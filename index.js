import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =================== Constants ===================
const ACCOUNTS_FILE = path.join(__dirname, "accounts.json");
const MESSAGE_FILE = path.join(__dirname, "message.txt");
const MESSAGES_FILE = path.join(__dirname, "message.json");
const IMAGES_LIST_FILE = path.join(__dirname, "images.json");
const DASHBOARD_DIR = path.join(__dirname, "dashboard");
const SESSION_DIR = path.join(__dirname, "session");
const LOGS_DIR = path.join(__dirname, "logs");
const CHECKPOINT_FILE = path.join(__dirname, "checkpoint.json");
const LOCAL_LOG_FILE = path.join(__dirname, "qr_status_log.json");
const AGGREGATE_FILE = path.join(__dirname, "aggregate.json");   // <-- الملف الجديد
const ADMIN_NUMBER = "212642284241";

const MAX_RETRIES = 2;
const RETRY_DELAY = 5000;
const MIN_DELAY = 20000;
const MAX_DELAY = 40000;
const MESSAGE_MODE = "random";
const QR_TIMEOUT_MS = 120000;
const RESTART_DELAY_MS = 5000;

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
    if (logStream) logStream.end();
    logStream = fs.createWriteStream(logPath, { flags: "a" });
    return logPath;
}

function log(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(msg);

    // قائمة بالعبارات المطلوب تسجيلها في الملف فقط
    const importantKeywords = [
        'Image sent to',
        'Message sent to',
        '❌ Failed',
        '✅ Script completed',
        '🏁 Batch complete'
    ];

    const shouldLogToFile = importantKeywords.some(keyword => msg.includes(keyword));

    if (shouldLogToFile && logStream) {
        logStream.write(line + "\n");
    }
}

// =================== Worker Communication ===================
async function sendToWorker(endpoint, data, retries = 2) {
    if (!WORKER_URL || !API_SECRET) {
        log(`⚠️ WORKER_URL or API_SECRET not set, cannot send to worker`);
        return false;
    }
    const url = WORKER_URL + endpoint;
    const payload = { session: SESSION_NAME, ...data };
    let attempt = 0;
    while (attempt <= retries) {
        try {
            log(`📡 Sending to worker (attempt ${attempt+1}): ${endpoint}`);
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-API-Key": API_SECRET,
                },
                body: JSON.stringify(payload),
            });
            if (!response.ok) {
                const text = await response.text();
                log(`⚠️ Worker response ${response.status} for ${endpoint}: ${text}`);
                throw new Error(`HTTP ${response.status}`);
            }
            log(`✅ Sent to worker: ${endpoint} - ${JSON.stringify(data)}`);
            return true;
        } catch (e) {
            attempt++;
            log(`⚠️ Worker error (attempt ${attempt}): ${e.message}`);
            if (attempt <= retries) await wait(2000);
        }
    }
    log(`❌ Failed to send to worker after ${retries+1} attempts`);
    return false;
}

// =================== Local Storage for QR & Status ===================
async function logQRStatusLocally(type, data) {
    try {
        let logs = [];
        if (await fs.pathExists(LOCAL_LOG_FILE)) {
            logs = await fs.readJson(LOCAL_LOG_FILE);
        }
        logs.push({
            timestamp: new Date().toISOString(),
            type: type,
            data: data
        });
        await fs.writeJson(LOCAL_LOG_FILE, logs, { spaces: 2 });
        log(`💾 Saved ${type} locally`);
    } catch (err) {
        log(`⚠️ Failed to save locally: ${err.message}`);
    }
}

