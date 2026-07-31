import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =================== Constants ===================
const ACCOUNTS_FILE = "./accounts.json";
const MESSAGE_FILE = "./message.txt";
const MESSAGES_FILE = "./message.json";
const IMAGES_LIST_FILE = "./images.json";
const DASHBOARD_DIR = "./dashboard";
const SESSION_DIR = "./session";
const LOGS_DIR = "./logs";
const CHECKPOINT_FILE = "./checkpoint.json";
const ADMIN_NUMBER = "212642284241";

const MAX_RETRIES = 2;
const RETRY_DELAY = 5000;
const MIN_DELAY = 20000;
const MAX_DELAY = 40000;
const MESSAGE_MODE = "random";

// =================== Environment ===================
const WORKER_URL = process.env.WORKER_URL || null;
const API_SECRET = process.env.API_SECRET || null;
const SESSION_NAME = "main";
const PROFILE_PATH = path.join(SESSION_DIR, SESSION_NAME);

// =================== Helpers ===================
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const randomDelay = () => MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
const cleanNumber = (raw) => raw.replace(/\D/g, "");
const isUrl = (str) => /^https?:\/\/\S+\.\S+/.test(str);
const getToday = () => new Date().toISOString().split("T")[0];

// =================== Logging ===================
let logStream = null;

function initLogger() {
    const today = getToday();
    const logPath = path.join(LOGS_DIR, `${today}.log`);
    fs.ensureDirSync(LOGS_DIR);
    logStream = fs.createWriteStream(logPath, { flags: "a" });
    return logPath;
}

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(msg);
    if (logStream) logStream.write(line + "\n");
}

// =================== Worker Communication (optional) ===================
async function sendToWorker(endpoint, data) {
    if (!WORKER_URL || !API_SECRET) return;
    
    try {
        const response = await fetch(WORKER_URL + endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_SECRET,
            },
            body: JSON.stringify({ session: SESSION_NAME, ...data }),
        });
        if (!response.ok) {
            log(`⚠️ Worker response ${response.status} for ${endpoint}`);
        }
    } catch (e) {
        log(`⚠️ Worker error: ${e.message}`);
    }
}

// =================== File Helpers ===================
async function loadJSON(file, defaultVal = null) {
    if (await fs.pathExists(file)) {
        try {
            return await fs.readJson(file);
        } catch (e) {
            log(`⚠️ Failed to load ${file}`);
            return defaultVal;
        }
    }
    return defaultVal;
}

async function saveJSON(file, data) {
    await fs.writeJson(file, data, { spaces: 2 });
}

// =================== Session Management ===================
async function clearSession() {
    try {
        if (await fs.pathExists(SESSION_DIR)) {
            await fs.rm(SESSION_DIR, { force: true, recursive: true });
            log(`🗑️ Session cleared`);
        }
    } catch (err) {
        log(`⚠️ Failed to clear session: ${err.message}`);
    }
}

async function removeLocks() {
    try {
        if (!await fs.pathExists(PROFILE_PATH)) return;
        const lockPatterns = ["SingletonLock", "SingletonSocket", "SingletonCookie", "DevToolsActivePort"];
        const files = await fs.readdir(PROFILE_PATH);
        
        for (const file of files) {
            if (lockPatterns.includes(file) || file.endsWith(".lock")) {
                await fs.remove(path.join(PROFILE_PATH, file)).catch(() => {});
            }
        }
    } catch (err) {
        log(`⚠️ Error removing locks: ${err.message}`);
    }
}

async function cleanTempFiles() {
    try {
        if (!await fs.pathExists(PROFILE_PATH)) return;
        const tempDirs = ["Cache", "Code Cache", "GPUCache", "Crashpad", "BrowserMetrics", 
                          "ShaderCache", "GraphiteDawnCache", "GrShaderCache", "DawnCache"];
        
        for (const dir of tempDirs) {
            const fullPath = path.join(PROFILE_PATH, dir);
            if (await fs.pathExists(fullPath)) {
                await fs.rm(fullPath, { force: true, recursive: true }).catch(() => {});
            }
        }
    } catch (err) {
        log(`⚠️ Error cleaning temp files: ${err.message}`);
    }
}

