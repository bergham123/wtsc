import { createGitHubClient } from './github.js';

export async function onRequest(context) {
  const { env } = context;
  try {
    const github = createGitHubClient(env);
    const file = await github.getFile('accounts.json');
    return new Response(JSON.stringify(file.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    if (error.message.includes('Cannot read')) {
      return new Response(JSON.stringify([]), { status: 200 });
    }
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}