// =================== File Helpers ===================
async function loadJSON(file, defaultVal = null) {
    if (await fs.pathExists(file)) {
        try { return await fs.readJson(file); }
        catch (e) { log(`⚠️ Failed to load ${file}`); return defaultVal; }
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

// =================== تنظيف الملفات المؤقتة ===================
async function cleanArtifacts() {
    log("🧹 Cleaning artifacts (cache, temp files, old checkpoints)");
    try {
        if (await fs.pathExists(CHECKPOINT_FILE)) {
            await fs.remove(CHECKPOINT_FILE);
            log("🗑️ Removed old checkpoint.json");
        }
        if (await fs.pathExists(LOCAL_LOG_FILE)) {
            await fs.remove(LOCAL_LOG_FILE);
            log("🗑️ Removed old qr_status_log.json");
        }
        await cleanTempFiles();
        await removeLocks();
    } catch (err) {
        log(`⚠️ Error during artifact cleaning: ${err.message}`);
    }
}

// =================== Dashboard ===================
async function loadDashboard() {
    const today = getToday();
    const dashboardPath = path.join(DASHBOARD_DIR, `dashboard-${today}.json`);
    fs.ensureDirSync(DASHBOARD_DIR);
    let dashboard = {
        date: today, attempted: 0, success: 0, failed: 0,
        sent: [], failedList: []
    };
    if (await fs.pathExists(dashboardPath)) {
        try {
            const loaded = await fs.readJson(dashboardPath);
            dashboard = { ...dashboard, ...loaded };
            if (!Array.isArray(dashboard.sent)) dashboard.sent = [];
            if (!Array.isArray(dashboard.failedList)) dashboard.failedList = [];
        } catch (err) { log(`⚠️ Failed to load dashboard: ${err.message}`); }
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

// =================== تحديث ملف aggregate.json ===================
async function updateAggregate(dashboard) {
    try {
        let aggregate = [];
        if (await fs.pathExists(AGGREGATE_FILE)) {
            aggregate = await fs.readJson(AGGREGATE_FILE);
            if (!Array.isArray(aggregate)) aggregate = [];
        }
        // البحث عن إدخال بنفس التاريخ
        const today = dashboard.date;
        const index = aggregate.findIndex(entry => entry.date === today);
        const newEntry = {
            date: today,
            attempted: dashboard.attempted,
            success: dashboard.success,
            failed: dashboard.failed
        };
        if (index !== -1) {
            aggregate[index] = newEntry;
            log(`📊 Updated aggregate for ${today}`);
        } else {
            aggregate.push(newEntry);
            log(`📊 Added aggregate for ${today}`);
        }
        await fs.writeJson(AGGREGATE_FILE, aggregate, { spaces: 2 });
    } catch (err) {
        log(`⚠️ Failed to update aggregate: ${err.message}`);
    }
}

// =================== Main Bot Logic ===================
async function runBot(client, stopSignal) {
    log("✅ WhatsApp client ready");
    if (!stopSignal.isRunning) { log("⚠️ Bot already stopped"); return; }
    try {
        const numbers = await loadJSON(ACCOUNTS_FILE, []);
        if (!Array.isArray(numbers) || numbers.length === 0) {
            log("❌ No numbers in accounts.json"); process.exit(1);
        }
        const cleanNumbers = [...new Set(numbers.map(cleanNumber))];
        log(`📞 ${cleanNumbers.length} unique numbers loaded`);

        let messages = [];
        const loadedMessages = await loadJSON(MESSAGES_FILE, []);
        if (Array.isArray(loadedMessages) && loadedMessages.length > 0) {
            messages = loadedMessages.filter(m => typeof m === "string" && m.trim().length > 0);
        }
        if (messages.length === 0 && await fs.pathExists(MESSAGE_FILE)) {
            const text = await fs.readFile(MESSAGE_FILE, "utf8");
            if (text.trim()) messages = [text.trim()];
        }
        if (messages.length === 0) { log("❌ No messages found"); process.exit(1); }
        log(`📝 ${messages.length} messages loaded`);

        let imageItems = [];
        const loadedImages = await loadJSON(IMAGES_LIST_FILE, []);
        if (Array.isArray(loadedImages) && loadedImages.length > 0) {
            imageItems = loadedImages.filter(p => typeof p === "string" && p.trim().length > 0);
        }
        if (imageItems.length > 0) log(`🖼️ ${imageItems.length} images available`);

        const checkpoint = await loadCheckpoint();
        let startIndex = checkpoint.lastIndex >= cleanNumbers.length ? 0 : checkpoint.lastIndex;
        const { dashboard, dashboardPath } = await loadDashboard();
        log(`⏩ Starting from index ${startIndex}`);

        let messageCounter = 0, index = startIndex;
        while (index < cleanNumbers.length && stopSignal.isRunning) {
            const rawNumber = cleanNumbers[index], chatId = `${rawNumber}@c.us`;
            if (dashboard.sent.includes(rawNumber) || dashboard.failedList.includes(rawNumber)) {
                log(`⏭️ ${rawNumber} already processed`); index++; continue;
            }
            const currentMessage = MESSAGE_MODE === "random"
                ? messages[Math.floor(Math.random() * messages.length)]
                : messages[messageCounter++ % messages.length];
            const selectedImageItem = imageItems.length > 0
                ? imageItems[Math.floor(Math.random() * imageItems.length)] : null;

            let success = false, attempts = 0;
            while (attempts <= MAX_RETRIES && !success && stopSignal.isRunning) {
                try {
                    const numberId = await client.getNumberId(chatId);
                    if (!numberId) { log(`⚠️ ${rawNumber} not on WhatsApp`); break; }
                    let mediaSent = false;
                    if (selectedImageItem) {
                        try {
                            let media;
                            if (isUrl(selectedImageItem)) media = await MessageMedia.fromUrl(selectedImageItem);
                            else {
                                const fullPath = path.join(__dirname, selectedImageItem);
                                if (await fs.pathExists(fullPath)) media = MessageMedia.fromFilePath(fullPath);
                                else throw new Error("File not found");
                            }
                            if (media) { await client.sendMessage(chatId, media, { caption: currentMessage }); mediaSent = true; log(`🖼️ Image sent to ${rawNumber}`); }
                        } catch (err) { log(`⚠️ Image failed: ${err.message}`); }
                    }
                    if (!mediaSent) { await client.sendMessage(chatId, currentMessage); log(`📝 Message sent to ${rawNumber}`); }
                    success = true; dashboard.attempted++; dashboard.success++; dashboard.sent.push(rawNumber); checkpoint.lastIndex = index + 1;
                    if (dashboard.success % 10 === 0) { await saveJSON(dashboardPath, dashboard); await saveCheckpoint(checkpoint); }
                } catch (err) {
                    if (err.message && err.message.includes('detached')) { log(`💥 Browser detached`); stopSignal.isRunning = false; break; }
                    attempts++;
                    if (attempts <= MAX_RETRIES && stopSignal.isRunning) { log(`🔁 Retry ${attempts}/${MAX_RETRIES}`); await wait(RETRY_DELAY); }
                    else { dashboard.attempted++; dashboard.failed++; dashboard.failedList.push(rawNumber); log(`❌ Failed: ${rawNumber}`); }
                }
            }
            if (!stopSignal.isRunning) break;
            await wait(randomDelay()); index++;
        }
        // حفظ dashboard النهائي
        await saveJSON(dashboardPath, dashboard);
        await saveCheckpoint(checkpoint);
        // تحديث ملف aggregate.json
        await updateAggregate(dashboard);
        log("🏁 Batch complete");
        await fs.remove(CHECKPOINT_FILE).catch(() => {});
        if (stopSignal.isRunning) await sendAdminReport(client, dashboard, messages.length, imageItems.length);
        log("✅ Script completed");
    } catch (err) { log(`💥 Bot error: ${err.message}`); }
}

// =================== Admin Report ===================
async function sendAdminReport(client, dashboard, msgCount, imgCount) {
    const adminChatId = `${ADMIN_NUMBER}@c.us`;
    const report = `✅ WhatsApp Bot Report\n📅 Date: ${dashboard.date}\n📤 Attempted: ${dashboard.attempted}\n✔ Success: ${dashboard.success}\n❌ Failed: ${dashboard.failed}\n📝 Messages: ${msgCount}\n🖼️ Images: ${imgCount}`;
    try { const adminId = await client.getNumberId(adminChatId); if (adminId) { await client.sendMessage(adminChatId, report); log("📨 Admin report sent"); } }
    catch (err) { log(`⚠️ Admin report failed: ${err.message}`); }
}

// =================== محاولة تشغيل البوت ===================
async function attemptBot() {
    return new Promise(async (resolve) => {
        const stopSignal = { isRunning: true };
        let client, qrTimeout, resolved = false;

        const finish = async (result) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(qrTimeout);
            await sendToWorker("/api/live/status", { status: "disconnected" });
            try { if (client) await client.destroy(); } catch {}
            await cleanTempFiles();
            resolve(result);
        };

        const sessionExists = await fs.pathExists(PROFILE_PATH);
        if (sessionExists) {
            log("📁 تم العثور على مجلد الجلسة، سيتم محاولة استعادتها...");
        } else {
            log("🆕 لا توجد جلسة سابقة، سيتم طلب QR جديد.");
        }

        qrTimeout = setTimeout(async () => {
            log("⏰ انتهت المهلة دون اتصال – الجلسة غير صالحة");
            stopSignal.isRunning = false;
            await clearSession();
            finish("TIMEOUT");
        }, QR_TIMEOUT_MS);

        client = new Client({
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
                    "--disable-background-networking",
                    "--disable-sync",
                    "--no-first-run",
                    "--no-default-browser-check",
                    "--disable-features=Translate,BackForwardCache,site-per-process",
                    "--disable-ipc-flooding-protection",
                    "--disable-blink-features=AutomationControlled",
                    "--disable-software-rasterizer",
                    "--disable-crashpad",
                    "--aggressive-cache-discard"
                ],
                timeout: 120000,
                protocolTimeout: 120000,
            },
        });

        // ============ Event: QR ============
        client.on("qr", async (qr) => {
            clearTimeout(qrTimeout);
            log("📲 QR code generated - scan now");
            qrcode.generate(qr, { small: true });
            await logQRStatusLocally("qr", { qr: qr });
            try {
                const qrDataUrl = await QRCode.toDataURL(qr);
                await sendToWorker("/api/live/qr", { qr: qrDataUrl });
            } catch (e) {
                log(`⚠️ Failed to send QR to worker: ${e.message}`);
            }
        });

        // ============ Event: Ready ============
        client.on("ready", async () => {
            clearTimeout(qrTimeout);
            log("♻️ Session ready");
            await sendToWorker("/api/live/status", { status: "connected" });
            await logQRStatusLocally("status", { status: "connected" });
            log("⏳ Stabilizing...");
            await wait(3000);
            await runBot(client, stopSignal);
            finish("DONE");
        });

        // ============ Event: Disconnected ============
        client.on("disconnected", async (reason) => {
            log(`⚠️ Disconnected: ${reason}`);
            clearTimeout(qrTimeout);
            stopSignal.isRunning = false;
            await sendToWorker("/api/live/status", { status: "disconnected" });
            await logQRStatusLocally("status", { status: "disconnected", reason });
            try { await client.destroy(); } catch {}
            await cleanTempFiles();
            if (reason === "LOGOUT") {
                log("🔄 جلسة مطرودة، جاري حذفها...");
                await clearSession();
                finish("LOGOUT");
            } else finish("DISCONNECTED");
        });

        // ============ Event: Auth Failure ============
        client.on("auth_failure", async (msg) => {
            log(`🔐 Auth failed: ${msg}`);
            clearTimeout(qrTimeout);
            stopSignal.isRunning = false;
            await sendToWorker("/api/live/status", { status: "disconnected" });
            await logQRStatusLocally("status", { status: "auth_failure", msg });
            try { await client.destroy(); } catch {}
            await clearSession();
            finish("AUTH_FAILURE");
        });

        // ============ Event: Incoming Message ============
        client.on("message", async (message) => {
            if (message.type === 'chat' && !message.fromMe) {
                await sendToWorker("/api/live/message", { message: { from: message.from, body: message.body, timestamp: message.timestamp } });
            }
        });

        // ============ إعادة محاولة التهيئة ============
        let initSuccess = false;
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                await removeLocks();
                log(`🔧 Init attempt ${attempt}`);
                await client.initialize();
                initSuccess = true;
                log("✅ Initialized");
                break;
            } catch (err) {
                log(`❌ Init failed (attempt ${attempt}): ${err.message}`);
                if (attempt < 3) {
                    await wait(3000);
                }
            }
        }

        if (!initSuccess) {
            clearTimeout(qrTimeout);
            await sendToWorker("/api/live/status", { status: "disconnected" });
            try { await client.destroy(); } catch {}
            await cleanTempFiles();
            finish("INIT_FAILED");
        }
    });
}

