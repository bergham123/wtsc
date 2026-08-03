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
const PROFILE_PATH = path.join(SESSION_DIR, SESSION_NAME);
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY; // نأخذه من البيئة الآمنة

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
        const assistantMsg = result.choices[0].message;

        // Preserve the assistant message with reasoning_details
        const messages = [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": userMessage },
            {
                role: 'assistant',
                content: assistantMsg.content,
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
        const promptData = await fs.readJson(PROMPT_FILE);
        if (promptData.system_prompt) systemPrompt = promptData.system_prompt;
    }
    log(`📝 Loaded system prompt.`);

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
        log("✅ WhatsApp client ready for AUTO-REPLY");
        
        try {
            const chats = await client.getChats();
            // Filter chats with unread messages
            const unreadChats = chats.filter(chat => chat.unreadCount > 0);
            log(`📬 Found ${unreadChats.length} unread chats.`);

            for (const chat of unreadChats) {
                // Mark as seen immediately to prevent re-replying in next run
                await chat.sendSeen();

                // Fetch the latest unread message
                const messages = await chat.fetchMessages({ limit: 1, fromMe: false });
                if (messages.length === 0) continue;

                const lastMessage = messages[0];
                
                // Skip if it's a status message or not text
                if (lastMessage.type !== 'chat') continue;

                log(`💬 Replying to ${chat.id.user}: "${lastMessage.body.substring(0, 30)}..."`);
                
                // Get AI Response
                const aiReply = await askAI(lastMessage.body, systemPrompt);
                
                // Send Reply
                await client.sendMessage(chat.id._serialized, aiReply);
                log(`✔ Replied to ${chat.id.user} with AI response.`);
                
                // Wait 3 seconds before processing next chat
                await wait(3000);
            }

            log("🏁 Auto-reply batch complete.");
        } catch (err) {
            log(`💥 Error during auto-reply: ${err.message}`);
        }

        logStream.end();
        await client.destroy();
        process.exit(0);
    });

    client.on("auth_failure", async (msg) => {
        log(`🔐 Auth failed: ${msg}`);
        await fs.rm(SESSION_DIR, { force: true, recursive: true });
        process.exit(1);
    });

    try {
        await client.initialize();
    } catch (err) {
        log(`❌ Initialization failed: ${err.message}`);
        process.exit(1);
    }
}

runBot();
