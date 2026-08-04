import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import qrcode from "qrcode-terminal";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =================== Constants ===================
const SESSION_DIR = path.join(__dirname, "session");
const PROMPT_FILE = path.join(__dirname, "data", "prompt.json");
const LOGS_DIR = path.join(__dirname, "logs");

const SESSION_NAME = "main";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 

// =================== Helpers ===================
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const getToday = () => new Date().toISOString().split("T")[0];

let logStream;
function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(msg);
    if (logStream) logStream.write(line + "\n");
}

// =================== AI Integration (OpenRouter) ===================
async function askAI(userMessage, systemPrompt) {
    try {
        log(`🧠 جاري معالجة الرسالة عبر AI: "${userMessage.substring(0, 30)}..."`);

        // First API call with reasoning
        let response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
                "messages": [
                    { "role": "system", "content": systemPrompt },
                    { "role": "user", "content": userMessage }
                ],
                "reasoning": { "enabled": true }
            })
        });

        const result = await response.json();
        
        // التحقق من وجود رد صالح
        if (!result.choices || !result.choices[0]) {
            log(`⚠️ AI API Response (First Call): ${JSON.stringify(result)}`);
            return "عذراً، لم أتمكن من توليد رد حالياً.";
        }

        const assistantMsg = result.choices[0].message;

        // Preserve the assistant message with reasoning_details
        const messages = [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": userMessage },
            {
                role: 'assistant',
                content: assistantMsg.content || "",
                reasoning_details: assistantMsg.reasoning_details,
            },
            {
                role: 'user',
                content: "Based on your reasoning, provide the final concise answer to reply to the user on WhatsApp.",
            }
        ];

        // Second API call - model continues reasoning from where it left off
        const response2 = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "nvidia/nemotron-3-ultra-550b-a55b:free",
                "messages": messages
            })
        });

        const result2 = await response2.json();
        if (!result2.choices || !result2.choices[0]) {
            log(`⚠️ AI API Response (Second Call): ${JSON.stringify(result2)}`);
            return assistantMsg.content || "عذراً، حدث خطأ في الاستجابة.";
        }
        
        return result2.choices[0].message.content;

    } catch (error) {
        log(`❌ AI Error: ${error.message}`);
        return "عذراً، حدث خطأ أثناء معالجة رسالتك. حاول مرة أخرى لاحقاً.";
    }
}

// =================== Main Bot Logic ===================
async function runBot() {
    fs.ensureDirSync(LOGS_DIR);
    fs.ensureDirSync(SESSION_DIR);
    
    const today = getToday();
    logStream = fs.createWriteStream(path.join(LOGS_DIR, `${today}-reply.log`), { flags: "a" });

    if (!OPENROUTER_API_KEY) {
        log("❌ OPENROUTER_API_KEY not set in environment variables.");
        process.exit(1);
    }

    // Load Prompt
    let systemPrompt = "You are a helpful assistant.";
    if (await fs.pathExists(PROMPT_FILE)) {
        try {
            const promptData = await fs.readJson(PROMPT_FILE);
            if (promptData.system_prompt) systemPrompt = promptData.system_prompt;
            log(`📝 Loaded system prompt.`);
        } catch (err) {
            log(`⚠️ Failed to load prompt.json, using default. Error: ${err.message}`);
        }
    } else {
        log(`⚠️ prompt.json not found, using default prompt.`);
    }

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: SESSION_NAME, dataPath: SESSION_DIR, restartOnAuthFail: true }),
        puppeteer: {
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: [
                "--no-sandbox", 
                "--disable-setuid-sandbox", 
                "--disable-dev-shm-usage",
                "--disable-gpu", 
                "--disable-extensions", 
                "--no-first-run",
                "--disable-blink-features=AutomationControlled", 
                "--aggressive-cache-discard"
            ],
            timeout: 120000,
        },
    });

    client.on("qr", (qr) => {
        log("📲 QR code generated - scan now");
        qrcode.generate(qr, { small: true });
    });

    client.on("ready", async () => {
        log("✅ WhatsApp client ready for AUTO-REPLY");
        
        try {
            // إعطاء المتصفح 10 ثواني ليكتمل تحميل واتساب ويب وتحميل كل الرسائل في الخلفية
            log("⏳ Stabilizing connection for 10 seconds to load messages...");
            await wait(10000);
            
            const chats = await client.getChats();
            // فلترة الدردشات التي تحتوي على رسائل غير مقروءة
            const unreadChats = chats.filter(chat => chat.unreadCount > 0);
            log(`📬 Found ${unreadChats.length} unread chats to process in queue.`);

            if (unreadChats.length === 0) {
                log("✅ No unread messages. Exiting gracefully.");
                logStream.end();
                await client.destroy();
                process.exit(0);
            }

            // معالجة الدردشات واحدة تلو الأخرى (Queue System)
            for (const chat of unreadChats) {
                try {
                    // تحديد الدردشة كمقروءة فوراً لعدم تكرار الرد عليها لاحقاً
                    await chat.sendSeen();

                    // جلب آخر رسالة في الدردشة
                    const messages = await chat.fetchMessages({ limit: 1 });
                    if (messages.length === 0) continue;

                    const lastMessage = messages[0];
                    
                    // تخطي إذا كانت الرسالة من البوت نفسه أو ليست نصاً
                    if (lastMessage.fromMe || lastMessage.type !== 'chat') {
                        log(`⏭️ Skipping ${chat.id.user} (No text or sent by bot).`);
                        continue;
                    }

                    log(`💬 Processing message from ${chat.id.user}: "${lastMessage.body.substring(0, 40)}..."`);
                    
                    // الحصول على الرد من الذكاء الاصطناعي
                    const aiReply = await askAI(lastMessage.body, systemPrompt);
                    
                    // إرسال الرد
                    await client.sendMessage(chat.id._serialized, aiReply);
                    log(`✔ Replied to ${chat.id.user} with AI response.`);
                    
                    // انتظار 3 ثواني قبل معالجة الدردشة التالية في الطابور
                    await wait(3000);

                } catch (chatError) {
                    log(`⚠️ Error processing chat ${chat.id.user}: ${chatError.message}`);
                    // نستمر في الدردشة التالية حتى لو فشلت واحدة
                    continue;
                }
            }

            log("🏁 Auto-reply queue complete.");
        } catch (err) {
            log(`💥 Error during auto-reply process: ${err.stack || err.message}`);
        }

        logStream.end();
        await client.destroy();
        process.exit(0);
    });

    client.on("auth_failure", async (msg) => {
        log(`🔐 Auth failed: ${msg}`);
        await fs.rm(SESSION_DIR, { force: true, recursive: true }).catch(() => {});
        process.exit(1);
    });

    client.on("disconnected", async (reason) => {
        log(`⚠️ Disconnected: ${reason}`);
        process.exit(1);
    });

    try {
        log("🔧 Initializing WhatsApp Client...");
        await client.initialize();
    } catch (err) {
        log(`❌ Initialization failed: ${err.message}`);
        process.exit(1);
    }
}

runBot();
