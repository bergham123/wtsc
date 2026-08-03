import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ==================== Configuration ====================
// قائمة الردود العشوائية
const REPLIES = [
    "شكراً لتواصلك!",
    "أهلاً بك، كيف يمكنني مساعدتك؟",
    "تم استلام رسالتك، سأرد قريباً.",
    "مرحباً!",
    "أنا هنا لمساعدتك."
];

const SESSION_DIR = path.join(__dirname, 'session');
const SESSION_NAME = 'main';
const TIMESTAMP_FILE = path.join(SESSION_DIR, 'last_run.txt');
const QUEUE_FILE = path.join(SESSION_DIR, 'reply_queue.json');

// الفارق الزمني بين الردود: من 10 إلى 30 ثانية
const MIN_DELAY_MS = 10 * 1000;   // 10 ثوان
const MAX_DELAY_MS = 30 * 1000;   // 30 ثانية

// إعدادات إعادة المحاولة لجلب المحادثات (نفس الكود الأول)
const MAX_RETRIES = 5;
const BASE_RETRY_DELAY_MS = 3000;
const GET_CHATS_TIMEOUT_MS = 60000;

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

// ==================== دالة جلب المحادثات مع إعادة المحاولة (نفس الكود الأول) ====================
async function getChatsWithRetry(client) {
    let lastError;
    let delay = BASE_RETRY_DELAY_MS;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`📡 Fetching chats (attempt ${attempt}/${MAX_RETRIES})...`);

            const page = client.pupPage;
            if (!page) throw new Error('Puppeteer page is not available');

            await page.evaluate(() => document?.readyState || 'loading').catch(() => {
                throw new Error('Page is not responsive');
            });

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
                delay = Math.min(delay * 1.5, 20000);
            }
        }
    }

    console.error('❌ All retries exhausted.');
    throw new Error(`Failed to get chats after ${MAX_RETRIES} attempts: ${lastError?.message || lastError}`);
}

// ==================== إزالة ملفات القفل ====================
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

// ==================== العميل الرئيسي ====================
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
        timeout: 120000,
        protocolTimeout: 120000,
    },
});

client.on('qr', qr => {
    console.log('📲 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot is ready. Waiting 10 seconds for page to stabilise...');
    await sleep(10000);

    try {
        const now = Date.now();
        const lastRun = await readLastRun();
        const queue = await loadQueue();

        // --- 1. إرسال الردود المجدولة التي حان وقتها ---
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

        // --- 2. جلب المحادثات ---
        let chats;
        try {
            chats = await getChatsWithRetry(client);
        } catch (err) {
            console.error('❌ Failed to get chats:', err.message);
            process.exit(1);
        }

        let scheduledCount = 0;

        // --- 3. معالجة كل محادثة للحصول على آخر رسالة من المستخدم ---
        for (const chat of chats) {
            try {
                // جلب آخر 50 رسالة (نكتفي بآخر رسالة جديدة)
                const messages = await chat.fetchMessages({ limit: 50 });
                // تصفية الرسائل التي أرسلها المستخدم (ليست مني) والتي بعد آخر تشغيل
                const newUserMessages = messages.filter(msg =>
                    !msg.fromMe && (msg.timestamp * 1000 > lastRun)
                );

                if (newUserMessages.length === 0) continue;

                // ترتيب تنازلي حسب الطابع الزمني للحصول على الأحدث
                newUserMessages.sort((a, b) => b.timestamp - a.timestamp);
                const latestMsg = newUserMessages[0];

                // التأكد من عدم جدولة رد لهذه الرسالة مسبقاً
                const alreadyScheduled = queue.some(item => item.messageId === latestMsg.id._serialized);
                if (alreadyScheduled) continue;

                // جدولة الرد
                const delay = getRandomDelay();
                const scheduledTime = Date.now() + delay;
                const reply = getRandomReply();

                queue.push({
                    chatId: chat.id._serialized,
                    messageId: latestMsg.id._serialized,
                    scheduledTime,
                    replyText: reply
                });

                console.log(`📅 Scheduled reply for "${latestMsg.body}" from ${chat.name || chat.id._serialized} in ${(delay / 1000).toFixed(1)} seconds`);
                scheduledCount++;
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

// ==================== البدء ====================
(async () => {
    await removeLocks();
    console.log('🚀 Initializing WhatsApp client...');
    try {
        await client.initialize();
    } catch (err) {
        console.error('❌ Init failed:', err);
        process.exit(1);
    }
})();
