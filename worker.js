// worker.js - المدخل الرئيسي
import { renderStatsLogs } from './src/pages/statsLogs.js';
import { renderScheduleRun } from './src/pages/scheduleRun.js';
import { renderMessagesContacts } from './src/pages/messagesContacts.js';
import { renderImagesManager } from './src/pages/imagesManager.js';
import { renderContactsManager } from './src/pages/contactsManager.js';

// ... استيرادات أخرى (handlers, live, etc.)

export default {
    async fetch(request, env) {
        const url = new URL(request.url);
        const path = url.pathname;

        // مسارات الصفحات
        if (path === '/' || path === '/stats') {
            return new Response(renderStatsLogs(env), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        if (path === '/schedule') {
            return new Response(renderScheduleRun(env), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        if (path === '/messages') {
            return new Response(renderMessagesContacts(env), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        if (path === '/images') {
            return new Response(renderImagesManager(env), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }
        if (path === '/contacts') {
            return new Response(renderContactsManager(env), { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
        }

        // ---- API endpoints (نفسها مع إضافة mycontacts) ----
        // GET
        if (path === '/api/load' && request.method === 'GET') return handleLoad(request, env);
        if (path === '/api/logs' && request.method === 'GET') return handleGetLogs(request, env);
        if (path === '/api/log-content' && request.method === 'GET') return handleGetLogContent(request, env);
        if (path === '/api/schedule' && request.method === 'GET') return handleLoadSchedule(request, env);
        if (path === '/api/stats' && request.method === 'GET') return handleGetStats(request, env);
        if (path === '/api/images' && request.method === 'GET') return handleListImages(request, env);
        if (path === '/api/live/status' && request.method === 'GET') return handleGetStatus(request, env);
        if (path === '/api/live/qr' && request.method === 'GET') return handleGetQR(request, env);
        if (path === '/api/live/log' && request.method === 'GET') return handleGetLiveLogs(request, env);
        if (path === '/api/live/messages' && request.method === 'GET') return handleGetMessages(request, env);

        // POST
        if (request.method === 'POST') {
            switch (path) {
                case '/api/save': return handleSave(request, env);
                case '/api/run-workflow': return handleRunWorkflow(request, env);
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
