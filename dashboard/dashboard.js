// ===============================
// Elements
// ===============================

const accountsArea = document.getElementById("accounts");
const messagesArea = document.getElementById("messages");

const loadAccountsBtn = document.getElementById("loadAccounts");
const loadMessagesBtn = document.getElementById("loadMessages");

const clearAccountsBtn = document.getElementById("clearAccounts");
const clearMessagesBtn = document.getElementById("clearMessages");

const saveAllBtn = document.getElementById("saveAll");
const runWorkflowBtn = document.getElementById("runWorkflow");

const logs = document.getElementById("logs");
const status = document.getElementById("status");

// ===============================
// Auth Helpers
// ===============================

function getToken() {
    return localStorage.getItem("token");
}

function getAuthHeaders() {
    const token = getToken();
    return {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : ""
    };
}

async function fetchWithAuth(url, options = {}) {
    const headers = {
        ...getAuthHeaders(),
        ...(options.headers || {})
    };
    return fetch(url, {
        ...options,
        headers
    });
}

// ===============================
// Helpers
// ===============================

function log(text) {
    const time = new Date().toLocaleTimeString();
    logs.innerHTML += `<div>[${time}] ${text}</div>`;
    logs.scrollTop = logs.scrollHeight;
}

function setStatus(text, type = "info") {
    status.textContent = text;
    // Change color based on type
    status.style.color = type === "error" ? "#ef4444" :
                         type === "success" ? "#22c55e" :
                         type === "warning" ? "#f59e0b" :
                         type === "running" ? "#3b82f6" :
                         "#94a3b8";
}

// ===============================
// Convert Text => JSON Array
// ===============================

function textToArray(text) {
    return [...new Set(
        text
            .split("\n")
            .map(x => x.trim())
            .filter(x => x !== "")
    )];
}

// ===============================
// Clear
// ===============================

clearAccountsBtn.onclick = () => {
    accountsArea.value = "";
    log("Accounts cleared");
};

clearMessagesBtn.onclick = () => {
    messagesArea.value = "";
    log("Messages cleared");
};

// ===============================
// Load Accounts
// ===============================

loadAccountsBtn.onclick = async () => {
    try {
        setStatus("Loading Accounts...", "warning");
        const res = await fetchWithAuth("/api/load-accounts");
        
        if (res.status === 401) {
            localStorage.removeItem("token");
            location.href = "login.html";
            return;
        }

        const data = await res.json();
        accountsArea.value = data.join("\n");
        log("Accounts loaded");
        setStatus("Ready", "success");
    } catch (e) {
        log("Cannot load accounts");
        setStatus("Error loading accounts", "error");
        console.error(e);
    }
};

// ===============================
// Load Messages
// ===============================

loadMessagesBtn.onclick = async () => {
    try {
        setStatus("Loading Messages...", "warning");
        const res = await fetchWithAuth("/api/load-messages");
        
        if (res.status === 401) {
            localStorage.removeItem("token");
            location.href = "login.html";
            return;
        }

        const data = await res.json();
        messagesArea.value = data.join("\n");
        log("Messages loaded");
        setStatus("Ready", "success");
    } catch (e) {
        log("Cannot load messages");
        setStatus("Error loading messages", "error");
        console.error(e);
    }
};

// ===============================
// Save All
// ===============================

