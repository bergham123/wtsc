// worker.js - المدخل الرئيسي
import { HTML_PAGE } from './src/html.js';

import {
  handleLoad,
  handleSave,
  handleRunWorkflow,
  handleUploadImage,
  handleGetLogs,
  handleGetLogContent,
  handleGetStats,
  handleLoadSchedule,
  handleSaveSchedule,
  handleListImages,
  handleDeleteImage,
  handleLoadImagesList,
  handleSaveImagesList,
  handleRunQRWorkflow,
  handleStopQRWorkflow,
  handleGetStatus,
  handleSetStatus,
  handleGetQR,
  handleSetQR,
  handleAddLog,
  handleGetLogs as handleGetSessionLogs,
  handleAddMessage,
  handleGetMessages,
  handleRunReplyWorkflow,   // ← جديد
  handleStopReplyWorkflow   // ← جديد
} from './src/handlers.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // ==================== الصفحة الرئيسية ====================
    if (url.pathname === "/" && method === "GET") {
      return new Response(HTML_PAGE, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // ==================== API: تحميل وحفظ الملفات ====================
    if (url.pathname === "/api/load" && method === "GET")
      return handleLoad(request, env);
    if (url.pathname === "/api/save" && method === "POST")
      return handleSave(request, env);

    // ==================== API: الصور ====================
    if (url.pathname === "/api/upload-image" && method === "POST")
      return handleUploadImage(request, env);
    if (url.pathname === "/api/images" && method === "GET")
      return handleListImages(request, env);
    if (url.pathname === "/api/delete-image" && method === "POST")
      return handleDeleteImage(request, env);

    // ==================== API: قائمة الصور ====================
    if (url.pathname === "/api/images-list" && method === "GET")
      return handleLoadImagesList(request, env);
    if (url.pathname === "/api/images-list" && method === "POST")
      return handleSaveImagesList(request, env);

    // ==================== API: Send Workflow ====================
    if (url.pathname === "/api/run-workflow" && method === "POST")
      return handleRunWorkflow(request, env);
    if (url.pathname === "/api/stop-workflow" && method === "POST")
      return handleStopQRWorkflow(request, env);

    // ==================== API: Reply AI Workflow ====================
    if (url.pathname === "/api/reply/run" && method === "POST")
      return handleRunReplyWorkflow(request, env);
    if (url.pathname === "/api/reply/stop" && method === "POST")
      return handleStopReplyWorkflow(request, env);

    // ==================== API: السجلات ====================
    if (url.pathname === "/api/logs" && method === "GET")
      return handleGetLogs(request, env);
    if (url.pathname === "/api/log-content" && method === "GET")
      return handleGetLogContent(request, env);

    // ==================== API: الجدولة ====================
    if (url.pathname === "/api/schedule" && method === "GET")
      return handleLoadSchedule(request, env);
    if (url.pathname === "/api/schedule" && method === "POST")
      return handleSaveSchedule(request, env);

    // ==================== API: الإحصائيات ====================
    if (url.pathname === "/api/stats" && method === "GET")
      return handleGetStats(request, env);

    // ==================== API: Session ====================
    if (url.pathname === "/api/session/status" && method === "GET")
      return handleGetStatus(request, env);
    if (url.pathname === "/api/session/status" && method === "POST")
      return handleSetStatus(request, env);
    if (url.pathname === "/api/session/qr" && method === "GET")
      return handleGetQR(request, env);
    if (url.pathname === "/api/session/qr" && method === "POST")
      return handleSetQR(request, env);

    // ==================== API: QR Workflow ====================
    if (url.pathname === "/api/qr/run" && method === "POST")
      return handleRunQRWorkflow(request, env);
    if (url.pathname === "/api/qr/stop" && method === "POST")
      return handleStopQRWorkflow(request, env);

    // ==================== API: Live (من GitHub Actions) ====================
    if (url.pathname === "/api/live/status" && method === "POST")
      return handleSetStatus(request, env);
    if (url.pathname === "/api/live/status" && method === "GET")
      return handleGetStatus(request, env);
    if (url.pathname === "/api/live/qr" && method === "POST")
      return handleSetQR(request, env);
    if (url.pathname === "/api/live/message" && method === "POST")
      return handleAddMessage(request, env);
    if (url.pathname === "/api/live/logs" && method === "GET")
      return handleGetSessionLogs(request, env);
    if (url.pathname === "/api/live/log" && method === "POST")
      return handleAddLog(request, env);
    if (url.pathname === "/api/live/messages" && method === "GET")
      return handleGetMessages(request, env);

    return new Response("Not found", { status: 404 });
  }
};
