import { createGitHubClient } from './github.js';

export async function onRequest(context) {
    const { env } = context;
    try {
        const github = createGitHubClient(env);
        const accounts = await github.getAccounts();
        return new Response(JSON.stringify(accounts), {
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
