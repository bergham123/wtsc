import pkg from "whatsapp-web.js";
const { Client, LocalAuth, MessageMedia } = pkg;

import qrcode from "qrcode-terminal";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { spawn } from "child_process";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// =================== ثوابت ===================
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

// عداد إعادة التشغيل
const RESTART_COUNT_FILE = "./restart_count.json";
const MAX_RESTARTS = 3;

// =================== متغيرات البيئة ===================
const WORKER_URL = process.env.WORKER_URL;
const API_SECRET = process.env.API_SECRET;
const SESSION_NAME = "main"; // أو أي اسم تريده

// =================== أدوات مساعدة ===================
const wait = (ms) => new Promise((r) => setTimeout(r, ms));
const randomDelay = () => MIN_DELAY + Math.floor(Math.random() * (MAX_DELAY - MIN_DELAY));
const cleanNumber = (raw) => raw.replace(/\D/g, "");
const isUrl = (str) => /^https?:\/\/\S+\.\S+/.test(str);

// =================== الاتصال بالـ Worker ===================
async function sendToWorker(endpoint, data) {
    if (!WORKER_URL || !API_SECRET) {
        // إذا لم تكن المتغيرات موجودة، لا تفعل شيئاً (قد تكون في بيئة محلية)
        return;
    }
    const url = WORKER_URL + endpoint;
    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-API-Key": API_SECRET,
            },
            body: JSON.stringify({ session: SESSION_NAME, ...data }),
        });
        const text = await response.text();
        if (!response.ok) {
            console.warn(`⚠️ فشل إرسال إلى Worker: ${response.status} - ${text}`);
        } else {
            console.log(`✅ تم الإرسال إلى Worker: ${endpoint}`);
        }
    } catch (e) {
        console.error(`💥 خطأ في الإرسال إلى Worker: ${e.message}`);
    }
}

// =================== تهيئة المجلدات ===================
await fs.ensureDir(DASHBOARD_DIR);
await fs.ensureDir(SESSION_DIR);
await fs.ensureDir(LOGS_DIR);

const today = new Date().toISOString().split("T")[0];
const dashboardPath = path.join(DASHBOARD_DIR, `dashboard-${today}.json`);
const logPath = path.join(LOGS_DIR, `${today}.log`);

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
    console.log(`📂 تم تحميل dashboard اليومي (${dashboard.success} نجاح، ${dashboard.failed} فشل)`);
  } catch (err) {
    console.warn(`⚠️ فشل تحميل dashboard: ${err.message}`);
  }
}

// =================== إعداد الـ Logger ===================
const logStream = fs.createWriteStream(logPath, { flags: "a" });
function logMessage(msg) {
  const timestamp = new Date().toISOString();
  const line = `[${timestamp}] ${msg}`;
  console.log(msg);
  logStream.write(line + "\n");
  // إرسال السجل إلى الـ Worker أيضاً (اختياري)
  sendToWorker("/api/live/log", { text: msg }).catch(() => {});
}

logMessage("🚀 بدء تشغيل السكربت");

// =================== إدارة نقطة التوقف ===================
let checkpoint = { lastIndex: 0 };
if (await fs.pathExists(CHECKPOINT_FILE)) {
  try {
    checkpoint = await fs.readJson(CHECKPOINT_FILE);
    if (typeof checkpoint.lastIndex !== "number") checkpoint.lastIndex = 0;
  } catch {
    checkpoint.lastIndex = 0;
  }
}
logMessage(`📌 نقطة التوقف الحالية: الفهرس ${checkpoint.lastIndex}`);

// =================== إدارة الجلسة ===================
async function clearSession() {
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      if (await fs.pathExists(SESSION_DIR)) {
        await fs.rm(SESSION_DIR, { force: true, recursive: true });
        logMessage(`🗑️ تم حذف مجلد الجلسة: ${SESSION_DIR}`);
        return;
      }
      return;
    } catch (err) {
      logMessage(`⚠️ محاولة حذف ${attempt} فشلت: ${err.message}`);
      if (attempt < 3) await wait(1000);
    }
  }
  logMessage(`❌ فشل حذف الجلسة بعد 3 محاولات`);
}

