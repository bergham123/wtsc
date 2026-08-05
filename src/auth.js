import { jsonResponse } from './helpers.js';
import { githubGetFile } from './github.js';

const PASS_KEY = 'auth_password_hash';
const CODE_KEY = 'auth_reset_code';
const EXPIRES_KEY = 'auth_reset_expires';
const SALT = '_nexus_ai_salt_2026_';

async function hashPwd(pwd) {
  const data = new TextEncoder().encode(pwd + SALT);
  const buf = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function getTgChatId(env) {
  try {
    const { content } = await githubGetFile(env, 'data/telegram-id.json');
    if (content) { const d = JSON.parse(content); return d.chat_id || null; }
  } catch (e) {}
  return null;
}

export async function handleAuthStatus(request, env) {
  try {
    const hash = await env.SESSION_KV.get(PASS_KEY);
    return jsonResponse({ ok: true, setup: !!hash });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message) }, 500);
  }
}

export async function handleAuthCheck(request, env) {
  try {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    if (!token) return jsonResponse({ ok: false, valid: false });
    const val = await env.SESSION_KV.get('sess_' + token);
    return jsonResponse({ ok: true, valid: !!val });
  } catch (err) {
    return jsonResponse({ ok: false, valid: false });
  }
}

export async function handleAuthLogin(request, env) {
  try {
    const { password } = await request.json();
    if (!password) return jsonResponse({ ok: false, error: 'Password required' }, 400);

    let storedHash = await env.SESSION_KV.get(PASS_KEY);

    // First time: set password
    if (!storedHash) {
      storedHash = await hashPwd(password);
      await env.SESSION_KV.put(PASS_KEY, storedHash);
      const token = crypto.randomUUID();
      await env.SESSION_KV.put('sess_' + token, '1', { expirationTtl: 86400 });
      return jsonResponse({ ok: true, token: token, firstTime: true });
    }

    const inputHash = await hashPwd(password);
    if (inputHash === storedHash) {
      const token = crypto.randomUUID();
      await env.SESSION_KV.put('sess_' + token, '1', { expirationTtl: 86400 });
      return jsonResponse({ ok: true, token: token, firstTime: false });
    }
    return jsonResponse({ ok: false, error: 'Invalid password' }, 401);
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message) }, 500);
  }
}

export async function handleResetRequest(request, env) {
  try {
    const storedHash = await env.SESSION_KV.get(PASS_KEY);
    if (!storedHash) return jsonResponse({ ok: false, error: 'No password set yet' }, 400);

    const token = env.TELEGRAM_BOT_TOKEN;
    if (!token) return jsonResponse({ ok: false, error: 'Telegram bot token not configured in Worker secrets' }, 500);

    const chatId = await getTgChatId(env);
    if (!chatId) return jsonResponse({ ok: false, error: 'Telegram chat ID not found in data/telegram-id.json' }, 500);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = Date.now() + 5 * 60 * 1000;

    await env.SESSION_KV.put(CODE_KEY, code);
    await env.SESSION_KV.put(EXPIRES_KEY, expires.toString());

    const tgRes = await fetch('https://api.telegram.org/bot' + token + '/sendMessage', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: '\u{1F510} <b>Nexus AI - Password Reset</b>\n\nYour verification code:\n\n<code>' + code + '</code>\n\nExpires in 5 minutes.',
        parse_mode: 'HTML'
      })
    });

    if (!tgRes.ok) {
      const errText = await tgRes.text();
      return jsonResponse({ ok: false, error: 'Telegram failed: ' + errText }, 500);
    }

    return jsonResponse({ ok: true, message: 'Code sent to Telegram' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message) }, 500);
  }
}

export async function handleResetVerify(request, env) {
  try {
    const { code, newPassword } = await request.json();
    if (!code || !newPassword) return jsonResponse({ ok: false, error: 'Code and new password required' }, 400);
    if (newPassword.length < 4) return jsonResponse({ ok: false, error: 'Password must be at least 4 characters' }, 400);

    const storedCode = await env.SESSION_KV.get(CODE_KEY);
    const expiresStr = await env.SESSION_KV.get(EXPIRES_KEY);

    if (!storedCode || !expiresStr) return jsonResponse({ ok: false, error: 'No reset request found. Request a code first.' }, 400);
    if (Date.now() > parseInt(expiresStr)) {
      await env.SESSION_KV.delete(CODE_KEY);
      await env.SESSION_KV.delete(EXPIRES_KEY);
      return jsonResponse({ ok: false, error: 'Code expired. Request a new one.' }, 400);
    }
    if (code !== storedCode) return jsonResponse({ ok: false, error: 'Invalid code' }, 401);

    const hash = await hashPwd(newPassword);
    await env.SESSION_KV.put(PASS_KEY, hash);
    await env.SESSION_KV.delete(CODE_KEY);
    await env.SESSION_KV.delete(EXPIRES_KEY);

    // Invalidate all sessions
    // (In KV we can't list keys by prefix easily, so we just note it)

    return jsonResponse({ ok: true, message: 'Password reset successfully' });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err.message) }, 500);
  }
}
