import pkg from "whatsapp-web.js";
const { Client, LocalAuth } = pkg;

import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =================== Constants ===================
const SESSION_DIR = path.join(__dirname, "session");
const SESSION_NAME = "main";
const PROFILE_PATH = path.join(SESSION_DIR, SESSION_NAME);

const WORKER_URL = process.env.WORKER_URL || null;
const API_SECRET = process.env.API_SECRET || null;

const QR_TIMEOUT_MS = 300000; // 5 دقائق كحد أقصى لانتظار المسح

// =================== Helpers ===================
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

function log(msg) {
    console.log(`[${new Date().toISOString()}] ${msg}`);
}

// =================== إرسال QR إلى Worker ===================
async function sendToWorker(endpoint, data, retries = 2) {
    if (!WORKER_URL || !API_SECRET) {
        log("⚠️ WORKER_URL or API_SECRET not set, cannot send to worker");
        return false;
    }
    const url = WORKER_URL + endpoint;
    const payload = { session: SESSION_NAME, ...data };
    let attempt = 0;
    while (attempt <= retries) {
        try {
            log(`📡 Sending QR to worker (attempt ${attempt+1})`);
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
                log(`⚠️ Worker response ${response.status}: ${text}`);
                throw new Error(`HTTP ${response.status}`);
            }
            log("✅ QR sent to worker successfully");
            return true;
        } catch (e) {
            attempt++;
            log(`⚠️ Worker error (attempt ${attempt}): ${e.message}`);
            if (attempt <= retries) await wait(2000);
        }
    }
    log("❌ Failed to send QR to worker after retries");
    return false;
}

// =================== مسح ملفات القفل ===================
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

// =================== الدالة الرئيسية ===================
async function main() {
    const sessionExists = await fs.pathExists(PROFILE_PATH);

    if (sessionExists) {
        log("✅ الجلسة موجودة (المجلد موجود). لا حاجة لإنشاء QR.");
        process.exit(0);
    }

    log("🆕 لا توجد جلسة سابقة، سيتم إنشاء QR جديد وإرساله إلى dbs.");
    log("⏳ انتظر حتى يقوم المستخدم بمسح QR (المهلة 5 دقائق).");

    const client = new Client({
        authStrategy: new LocalAuth({ clientId: SESSION_NAME, dataPath: SESSION_DIR }),
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
            timeout: 60000,
            protocolTimeout: 60000,
        },
    });

    let qrSent = false;
    let resolved = false;

    // دالة لإنهاء البرنامج بشكل نظيف
    const exit = (code, message) => {
        if (resolved) return;
        resolved = true;
        log(message);
        client.destroy().catch(() => {});
        process.exit(code);
    };

    // حدث QR
    client.on("qr", async (qr) => {
        if (qrSent) return;
        qrSent = true;

        log("📲 تم توليد QR code - يرجى المسح خلال 5 دقائق");
        qrcode.generate(qr, { small: true });

        try {
            const qrDataUrl = await QRCode.toDataURL(qr);
            await sendToWorker("/api/live/qr", { qr: qrDataUrl });
        } catch (err) {
            log(`⚠️ فشل إرسال QR: ${err.message}`);
        }
        // لا ننهي البرنامج هنا، ننتظر الاتصال
    });

    // حدث Ready
    client.on("ready", () => {
        exit(0, "✅ تم الاتصال بنجاح، الجلسة جاهزة.");
    });

    // حدث Disconnected
    client.on("disconnected", (reason) => {
        exit(1, `⚠️ انقطع الاتصال: ${reason}`);
    });

    // حدث Auth Failure
    client.on("auth_failure", (msg) => {
        exit(1, `🔐 فشل المصادقة: ${msg}`);
    });

    // إزالة ملفات القفل
    await removeLocks();

    // تهيئة العميل
    try {
        log("⏳ جاري تهيئة العميل...");
        await client.initialize();
    } catch (err) {
        log(`❌ فشل التهيئة: ${err.message}`);
        process.exit(1);
    }

    // مهلة عامة: إذا لم يتم الاتصال خلال المدة المحددة، ننهي
    setTimeout(() => {
        if (!resolved) {
            exit(1, "⏰ انتهت المهلة (5 دقائق) دون مسح QR أو اتصال.");
        }
    }, QR_TIMEOUT_MS);
}

main().catch(err => {
    console.error("خطأ غير متوقع:", err);
    process.exit(1);
});
