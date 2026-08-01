import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ... constants as before ...

// =================== Helpers ===================
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const randomDelay = () => MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
const cleanNumber = (raw) => raw.replace(/\D/g, "");
const isUrl = (str) => /^https?:\/\/\S+\.\S+/.test(str);
const getToday = () => new Date().toISOString().split("T")[0];

// ... logging, worker, file helpers, session management, dashboard ... (same as before, no changes needed)

// =================== محاولة واحدة (معالجة محسنة) ===================
async function attemptBot() {
    return new Promise(async (resolve) => {
        const stopSignal = { isRunning: true };
        let client, qrTimeout, resolved = false;

        const finish = async (result) => {
            if (resolved) return;
            resolved = true;
            clearTimeout(qrTimeout);
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

        client.on("qr", async (qr) => {
            clearTimeout(qrTimeout);
            log("📲 QR code generated - scan now");
            qrcode.generate(qr, { small: true });
            try { const qrDataUrl = await QRCode.toDataURL(qr); await sendToWorker("/api/live/qr", { qr: qrDataUrl }); } catch (e) {}
        });

        client.on("ready", async () => {
            clearTimeout(qrTimeout);
            log("♻️ Session ready");
            await sendToWorker("/api/live/status", { status: "connected" });
            log("⏳ Stabilizing..."); await wait(3000);
            await runBot(client, stopSignal);
            finish("DONE");
        });

        client.on("disconnected", async (reason) => {
            log(`⚠️ Disconnected: ${reason}`);
            clearTimeout(qrTimeout);
            stopSignal.isRunning = false;
            try { await client.destroy(); } catch {}
            await cleanTempFiles();
            if (reason === "LOGOUT") {
                log("🔄 جلسة مطرودة، جاري حذفها...");
                await clearSession();
                finish("LOGOUT");
            } else finish("DISCONNECTED");
        });

        client.on("auth_failure", async (msg) => {
            log(`🔐 Auth failed: ${msg}`);
            clearTimeout(qrTimeout);
            stopSignal.isRunning = false;
            try { await client.destroy(); } catch {}
            await clearSession();
            finish("AUTH_FAILURE");
        });

        client.on("message", async (message) => {
            if (message.type === 'chat' && !message.fromMe) {
                await sendToWorker("/api/live/message", { message: { from: message.from, body: message.body, timestamp: message.timestamp } });
            }
        });

        // بدء التهيئة مع إمكانية إعادة المحاولة داخل المحاولة
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

    await fs.ensureDir(SESSION_DIR);
    await fs.ensureDir(LOGS_DIR);
    await fs.ensureDir(DASHBOARD_DIR);
    initLogger();
    log("🚀 Starting WhatsApp bot");
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
            await wait(5000);
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