// =================== إعادة تشغيل العملية ===================
async function restartProcess() {
  let restartData = { count: 0 };
  if (await fs.pathExists(RESTART_COUNT_FILE)) {
    try {
      restartData = await fs.readJson(RESTART_COUNT_FILE);
    } catch {}
  }
  restartData.count = (restartData.count || 0) + 1;
  await fs.writeJson(RESTART_COUNT_FILE, restartData, { spaces: 2 });

  if (restartData.count > MAX_RESTARTS) {
    logMessage(`❌ عدد إعادة التشغيل تجاوز الحد الأقصى (${MAX_RESTARTS})، إنهاء.`);
    process.exit(1);
  }

  logMessage(`🔄 إعادة تشغيل العملية (المحاولة ${restartData.count})...`);
  logStream.end();

  const child = spawn(process.argv[0], process.argv.slice(1), {
    stdio: 'inherit',
    env: process.env,
    detached: false,
  });

  child.on('error', (err) => {
    console.error('فشل بدء العملية الجديدة:', err);
    process.exit(1);
  });

  setTimeout(() => {
    process.exit(0);
  }, 1000);
}

// =================== إنشاء عميل واتساب ===================
async function createClient() {
  const client = new Client({
    authStrategy: new LocalAuth({
      clientId: "main",
      dataPath: SESSION_DIR,
    }),
    puppeteer: {
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      headless: true,
    },
  });

  // ----- حدث الـ QR -----
  client.on("qr", async (qr) => {
    console.log("🔐 امسح رمز QR:");
    qrcode.generate(qr, { small: true });

    // إرسال الـ QR إلى الـ Worker
    try {
      // يمكنك تحويل الـ QR إلى صورة base64 أو إرساله كنص
      // لكن الأفضل إرسال النص نفسه ليتم عرضه في الواجهة
      await sendToWorker("/api/live/qr", { qr: qr });
    } catch (err) {
      console.warn("فشل إرسال QR إلى Worker:", err.message);
    }
  });

  // ----- حدث الجاهزية -----
  client.on("ready", async () => {
    logMessage("✅ واتساب جاهز");
    await sendToWorker("/api/live/status", { status: "connected" });
    // تشغيل الروبوت
    await runBot(client);
  });

  // ----- حدث الانقطاع -----
  client.on("disconnected", async (reason) => {
    logMessage(`⚠️ تم فصل الاتصال: ${reason}`);
    await sendToWorker("/api/live/status", { status: "disconnected", reason });

    try {
      await client.destroy();
      logMessage("✅ تم تدمير العميل");
    } catch (err) {
      logMessage(`⚠️ خطأ أثناء تدمير العميل: ${err.message}`);
    }
    await wait(2000);

    if (reason === "LOGOUT") {
      logMessage("🔄 انتهت الجلسة – سنحذف الجلسة ونعيد التشغيل...");
      await clearSession();
    } else {
      logMessage("🔄 سنعيد التشغيل دون حذف الجلسة (قد يكون خطأ شبكة)");
    }
    await restartProcess();
  });

  // ----- حدث فشل المصادقة -----
  client.on("auth_failure", async (msg) => {
    logMessage(`🔐 فشل المصادقة: ${msg}`);
    await sendToWorker("/api/live/status", { status: "auth_failure", message: msg });
    try {
      await client.destroy();
    } catch {}
    await wait(2000);
    await clearSession();
    await restartProcess();
  });

  // ----- حدث الرسائل الواردة (اختياري) -----
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

  return client;
}

