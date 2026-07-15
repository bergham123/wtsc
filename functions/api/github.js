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
        if (!res.ok) {
            // إذا كان الملف غير موجود، نرمي خطأ محدد
            if (res.status === 404) {
                throw new Error(`File not found: ${path}`);
            }
            throw new Error(`Cannot read ${path}: ${res.status}`);
        }
        const file = await res.json();
        const content = atob(file.content);
        return { sha: file.sha, data: JSON.parse(content) };
    }

    async function updateFile(path, json, message = "Update File") {
        let sha = null;
        // نحاول نقرأ الملف الحالي، لكن إذا غاب نكمل بـ sha = null
        try {
            const current = await getFile(path);
            sha = current.sha;
        } catch (error) {
            // الملف غير موجود، نكمل بدون sha
            if (!error.message.includes('File not found')) {
                throw error; // خطأ آخر نرميه
            }
        }
        const content = btoa(JSON.stringify(json, null, 2));
        const body = {
            message,
            content,
            ...(sha && { sha }) // نضيف sha فقط إذا كان موجوداً
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
            throw new Error(`Update failed: ${err}`);
        }
        return await res.json();
    }

    // باقي الدوال (runWorkflow, getUsers, saveUsers, getRawFile, updateRawFile, uploadFileRaw) بنفس الشكل، لكن نعدل updateRawFile بنفس المنطق
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
            if (error.message.includes('File not found')) return [];
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
        if (!res.ok) {
            if (res.status === 404) throw new Error(`File not found: ${path}`);
            throw new Error(`Cannot read ${path}`);
        }
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
        } catch (e) {}
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