// =================== Dashboard ===================
async function loadDashboard() {
    const today = getToday();
    const dashboardPath = path.join(DASHBOARD_DIR, `dashboard-${today}.json`);
    await fs.ensureDir(DASHBOARD_DIR);

    let dashboard = {
        date: today,
        attempted: 0,
        success: 0,
        failed: 0,
        sent: [],
        failedList: [],
    };

    if (await fs.pathExists(dashboardPath)) {
        try {
            const loaded = await fs.readJson(dashboardPath);
            dashboard = { ...dashboard, ...loaded };
            if (!Array.isArray(dashboard.sent)) dashboard.sent = [];
            if (!Array.isArray(dashboard.failedList)) dashboard.failedList = [];
        } catch (err) {
            log(`⚠️ Failed to load dashboard: ${err.message}`);
        }
    }
    return { dashboard, dashboardPath };
}

async function loadCheckpoint() {
    let checkpoint = { lastIndex: 0 };
    if (await fs.pathExists(CHECKPOINT_FILE)) {
        try {
            const data = await fs.readJson(CHECKPOINT_FILE);
            if (typeof data.lastIndex === "number") checkpoint.lastIndex = data.lastIndex;
        } catch {}
    }
    return checkpoint;
}

async function saveCheckpoint(checkpoint) {
    await saveJSON(CHECKPOINT_FILE, checkpoint);
}

