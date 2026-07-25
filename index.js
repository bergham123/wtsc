// index.js
import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import qrcode from "qrcode-terminal";
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
const AGGREGATE_FILE = "./aggregate.json";
const ADMIN_NUMBER = "212642284241";

const MAX_RETRIES = 2;
const RETRY_DELAY = 5000;
const MIN_DELAY = 20000;
const MAX_DELAY = 40000;
const MESSAGE_MODE = "random";

// =================== Helpers ===================
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const randomDelay = () => MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
const cleanNumber = (raw) => raw.replace(/\D/g, "");
const isUrl = (str) => /^https?:\/\/\S+\.\S+/.test(str);
const getToday = () => new Date().toISOString().split("T")[0];

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

// =================== Main Logic ===================
async function runBot(client) {
  logMessage("✅ WhatsApp client ready");

  // 1. Load accounts
  const numbers = await loadJSON(ACCOUNTS_FILE, []);
  if (!Array.isArray(numbers) || numbers.length === 0) {
    logMessage("❌ No numbers in accounts.json");
    process.exit(1);
  }
  const cleanNumbers = [...new Set(numbers.map(cleanNumber))];
  logMessage(`📞 Loaded ${cleanNumbers.length} unique numbers`);

  // 2. Load messages
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

  // 3. Load images
  let imageItems = [];
  const loadedImages = await loadJSON(IMAGES_LIST_FILE, []);
  if (Array.isArray(loadedImages) && loadedImages.length > 0) {
    imageItems = loadedImages.filter((p) => typeof p === "string" && p.trim().length > 0);
    logMessage(`🖼️ Loaded ${imageItems.length} image items from images.json`);
  }

  // 4. Load checkpoint
  const checkpoint = await loadCheckpoint();
  let startIndex = checkpoint.lastIndex;
  if (startIndex >= cleanNumbers.length) startIndex = 0;
  logMessage(`⏩ Starting from index ${startIndex} (${cleanNumbers[startIndex] || 'none'})`);

  // 5. Load dashboard
  const { dashboard, dashboardPath } = await loadDashboard();

  // 6. Prepare counters
  let messageCounter = 0;

  // 7. Main loop
  let index = startIndex;
  while (index < cleanNumbers.length) {
    const rawNumber = cleanNumbers[index];
    const chatId = `${rawNumber}@c.us`;

    // Skip already processed today
    if (dashboard.sent.includes(rawNumber) || dashboard.failedList.includes(rawNumber)) {
      logMessage(`⏭️ Number ${rawNumber} already processed today, skipping`);
      index++;
      continue;
    }

    // Select message
    let currentMessage;
    if (messageMode === "random") {
      currentMessage = messages[Math.floor(Math.random() * messages.length)];
    } else {
      currentMessage = messages[messageCounter % messages.length];
      messageCounter++;
    }

    // Select image item (if any)
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

        // Update checkpoint and dashboard
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

    // Delay between numbers
    const delay = randomDelay();
    logMessage(`⏳ Waiting ${(delay / 1000).toFixed(1)}s`);
    await wait(delay);
    index++;
  }

  // ========== Finish ==========
  logMessage("🏁 Main loop finished");

  // Remove checkpoint
  await fs.remove(CHECKPOINT_FILE).catch(() => {});

  // Update aggregate
  await updateAggregate();

  // Send admin report
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
    // Retry once
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
      dataPath: SESSION_DIR,
    }),
    puppeteer: {
      headless: true,
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
      ],
    },
    restartOnAuthFail: true,
  });

  client.on("qr", (qr) => {
    console.log("🔐 Scan the QR code below:");
    qrcode.generate(qr, { small: true });
  });

  client.on("disconnected", (reason) => {
    logMessage(`⚠️ Disconnected: ${reason}`);
    process.exit(1);
  });

  // Handle graceful shutdown
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
    // Ensure directories
    await fs.ensureDir(SESSION_DIR);
    await fs.ensureDir(LOGS_DIR);
    await fs.ensureDir(DASHBOARD_DIR);
    initLogger();

    logMessage("🚀 Starting WhatsApp bot");
    const client = await createClient();
    await client.initialize();

    // When ready, run the bot logic
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