// =================== الدالة الرئيسية ===================
async function main() {
    process.on("unhandledRejection", (reason) => {
        log(`⚠️ Unhandled rejection: ${reason?.message || reason}`);
    });

    fs.ensureDirSync(SESSION_DIR);
    fs.ensureDirSync(LOGS_DIR);
    fs.ensureDirSync(DASHBOARD_DIR);

    await cleanArtifacts();

    initLogger();
    log("🚀 Starting WhatsApp bot (using repository files)");
    await sendToWorker("/api/live/status", { status: "starting" });

    let retryCount = 0, maxAttempts = 10;
    while (retryCount < maxAttempts) {
        retryCount++;
        log(`🔄 المحاولة رقم ${retryCount}`);
        const result = await attemptBot();
        log(`ℹ️ نتيجة المحاولة: ${result}`);

        if (result === "DONE") break;
        else if (result === "LOGOUT" || result === "TIMEOUT" || result === "INIT_FAILED") {
            log("⏳ انتظار 5 ثواني قبل إعادة المحاولة...");
            await wait(RESTART_DELAY_MS);
        } else {
            log(`❌ خطأ غير متوقع: ${result}`);
            break;
        }
    }

    log("👋 انتهى البرنامج.");
    if (logStream) logStream.end();
    process.exit(0);
}

main();