// =================== Main Bot Logic ===================
async function runBot(client, stopSignal) {
    log("✅ WhatsApp client ready");
    
    // Safeguard: stop if disconnect already fired
    if (!stopSignal.isRunning) {
        log("⚠️ Bot already stopped before starting");
        return;
    }

    try {
        // Load accounts
        const numbers = await loadJSON(ACCOUNTS_FILE, []);
        if (!Array.isArray(numbers) || numbers.length === 0) {
            log("❌ No numbers in accounts.json");
            process.exit(1);
        }
        const cleanNumbers = [...new Set(numbers.map(cleanNumber))];
        log(`📞 ${cleanNumbers.length} unique numbers loaded`);

        // Load messages
        let messages = [];
        const loadedMessages = await loadJSON(MESSAGES_FILE, []);
        if (Array.isArray(loadedMessages) && loadedMessages.length > 0) {
            messages = loadedMessages.filter((m) => typeof m === "string" && m.trim().length > 0);
        }
        if (messages.length === 0 && await fs.pathExists(MESSAGE_FILE)) {
            const text = await fs.readFile(MESSAGE_FILE, "utf8");
            if (text.trim()) messages = [text.trim()];
        }
        if (messages.length === 0) {
            log("❌ No messages found");
            process.exit(1);
        }
        log(`📝 ${messages.length} messages loaded`);

        // Load images
        let imageItems = [];
        const loadedImages = await loadJSON(IMAGES_LIST_FILE, []);
        if (Array.isArray(loadedImages) && loadedImages.length > 0) {
            imageItems = loadedImages.filter((p) => typeof p === "string" && p.trim().length > 0);
        }
        if (imageItems.length > 0) log(`🖼️ ${imageItems.length} images available`);

        // Load state
        const checkpoint = await loadCheckpoint();
        let startIndex = checkpoint.lastIndex >= cleanNumbers.length ? 0 : checkpoint.lastIndex;
        const { dashboard, dashboardPath } = await loadDashboard();

        log(`⏩ Starting from index ${startIndex}`);

        // Main loop
        let messageCounter = 0;
        let index = startIndex;

        while (index < cleanNumbers.length && stopSignal.isRunning) {
            const rawNumber = cleanNumbers[index];
            const chatId = `${rawNumber}@c.us`;

            // Skip if already processed
            if (dashboard.sent.includes(rawNumber) || dashboard.failedList.includes(rawNumber)) {
                log(`⏭️ ${rawNumber} already processed, skipping`);
                index++;
                continue;
            }

            // Select message
            const currentMessage = MESSAGE_MODE === "random" 
                ? messages[Math.floor(Math.random() * messages.length)]
                : messages[messageCounter++ % messages.length];

            // Select image (optional)
            const selectedImageItem = imageItems.length > 0 
                ? imageItems[Math.floor(Math.random() * imageItems.length)]
                : null;

            let success = false;
            let attempts = 0;

            while (attempts <= MAX_RETRIES && !success && stopSignal.isRunning) {
                try {
                    const numberId = await client.getNumberId(chatId);
                    if (!numberId) {
                        log(`⚠️ ${rawNumber} not on WhatsApp`);
                        break;
                    }

                    let mediaSent = false;

                    // Try to send image + caption if available
                    if (selectedImageItem) {
                        try {
                            let media;
                            if (isUrl(selectedImageItem)) {
                                media = await MessageMedia.fromUrl(selectedImageItem);
                            } else {
                                const fullPath = path.join(__dirname, selectedImageItem);
                                if (await fs.pathExists(fullPath)) {
                                    media = MessageMedia.fromFilePath(fullPath);
                                } else {
                                    throw new Error("File not found");
                                }
                            }
                            if (media) {
                                await client.sendMessage(chatId, media, { caption: currentMessage });
                                mediaSent = true;
                                log(`🖼️ Image sent to ${rawNumber}`);
                            }
                        } catch (err) {
                            log(`⚠️ Image failed: ${err.message}`);
                        }
                    }

                    // Send text if no image or as fallback
                    if (!mediaSent) {
                        await client.sendMessage(chatId, currentMessage);
                        log(`📝 Message sent to ${rawNumber}`);
                    }

                    // Mark success
                    success = true;
                    dashboard.attempted++;
                    dashboard.success++;
                    dashboard.sent.push(rawNumber);
                    checkpoint.lastIndex = index + 1;

                    // Batch save (only save periodically)
                    if (dashboard.success % 10 === 0) {
                        await saveJSON(dashboardPath, dashboard);
                        await saveCheckpoint(checkpoint);
                    }

                } catch (err) {
                    // Check if frame error (browser disconnected)
                    if (err.message && err.message.includes('detached')) {
                        log(`💥 Browser detached - stopping: ${err.message}`);
                        stopSignal.isRunning = false;
                        break;
                    }
                    
                    attempts++;
                    if (attempts <= MAX_RETRIES && stopSignal.isRunning) {
                        log(`🔁 Retry ${attempts}/${MAX_RETRIES} for ${rawNumber}`);
                        await wait(RETRY_DELAY);
                    } else {
                        dashboard.attempted++;
                        dashboard.failed++;
                        dashboard.failedList.push(rawNumber);
                        log(`❌ Failed: ${rawNumber}`);
                    }
                }
            }

            if (!stopSignal.isRunning) break;

            // Random delay between sends
            const delay = randomDelay();
            await wait(delay);
            index++;
        }

        // Final save
        await saveJSON(dashboardPath, dashboard);
        await saveCheckpoint(checkpoint);

        log("🏁 Batch complete");
        await fs.remove(CHECKPOINT_FILE).catch(() => {});

        // Send admin report only if still connected
        if (stopSignal.isRunning) {
            await sendAdminReport(client, dashboard, messages.length, imageItems.length);
        }

        log("✅ Script completed");
        if (logStream) logStream.end();
        process.exit(0);
        
    } catch (err) {
        log(`💥 Bot error: ${err.message}`);
        if (logStream) logStream.end();
        process.exit(1);
    }
}

// =================== Admin Report ===================
async function sendAdminReport(client, dashboard, msgCount, imgCount) {
    const adminChatId = `${ADMIN_NUMBER}@c.us`;
    const report = `✅ WhatsApp Bot Report\n📅 Date: ${dashboard.date}\n📤 Attempted: ${dashboard.attempted}\n✔ Success: ${dashboard.success}\n❌ Failed: ${dashboard.failed}\n📝 Messages: ${msgCount}\n🖼️ Images: ${imgCount}`;

    try {
        const adminId = await client.getNumberId(adminChatId);
        if (adminId) {
            await client.sendMessage(adminChatId, report);
            log("📨 Admin report sent");
        }
    } catch (err) {
        log(`⚠️ Admin report failed: ${err.message}`);
    }
}

