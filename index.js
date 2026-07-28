import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import qrcode from "qrcode-terminal";
import QRCode from "qrcode";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

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
const AGGREGATE_FILE = "./aggregate.json";
const ADMIN_NUMBER = "212642284241";

const MAX_RETRIES = 2;
const RETRY_DELAY = 5000;
const MIN_DELAY = 20000;
const MAX_DELAY = 40000;
const MESSAGE_MODE = "random";

const WORKER_URL = process.env.WORKER_URL;
const API_SECRET = process.env.API_SECRET;
const SESSION_NAME = "main";

// Restart counter
const RESTART_COUNT_FILE = "./restart_count.json";
const MAX_RESTARTS = 3;

// =================== Helpers ===================
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const randomDelay = () => MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
const cleanNumber = (raw) => raw.replace(/\D/g, "");
const isUrl = (str) => /^https?:\/\/\S+\.\S+/.test(str);
const getToday = () => new Date().toISOString().split("T")[0];

// ---------- Worker communication ----------
async function sendToWorker(endpoint, data) {
    if (!WORKER_URL || !API_SECRET) {
        console.warn("⚠️ WORKER_URL or API_SECRET not set, cannot send to worker");
        return;
    }
    const url = WORKER_URL + endpoint;
    console.log(`📤 Sending to ${url}`);
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_SECRET,
            },
            body: JSON.stringify({ session: SESSION_NAME, ...data }),
        });
        const responseText = await response.text();
        console.log(`📥 Response status: ${response.status}, body: ${responseText}`);
        if (!response.ok) {
            console.warn(`❌ Failed to send to worker: ${response.status} - ${responseText}`);
        } else {
            console.log(`✅ Successfully sent to worker: ${endpoint}`);
        }
    } catch (e) {
        console.error(`💥 Error sending to worker (${endpoint}):`, e.message);
    }
}

function sendLogToWorker(text) {
    if (!WORKER_URL || !API_SECRET) return;
    const url = WORKER_URL + "/api/live/log";
    fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-API-Key": API_SECRET,
        },
        body: JSON.stringify({ session: SESSION_NAME, text }),
    }).catch((e) => console.error("💥 Log send error:", e.message));
}

// =================== File Helpers ===================
async function loadJSON(file, defaultVal = null) {
    if (await fs.pathExists(file)) {
        try {
            return await fs.readJson(file);
        } catch (e) {
            console.warn(`Failed to load ${file}: ${e.message}`);
            return defaultVal;
        }
    }
    return defaultVal;
}

async function saveJSON(file, data) {
    await fs.writeJson(file, data, { spaces: 2 });
}

// =================== Logger ===================
let logStream = null;
function initLogger() {
    const today = getToday();
    const logPath = path.join(LOGS_DIR, `${today}.log`);
    fs.ensureDirSync(LOGS_DIR);
    logStream = fs.createWriteStream(logPath, { flags: "a" });
    return logPath;
}

function logMessage(msg) {
    const timestamp = new Date().toISOString();
    const line = `[${timestamp}] ${msg}`;
    console.log(msg);
    if (logStream) logStream.write(line + "\n");
    sendLogToWorker(msg);
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
            logMessage(`📂 Loaded daily dashboard (${dashboard.success} success, ${dashboard.failed} failed)`);
        } catch (err) {
            logMessage(`⚠️ Failed to load dashboard: ${err.message}`);
        }
    }
    return { dashboard, dashboardPath };
}

// =================== Checkpoint ===================
async function loadCheckpoint() {
    let checkpoint = { lastIndex: 0 };
    if (await fs.pathExists(CHECKPOINT_FILE)) {
        try {
            const data = await fs.readJson(CHECKPOINT_FILE);
            if (typeof data.lastIndex === "number") checkpoint.lastIndex = data.lastIndex;
        } catch {
            // ignore
        }
    }
    return checkpoint;
}

async function saveCheckpoint(checkpoint) {
    await saveJSON(CHECKPOINT_FILE, checkpoint);
}

