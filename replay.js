import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

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

const MIN_DELAY_MS = 15 * 60 * 1000;   // 15 min
const MAX_DELAY_MS = 30 * 60 * 1000;   // 30 min

// Retry settings for getChats
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 3000;
const GET_CHATS_TIMEOUT_MS = 60000;    // 60 sec

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

// ==================== Robust getChats with retry & timeout ====================
async function getChatsWithRetry(client) {
    let lastError;
    let delay = BASE_RETRY_DELAY_MS;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`📡 Fetching chats (attempt ${attempt}/${MAX_RETRIES})...`);

            // ---- Check if the page is still responsive ----
            const page = client.pupPage;
            if (!page) {
                throw new Error('Puppeteer page is not available');
            }
            // Quick health check: evaluate a simple expression
            await page.evaluate(() => document?.readyState || 'loading').catch(() => {
                throw new Error('Page is not responsive');
            });

            // ---- Wrap getChats in a timeout ----
            const chats = await Promise.race([
                client.getChats(),
                new Promise((_, reject) =>
                    setTimeout(() => reject(new Error('getChats timed out')), GET_CHATS_TIMEOUT_MS)
                )
            ]);

            console.log(`✅ Fetched ${chats.length} chats successfully.`);
            return chats;
        } catch (err) {
            lastError = err;
            console.warn(`⚠️ Attempt ${attempt} failed:`, err.message || err);

            if (attempt < MAX_RETRIES) {
                const waitMs = delay + Math.floor(Math.random() * 2000);
                console.log(`⏳ Waiting ${(waitMs / 1000).toFixed(1)}s before retry...`);
                await sleep(waitMs);
                delay = Math.min(delay * 1.5, 20000); // exponential backoff up to 20s
            }
        }
    }

    // If all attempts failed, optionally clear session and exit
    console.error('❌ All retries exhausted. The session might be corrupted.');
    // Uncomment the next line to automatically wipe the session and let the script restart
    // await fs.remove(SESSION_DIR).catch(() => {});
    throw new Error(`Failed to get chats after ${MAX_RETRIES} attempts: ${lastError?.message || lastError}`);
}

// ==================== Remove lock files (portable) ====================
async function removeLocks() {
    try {
        if (!await fs.pathExists(SESSION_DIR)) return;
        const files = await fs.readdir(SESSION_DIR);
        for (const file of files) {
            if (file === 'SingletonLock' || file.endsWith('.lock')) {
                await fs.remove(path.join(SESSION_DIR, file)).catch(() => {});
            }
        }
    } catch (err) {
        console.warn('⚠️ Could not remove lock files:', err.message);
    }
}

// ==================== Main Bot ====================
const client = new Client({
    authStrategy: new LocalAuth({ clientId: SESSION_NAME, dataPath: SESSION_DIR }),
    puppeteer: {
        headless: 'new',
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
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
        timeout: 120000,          // 2 min for Puppeteer operations
        protocolTimeout: 120000,
    },
});

client.on('qr', qr => {
    console.log('📲 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot is ready. Waiting 10 seconds for page to stabilise...');
    await sleep(10000);   // increased from 5s

    try {
        const now = Date.now();
        const lastRun = await readLastRun();
        const queue = await loadQueue();

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
            const remainingQueue = queue.filter(item => !sentIds.has(item.messageId));
            await saveQueue(remainingQueue);
        }

        // --- 2. Fetch new messages and schedule replies ---
        let chats;
        try {
            chats = await getChatsWithRetry(client);
        } catch (err) {
            console.error('❌ Failed to get chats:', err.message);
            // Optionally, clear session and exit so the process can restart fresh
            // await fs.remove(SESSION_DIR).catch(() => {});
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
                    const text = msg.body.toLowerCase().trim();
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

                        console.log(`📅 Scheduled reply for "${msg.body}" from ${chat.name || chat.id._serialized} in ${Math.round(delay/60000)} min`);
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
        console.error('❌ Fatal error:', err);
    } finally {
        // Graceful shutdown
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

// ==================== Start ====================
(async () => {
    // Remove stale lock files before starting
    await removeLocks();

    console.log('🚀 Initializing WhatsApp client...');
    try {
        await client.initialize();
    } catch (err) {
        console.error('❌ Init failed:', err);
        process.exit(1);
    }
})();