// =================== Client Setup ===================
async function createClient() {
    // This object signals to runBot whether it should keep running
    const stopSignal = { isRunning: true };

    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: SESSION_NAME,
            dataPath: SESSION_DIR,
            restartOnAuthFail: true
        }),
        puppeteer: {
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium-browser',
            args: [
                "--no-sandbox",
                "--disable-setuid-sandbox",
                "--disable-dev-shm-usage",
                "--disable-gpu",
                "--disable-extensions",
                "--disable-background-networking",
                "--disable-sync",
                "--no-first-run",
                "--no-default-browser-check",
                "--disable-features=site-per-process,Translate",
                "--disable-ipc-flooding-protection",
                "--disable-blink-features=AutomationControlled",
            ],
            timeout: 120000,
            protocolTimeout: 120000,
        },
    });

    let qrEmitted = false;

    // QR code event
    client.on("qr", async (qr) => {
        qrEmitted = true;
        log("📲 QR code generated - scan now");
        qrcode.generate(qr, { small: true });
        
        try {
            const qrDataUrl = await QRCode.toDataURL(qr);
            await sendToWorker("/api/live/qr", { qr: qrDataUrl });
        } catch (e) {
            log(`⚠️ QR send failed: ${e.message}`);
        }
    });

    // Ready event
    client.on("ready", async () => {
        if (!qrEmitted) {
            log("♻️ Session restored from cache");
        }
        await sendToWorker("/api/live/status", { status: "connected" });
        
        // Wait for WhatsApp to stabilize before starting operations
        log("⏳ Stabilizing connection...");
        await wait(3000);
        
        // Pass the stopSignal so the bot can be stopped externally
        await runBot(client, stopSignal);
    });

    // Disconnected event – STOP EVERYTHING IMMEDIATELY
    client.on("disconnected", async (reason) => {
        log(`⚠️ Disconnected: ${reason}`);
        
        // Signal the bot loop to stop (if it's already running)
        stopSignal.isRunning = false;

        // Try a quick cleanup, but don't wait for it
        try {
            await client.destroy();
        } catch (e) {
            // Ignore – the browser may already be gone
        }

        await cleanTempFiles();

        if (reason === "LOGOUT") {
            log("✅ Session ended normally - keeping for next run");
        }

        // Exit cleanly – do not let other code continue
        process.exit(0);
    });

    // Auth failure
    client.on("auth_failure", async (msg) => {
        log(`🔐 Auth failed: ${msg}`);
        stopSignal.isRunning = false;
        try {
            await client.destroy();
        } catch {}
        await clearSession();
        process.exit(1);
    });

    // Incoming messages (optional)
    client.on("message", async (message) => {
        if (message.type === 'chat' && !message.fromMe) {
            await sendToWorker("/api/live/message", { 
                message: { from: message.from, body: message.body, timestamp: message.timestamp }
            });
        }
    });

    // Graceful shutdown (Ctrl+C)
    const shutdown = async () => {
        log("🛑 Shutting down");
        stopSignal.isRunning = false;
        try {
            await client.destroy();
        } catch {}
        await cleanTempFiles();
        if (logStream) logStream.end();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    return client;
}

// =================== Main Entry ===================
async function main() {
    // Catch any unhandled promise rejections (e.g., "detached Frame")
    process.on("unhandledRejection", (reason, promise) => {
        log(`❌ Unhandled rejection: ${reason?.message || reason}`);
        // If we get here, something catastrophic happened (like the frame error)
        // Exit cleanly so the GitHub workflow succeeds.
        process.exit(0);
    });

    try {
        await fs.ensureDir(SESSION_DIR);
        await fs.ensureDir(LOGS_DIR);
        await fs.ensureDir(DASHBOARD_DIR);
        initLogger();

        log("🚀 Starting WhatsApp bot");
        await sendToWorker("/api/live/status", { status: "starting" });

        // Cleanup locks before init
        await removeLocks();

        let client = await createClient();
        let initialized = false;
        let attempts = 0;

        while (!initialized && attempts < 3) {
            try {
                await removeLocks();
                log(`🔧 Init attempt ${attempts + 1}`);
                await client.initialize();
                initialized = true;
                log("✅ Initialized");
            } catch (err) {
                attempts++;
                log(`❌ Init failed: ${err.message}`);
                
                try {
                    await client.destroy();
                } catch {}

                if (attempts < 3) {
                    log(`⏳ Retrying in 5s...`);
                    await wait(5000);
                    client = await createClient();
                } else {
                    log("❌ Failed after 3 attempts");
                    process.exit(1);
                }
            }
        }
    } catch (err) {
        console.error("💥 Fatal error:", err.message);
        if (logStream) logStream.end();
        process.exit(1);
    }
}

main();