// =================== Session Management ===================
async function clearSession() {
    // Retry up to 3 times with 1 second delay
    for (let attempt = 1; attempt <= 3; attempt++) {
        try {
            if (await fs.pathExists(SESSION_DIR)) {
                // Use Node's native fs.rm with force and recursive
                await fs.rm(SESSION_DIR, { force: true, recursive: true });
                logMessage(`🗑️ Cleared session directory: ${SESSION_DIR}`);
                return; // success
            }
            return; // already gone
        } catch (err) {
            logMessage(`⚠️ Clear attempt ${attempt} failed: ${err.message}`);
            if (attempt < 3) {
                await wait(1000); // wait before retry
            } else {
                logMessage(`❌ Failed to clear session after 3 attempts, continuing anyway.`);
                // Optionally, we could throw, but we'll continue
            }
        }
    }
}

// =================== Process Restart ===================
async function restartProcess() {
    // Increment restart counter
    let restartData = { count: 0 };
    if (await fs.pathExists(RESTART_COUNT_FILE)) {
        try {
            restartData = await fs.readJson(RESTART_COUNT_FILE);
        } catch {}
    }
    restartData.count = (restartData.count || 0) + 1;
    await saveJSON(RESTART_COUNT_FILE, restartData);

    if (restartData.count > MAX_RESTARTS) {
        logMessage(`❌ Too many restarts (${MAX_RESTARTS}), giving up.`);
        process.exit(1);
    }

    logMessage(`🔄 Restarting process (attempt ${restartData.count})...`);
    if (logStream) logStream.end();

    // Spawn a new process with the same arguments
    const child = spawn(process.argv[0], process.argv.slice(1), {
        stdio: 'inherit',
        env: process.env,
        detached: false,
    });

    child.on('error', (err) => {
        console.error('Failed to start new process:', err);
        process.exit(1);
    });

    setTimeout(() => {
        process.exit(0);
    }, 1000);
}

