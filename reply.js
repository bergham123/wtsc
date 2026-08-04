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
const ANSWER_LIST_FILE = path.join(__dirname, "data", "answer.json");
const TELEGRAM_ID_FILE = path.join(__dirname, "data", "telegram-id.json");
const LOGS_DIR = path.join(__dirname, "logs");

const SESSION_NAME = "main";
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; 
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const BOT_UPTIME_MS = 9 * 60 * 1000; 
const MESSAGE_DELAY_MS = 10000; 

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

// =================== Telegram Alert System ===================
async function sendTelegramAlert(message) {
    if (!TELEGRAM_BOT_TOKEN) return log("⚠️ Telegram token missing, skipping alert.");
    
    let chatId = "5798206513"; // الافتراضي
    if (await fs.pathExists(TELEGRAM_ID_FILE)) {
        const data = await fs.readJson(TELEGRAM_ID_FILE).catch(() => ({}));
        if (data.chat_id) chatId = data.chat_id;
    }

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
        await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: "HTML"
            })
        });
        log(`📨 Telegram alert sent.`);
    } catch (err) {
        log(`❌ Telegram alert failed: ${err.message}`);
    }
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
const messageBuffers = {}; 

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

    let allowedNumbers = [];
    if (await fs.pathExists(ANSWER_LIST_FILE)) {
        try {
            const data = await fs.readJson(ANSWER_LIST_FILE);
            if (Array.isArray(data)) {
                allowedNumbers = data.map(n => String(n).replace(/\D/g, ''));
                log(`✅ Loaded ${allowedNumbers.length} allowed numbers.`);
            }
        } catch (err) {}
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

    client.on("qr", async (qr) => {
        log("📲 QR code generated - scan now");
        qrcode.generate(qr, { small: true });
        // 🚨 تنبيه تيليجرام للـ QR
        await sendTelegramAlert("🚨 <b>تنبيه: البوت يحتاج إلى مسح QR Code!</b>\n\nالجلسة انتهت أو غير موجودة. يرجى الدخول إلى GitHub Actions لعرض الـ QR ومسحه.");
    });

    client.on("ready", async () => {
        log("✅ Bot Ready (Live Mode - 9 minutes)");
        // ✅ تنبيه تيليجرام بنجاح الاتصال
        await sendTelegramAlert("✅ <b>البوت متصل ويعمل الآن!</b>\n\nتم تشغيل نظام الرد التلقائي بالـ AI بنجاح لمدة 9 دقائق.");
        
        setTimeout(async () => {
            log("⏰ 9 mins over. Shutting down...");
            try { await client.destroy(); } catch {}
            logStream.end();
            process.exit(0);
        }, BOT_UPTIME_MS);
    });

    client.on("message", async (msg) => {
        if (msg.fromMe || msg.type !== 'chat' || msg.isStatus) return;

        const senderNumber = msg.from.split('@')[0];

        if (allowedNumbers.length > 0 && !allowedNumbers.includes(senderNumber)) {
            return; 
        }

        log(`📩 Message chunk received from ${senderNumber}: "${msg.body}"`);

        if (!messageBuffers[msg.from]) {
            messageBuffers[msg.from] = { messages: [], lastMsg: msg, timer: null };
        }

        messageBuffers[msg.from].messages.push(msg.body);
        messageBuffers[msg.from].lastMsg = msg;

        if (messageBuffers[msg.from].timer) {
            clearTimeout(messageBuffers[msg.from].timer);
        }

        messageBuffers[msg.from].timer = setTimeout(() => {
            const combinedText = messageBuffers[msg.from].messages.join(' ');
            const msgToReply = messageBuffers[msg.from].lastMsg;
            
            delete messageBuffers[msg.from];
            
            messageQueue.push({ msg: msgToReply, combinedText: combinedText });
            processQueue(systemPrompt); 
        }, MESSAGE_DELAY_MS);
    });

    client.on("auth_failure", async (msg) => {
        log(`🔐 Auth failed: ${msg}`);
        // 🚨 تنبيه تيليجرام بفشل الاتصال
        await sendTelegramAlert(`❌ <b>فشل تسجيل الدخول!</b>\n\nالسبب: ${msg}\nتم حذف الجلسة. يرجى إعادة تشغيل الـ Workflow لمسح QR جديد.`);
        await fs.rm(SESSION_DIR, { force: true, recursive: true }).catch(() => {});
        process.exit(1);
    });

    client.on("disconnected", async (reason) => {
        log(`⚠️ Disconnected: ${reason}`);
        // 🚨 تنبيه تيليجرام بالانقطاع
        await sendTelegramAlert(`⚠️ <b>انقطع اتصال البوت!</b>\n\nالسبب: ${reason}\nسيحاول النظام إعادة التشغيل في الدورة القادمة.`);
        process.exit(1);
    });

    try {
        log("🔧 Initializing...");
        await client.initialize();
    } catch (err) {
        log(`❌ Init failed: ${err.message}`);
        await sendTelegramAlert(`❌ <b>خطأ في تشغيل البوت!</b>\n\n${err.message}`);
        process.exit(1);
    }
}

runBot();
