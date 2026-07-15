import * as jose from 'jose';
import { createGitHubClient } from './github.js';

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required' }), { status: 400 });
    }

    const github = createGitHubClient(env);
    let users = [];

    // حاول قراءة users.json، وإن لم يجد أنشئه بمستخدم افتراضي
    try {
      const file = await github.getFile('users.json');
      users = file.data;
    } catch (error) {
      // إذا كان الملف غير موجود، أنشئ مستخدم افتراضي
      const defaultUser = {
        username: 'admin',
        email: 'admin@example.com',
        password: 'admin123', // كلمة مرور نص عادي
        createdAt: new Date().toISOString()
      };
      users = [defaultUser];
      // احفظ الملف في GitHub
      await github.updateFile('users.json', users, 'Create default users.json');
    }

    // تأكد من أن users مصفوفة
    if (!Array.isArray(users)) {
      users = [];
    }

    const user = users.find(u => u.email === email);
    if (!user || user.password !== password) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const secret = new TextEncoder().encode(env.JWT_SECRET);
    const token = await new jose.SignJWT({ email: user.email, username: user.username })
      .setProtectedHeader({ alg: 'HS256' })
      .setExpirationTime('24h')
      .sign(secret);

    return new Response(JSON.stringify({
      success: true,
      token,
      user: { email: user.email, username: user.username }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Login error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
  }
}
