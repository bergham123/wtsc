import { createGitHubClient } from './github.js';

export async function onRequest(context) {
    const { request, env } = context;
    if (request.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Method Not Allowed' }), { status: 405 });
    }

    try {
        const { time } = await request.json();
        if (!time) {
            return new Response(JSON.stringify({ error: 'Time is required' }), { status: 400 });
        }

        const [hour, minute] = time.split(':');
        const cron = `${parseInt(minute)} ${parseInt(hour)} * * *`;

        const github = createGitHubClient(env);
        const raw = await github.getRawFile('.github/workflows/send.yaml');
        const lines = raw.content.split('\n');
        const newLines = lines.map(line => {
            if (line.trim().startsWith('cron:')) {
                const indent = line.match(/^\s*/)[0];
                return `${indent}cron: '${cron}'`;
            }
            return line;
        });
        const newYaml = newLines.join('\n');

        await github.updateRawFile('.github/workflows/send.yaml', newYaml, `Update schedule to ${time}`);

        return new Response(JSON.stringify({ success: true, cron }), {
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
