import {
  githubGetFile, githubPutFile, githubRunWorkflow, githubListFiles,
  githubGetFileRaw, githubPutFileBase64, githubDeleteFile,
  githubRunWorkflowByName, githubListWorkflowRunsByName, githubCancelWorkflowRun,
  githubEnsureFile,
  githubListActiveRuns
} from './github.js';
import { jsonResponse, getPath, getImagesDir, linesToJsonArray, jsonToLines, getImagesListPath } from './helpers.js';
import { handleLoadSchedule, handleSaveSchedule } from './schedule.js';

import {
  handleSetStatus,
  handleGetStatus,
  handleSetQR,
  handleGetQR,
  handleAddLog,
  handleGetLogs as handleGetSessionLogs,
  handleAddMessage,
  handleGetMessages
} from './live.js';

// ===== دوال تحميل وحفظ الملفات (messages, contacts, images) =====
export async function handleLoad(request, env) {
  const type = new URL(request.url).searchParams.get("type");
  if (!["messages", "contacts", "images"].includes(type)) {
    return jsonResponse({ error: "type must be messages, contacts or images" }, 400);
  }
  try {
    const filePath = getPath(env, type);
    const fileData = await githubEnsureFile(env, filePath, "[]");
    return jsonResponse({ ok: true, text: jsonToLines(fileData.content), initialized: fileData.initialized || false });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) }, 500);
  }
}

export async function handleSave(request, env) {
  try {
    const { type, text } = await request.json();
    if (!["messages", "contacts", "images"].includes(type)) {
      return jsonResponse({ error: "type must be messages, contacts or images" }, 400);
    }
    const filePath = getPath(env, type);
    const current = await githubGetFile(env, filePath);
    const result = await githubPutFile(env, filePath, linesToJsonArray(text || ""), current.sha, "Update " + filePath);
    return jsonResponse({ ok: true, commit: result.commit && result.commit.sha });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message || err) }, 500);
  }
}

