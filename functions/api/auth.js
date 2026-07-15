import { jwtVerify } from 'jose';

export async function onRequest(context) {
  const { request, env } = context;

  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No token provided' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = new TextEncoder().encode(env.JWT_SECRET);
    
    // Verify the token using jose
    const { payload } = await jwtVerify(token, secret);

    return new Response(JSON.stringify({
      valid: true,
      user: {
        email: payload.email,
        username: payload.username
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Auth error:', error);
    return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
