// github.js - مُعدَّل لـ Cloudflare (يستقبل env)
export function createGitHubClient(env) {
    const TOKEN = env.GITHUB_TOKEN;
    const OWNER = env.OWNER;
    const REPO = env.REPO;
    const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

    async function getFile(path) {
        const res = await fetch(`${API}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });
        if (!res.ok) throw new Error("Cannot read " + path);
        const file = await res.json();
        const content = Buffer.from(file.content, "base64").toString("utf8");
        return { sha: file.sha, data: JSON.parse(content) };
    }

    async function updateFile(path, json, message = "Update File") {
        const current = await getFile(path);
        const content = Buffer.from(JSON.stringify(json, null, 2)).toString("base64");
        const res = await fetch(`${API}/contents/${path}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json"
            },
            body: JSON.stringify({
                message,
                content,
                sha: current.sha
            })
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        return await res.json();
    }

    async function runWorkflow(workflow = "send.yaml") {
        const res = await fetch(`${API}/actions/workflows/${workflow}/dispatches`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json"
            },
            body: JSON.stringify({ ref: "main" })
        });
        if (!res.ok) throw new Error("Workflow Error");
        return true;
    }

    async function getUsers() {
        try {
            const file = await getFile("users.json");
            return file.data;
        } catch (error) {
            if (error.message.includes("Cannot read")) return [];
            throw error;
        }
    }

    async function saveUsers(users) {
        return await updateFile("users.json", users, "Update users");
    }

    async function getRawFile(path) {
        const res = await fetch(`${API}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });
        if (!res.ok) throw new Error(`Cannot read ${path}`);
        const data = await res.json();
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return { sha: data.sha, content };
    }

    async function updateRawFile(path, content, message = "Update file") {
        const current = await getRawFile(path);
        const base64 = Buffer.from(content, 'utf8').toString('base64');
        const res = await fetch(`${API}/contents/${path}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message,
                content: base64,
                sha: current.sha
            })
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        return await res.json();
    }

    async function uploadFileRaw(path, contentBase64, message = "Upload file") {
        let sha = null;
        try {
            const res = await fetch(`${API}/contents/${path}`, {
                headers: { Authorization: `Bearer ${TOKEN}` }
            });
            if (res.ok) {
                const data = await res.json();
                sha = data.sha;
            }
        } catch (e) { }
        const body = {
            message,
            content: contentBase64,
            ...(sha && { sha })
        };
        const res = await fetch(`${API}/contents/${path}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        return await res.json();
    }

    return {
        getFile,
        updateFile,
        runWorkflow,
        getUsers,
        saveUsers,
        getRawFile,
        updateRawFile,
        uploadFileRaw
    };
}