// =================== وظيفة الروبوت الرئيسية ===================
async function runBot(client) {
  // (كل الكود الأصلي للروبوت يبقى كما هو دون تغيير)
  // ... (سنضعه هنا بالكامل للحفاظ على السياق)
  // لكن لتجنب التكرار، سأكتبه مختصراً مع الإشارة إلى أنه نفس الكود السابق.

  // ========== قراءة الملفات ==========
  if (!(await fs.pathExists(ACCOUNTS_FILE))) {
    logMessage("❌ ملف accounts.json غير موجود");
    process.exit(1);
  }
  let numbers = await fs.readJson(ACCOUNTS_FILE);
  if (!Array.isArray(numbers) || numbers.length === 0) {
    logMessage("❌ لا توجد أرقام في accounts.json");
    process.exit(1);
  }
  const cleanNumbers = [...new Set(numbers.map(cleanNumber))];
  logMessage(`📞 عدد الأرقام بعد التنظيف: ${cleanNumbers.length}`);

  // ========== قراءة الرسائل ==========
  let messages = [];
  let messageMode = MESSAGE_MODE;
  if (await fs.pathExists(MESSAGES_FILE)) {
    try {
      const data = await fs.readJson(MESSAGES_FILE);
      if (Array.isArray(data) && data.length > 0) {
        messages = data.filter(msg => typeof msg === "string" && msg.trim().length > 0);
        logMessage(`📝 تم تحميل ${messages.length} رسالة من message.json`);
      }
    } catch (err) {
      logMessage(`⚠️ فشل قراءة message.json: ${err.message}`);
    }
  }
  if (messages.length === 0) {
    if (!(await fs.pathExists(MESSAGE_FILE))) {
      logMessage("❌ لا يوجد message.txt ولا message.json صالح");
      process.exit(1);
    }
    const text = await fs.readFile(MESSAGE_FILE, "utf8");
    if (!text.trim()) {
      logMessage("❌ الرسالة فارغة");
      process.exit(1);
    }
    messages = [text.trim()];
    logMessage(`📝 تم تحميل رسالة واحدة من message.txt`);
  }

  // ========== قراءة قائمة الصور ==========
  let imageItems = [];
  if (await fs.pathExists(IMAGES_LIST_FILE)) {
    try {
      const data = await fs.readJson(IMAGES_LIST_FILE);
      if (Array.isArray(data) && data.length > 0) {
        imageItems = data.filter(p => typeof p === "string" && p.trim().length > 0);
        logMessage(`🖼️ تم تحميل ${imageItems.length} مدخل من images.json`);
      }
    } catch (err) {
      logMessage(`⚠️ فشل قراءة images.json: ${err.message}`);
    }
  }

  // ========== تحديد نقطة البداية ==========
  let startIndex = 0;
  if (checkpoint.lastIndex < cleanNumbers.length) {
    startIndex = checkpoint.lastIndex;
    logMessage(`⏩ الاستئناف من الفهرس ${startIndex} (الرقم: ${cleanNumbers[startIndex]})`);
  } else {
    startIndex = 0;
    logMessage(`🔄 بدء من البداية (الفهرس ${startIndex})`);
  }

  let messageCounter = 0;

  // ========== الحلقة الرئيسية ==========
  let index = startIndex;
  while (index < cleanNumbers.length) {
    const rawNumber = cleanNumbers[index];
    const chatId = `${rawNumber}@c.us`;

    if (dashboard.sent.includes(rawNumber) || dashboard.failedList.includes(rawNumber)) {
      logMessage(`⏭️ الرقم ${rawNumber} سبق معالجته اليوم، تخطي`);
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
          logMessage(`⚠️ الرقم ${rawNumber} غير موجود على واتساب`);
          break;
        }

        let mediaSent = false;
        if (selectedImageItem) {
          try {
            let media;
            if (isUrl(selectedImageItem)) {
              logMessage(`🌐 محاولة تحميل صورة من رابط: ${selectedImageItem}`);
              media = await MessageMedia.fromUrl(selectedImageItem);
            } else {
              const fullPath = path.join(__dirname, selectedImageItem);
              if (await fs.pathExists(fullPath)) {
                media = MessageMedia.fromFilePath(fullPath);
              } else {
                logMessage(`⚠️ الملف المحلي غير موجود: ${fullPath}`);
                throw new Error("Local file not found");
              }
            }
            if (media) {
              await client.sendMessage(chatId, media, { caption: currentMessage });
              mediaSent = true;
              logMessage(`🖼️ تم إرسال صورة + نص إلى ${rawNumber}`);
            }
          } catch (imgErr) {
            logMessage(`⚠️ فشل إرسال الصورة (${selectedImageItem}): ${imgErr.message}`);
          }
        }

        if (!mediaSent) {
          await client.sendMessage(chatId, currentMessage);
          logMessage(`📝 تم إرسال نص فقط إلى ${rawNumber}`);
        }

        success = true;
        dashboard.attempted++;
        dashboard.success++;
        dashboard.sent.push(rawNumber);
        logMessage(`✔ تم الإرسال إلى ${rawNumber} (${currentMessage.substring(0, 30)}...)`);

        checkpoint.lastIndex = index + 1;
        await fs.writeJson(CHECKPOINT_FILE, checkpoint, { spaces: 2 });
        await fs.writeJson(dashboardPath, dashboard, { spaces: 2 });

      } catch (err) {
        attempts++;
        if (attempts <= MAX_RETRIES) {
          logMessage(`🔁 محاولة ${attempts}/${MAX_RETRIES} للرقم ${rawNumber} فشلت: ${err.message}`);
          await wait(RETRY_DELAY);
        } else {
          dashboard.attempted++;
          dashboard.failed++;
          dashboard.failedList.push(rawNumber);
          logMessage(`❌ فشل نهائي للرقم ${rawNumber}: ${err.message}`);
          await fs.writeJson(dashboardPath, dashboard, { spaces: 2 });
        }
      }
    }

    const delay = randomDelay();
    logMessage(`⏳ انتظار ${(delay / 1000).toFixed(1)} ثانية`);
    await wait(delay);
    index++;
  }

  // ========== انتهى الإرسال ==========
  logMessage("🏁 انتهت الحلقة الرئيسية");
  await fs.remove(CHECKPOINT_FILE).catch(() => {});

  // ========== تحديث الـ Aggregate ==========
  try {
    const allDashboards = await fs.readdir(DASHBOARD_DIR);
    const aggregate = [];
    for (const file of allDashboards) {
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
    await fs.writeJson(AGGREGATE_FILE, aggregate, { spaces: 2 });
    logMessage("📊 تم تحديث aggregate.json");
  } catch (err) {
    logMessage(`⚠️ فشل تحديث aggregate: ${err.message}`);
  }

  // ========== إرسال التقرير للإدمن ==========
  const report = `
✅ تقرير الإرسال
📅 التاريخ: ${today}
📤 المحاولات: ${dashboard.attempted}
✔ النجاح: ${dashboard.success}
❌ الفشل: ${dashboard.failed}
📌 المرسلة: ${dashboard.sent.length} رقم
❌ الفاشلة: ${dashboard.failedList.join(", ") || "لا يوجد"}
📝 عدد الرسائل المستخدمة: ${messages.length}
🖼️ عدد مدخلات الصور: ${imageItems.length}
🔄 وضع اختيار الرسالة: ${messageMode}
`;

  const adminChatId = `${ADMIN_NUMBER}@c.us`;
  try {
    const adminId = await client.getNumberId(adminChatId);
    if (!adminId) {
      logMessage(`⚠️ رقم الإدمن ${ADMIN_NUMBER} غير مسجل على واتساب`);
    } else {
      await client.sendMessage(adminChatId, report);
      logMessage("📨 تم إرسال التقرير للإدمن");
    }
  } catch (err) {
    logMessage(`⚠️ فشل إرسال التقرير للإدمن: ${err.message}`);
    await wait(5000);
    try {
      await client.sendMessage(adminChatId, report);
      logMessage("📨 تم إرسال التقرير بعد المحاولة الثانية");
    } catch (err2) {
      logMessage(`⚠️ فشل المحاولة الثانية: ${err2.message}`);
    }
  }

  logMessage("✅ تم إنهاء السكربت بنجاح");
  logStream.end();
  process.exit(0);
}

// =================== الدالة الرئيسية ===================
async function main() {
  // حذف عداد إعادة التشغيل عند بداية جديدة
  if (await fs.pathExists(RESTART_COUNT_FILE)) {
    await fs.remove(RESTART_COUNT_FILE);
  }

  // إرسال حالة البدء إلى الـ Worker
  await sendToWorker("/api/live/status", { status: "starting" });

  let client = await createClient();
  let initialized = false;
  let attempts = 0;
  while (!initialized && attempts < 3) {
    try {
      await client.initialize();
      initialized = true;
      logMessage("✅ تم تهيئة العميل بنجاح");
    } catch (err) {
      attempts++;
      logMessage(`❌ محاولة تهيئة ${attempts} فشلت: ${err.message}`);
      if (attempts < 3) {
        logMessage(`🔄 إعادة المحاولة بعد 10 ثوانٍ...`);
        await wait(10000);
        await client.destroy().catch(() => {});
        client = await createClient();
      } else {
        logMessage(`❌ فشل التهيئة بعد 3 محاولات، إنهاء.`);
        process.exit(1);
      }
    }
  }
}

// تشغيل البرنامج
main().catch(err => {
  console.error("❌ خطأ فادح:", err);
  logStream?.end();
  process.exit(1);
});
