import { createGitHubClient } from './github.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

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
    try {
      users = await github.getUsers();
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const user = users.find(u => u.email === email);
    if (!user) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401 });
    }

    const token = jwt.sign(
      { email: user.email, username: user.username },
      env.JWT_SECRET,
      { expiresIn: '24h' }
    );

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