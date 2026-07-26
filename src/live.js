// src/live.js
import { jsonResponse } from './helpers.js';

// KV key helpers
const STATUS_KEY = (s) => `session_${s}_status`;
const QR_KEY = (s) => `session_${s}_qr`;
const LOGS_KEY = (s) => `session_${s}_logs`;
const MESSAGES_KEY = (s) => `session_${s}_messages`;

const MAX_LOGS = 50;
const MAX_MESSAGES = 20;

// Append to a KV array, keep only last N
async function appendToKVList(env, key, entry, maxLen) {
    let list = [];
    try {
        const stored = await env.SESSION_KV.get(key, 'json');
        if (Array.isArray(stored)) list = stored;
    } catch (_) {}
    list.push({ ...entry, timestamp: new Date().toISOString() });
    if (list.length > maxLen) list = list.slice(-maxLen);
    await env.SESSION_KV.put(key, JSON.stringify(list));
}

// ----- Status -----
export async function handleSetStatus(req, env) {
    try {
        const { session, status } = await req.json();
        if (!session || !status) return jsonResponse({ ok: false, error: 'session and status required' }, 400);
        await env.SESSION_KV.put(STATUS_KEY(session), status);
        // If connected, clear QR
        if (status === 'connected') {
            await env.SESSION_KV.delete(QR_KEY(session));
        }
        return jsonResponse({ ok: true });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}

export async function handleGetStatus(req, env) {
    try {
        const session = new URL(req.url).searchParams.get('session') || 'main';
        const status = await env.SESSION_KV.get(STATUS_KEY(session));
        return jsonResponse({ ok: true, status: status || null });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}

// ----- QR -----
export async function handleSetQR(req, env) {
    try {
        const { session, qr } = await req.json();
        if (!session || !qr) return jsonResponse({ ok: false, error: 'session and qr required' }, 400);
        await env.SESSION_KV.put(QR_KEY(session), qr);
        // Set status to waiting_scan unless already connected
        const current = await env.SESSION_KV.get(STATUS_KEY(session));
        if (current !== 'connected') {
            await env.SESSION_KV.put(STATUS_KEY(session), 'waiting_scan');
        }
        return jsonResponse({ ok: true });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}

export async function handleGetQR(req, env) {
    try {
        const session = new URL(req.url).searchParams.get('session') || 'main';
        const qr = await env.SESSION_KV.get(QR_KEY(session));
        return jsonResponse({ ok: true, qr: qr || null });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}

// ----- Logs -----
export async function handleAddLog(req, env) {
    try {
        const { session, text } = await req.json();
        if (!session || !text) return jsonResponse({ ok: false, error: 'session and text required' }, 400);
        await appendToKVList(env, LOGS_KEY(session), { text }, MAX_LOGS);
        return jsonResponse({ ok: true });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}

export async function handleGetLogs(req, env) {
    try {
        const session = new URL(req.url).searchParams.get('session') || 'main';
        const logs = await env.SESSION_KV.get(LOGS_KEY(session), 'json');
        return jsonResponse({ ok: true, logs: logs || [] });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}

// ----- Messages -----
export async function handleAddMessage(req, env) {
    try {
        const { session, message } = await req.json();
        if (!session || !message) return jsonResponse({ ok: false, error: 'session and message required' }, 400);
        await appendToKVList(env, MESSAGES_KEY(session), message, MAX_MESSAGES);
        return jsonResponse({ ok: true });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}

export async function handleGetMessages(req, env) {
    try {
        const session = new URL(req.url).searchParams.get('session') || 'main';
        const messages = await env.SESSION_KV.get(MESSAGES_KEY(session), 'json');
        return jsonResponse({ ok: true, messages: messages || [] });
    } catch (e) { return jsonResponse({ ok: false, error: String(e) }, 500); }
}
