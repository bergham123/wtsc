import { createGitHubClient } from './github.js';

export async function onRequest(context) {
    const { request, env } = context;
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const { accounts, messages } = await request.json();
        if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
            return new Response(JSON.stringify({ error: 'Accounts array is required' }), { status: 400 });
        }
        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            return new Response(JSON.stringify({ error: 'Messages array is required' }), { status: 400 });
        }

        const github = createGitHubClient(env);
        await github.saveAccounts(accounts);
        await github.saveMessages(messages);

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        return new Response(JSON.stringify({ error: error.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
