// logger.js
const WORKER_URL = process.env.LOG_SERVER || process.env.WORKER_URL;
const RUN_ID = process.env.GITHUB_RUN_ID || Date.now().toString();

if (!WORKER_URL) {
  console.log("[LOGGER] LOG_SERVER غير محدد");
}

const original = {
  log: console.log,
  error: console.error,
  warn: console.warn,
  info: console.info,
};

async function send(level, args) {
  if (!WORKER_URL) return;

  try {
    const text = args
      .map(v => {
        if (typeof v === "string") return v;
        try {
          return JSON.stringify(v);
        } catch {
          return String(v);
        }
      })
      .join(" ");

    await fetch(`${WORKER_URL}/api/live-log`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        runId: RUN_ID,
        level,
        text,
        time: new Date().toISOString()
      })
    });
  } catch (_) {
    // تجاهل أي خطأ حتى لا يتوقف البوت
  }
}

console.log = (...args) => {
  original.log(...args);
  send("log", args);
};

console.info = (...args) => {
  original.info(...args);
  send("info", args);
};

console.warn = (...args) => {
  original.warn(...args);
  send("warn", args);
};

console.error = (...args) => {
  original.error(...args);
  send("error", args);
};

process.on("uncaughtException", err => {
  original.error(err);
  send("error", [err.stack || err.message]);
});

process.on("unhandledRejection", err => {
  original.error(err);
  send("error", [String(err)]);
});
