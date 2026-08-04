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
const BOT_UPTIME_MS = 9 * 60 * 1000; // 9 دقائق تشغيل ثم إغلاق تلقائي

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
        if (!result.choices || !result.choices[0]) {
            log(`⚠️ AI API Response (First Call): ${JSON.stringify(result)}`);
            return "عذراً، لم أتمكن من توليد رد حالياً.";
        }

        const assistantMsg = result.choices[0].message;

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

        // Second API call
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
            return assistantMsg.content || "عذراً، حدث خطأ في الاستجابة.";
        }
        
        return result2.choices[0].message.content;

    } catch (error) {
        log(`❌ AI Error: ${error.message}`);
        return "عذراً، حدث خطأ أثناء معالجة رسالتك. حاول مرة أخرى لاحقاً.";
    }
}

// =================== Message Queue System ===================
const messageQueue = [];
let isProcessing = false;

async function processQueue(systemPrompt, client) {
    if (isProcessing || messageQueue.length === 0) return;
    
    isProcessing = true;
    const msg = messageQueue.shift(); // أخذ أول رسالة في الطابور

    try {
        const chat = await msg.getChat();
        await chat.sendSeen();
        
        log(`💬 Processing message from ${chat.id.user}: "${msg.body.substring(0, 40)}..."`);
        const aiReply = await askAI(msg.body, systemPrompt);
        await client.sendMessage(chat.id._serialized, aiReply);
        log(`✔ Replied to ${chat.id.user}.`);
        
        await wait(2000); // مهلة 2 ثانية بين كل رد
    } catch (err) {
        log(`⚠️ Error processing message in queue: ${err.message}`);
    } finally {
        isProcessing = false;
        processQueue(systemPrompt, client); // معالجة الرسالة التالية إذا وجدت
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

    let systemPrompt = "You are a helpful assistant.";
    if (await fs.pathExists(PROMPT_FILE)) {
        try {
            const promptData = await fs.readJson(PROMPT_FILE);
            if (promptData.system_prompt) systemPrompt = promptData.system_prompt;
            log(`📝 Loaded system prompt.`);
        } catch (err) {
            log(`⚠️ Failed to load prompt.json, using default.`);
        }
    }

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: SESSION_NAME, dataPath: SESSION_DIR, restartOnAuthFail: true }),
        puppeteer: {
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: [
                "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
                "--disable-gpu", "--disable-extensions", "--no-first-run",
                "--disable-blink-features=AutomationControlled", "--aggressive-cache-discard"
            ],
            timeout: 120000,
        },
    });

    client.on("qr", (qr) => {
        log("📲 QR code generated - scan now");
        qrcode.generate(qr, { small: true });
    });

    client.on("ready", async () => {
        log("✅ WhatsApp client ready for AUTO-REPLY (Live Mode)");
        log(`⏳ Bot will stay active for 9 minutes and listen for incoming messages...`);
        
        // إعطاء المتصفح 5 ثواني فقط ليستقر قبل الاستماع للرسائل الحية
        await wait(5000);

        // ضبط مؤقت لإغلاق البوت بعد 9 دقائق تلقائياً
        setTimeout(async () => {
            log("⏰ 9 minutes elapsed. Shutting down gracefully to wait for next workflow...");
            try { await client.destroy(); } catch {}
            logStream.end();
            process.exit(0);
        }, BOT_UPTIME_MS);
    });

    // الاستماع للرسائل الحية الجديدة
    client.on("message", async (msg) => {
        // تجاهل الرسائل القديمة، رسائل الحالة، أو الرسائل المرسلة من البوت
        if (msg.fromMe || msg.type !== 'chat' || msg.isStatus) return;

        log(`📩 New live message received from ${msg.from}`);
        messageQueue.push(msg); // إضافة الرسالة إلى الطابور
        processQueue(systemPrompt, client); // بدء معالجة الطابور
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
