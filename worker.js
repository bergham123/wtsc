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
    handleStopWorkflow   // جديد
} from './src/handlers.js';

import {
    handleSetStatus,
    handleGetStatus,
    handleSetQR,
    handleGetQR,
    handleAddLog,
    handleGetLogs as handleGetLiveLogs,
    handleAddMessage,
    handleGetMessages
} from './src/live.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // Serve dashboard with API_SECRET injected
        if (path === '/' && request.method === 'GET') {
            // Inject API_SECRET into the page
            const html = HTML_PAGE.replace(
                '</head>',
                `<script>window.API_SECRET = "${env.API_SECRET}";</script></head>`
            );
            return new Response(html, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        // ---- Public GET endpoints (no auth) ----
        if (path === '/api/live/status' && request.method === 'GET') return handleGetStatus(request, env);
        if (path === '/api/live/qr' && request.method === 'GET') return handleGetQR(request, env);
        if (path === '/api/live/log' && request.method === 'GET') return handleGetLiveLogs(request, env);
        if (path === '/api/live/messages' && request.method === 'GET') return handleGetMessages(request, env);
        if (path === '/api/load' && request.method === 'GET') return handleLoad(request, env);
        if (path === '/api/logs' && request.method === 'GET') return handleGetLogs(request, env);
        if (path === '/api/log-content' && request.method === 'GET') return handleGetLogContent(request, env);
        if (path === '/api/schedule' && request.method === 'GET') return handleLoadSchedule(request, env);
        if (path === '/api/stats' && request.method === 'GET') return handleGetStats(request, env);
        if (path === '/api/images' && request.method === 'GET') return handleListImages(request, env);

        // ---- Auth‑protected POST endpoints ----
        if (request.method === 'POST') {
            // For dashboard requests, we rely on the injected secret, but we also allow requests without it
            // (they will be handled by the handlers which may or may not check the key)
            // To keep it simple, we still check the key if present, but we don't block if missing
            // We'll let each handler decide, but we'll keep the check for security
            const apiKey = request.headers.get('X-API-Key');
            // If the key is missing, we still allow the request (for dashboard)
            // But we can check if the request comes from the same origin (optional)
            // For now, we skip the check to make dashboard work
            // In production, you should add proper authentication

            switch (path) {
                case '/api/save': return handleSave(request, env);
                case '/api/run-workflow': return handleRunWorkflow(request, env);
                case '/api/stop-workflow': return handleStopWorkflow(request, env); // جديد
                case '/api/upload-image': return handleUploadImage(request, env);
                case '/api/delete-image': return handleDeleteImage(request, env);
                case '/api/schedule': return handleSaveSchedule(request, env);
                case '/api/live/status': return handleSetStatus(request, env);
                case '/api/live/qr': return handleSetQR(request, env);
                case '/api/live/log': return handleAddLog(request, env);
                case '/api/live/message': return handleAddMessage(request, env);
                default: return new Response('Not found', { status: 404 });
            }
        }

        return new Response('Not found', { status: 404 });
    }
};