saveAllBtn.onclick = async () => {
    const accounts = textToArray(accountsArea.value);
    const messages = textToArray(messagesArea.value);

    if (accounts.length === 0) {
        alert("Accounts Empty");
        return;
    }

    if (messages.length === 0) {
        alert("Messages Empty");
        return;
    }

    saveAllBtn.disabled = true;
    setStatus("Saving...", "warning");
    log("Uploading data...");

    try {
        const res = await fetchWithAuth("/api/save-all", {
            method: "POST",
            body: JSON.stringify({ accounts, messages })
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            location.href = "login.html";
            return;
        }

        const data = await res.json();

        if (data.success) {
            log("Accounts saved");
            log("Messages saved");
            log("GitHub Commit Created");
            setStatus("Saved Successfully", "success");
            runWorkflowBtn.disabled = false;
        } else {
            log(data.error || "Save failed");
            setStatus("Save failed", "error");
            alert(data.error || "Save failed");
        }
    } catch (err) {
        console.error(err);
        log("Server Error");
        setStatus("Server Error", "error");
    }

    saveAllBtn.disabled = false;
};

// ===============================
// Run Workflow
// ===============================

runWorkflowBtn.onclick = async () => {
    runWorkflowBtn.disabled = true;
    setStatus("Starting Workflow...", "running");
    log("Sending request...");

    try {
        const res = await fetchWithAuth("/api/run-workflow", {
            method: "POST"
        });

        if (res.status === 401) {
            localStorage.removeItem("token");
            location.href = "login.html";
            return;
        }

        const data = await res.json();

        if (data.success) {
            log("Workflow Started");
            setStatus("Workflow Running", "running");
        } else {
            log(data.error || "Workflow failed");
            setStatus("Workflow failed", "error");
        }
    } catch (e) {
        console.error(e);
        log("Workflow Error");
        setStatus("Workflow Error", "error");
    } finally {
        runWorkflowBtn.disabled = false;
    }
};

// ===============================
// Logout
// ===============================

document.getElementById("logout").onclick = () => {
    localStorage.removeItem("token");
    location.href = "login.html";
};

// ===============================
// Check Login & Auth
// ===============================

async function checkAuth() {
    const token = getToken();
    if (!token) {
        location.href = "login.html";
        return false;
    }

    try {
        const res = await fetchWithAuth("/api/auth");
        if (res.status === 401) {
            localStorage.removeItem("token");
            location.href = "login.html";
            return false;
        }
        const data = await res.json();
        if (!data.valid) {
            localStorage.removeItem("token");
            location.href = "login.html";
            return false;
        }
        return true;
    } catch (e) {
        console.error("Auth check failed:", e);
        location.href = "login.html";
        return false;
    }
}

// ===============================
// Upload Image
// ===============================

const imageInput = document.getElementById('imageInput');
const uploadImageBtn = document.getElementById('uploadImageBtn');
const uploadResult = document.getElementById('uploadResult');

if (uploadImageBtn) {
    uploadImageBtn.onclick = async () => {
        const file = imageInput.files[0];
        if (!file) {
            alert('Please select an image');
            return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
            const base64 = e.target.result.split(',')[1];
            const filename = file.name;

            try {
                const res = await fetchWithAuth('/api/upload-image', {
                    method: 'POST',
                    body: JSON.stringify({ filename, base64 })
                });
                const data = await res.json();
                if (data.success) {
                    uploadResult.innerHTML = `✅ Image uploaded! <a href="${data.url}" target="_blank">${data.url}</a>`;
                    log(`Image uploaded: ${filename}`);
                } else {
                    uploadResult.textContent = '❌ ' + (data.error || 'Upload failed');
                }
            } catch (err) {
                uploadResult.textContent = '❌ Error uploading';
                console.error(err);
            }
        };
        reader.readAsDataURL(file);
    };
}

// ===============================
// Schedule
// ===============================

const scheduleTime = document.getElementById('scheduleTime');
const setScheduleBtn = document.getElementById('setScheduleBtn');
const loadScheduleBtn = document.getElementById('loadScheduleBtn');
const scheduleStatus = document.getElementById('scheduleStatus');

if (loadScheduleBtn) {
    loadScheduleBtn.onclick = async () => {
        try {
            const res = await fetchWithAuth('/api/load-schedule');
            const data = await res.json();
            if (data.time) {
                scheduleTime.value = data.time;
                scheduleStatus.textContent = `Current schedule: ${data.time}`;
            } else {
                scheduleStatus.textContent = 'No schedule set';
            }
        } catch (err) {
            scheduleStatus.textContent = 'Error loading schedule';
            console.error(err);
        }
    };
}

if (setScheduleBtn) {
    setScheduleBtn.onclick = async () => {
        const time = scheduleTime.value;
        if (!time) {
            alert('Please select a time');
            return;
        }

        try {
            const res = await fetchWithAuth('/api/set-schedule', {
                method: 'POST',
                body: JSON.stringify({ time })
            });
            const data = await res.json();
            if (data.success) {
                scheduleStatus.textContent = `✅ Schedule set to ${time} (cron: ${data.cron})`;
                log(`Schedule updated to ${time}`);
            } else {
                scheduleStatus.textContent = '❌ ' + (data.error || 'Failed to set schedule');
            }
        } catch (err) {
            scheduleStatus.textContent = '❌ Error setting schedule';
            console.error(err);
        }
    };
}

// ===============================
// Init
// ===============================

(async function init() {
    const authenticated = await checkAuth();
    if (authenticated) {
        log("Dashboard Ready");
        setStatus("Ready", "success");
        // Load schedule on page load if elements exist
        if (loadScheduleBtn) loadScheduleBtn.click();
    }
})();
