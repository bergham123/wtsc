export function createGitHubClient(env) {
    const TOKEN = env.GITHUB_TOKEN;
    const OWNER = env.OWNER;
    const REPO = env.REPO;
    const API = `https://api.github.com/repos/${OWNER}/${REPO}`;

    // دالة مساعدة للتحقق من الاستجابة
    async function checkResponse(res) {
        if (!res.ok) {
            let errorMsg = `HTTP ${res.status}`;
            try {
                const text = await res.text();
                const json = JSON.parse(text);
                if (json.message) errorMsg = json.message;
            } catch {}
            throw new Error(errorMsg);
        }
        return res;
    }

    // قراءة ملف JSON
    async function getFile(path) {
        const res = await fetch(`${API}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github+json"
            }
        });
        if (res.status === 404) {
            throw new Error(`File not found: ${path}`);
        }
        await checkResponse(res);
        const data = await res.json();
        const content = atob(data.content);
        return { sha: data.sha, data: JSON.parse(content) };
    }

    // تحديث/إنشاء ملف JSON
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
        await checkResponse(res);
        return await res.json();
    }

    // دوال مخصصة للقراءة والكتابة
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

    async function getUsers() {
        try {
            const file = await getFile('users.json');
            return file.data;
        } catch (error) {
            if (error.message.includes('File not found')) return [];
            throw error;
        }
    }

    async function saveUsers(users) {
        return await updateFile('users.json', users, 'Update users');
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
        await checkResponse(res);
        return true;
    }

    // قراءة ملفات خام (مثل YAML)
    async function getRawFile(path) {
        const res = await fetch(`${API}/contents/${path}`, {
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                Accept: "application/vnd.github.v3+json"
            }
        });
        if (res.status === 404) throw new Error(`File not found: ${path}`);
        await checkResponse(res);
        const data = await res.json();
        const content = atob(data.content);
        return { sha: data.sha, content };
    }

    async function updateRawFile(path, content, message = "Update file") {
        let sha = null;
        try {
            const current = await getRawFile(path);
            sha = current.sha;
        } catch (error) {
            if (!error.message.includes('File not found')) throw error;
        }
        const base64 = btoa(content);
        const body = {
            message,
            content: base64,
            ...(sha && { sha })
        };
        const res = await fetch(`${API}/contents/${path}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        await checkResponse(res);
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
        } catch {}
        const body = {
            message,
            content: contentBase64,
            ...(sha && { sha })
        };
        const res = await fetch(`${API}/contents/${path}`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(body)
        });
        await checkResponse(res);
        return await res.json();
    }

    return {
        getAccounts,
        saveAccounts,
        getMessages,
        saveMessages,
        getUsers,
        saveUsers,
        runWorkflow,
        getRawFile,
        updateRawFile,
        uploadFileRaw
    };
}
