import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==================== Configuration ====================
const TRIGGERS = ['hi', 'hello', 'good morning'];
const REPLIES = [
    "hi, im fine thanks",
    "Hello!",
    "Hey! How are you?"
];

const SESSION_DIR = path.join(__dirname, 'session');
const SESSION_NAME = 'main';
const TIMESTAMP_FILE = path.join(SESSION_DIR, 'last_run.txt');
const QUEUE_FILE = path.join(SESSION_DIR, 'reply_queue.json');

const MIN_DELAY_MS = 15 * 60 * 1000;
const MAX_DELAY_MS = 30 * 60 * 1000;

// Retry settings
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 3000;

// Remove stale lock files BEFORE initialization
try {
    execSync(`find ${SESSION_DIR} -name "SingletonLock" -delete 2>/dev/null || true`, { shell: true });
    execSync(`find ${SESSION_DIR} -name "*.lock" -delete 2>/dev/null || true`, { shell: true });
} catch (e) {
    // Ignore cleanup errors
}

// ==================== Helpers ====================
function getRandomReply() {
    return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}

function getRandomDelay() {
    return Math.floor(Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS + 1)) + MIN_DELAY_MS;
}

async function readLastRun() {
    try {
        const data = await fs.readFile(TIMESTAMP_FILE, 'utf-8');
        return parseInt(data, 10);
    } catch {
        return 0;
    }
}

async function writeLastRun(timestamp) {
    await fs.ensureDir(SESSION_DIR);
    await fs.writeFile(TIMESTAMP_FILE, String(timestamp));
}

async function loadQueue() {
    try {
        const data = await fs.readFile(QUEUE_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return [];
    }
}

async function saveQueue(queue) {
    await fs.ensureDir(SESSION_DIR);
    await fs.writeFile(QUEUE_FILE, JSON.stringify(queue, null, 2));
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getChatsWithRetry(client, retries = MAX_RETRIES) {
    let lastError;
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`📡 Fetching chats (attempt ${attempt}/${retries})...`);
            const chats = await client.getChats();
            console.log(`✅ Fetched ${chats.length} chats successfully.`);
            return chats;
        } catch (err) {
            lastError = err;
            console.warn(`⚠️ Attempt ${attempt} failed: ${err.message}`);
            if (attempt < retries) {
                console.log(`⏳ Waiting ${RETRY_DELAY_MS / 1000}s before retry...`);
                await sleep(RETRY_DELAY_MS);
            }
        }
    }
    throw new Error(`Failed to get chats after ${retries} attempts: ${lastError.message}`);
}

// ==================== Main Bot ====================
const client = new Client({
    authStrategy: new LocalAuth({ clientId: SESSION_NAME, dataPath: SESSION_DIR }),
    puppeteer: {
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-gpu',
            '--disable-extensions',
            '--disable-background-networking',
            '--disable-sync',
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-features=Translate,BackForwardCache,site-per-process',
            '--disable-ipc-flooding-protection',
            '--disable-blink-features=AutomationControlled',
            '--disable-software-rasterizer',
            '--disable-crashpad',
            '--aggressive-cache-discard'
        ],
        timeout: 60000,
        protocolTimeout: 60000,
    },
});

client.on('qr', qr => {
    console.log('📲 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot is ready. Waiting 5 seconds for page to stabilise...');
    await sleep(5000);

    try {
        const now = Date.now();
        const lastRun = await readLastRun();
        let queue = await loadQueue();

        // --- 1. Send due replies ---
        const dueReplies = queue.filter(item => item.scheduledTime <= now);
        if (dueReplies.length > 0) {
            console.log(`⏰ Sending ${dueReplies.length} due replies...`);
            for (const item of dueReplies) {
                try {
                    const chat = await client.getChatById(item.chatId);
                    await chat.sendMessage(item.replyText);
                    console.log(`📤 Sent to ${item.chatId}: "${item.replyText}"`);
                } catch (err) {
                    console.error(`❌ Failed to send reply to ${item.chatId}:`, err.message);
                }
            }
            const sentIds = new Set(dueReplies.map(item => item.messageId));
            queue = queue.filter(item => !sentIds.has(item.messageId));
            await saveQueue(queue);
        }

        // --- 2. Fetch new messages and schedule replies ---
        let chats;
        try {
            chats = await getChatsWithRetry(client);
        } catch (err) {
            console.error('❌ Failed to get chats after retries:', err.message);
            process.exit(1);
        }

        let scheduledCount = 0;
        for (const chat of chats) {
            try {
                const messages = await chat.fetchMessages({ limit: 100 });
                const newMessages = messages.filter(msg =>
                    msg.timestamp * 1000 > lastRun && !msg.fromMe
                );

                for (const msg of newMessages) {
                    const text = (msg.body || '').toLowerCase().trim();
                    const matched = TRIGGERS.some(trigger => text.includes(trigger));
                    if (matched) {
                        const alreadyScheduled = queue.some(item => item.messageId === msg.id._serialized);
                        if (alreadyScheduled) continue;

                        const delay = getRandomDelay();
                        const scheduledTime = Date.now() + delay;
                        const reply = getRandomReply();

                        queue.push({
                            chatId: chat.id._serialized,
                            messageId: msg.id._serialized,
                            scheduledTime,
                            replyText: reply
                        });

                        console.log(`📅 Scheduled reply for "${msg.body}" from ${chat.name || chat.id._serialized} in ${Math.round(delay / 60000)} min`);
                        scheduledCount++;
                    }
                }
            } catch (err) {
                console.error(`⚠️ Error processing chat ${chat.id._serialized}:`, err.message);
            }
        }

        if (scheduledCount > 0) {
            await saveQueue(queue);
        }

        await writeLastRun(now);
        console.log(`✅ Done. Scheduled ${scheduledCount} new replies. Sent ${dueReplies.length} due replies.`);

    } catch (err) {
        console.error('❌ Fatal error during run:', err);
    } finally {
        setTimeout(() => {
            client.destroy().catch(() => {});
            process.exit(0);
        }, 5000);
    }
});

client.on('auth_failure', msg => {
    console.error('❌ Auth failure:', msg);
    process.exit(1);
});

client.on('disconnected', reason => {
    console.warn('⚠️ Disconnected:', reason);
    process.exit(1);
});

console.log('🚀 Initializing WhatsApp client...');
client.initialize().catch(err => {
    console.error('❌ Init failed:', err);
    process.exit(1);
});
