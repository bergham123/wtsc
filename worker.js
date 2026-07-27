// worker.js
import { HTML_PAGE } from './src/app.js';
import {
    handleGetAccounts,
    handleUpdateAccounts,
    handleGetMessagesFile,
    handleUpdateMessagesFile,
    handleGetMyList,
    handleUpdateMyList,
    // ---------
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
    handleStopWorkflow,
    handleGetContacts,
    handleUpdateContacts
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

        // Serve the main dashboard HTML
        if (path === '/' && request.method === 'GET') {
            const html = HTML_PAGE.replace(
                '</head>',
                `<script>window.API_SECRET = "${env.API_SECRET || ''}";</script></head>`
            );
            return new Response(html, {
                headers: { 'Content-Type': 'text/html; charset=utf-8' }
            });
        }

        // ---- Public GET endpoints ----

         // إضافة نقاط GET
        if (path === '/api/accounts' && request.method === 'GET') return handleGetAccounts(request, env);
        if (path === '/api/messages' && request.method === 'GET') return handleGetMessagesFile(request, env);
        if (path === '/api/mylist' && request.method === 'GET') return handleGetMyList(request, env);
//  ------------------------------
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
        if (path === '/api/contacts' && request.method === 'GET') return handleGetContacts(request, env);

        // ---- POST endpoints ----
        if (request.method === 'POST') {
            // Optional: verify API key
            // const apiKey = request.headers.get('X-API-Key');
            // if (!apiKey || apiKey !== env.API_SECRET) return new Response('Unauthorized', { status: 401 });

            switch (path) {
                case '/api/save': return handleSave(request, env);
                case '/api/run-workflow': return handleRunWorkflow(request, env);
                case '/api/stop-workflow': return handleStopWorkflow(request, env);
                case '/api/upload-image': return handleUploadImage(request, env);
                case '/api/delete-image': return handleDeleteImage(request, env);
                case '/api/schedule': return handleSaveSchedule(request, env);
                case '/api/live/status': return handleSetStatus(request, env);
                case '/api/live/qr': return handleSetQR(request, env);
                case '/api/live/log': return handleAddLog(request, env);
                case '/api/live/message': return handleAddMessage(request, env);
                case '/api/contacts': return handleUpdateContacts(request, env);
                case '/api/accounts': return handleUpdateAccounts(request, env);
                case '/api/messages': return handleUpdateMessagesFile(request, env);
                case '/api/mylist': return handleUpdateMyList(request, env);
                
                default: return new Response('Not found', { status: 404 });
                    
            }
        }

        return new Response('Not found', { status: 404 });
    }
};
