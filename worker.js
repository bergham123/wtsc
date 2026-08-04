import { HTML_PAGE } from './src/html.js';

import {
  handleLoad,
  handleSave,
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
  handleSendRun,
  handleSendStop,
  handleSendStatus,
  handleReplyRun,
  handleReplyStop,
  handleReplyStatus
} from './src/handlers.js';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const method = request.method;

    // الصفحة الرئيسية
    if (url.pathname === "/" && method === "GET") {
      return new Response(HTML_PAGE, {
        headers: { "Content-Type": "text/html; charset=utf-8" }
      });
    }

    // تحميل وحفظ الملفات
    if (url.pathname === "/api/load" && method === "GET")
      return handleLoad(request, env);
    if (url.pathname === "/api/save" && method === "POST")
      return handleSave(request, env);

    // الصور
    if (url.pathname === "/api/upload-image" && method === "POST")
      return handleUploadImage(request, env);
    if (url.pathname === "/api/images" && method === "GET")
      return handleListImages(request, env);
    if (url.pathname === "/api/delete-image" && method === "POST")
      return handleDeleteImage(request, env);
    if (url.pathname === "/api/images-list" && method === "GET")
      return handleLoadImagesList(request, env);
    if (url.pathname === "/api/images-list" && method === "POST")
      return handleSaveImagesList(request, env);

    // إرسال الرسائل (send.yaml)
    if (url.pathname === "/api/send/run" && method === "POST")
      return handleSendRun(request, env);
    if (url.pathname === "/api/send/stop" && method === "POST")
      return handleSendStop(request, env);
    if (url.pathname === "/api/send/status" && method === "GET")
      return handleSendStatus(request, env);

    // الرد الذكي (reply.yaml)
    if (url.pathname === "/api/reply/run" && method === "POST")
      return handleReplyRun(request, env);
    if (url.pathname === "/api/reply/stop" && method === "POST")
      return handleReplyStop(request, env);
    if (url.pathname === "/api/reply/status" && method === "GET")
      return handleReplyStatus(request, env);

    // QR workflow
    if (url.pathname === "/api/qr/run" && method === "POST")
      return handleRunQRWorkflow(request, env);
    if (url.pathname === "/api/qr/stop" && method === "POST")
      return handleStopQRWorkflow(request, env);

    // السجلات
    if (url.pathname === "/api/logs" && method === "GET")
      return handleGetLogs(request, env);
    if (url.pathname === "/api/log-content" && method === "GET")
      return handleGetLogContent(request, env);

    // الجدولة
    if (url.pathname === "/api/schedule" && method === "GET")
      return handleLoadSchedule(request, env);
    if (url.pathname === "/api/schedule" && method === "POST")
      return handleSaveSchedule(request, env);

    // الإحصائيات
    if (url.pathname === "/api/stats" && method === "GET")
      return handleGetStats(request, env);

    // Session (الداشبورد)
    if (url.pathname === "/api/session/status" && method === "GET")
      return handleGetStatus(request, env);
    if (url.pathname === "/api/session/status" && method === "POST")
      return handleSetStatus(request, env);
    if (url.pathname === "/api/session/qr" && method === "GET")
      return handleGetQR(request, env);
    if (url.pathname === "/api/session/qr" && method === "POST")
      return handleSetQR(request, env);

    // Live (يستخدمها send.js من GitHub Actions)
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