// ===== دوال إدارة الصور =====
export async function handleUploadImage(request, env) {
  try {
    const { filename, dataBase64 } = await request.json();
    if (!filename || !dataBase64) return jsonResponse({ ok: false, error: "filename and dataBase64 are required" }, 400);
    const imagesListPath = getImagesListPath(env);
    const listFile = await githubGetFile(env, imagesListPath);
    let imagesList = [];
    if (listFile.exists && listFile.content) {
      try { imagesList = JSON.parse(listFile.content); if (!Array.isArray(imagesList)) imagesList = []; } catch (e) { imagesList = []; }
    }
    if (imagesList.length >= 3) return jsonResponse({ ok: false, error: "لا يمكن رفع أكثر من 3 صور." }, 400);
    const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
    const timestamp = Date.now();
    const imagePath = getImagesDir(env) + "/" + timestamp + "_" + safeName;
    const existing = await githubGetFileRaw(env, imagePath);
    const result = await githubPutFileBase64(env, imagePath, dataBase64, existing.sha, "Add image " + safeName);
    imagesList.push(imagePath);
    await githubPutFile(env, imagesListPath, JSON.stringify(imagesList, null, 2), listFile.sha, "Update images list");
    return jsonResponse({ ok: true, path: imagePath, commit: result.commit && result.commit.sha });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleListImages(request, env) {
  try {
    const imagesListPath = getImagesListPath(env);
    const { content, exists } = await githubGetFile(env, imagesListPath);
    if (!exists || !content) return jsonResponse({ ok: true, files: [] });
    let list = [];
    try { list = JSON.parse(content); if (!Array.isArray(list)) list = []; } catch (e) { list = []; }
    const branch = env.GITHUB_BRANCH || "main";
    const owner = env.GITHUB_OWNER;
    const repo = env.GITHUB_REPO;
    const files = list.map(p => ({
      name: p.split('/').pop(), path: p, sha: null, size: 0,
      download_url: "https://raw.githubusercontent.com/" + owner + "/" + repo + "/" + branch + "/" + p
    }));
    return jsonResponse({ ok: true, files });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleDeleteImage(request, env) {
  try {
    const { filename } = await request.json();
    if (!filename) return jsonResponse({ ok: false, error: "filename is required" }, 400);
    const filePath = getImagesDir(env) + "/" + filename;
    const fileInfo = await githubGetFileRaw(env, filePath);
    if (!fileInfo.exists) return jsonResponse({ ok: false, error: "File not found" }, 404);
    await githubDeleteFile(env, filePath, fileInfo.sha, "Delete image " + filename);
    const imagesListPath = getImagesListPath(env);
    const listFile = await githubGetFile(env, imagesListPath);
    if (listFile.exists && listFile.content) {
      let imagesList = [];
      try { imagesList = JSON.parse(listFile.content); if (!Array.isArray(imagesList)) imagesList = []; } catch (e) { imagesList = []; }
      const newList = imagesList.filter(item => item !== filePath);
      await githubPutFile(env, imagesListPath, JSON.stringify(newList, null, 2), listFile.sha, "Update images list after delete");
    }
    return jsonResponse({ ok: true });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleLoadImagesList(request, env) {
  try {
    const filePath = getImagesListPath(env);
    const fileData = await githubEnsureFile(env, filePath, "[]");
    return jsonResponse({ ok: true, text: jsonToLines(fileData.content), initialized: fileData.initialized || false });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleSaveImagesList(request, env) {
  try {
    const { text } = await request.json();
    const filePath = getImagesListPath(env);
    const current = await githubGetFile(env, filePath);
    const result = await githubPutFile(env, filePath, linesToJsonArray(text || ""), current.sha, "Update images list");
    return jsonResponse({ ok: true, commit: result.commit && result.commit.sha });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

// ===== دوال أخرى (Workflow, Logs, Stats) =====
export async function handleRunWorkflow(request, env) {
  try { await githubRunWorkflow(env); return jsonResponse({ ok: true }); }
  catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleGetLogs(request, env) {
  try {
    const { files } = await githubListFiles(env, "logs");
    return jsonResponse({ ok: true, files });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleGetLogContent(request, env) {
  try {
    const filename = new URL(request.url).searchParams.get("file");
    if (!filename) return jsonResponse({ ok: false, error: "Missing file parameter" }, 400);
    const { content } = await githubGetFile(env, "logs/" + filename);
    return jsonResponse({ ok: true, content });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleGetStats(request, env) {
  try {
    const { content, exists } = await githubGetFile(env, "data/aggregate.json");
    if (!exists || !content) return jsonResponse({ ok: true, data: [] });
    try {
      const data = JSON.parse(content);
      return jsonResponse({ ok: true, data: Array.isArray(data) ? data : [] });
    } catch (e) { return jsonResponse({ ok: false, error: "Invalid JSON format" }, 500); }
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

// ===== إرسال الرسائل (send.yaml) =====
export async function handleSendRun(request, env) {
  try { await githubRunWorkflowByName(env, "send.yaml"); return jsonResponse({ ok: true, message: "تم تشغيل send.yaml" }); }
  catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}
export async function handleSendStop(request, env) {
  try {
    const runs = await githubListActiveRuns(env, "send.yaml");
    if (runs.length === 0) return jsonResponse({ ok: false, error: "لا يوجد إرسال قيد التنفيذ" }, 404);
    for (const run of runs) await githubCancelWorkflowRun(env, run.id);
    return jsonResponse({ ok: true, message: "تم إيقاف " + runs.length + " تشغيل" });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}
export async function handleSendStatus(request, env) {
  try {
    const runs = await githubListActiveRuns(env, "send.yaml");
    return jsonResponse({ ok: true, running: runs.length > 0, count: runs.length });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

// ===== الرد الذكي (reply.yaml) =====
export async function handleReplyRun(request, env) {
  try { await githubRunWorkflowByName(env, "reply.yaml"); return jsonResponse({ ok: true, message: "تم تشغيل reply.yaml" }); }
  catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}
export async function handleReplyStop(request, env) {
  try {
    const runs = await githubListActiveRuns(env, "reply.yaml");
    if (runs.length === 0) return jsonResponse({ ok: false, error: "لا يوجد رد ذكي قيد التنفيذ" }, 404);
    for (const run of runs) await githubCancelWorkflowRun(env, run.id);
    return jsonResponse({ ok: true, message: "تم إيقاف " + runs.length + " تشغيل" });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}
export async function handleReplyStatus(request, env) {
  try {
    const runs = await githubListActiveRuns(env, "reply.yaml");
    return jsonResponse({ ok: true, running: runs.length > 0, count: runs.length });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

// ===== QR workflow =====
export async function handleRunQRWorkflow(request, env) {
  try { const wf = env.QR_WORKFLOW_FILE || "qr.yaml"; await githubRunWorkflowByName(env, wf); return jsonResponse({ ok: true, message: "تم تشغيل " + wf }); }
  catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}
export async function handleStopQRWorkflow(request, env) {
  try {
    const wf = env.QR_WORKFLOW_FILE || "qr.yaml";
    const runs = await githubListActiveRuns(env, wf);
    if (runs.length === 0) return jsonResponse({ ok: false, error: "لا يوجد تشغيل قيد التنفيذ" }, 404);
    for (const run of runs) await githubCancelWorkflowRun(env, run.id);
    return jsonResponse({ ok: true, message: "تم إيقاف " + runs.length + " تشغيل" });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

// ===== قائمة الأرقام التفصيلية (mylist.json) =====
const MYLIST_PATH = "data/mylist.json";

export async function handleGetMylist(request, env) {
  try {
    const url = new URL(request.url);
    const gender = url.searchParams.get("gender") || "all";
    const minAge = url.searchParams.get("minAge") !== null ? parseInt(url.searchParams.get("minAge")) : null;
    const maxAge = url.searchParams.get("maxAge") !== null ? parseInt(url.searchParams.get("maxAge")) : null;
    const sort = url.searchParams.get("sort") || "index";
    const order = url.searchParams.get("order") || "asc";

    const fileData = await githubEnsureFile(env, MYLIST_PATH, "[]");
    let list = [];
    try { list = JSON.parse(fileData.content); if (!Array.isArray(list)) list = []; } catch (e) { list = []; }

    let filtered = list.map(function(item, idx) { return Object.assign({}, item, { _index: idx }); });

    if (gender !== "all") {
      filtered = filtered.filter(function(item) { return item.gender === gender; });
    }
    if (minAge !== null && !isNaN(minAge)) {
      filtered = filtered.filter(function(item) { return (item.age || 0) >= minAge; });
    }
    if (maxAge !== null && !isNaN(maxAge)) {
      filtered = filtered.filter(function(item) { return (item.age || 0) <= maxAge; });
    }

    filtered.sort(function(a, b) {
      var cmp = 0;
      if (sort === "age") cmp = (a.age || 0) - (b.age || 0);
      else if (sort === "number") cmp = (a.number || "").localeCompare(b.number || "");
      else cmp = a._index - b._index;
      return order === "desc" ? -cmp : cmp;
    });

    return jsonResponse({ ok: true, total: list.length, filtered: filtered.length, data: filtered });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

export async function handleSaveMylist(request, env) {
  try {
    var body = await request.json();
    var action = body.action;

    var fileData = await githubEnsureFile(env, MYLIST_PATH, "[]");
    var list = [];
    try { list = JSON.parse(fileData.content); if (!Array.isArray(list)) list = []; } catch (e) { list = []; }

    if (action === "add") {
      var number = body.number;
      var age = body.age;
      var gender = body.gender;
      if (!number) return jsonResponse({ ok: false, error: "الرقم مطلوب" }, 400);
      list.push({
        number: String(number).replace(/\D/g, ""),
        age: parseInt(age) || 0,
        gender: gender || "غير محدد"
      });
    } else if (action === "update") {
      var index = body.index;
      if (index === undefined || index < 0 || index >= list.length) return jsonResponse({ ok: false, error: "فهرس غير صالح" }, 400);
      if (body.number !== undefined) list[index].number = String(body.number).replace(/\D/g, "");
      if (body.age !== undefined) list[index].age = parseInt(body.age) || 0;
      if (body.gender !== undefined) list[index].gender = body.gender;
    } else if (action === "delete") {
      var index = body.index;
      if (index === undefined || index < 0 || index >= list.length) return jsonResponse({ ok: false, error: "فهرس غير صالح" }, 400);
      list.splice(index, 1);
    } else if (action === "sync-to-contacts") {
      var contactsPath = getPath(env, "contacts");
      var numbers = list.map(function(item) { return item.number; }).filter(function(n) { return n; });
      var uniqueNumbers = [...new Set(numbers)];
      var current = await githubGetFile(env, contactsPath);
      await githubPutFile(env, contactsPath, JSON.stringify(uniqueNumbers, null, 2), current.sha, "Sync mylist to contacts");
      return jsonResponse({ ok: true, message: "تم نسخ " + uniqueNumbers.length + " رقم إلى جهات الاتصال" });
    } else {
      return jsonResponse({ ok: false, error: "إجراء غير معروف" }, 400);
    }

    var result = await githubPutFile(env, MYLIST_PATH, JSON.stringify(list, null, 2), fileData.sha, "Update mylist.json");
    return jsonResponse({ ok: true, total: list.length, commit: result.commit && result.commit.sha });
  } catch (err) { return jsonResponse({ ok: false, error: String(err.message || err) }, 500); }
}

// إعادة تصدير دوال live.js
export { handleSetStatus, handleGetStatus, handleSetQR, handleGetQR, handleAddLog, handleGetSessionLogs, handleAddMessage, handleGetMessages };
// إعادة تصدير معالجات الجدولة
export { handleLoadSchedule, handleSaveSchedule };
