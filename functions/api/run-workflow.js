import { createGitHubClient } from './github.js';

export async function onRequest(context) {
  const { request, env } = context;
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
  }

  try {
    const github = createGitHubClient(env);
    await github.runWorkflow('send.yaml');
    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Run workflow error:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}