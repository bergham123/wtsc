import pkg from 'whatsapp-web.js';
const { Client, LocalAuth } = pkg;
import qrcode from 'qrcode-terminal';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ------------------------- Configuration -------------------------
const REPLIES = [
    "hi, im fine thanks",
    "Hello!",
    "Hey! How are you?"
];

const SESSION_DIR = path.join(__dirname, 'session');
const SESSION_NAME = 'main';
const TIMESTAMP_FILE = path.join(SESSION_DIR, 'last_run.txt');

// ------------------------- Helpers -------------------------
function getRandomReply() {
    return REPLIES[Math.floor(Math.random() * REPLIES.length)];
}

async function readLastRun() {
    try {
        const data = await fs.readFile(TIMESTAMP_FILE, 'utf-8');
        return parseInt(data, 10);
    } catch {
        return 0; // first run
    }
}

async function writeLastRun(timestamp) {
    await fs.ensureDir(SESSION_DIR);
    await fs.writeFile(TIMESTAMP_FILE, String(timestamp));
}

// ------------------------- Main Bot -------------------------
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
        timeout: 60000,
        protocolTimeout: 60000,
    },
});

// QR code display (if no session exists)
client.on('qr', qr => {
    console.log('📲 Scan this QR code with WhatsApp:');
    qrcode.generate(qr, { small: true });
});

client.on('ready', async () => {
    console.log('✅ Bot is ready. Processing new messages...');

    try {
        const lastRun = await readLastRun();
        const now = Date.now();

        // Get all chats
        const chats = await client.getChats();
        let repliedCount = 0;

        for (const chat of chats) {
            try {
                // Fetch messages since last run (limit to avoid memory issues)
                const messages = await chat.fetchMessages({ limit: 100 });

                // Filter messages that are newer than lastRun and not sent by me
                const newMessages = messages.filter(msg =>
                    msg.timestamp * 1000 > lastRun && !msg.fromMe
                );

                if (newMessages.length > 0) {
                    const reply = getRandomReply();
                    await chat.sendMessage(reply);
                    console.log(`📤 Replied to ${chat.name || chat.id._serialized} with: "${reply}"`);
                    repliedCount++;
                }
            } catch (err) {
                console.error(`⚠️ Error processing chat ${chat.id._serialized}:`, err.message);
            }
        }

        // Update timestamp
        await writeLastRun(now);
        console.log(`✅ Done. Replied to ${repliedCount} chat(s).`);

    } catch (err) {
        console.error('❌ Error during processing:', err);
    } finally {
        // Exit gracefully after a short delay to allow messages to send
        setTimeout(() => {
            client.destroy().catch(() => {});
            process.exit(0);
        }, 5000);
    }
});

client.on('auth_failure', (msg) => {
    console.error('❌ Authentication failed:', msg);
    process.exit(1);
});

client.on('disconnected', (reason) => {
    console.warn('⚠️ Disconnected:', reason);
    process.exit(1);
});

// Remove stale lock files before starting
import { execSync } from 'child_process';
try {
    execSync(`find ${SESSION_DIR} -name "SingletonLock" -delete 2>/dev/null || true`, { shell: true });
    execSync(`find ${SESSION_DIR} -name "*.lock" -delete 2>/dev/null || true`, { shell: true });
} catch {}

// Start the client
console.log('🚀 Initializing WhatsApp client...');
client.initialize().catch(err => {
    console.error('❌ Failed to initialize:', err);
    process.exit(1);
});