// =================== Main Logic ===================
async function runBot(client) {
    logMessage("✅ WhatsApp client ready");

    const numbers = await loadJSON(ACCOUNTS_FILE, []);
    if (!Array.isArray(numbers) || numbers.length === 0) {
        logMessage("❌ No numbers in accounts.json");
        process.exit(1);
    }
    const cleanNumbers = [...new Set(numbers.map(cleanNumber))];
    logMessage(`📞 Loaded ${cleanNumbers.length} unique numbers`);

    let messages = [];
    let messageMode = MESSAGE_MODE;
    const loadedMessages = await loadJSON(MESSAGES_FILE, []);
    if (Array.isArray(loadedMessages) && loadedMessages.length > 0) {
        messages = loadedMessages.filter((m) => typeof m === "string" && m.trim().length > 0);
        logMessage(`📝 Loaded ${messages.length} messages from message.json`);
    }
    if (messages.length === 0) {
        if (await fs.pathExists(MESSAGE_FILE)) {
            const text = await fs.readFile(MESSAGE_FILE, "utf8");
            if (text.trim()) {
                messages = [text.trim()];
                logMessage(`📝 Loaded one message from message.txt`);
            }
        }
    }
    if (messages.length === 0) {
        logMessage("❌ No valid messages found");
        process.exit(1);
    }

    let imageItems = [];
    const loadedImages = await loadJSON(IMAGES_LIST_FILE, []);
    if (Array.isArray(loadedImages) && loadedImages.length > 0) {
        imageItems = loadedImages.filter((p) => typeof p === "string" && p.trim().length > 0);
        logMessage(`🖼️ Loaded ${imageItems.length} image items from images.json`);
    }

    const checkpoint = await loadCheckpoint();
    let startIndex = checkpoint.lastIndex;
    if (startIndex >= cleanNumbers.length) startIndex = 0;
    logMessage(`⏩ Starting from index ${startIndex} (${cleanNumbers[startIndex] || 'none'})`);

    const { dashboard, dashboardPath } = await loadDashboard();

    let messageCounter = 0;
    let index = startIndex;
    while (index < cleanNumbers.length) {
        const rawNumber = cleanNumbers[index];
        const chatId = `${rawNumber}@c.us`;

        if (dashboard.sent.includes(rawNumber) || dashboard.failedList.includes(rawNumber)) {
            logMessage(`⏭️ Number ${rawNumber} already processed today, skipping`);
            index++;
            continue;
        }

        let currentMessage;
        if (messageMode === "random") {
            currentMessage = messages[Math.floor(Math.random() * messages.length)];
        } else {
            currentMessage = messages[messageCounter % messages.length];
            messageCounter++;
        }

        let selectedImageItem = null;
        if (imageItems.length > 0) {
            selectedImageItem = imageItems[Math.floor(Math.random() * imageItems.length)];
        }

        let success = false;
        let attempts = 0;

        while (attempts <= MAX_RETRIES && !success) {
            try {
                const numberId = await client.getNumberId(chatId);
                if (!numberId) {
                    logMessage(`⚠️ Number ${rawNumber} not on WhatsApp`);
                    break;
                }

                let mediaSent = false;
                if (selectedImageItem) {
                    try {
                        let media;
                        if (isUrl(selectedImageItem)) {
                            logMessage(`🌐 Loading image from URL: ${selectedImageItem}`);
                            media = await MessageMedia.fromUrl(selectedImageItem);
                        } else {
                            const fullPath = path.join(__dirname, selectedImageItem);
                            if (await fs.pathExists(fullPath)) {
                                media = MessageMedia.fromFilePath(fullPath);
                            } else {
                                logMessage(`⚠️ Local file not found: ${fullPath}`);
                                throw new Error("Local file not found");
                            }
                        }
                        if (media) {
                            await client.sendMessage(chatId, media, { caption: currentMessage });
                            mediaSent = true;
                            logMessage(`🖼️ Sent image + caption to ${rawNumber}`);
                        }
                    } catch (imgErr) {
                        logMessage(`⚠️ Failed to send image (${selectedImageItem}): ${imgErr.message}`);
                    }
                }

                if (!mediaSent) {
                    await client.sendMessage(chatId, currentMessage);
                    logMessage(`📝 Sent text only to ${rawNumber}`);
                }

                success = true;
                dashboard.attempted++;
                dashboard.success++;
                dashboard.sent.push(rawNumber);
                logMessage(`✔ Successfully sent to ${rawNumber}`);

                checkpoint.lastIndex = index + 1;
                await saveCheckpoint(checkpoint);
                await saveJSON(dashboardPath, dashboard);

            } catch (err) {
                attempts++;
                if (attempts <= MAX_RETRIES) {
                    logMessage(`🔁 Retry ${attempts}/${MAX_RETRIES} for ${rawNumber}: ${err.message}`);
                    await wait(RETRY_DELAY);
                } else {
                    dashboard.attempted++;
                    dashboard.failed++;
                    dashboard.failedList.push(rawNumber);
                    logMessage(`❌ Final failure for ${rawNumber}: ${err.message}`);
                    await saveJSON(dashboardPath, dashboard);
                }
            }
        }

        const delay = randomDelay();
        logMessage(`⏳ Waiting ${(delay / 1000).toFixed(1)}s`);
        await wait(delay);
        index++;
    }

    logMessage("🏁 Main loop finished");
    await fs.remove(CHECKPOINT_FILE).catch(() => {});
    await updateAggregate();
    await sendAdminReport(client, dashboard, messages.length, imageItems.length, messageMode);

    logMessage("✅ Script completed successfully");
    logStream?.end();
    process.exit(0);
}

// =================== Aggregate ===================
async function updateAggregate() {
    try {
        const files = await fs.readdir(DASHBOARD_DIR);
        const aggregate = [];
        for (const file of files) {
            if (file.endsWith(".json")) {
                const data = await fs.readJson(path.join(DASHBOARD_DIR, file));
                aggregate.push({
                    date: data.date,
                    attempted: data.attempted || 0,
                    success: data.success || 0,
                    failed: data.failed || 0,
                });
            }
        }
        await saveJSON(AGGREGATE_FILE, aggregate);
        logMessage("📊 Updated aggregate.json");
    } catch (err) {
        logMessage(`⚠️ Failed to update aggregate: ${err.message}`);
    }
}

