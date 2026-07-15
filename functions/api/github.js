export function createGitHubClient(env) {
    const TOKEN = env.GITHUB_TOKEN;
    const OWNER = env.OWNER;
    const REPO = env.REPO;
    const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

    // قراءة ملف JSON
    async function getFile(path) {
        const res = await fetch(`${API}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });
        if (!res.ok) {
            if (res.status === 404) throw new Error(`File not found: ${path}`);
            throw new Error(`Cannot read ${path}: ${res.status}`);
        }
        const file = await res.json();
        const content = atob(file.content);
        return { sha: file.sha, data: JSON.parse(content) };
    }

    // تحديث أو إنشاء ملف JSON
    async function updateFile(path, json, message = "Update file") {
        let sha = null;
        try {
            const current = await getFile(path);
            sha = current.sha;
        } catch (error) {
            if (!error.message.includes('File not found')) throw error;
        }
        const content = btoa(JSON.stringify(json, null, 2));
        const body = {
            message,
            content,
            ...(sha && { sha })
        };
        const res = await fetch(`${API}/contents/${path}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json"
            },
            body: JSON.stringify(body)
        });
        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }
        return await res.json();
    }

    // تشغيل Workflow
    async function runWorkflow(workflow = "send.yaml") {
        const res = await fetch(`${API}/actions/workflows/${workflow}/dispatches`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json"
            },
            body: JSON.stringify({ ref: "main" })
        });
        if (!res.ok) throw new Error("Workflow dispatch failed");
        return true;
    }

    // دوال مخصصة للمشروع
    async function getAccounts() {
        try {
            const file = await getFile('accounts.json');
            return file.data;
        } catch (error) {
            if (error.message.includes('File not found')) return [];
            throw error;
        }
    }

    async function saveAccounts(accounts) {
        return await updateFile('accounts.json', accounts, 'Update accounts');
    }

    async function getMessages() {
        try {
            const file = await getFile('message.json');
            return file.data;
        } catch (error) {
            if (error.message.includes('File not found')) return [];
            throw error;
        }
    }

    async function saveMessages(messages) {
        return await updateFile('message.json', messages, 'Update messages');
    }

    return {
        getAccounts,
        saveAccounts,
        getMessages,
        saveMessages,
        runWorkflow
    };
}
