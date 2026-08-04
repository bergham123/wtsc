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
const BOT_UPTIME_MS = 9 * 60 * 1000; // 9 دقائق تشغيل
const MESSAGE_DELAY_MS = 10000; // الانتظار 10 ثواني لتجميع رسائل المستخدم

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

// =================== AI Integration ===================
async function askAI(userMessage, systemPrompt) {
    try {
        log(`🧠 AI thinking: "${userMessage.substring(0, 30)}..."`);

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
        if (!result.choices || !result.choices[0]) return "عذراً، لم أتمكن من توليد رد.";

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
                content: "Provide the final concise answer to reply on WhatsApp.",
            }
        ];

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
        if (!result2.choices || !result2.choices[0]) return assistantMsg.content || "عذراً، حدث خطأ.";
        
        return result2.choices[0].message.content;

    } catch (error) {
        log(`❌ AI Error: ${error.message}`);
        return "عذراً، حدث خطأ أثناء المعالجة.";
    }
}

// =================== Message Queue & Buffer ===================
const messageQueue = [];
let isProcessing = false;
const messageBuffers = {}; // لتخزين الرسائل المؤقتة لكل مستخدم

async function processQueue(systemPrompt) {
    if (isProcessing || messageQueue.length === 0) return;
    
    isProcessing = true;
    const item = messageQueue.shift(); 

    try {
        log(`💬 Replying to ${item.msg.from}: "${item.combinedText.substring(0, 40)}..."`);
        const aiReply = await askAI(item.combinedText, systemPrompt);
        await item.msg.reply(aiReply); 
        log(`✔ Replied successfully.`);
        
        await wait(2000); 
    } catch (err) {
        log(`⚠️ Queue Error: ${err.message}`);
    } finally {
        isProcessing = false;
        processQueue(systemPrompt); 
    }
}

// =================== Main Bot ===================
async function runBot() {
    fs.ensureDirSync(LOGS_DIR);
    fs.ensureDirSync(SESSION_DIR);
    
    const today = getToday();
    logStream = fs.createWriteStream(path.join(LOGS_DIR, `${today}-reply.log`), { flags: "a" });

    if (!OPENROUTER_API_KEY) {
        log("❌ OPENROUTER_API_KEY missing.");
        process.exit(1);
    }

    let systemPrompt = "You are a helpful assistant.";
    if (await fs.pathExists(PROMPT_FILE)) {
        const promptData = await fs.readJson(PROMPT_FILE).catch(() => ({}));
        if (promptData.system_prompt) systemPrompt = promptData.system_prompt;
        log(`📝 Loaded prompt.`);
    }

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: SESSION_NAME, dataPath: SESSION_DIR, restartOnAuthFail: true }),
        puppeteer: {
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: [
                "--no-sandbox", "--disable-setuid-sandbox", "--disable-dev-shm-usage",
                "--disable-gpu", "--disable-extensions", "--no-first-run",
                "--aggressive-cache-discard"
            ],
            timeout: 120000,
        },
    });

    client.on("qr", (qr) => {
        log("📲 Scan QR");
        qrcode.generate(qr, { small: true });
    });

    client.on("ready", async () => {
        log("✅ Bot Ready (Live Mode - 9 minutes)");
        
        setTimeout(async () => {
            log("⏰ 9 mins over. Shutting down...");
            try { await client.destroy(); } catch {}
            logStream.end();
            process.exit(0);
        }, BOT_UPTIME_MS);
    });

    // الاستماع المباشر للرسائل
    client.on("message", async (msg) => {
        if (msg.fromMe || msg.type !== 'chat' || msg.isStatus) return;

        const sender = msg.from;
        log(`📩 Message chunk received from ${sender}: "${msg.body}"`);

        // إذا لم يكن لدى المستخدم مؤقت سابق، أنشئ واحداً
        if (!messageBuffers[sender]) {
            messageBuffers[sender] = { messages: [], lastMsg: msg, timer: null };
        }

        // إضافة الرسالة إلى مجموعة المستخدم
        messageBuffers[sender].messages.push(msg.body);
        messageBuffers[sender].lastMsg = msg; // تحديث آخر رسالة ليرد عليها لاحقاً

        // إلغاء المؤقت السابق وإعداد مؤقت جديد (10 ثواني)
        if (messageBuffers[sender].timer) {
            clearTimeout(messageBuffers[sender].timer);
        }

        messageBuffers[sender].timer = setTimeout(() => {
            // بعد 10 ثواني من الصمت، ندمج الرسائل ونرسلها للطابور
            const combinedText = messageBuffers[sender].messages.join(' ');
            const msgToReply = messageBuffers[sender].lastMsg;
            
            log(`✅ User ${sender} stopped typing. Combined text: "${combinedText.substring(0, 50)}..."`);
            
            // مسح البيانات المؤقتة لهذا المستخدم
            delete messageBuffers[sender];
            
            // إضافة للطابور
            messageQueue.push({ msg: msgToReply, combinedText: combinedText });
            processQueue(systemPrompt); 
        }, MESSAGE_DELAY_MS);
    });

    client.on("auth_failure", async (msg) => {
        log(`🔐 Auth failed: ${msg}`);
        await fs.rm(SESSION_DIR, { force: true, recursive: true }).catch(() => {});
        process.exit(1);
    });

    try {
        log("🔧 Initializing...");
        await client.initialize();
    } catch (err) {
        log(`❌ Init failed: ${err.message}`);
        process.exit(1);
    }
}

runBot();