// =================== Admin Report ===================
async function sendAdminReport(client, dashboard, msgCount, imgCount, mode) {
    const adminChatId = `${ADMIN_NUMBER}@c.us`;
    const report = `
✅ Report
📅 Date: ${dashboard.date}
📤 Attempted: ${dashboard.attempted}
✔ Success: ${dashboard.success}
❌ Failed: ${dashboard.failed}
📌 Sent: ${dashboard.sent.length} numbers
❌ Failed list: ${dashboard.failedList.join(", ") || "none"}
📝 Messages used: ${msgCount}
🖼️ Images available: ${imgCount}
🔄 Mode: ${mode}
`;

    try {
        const adminId = await client.getNumberId(adminChatId);
        if (!adminId) {
            logMessage(`⚠️ Admin number ${ADMIN_NUMBER} not on WhatsApp`);
            return;
        }
        await client.sendMessage(adminChatId, report);
        logMessage("📨 Admin report sent");
    } catch (err) {
        logMessage(`⚠️ Failed to send admin report: ${err.message}`);
        try {
            await wait(5000);
            await client.sendMessage(adminChatId, report);
            logMessage("📨 Admin report sent on retry");
        } catch (err2) {
            logMessage(`⚠️ Second attempt failed: ${err2.message}`);
        }
    }
}

// =================== Client Setup ===================
async function createClient() {
    const client = new Client({
        authStrategy: new LocalAuth({
            clientId: "main",
            dataPath: "./session",
            restartOnAuthFail: true
        }),
        puppeteer: {
            headless: 'new',
            executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || undefined,
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

    client.on("qr", async (qr) => {
        console.log("🔐 Scan the QR code below:");
        qrcode.generate(qr, { small: true });
        try {
            const qrDataUrl = await QRCode.toDataURL(qr);
            await sendToWorker("/api/live/qr", { qr: qrDataUrl });
        } catch (e) {
            console.warn("Failed to send QR to worker:", e.message);
        }
    });

    client.on("ready", async () => {
        await sendToWorker("/api/live/status", { status: "connected" });
    });

    client.on("disconnected", async (reason) => {
        await sendToWorker("/api/live/status", { status: "disconnected", reason });
        logMessage(`⚠️ Disconnected: ${reason}`);

        // Destroy the client to release browser resources
        try {
            await client.destroy();
            logMessage("✅ Client destroyed");
        } catch (destroyErr) {
            logMessage(`⚠️ Error destroying client: ${destroyErr.message}`);
        }

        // Wait a moment for file handles to close
        await wait(2000);

        if (reason === "LOGOUT") {
            logMessage("🔄 Session expired – clearing session and restarting process...");
            await clearSession();
        } else {
            logMessage("🔄 Attempting to restart process without clearing session...");
        }

        // Restart the process
        await restartProcess();
    });

    client.on("auth_failure", async (msg) => {
        logMessage(`🔐 Authentication failure: ${msg}`);
        try {
            await client.destroy();
        } catch {}
        await wait(2000);
        await clearSession();
        await restartProcess();
    });

    client.on("message", async (message) => {
        if (message.type === 'chat' && !message.fromMe) {
            const msgData = {
                from: message.from,
                body: message.body,
                timestamp: message.timestamp,
            };
            await sendToWorker("/api/live/message", { message: msgData });
        }
    });

    const shutdown = async () => {
        logMessage("🛑 Shutting down...");
        await client.destroy();
        logStream?.end();
        process.exit(0);
    };
    process.on("SIGINT", shutdown);
    process.on("SIGTERM", shutdown);

    return client;
}

// =================== Main Entry ===================
async function main() {
    try {
        // Reset restart counter on fresh start
        if (await fs.pathExists(RESTART_COUNT_FILE)) {
            await fs.remove(RESTART_COUNT_FILE);
        }

        await fs.ensureDir(SESSION_DIR);
        await fs.ensureDir(LOGS_DIR);
        await fs.ensureDir(DASHBOARD_DIR);
        initLogger();

        logMessage("🚀 Starting WhatsApp bot");
        await sendToWorker("/api/live/status", { status: "starting" });

        let client = await createClient();
        let initialized = false;
        let initAttempts = 0;
        while (!initialized && initAttempts < 3) {
            try {
                await client.initialize();
                initialized = true;
                logMessage("✅ Client initialized successfully");
            } catch (initErr) {
                initAttempts++;
                logMessage(`❌ Initialization attempt ${initAttempts} failed: ${initErr.message}`);
                if (initAttempts < 3) {
                    logMessage(`Retrying in 10 seconds...`);
                    await wait(10000);
                    await client.destroy().catch(() => {});
                    client = await createClient();
                } else {
                    throw initErr;
                }
            }
        }

        client.on("ready", async () => {
            await runBot(client);
        });

    } catch (err) {
        console.error("❌ Fatal error:", err);
        logStream?.end();
        process.exit(1);
    }
}

main();
