// src/app.js

export const HTML_PAGE = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>مدير واتساب</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  :root {
    --bg-main: #111B21;
    --card-bg: #202C33;
    --border-color: #2A3942;
    --text-main: #E9EDEF;
    --text-muted: #8696A0;
    --accent: #25D366;
    --accent-glow: rgba(37, 211, 102, 0.2);
    --success: #25D366;
    --danger: #F15C6D;
    --warning: #FFB100;
    --input-bg: #2A3942;
    --shadow: 0 8px 24px rgba(0,0,0,0.4);
    --progress-bg: #2A3942;
    --progress-fill: #25D366;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Tajawal', sans-serif;
    background: var(--bg-main);
    color: var(--text-main);
    min-height: 100vh;
    display: flex;
    flex-direction: column;
  }
  .navbar {
    background: var(--card-bg);
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: 10px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 800;
  }
  .navbar-brand span { color: var(--accent); }
  .navbar-links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .nav-link {
    color: var(--text-muted);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
  }
  .nav-link:hover, .nav-link.active {
    background: var(--input-bg);
    color: var(--text-main);
  }
  .nav-link.active { color: var(--accent); }
  .navbar-actions { display: flex; gap: 10px; align-items: center; }

  .page-content {
    flex: 1;
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
  .page-header { margin-bottom: 24px; }
  .page-header h1 { font-size: 24px; }
  .page-header p { color: var(--text-muted); }

  .card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    transition: border-color 0.3s;
  }
  .card:hover { border-color: rgba(37, 211, 102, 0.3); }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .card-header i { color: var(--accent); }
  .card-header h2 { font-size: 18px; font-weight: 700; }

  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }
  .stats-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }
  .stats-icon {
    font-size: 32px;
    color: var(--accent);
    width: 60px;
    height: 60px;
    background: var(--bg-main);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stats-card h3 { font-size: 14px; color: var(--text-muted); font-weight: 500; }
  .stats-card p { font-size: 20px; font-weight: 700; }

  .btn {
    background: var(--input-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn:hover { background: var(--border-color); }
  .btn-primary { background: var(--accent); color: #111B21; border: none; font-weight: 700; }
  .btn-primary:hover { background: #1FB855; box-shadow: 0 4px 12px var(--accent-glow); }
  .btn-warning { background: var(--warning); border: none; color: #111B21; font-weight: 700; }
  .btn-danger { background: var(--danger); border: none; color: white; font-weight: 700; }
  .btn-danger:hover { background: #d9534f; }
  .btn-success { background: var(--success); border: none; color: #111B21; font-weight: 700; }
  .btn-success:hover { background: #1FB855; }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }
  input, textarea { font-family: 'Tajawal', sans-serif; }
  .status { margin-top: 10px; font-size: 13px; min-height: 20px; color: var(--text-muted); }
  .status.ok { color: var(--success); }
  .status.err { color: var(--danger); }

  .schedule-status { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; }
  .schedule-status.active { background: rgba(37, 211, 102, 0.15); color: var(--success); border: 1px solid rgba(37, 211, 102, 0.3); }
  .schedule-status.inactive { background: rgba(241, 92, 109, 0.15); color: var(--danger); border: 1px solid rgba(241, 92, 109, 0.3); }
  .schedule-inputs { display: flex; gap: 16px; margin-bottom: 12px; justify-content: center; }
  .schedule-inputs label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-muted); align-items: center; }

  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 20px;
  }
  .login-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 40px;
    max-width: 400px;
    width: 100%;
    text-align: center;
  }
  .login-icon { font-size: 48px; color: var(--accent); margin-bottom: 16px; }

  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 360px;
    width: 100%;
  }
  .toast {
    background: var(--card-bg);
    color: var(--text-main);
    padding: 12px 16px;
    border-radius: 8px;
    border-right: 4px solid var(--accent);
    box-shadow: var(--shadow);
    font-size: 14px;
    animation: slideIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .toast-success { border-right-color: var(--success); }
  .toast-error { border-right-color: var(--danger); }
  .toast-warning { border-right-color: var(--warning); }
  .toast-info { border-right-color: var(--accent); }
  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  .image-item {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    flex-shrink: 0;
  }
  .image-item img { width: 100%; height: 100%; object-fit: cover; }

  /* Progress Bar */
  .progress-container {
    width: 100%;
    background: var(--progress-bg);
    border-radius: 8px;
    height: 24px;
    overflow: hidden;
    margin: 12px 0;
  }
  .progress-bar {
    height: 100%;
    background: var(--progress-fill);
    border-radius: 8px;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #111B21;
    width: 0%;
  }
  .progress-text {
    font-size: 14px;
    color: var(--text-muted);
    margin-bottom: 4px;
  }

  /* Session */
  .session-status {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 8px;
    background: var(--bg-main);
    margin-bottom: 16px;
  }
  .session-indicator {
    width: 16px;
    height: 16px;
    border-radius: 50%;
    display: inline-block;
  }
  .session-indicator.connected { background: var(--success); }
  .session-indicator.waiting { background: var(--warning); }
  .session-indicator.disconnected { background: var(--danger); }
  .session-indicator.unknown { background: gray; }

  .qr-container {
    text-align: center;
    padding: 16px;
    background: var(--bg-main);
    border-radius: 8px;
    border: 1px solid var(--border-color);
  }
  .qr-container img {
    max-width: 200px;
    border-radius: 8px;
  }

  @media (max-width: 768px) {
    .navbar { flex-direction: column; align-items: stretch; }
    .navbar-links { justify-content: center; }
    .navbar-actions { justify-content: center; }
    .page-content { padding: 16px; }
    .dashboard-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .dashboard-grid { grid-template-columns: 1fr; }
    .schedule-inputs { flex-direction: column; align-items: center; }
  }
</style>
</head>
<body>
<div id="app"></div>
<script>
// ============================================================
// جميع أكواد JavaScript الخاصة بالواجهة (مضمنة)
// ============================================================

// ----- دوال مساعدة -----
function getHeaders() {
  const apiKey = localStorage.getItem('api_secret') || '';
  return {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  };
}

function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = 'toast toast-' + type;
  toast.innerHTML = '<span>' + message + '</span>';
  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, duration);
}

function isLoggedIn() {
  const key = localStorage.getItem('api_secret');
  return key && key.length > 0;
}

function logout() {
  localStorage.removeItem('api_secret');
  window.location.hash = '#login';
  navigate(window.location.hash);
}

function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy'); resolve(); } catch (e) { reject(e); }
      ta.remove();
    });
  }
}

function getToday() {
  return new Date().toISOString().split('T')[0];
}

// ----- دوال للتعامل مع الملفات (messages, accounts, mylist) -----
async function loadFile(type) {
  try {
    const res = await fetch('/api/load?type=' + type, { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    return data.text;
  } catch (e) {
    showToast('خطأ في تحميل ' + type + ': ' + e.message, 'error');
    return null;
  }
}

async function saveFile(type, text) {
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type, text })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    showToast('تم حفظ ' + type + ' بنجاح', 'success');
    return true;
  } catch (e) {
    showToast('خطأ في حفظ ' + type + ': ' + e.message, 'error');
    return false;
  }
}

// ============================================================
// صفحات التطبيق
// ============================================================

// ----- صفحة تسجيل الدخول -----
function renderLoginPage() {
  return \`
    <div class="login-container">
      <div class="login-card">
        <div class="login-icon"><i class="fas fa-lock"></i></div>
        <h2>تسجيل الدخول</h2>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">أدخل مفتاح API للوصول إلى لوحة التحكم</p>
        <input type="password" id="loginApiKey" placeholder="API_SECRET" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--input-bg); color:var(--text-main); font-size:16px; margin-bottom:16px; direction:ltr;" />
        <button id="loginBtn" class="btn btn-primary" style="width:100%;">دخول</button>
        <div id="loginError" style="color:var(--danger); margin-top:12px; font-size:13px;"></div>
      </div>
    </div>
  \`;
}

function initLogin() {
  const btn = document.getElementById('loginBtn');
  const input = document.getElementById('loginApiKey');
  const errorEl = document.getElementById('loginError');
  if (!btn || !input) return;

  async function doLogin() {
    const key = input.value.trim();
    if (!key) { errorEl.textContent = 'الرجاء إدخال المفتاح'; return; }
    try {
      const res = await fetch('/api/contacts', { headers: { 'X-API-Key': key } });
      if (res.status === 401 || res.status === 403) {
        errorEl.textContent = 'مفتاح غير صحيح';
        return;
      }
      localStorage.setItem('api_secret', key);
      showToast('تم تسجيل الدخول بنجاح', 'success');
      window.location.hash = '#dashboard';
      navigate(window.location.hash);
    } catch (e) {
      errorEl.textContent = 'خطأ في الاتصال: ' + e.message;
    }
  }

  btn.addEventListener('click', doLogin);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
}

// ----- تخطيط الصفحة (Navbar, Main, Toast) -----
function renderLayout() {
  return \`
    <nav class="navbar">
      <div class="navbar-brand">
        <i class="fab fa-whatsapp" style="color:var(--accent);"></i>
        <span>مدير واتساب</span>
      </div>
      <div class="navbar-links" id="navLinks">
        <a href="#dashboard" class="nav-link active"><i class="fas fa-home"></i> الرئيسية</a>
        <a href="#contacts" class="nav-link"><i class="fas fa-address-book"></i> جهات الاتصال</a>
        <a href="#messages" class="nav-link"><i class="fas fa-envelope"></i> الرسائل</a>
        <a href="#sender" class="nav-link"><i class="fas fa-paper-plane"></i> الإرسال</a>
        <a href="#schedule" class="nav-link"><i class="fas fa-clock"></i> الجدولة</a>
        <a href="#stats" class="nav-link"><i class="fas fa-chart-bar"></i> الإحصائيات</a>
        <a href="#logs" class="nav-link"><i class="fas fa-terminal"></i> السجلات</a>
        <a href="#images" class="nav-link"><i class="fas fa-images"></i> الصور</a>
        <a href="#session" class="nav-link"><i class="fas fa-qrcode"></i> الجلسة</a>
      </div>
      <div class="navbar-actions">
        <button id="logoutBtn" class="btn" style="width:auto; padding:6px 12px; background:transparent; border-color:var(--danger); color:var(--danger);">
          <i class="fas fa-sign-out-alt"></i> خروج
        </button>
      </div>
    </nav>
    <main id="pageContent" class="page-content"></main>
    <div id="toastContainer" class="toast-container"></div>
  \`;
}

function initLayout() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('api_secret');
      window.location.hash = '#login';
      navigate(window.location.hash);
      showToast('تم تسجيل الخروج', 'info');
    });
  }
}

// ----- الصفحة الرئيسية (Dashboard) -----
function renderDashboard() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-home"></i> لوحة التحكم</h1>
      <p style="color:var(--text-muted);">مرحباً بك في لوحة إدارة واتساب</p>
    </div>
    <div class="dashboard-grid">
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-users"></i></div>
        <div><h3>جهات الاتصال</h3><p id="dashboardContactsCount">-</p></div>
      </div>
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-envelope"></i></div>
        <div><h3>الرسائل</h3><p id="dashboardMessagesCount">-</p></div>
      </div>
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-clock"></i></div>
        <div><h3>آخر تشغيل</h3><p id="dashboardLastRun">-</p></div>
      </div>
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-check-circle"></i></div>
        <div><h3>حالة الجلسة</h3><p id="dashboardSessionStatus">-</p></div>
      </div>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-history"></i> <h2>آخر النتائج</h2></div>
      <div id="dashboardRecentStats" style="padding:10px 0;"><div style="color:var(--text-muted);">جاري التحميل...</div></div>
    </div>
  \`;
}

async function initDashboard() {
  try {
    const res = await fetch('/api/load?type=contacts', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok) {
      const lines = data.text ? data.text.split('\\n').filter(Boolean).length : 0;
      document.getElementById('dashboardContactsCount').textContent = lines;
    }
  } catch (e) {}

  try {
    const res = await fetch('/api/load?type=messages', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok) {
      const lines = data.text ? data.text.split('\\n').filter(Boolean).length : 0;
      document.getElementById('dashboardMessagesCount').textContent = lines;
    }
  } catch (e) {}

  try {
    const res = await fetch('/api/stats', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok && data.data.length > 0) {
      const last = data.data[data.data.length - 1];
      document.getElementById('dashboardLastRun').textContent = last.date;
      const recent = data.data.slice(-5).reverse();
      const container = document.getElementById('dashboardRecentStats');
      container.innerHTML = recent.map(row => \`
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color);">
          <span>\${row.date}</span>
          <span>محاولات: \${row.attempted || 0} | نجاح: \${row.success || 0} | فشل: \${row.failed || 0}</span>
        </div>
      \`).join('');
    }
  } catch (e) {}

  try {
    const res = await fetch('/api/live/status', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok) {
      const statusMap = { 'connected': '🟢 متصل', 'waiting_scan': '🟡 في انتظار المسح', 'starting': '🟡 جاري التشغيل', 'disconnected': '🔴 غير متصل' };
      document.getElementById('dashboardSessionStatus').textContent = statusMap[data.status] || 'غير معروف';
    }
  } catch (e) {}
}

// ----- صفحة جهات الاتصال (mylist.json) -----
function renderContacts() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-address-book"></i> جهات الاتصال (mylist.json)</h1>
      <p style="color:var(--text-muted);">إدارة جهات الاتصال مع الاسم، الجنس، الرقم، العمر</p>
    </div>
    <div class="card">
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px; align-items:center;">
        <input type="text" id="contactsFilter" placeholder="فلترة..." style="flex:1; min-width:200px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:6px; padding:10px 14px; font-family:'Tajawal';" />
        <button id="addContactRowBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-plus"></i> إضافة صف</button>
        <button id="copyNumbersBtn" class="btn" style="width:auto;"><i class="fas fa-copy"></i> نسخ الأرقام (المفلترة)</button>
        <button id="saveContactsBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-save"></i> حفظ</button>
        <span id="filteredCount" style="color:var(--text-muted); font-size:13px;">0 صف</span>
      </div>
      <div style="overflow:auto; border:1px solid var(--border-color); border-radius:8px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead style="background:var(--card-bg); position:sticky; top:0;">
            <tr>
              <th style="padding:10px 6px; text-align:center;">#</th>
              <th style="padding:10px 6px; text-align:right;">الاسم</th>
              <th style="padding:10px 6px; text-align:right;">النوع</th>
              <th style="padding:10px 6px; text-align:right;">الرقم</th>
              <th style="padding:10px 6px; text-align:right;">العمر</th>
              <th style="padding:10px 6px; text-align:center;">إجراء</th>
            </tr>
          </thead>
          <tbody id="contactsTableBody"><tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">جاري التحميل...</td></tr></tbody>
        </table>
      </div>
      <div id="contactsStatus" class="status" style="margin-top:12px;"></div>
    </div>
  \`;
}

let contactsData = [];
let filteredContacts = [];

async function loadContacts() {
  const tbody = document.getElementById('contactsTableBody');
  const status = document.getElementById('contactsStatus');
  status.textContent = 'جاري التحميل...';
  status.className = 'status';
  try {
    const text = await loadFile('contacts');
    if (text === null) throw new Error('فشل التحميل');
    // تحويل النص إلى مصفوفة كائنات (كل سطر هو JSON)
    const lines = text.split('\\n').filter(Boolean);
    contactsData = lines.map(line => {
      try { return JSON.parse(line); } catch (e) { return { name: '', gender: '', number: line, age: '' }; }
    });
    renderContactsTable();
    status.textContent = '✓ تم التحميل';
    status.className = 'status ok';
  } catch (e) {
    status.textContent = 'خطأ: ' + e.message;
    status.className = 'status err';
    showToast('فشل تحميل جهات الاتصال', 'error');
  }
}

function renderContactsTable() {
  const filter = document.getElementById('contactsFilter')?.value?.trim().toLowerCase() || '';
  filteredContacts = contactsData.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(filter)));
  document.getElementById('filteredCount').textContent = filteredContacts.length + ' صف';

  const tbody = document.getElementById('contactsTableBody');
  if (filteredContacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">لا توجد بيانات</td></tr>';
    return;
  }
  tbody.innerHTML = filteredContacts.map((row, idx) => {
    const realIndex = contactsData.indexOf(row);
    return \`
      <tr data-index="\${realIndex}">
        <td style="text-align:center; padding:6px;">\${idx+1}</td>
        <td contenteditable="true" class="editable" data-field="name" style="padding:6px;">\${row.name || ''}</td>
        <td contenteditable="true" class="editable" data-field="gender" style="padding:6px;">\${row.gender || ''}</td>
        <td contenteditable="true" class="editable" data-field="number" style="padding:6px; direction:ltr;">\${row.number || ''}</td>
        <td contenteditable="true" class="editable" data-field="age" style="padding:6px;">\${row.age || ''}</td>
        <td style="text-align:center; padding:6px;">
          <button class="deleteRowBtn btn" style="width:auto; padding:2px 10px; background:var(--danger); color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;">حذف</button>
        </td>
      </tr>
    \`;
  }).join('');

  document.querySelectorAll('.editable').forEach(cell => {
    cell.addEventListener('blur', function() {
      const tr = this.closest('tr');
      const index = parseInt(tr.dataset.index);
      const field = this.dataset.field;
      const newValue = this.textContent.trim();
      if (contactsData[index]) contactsData[index][field] = newValue;
    });
  });
  document.querySelectorAll('.deleteRowBtn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tr = this.closest('tr');
      const index = parseInt(tr.dataset.index);
      if (confirm('تأكيد حذف هذا الصف؟')) {
        contactsData.splice(index, 1);
        renderContactsTable();
        showToast('تم الحذف (لم يحفظ بعد)', 'info');
      }
    });
  });
}

async function saveContacts() {
  const status = document.getElementById('contactsStatus');
  status.textContent = 'جاري الحفظ...';
  status.className = 'status';
  try {
    // تحويل المصفوفة إلى نصوص JSON سطراً سطراً
    const text = contactsData.map(row => JSON.stringify(row)).join('\\n');
    const ok = await saveFile('contacts', text);
    if (ok) {
      status.textContent = '✓ تم الحفظ';
      status.className = 'status ok';
    } else {
      status.textContent = 'فشل الحفظ';
      status.className = 'status err';
    }
  } catch (e) {
    status.textContent = 'خطأ: ' + e.message;
    status.className = 'status err';
  }
}

function initContacts() {
  loadContacts();
  document.getElementById('contactsFilter').addEventListener('input', renderContactsTable);
  document.getElementById('addContactRowBtn').addEventListener('click', () => {
    contactsData.push({ name: '', gender: '', number: '', age: '' });
    renderContactsTable();
    showToast('تمت الإضافة (لم يحفظ بعد)', 'info');
  });
  document.getElementById('saveContactsBtn').addEventListener('click', saveContacts);
  document.getElementById('copyNumbersBtn').addEventListener('click', async () => {
    const numbers = filteredContacts.map(row => row.number).filter(Boolean);
    if (numbers.length === 0) { showToast('لا توجد أرقام للنسخ', 'warning'); return; }
    try {
      await copyToClipboard(numbers.join('\\n'));
      showToast('تم نسخ ' + numbers.length + ' رقم', 'success');
    } catch (e) {
      showToast('فشل النسخ', 'error');
    }
  });
}

// ----- صفحة الرسائل (messages.json) -----
function renderMessages() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-envelope"></i> الرسائل (messages.json)</h1>
      <p style="color:var(--text-muted);">إدارة قائمة الرسائل (كل رسالة في سطر)</p>
    </div>
    <div class="card">
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px; align-items:center;">
        <button id="loadMessagesBtn" class="btn" style="width:auto;"><i class="fas fa-download"></i> تحميل</button>
        <button id="saveMessagesBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-save"></i> حفظ</button>
        <span id="messagesCount" style="color:var(--text-muted); font-size:13px;">0 رسالة</span>
      </div>
      <textarea id="messagesArea" style="width:100%; min-height:200px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:8px; padding:12px; font-family:'Consolas',monospace; font-size:13px; resize:vertical; direction:ltr; text-align:left;"></textarea>
      <div id="messagesStatus" class="status" style="margin-top:12px;"></div>
    </div>
    <div class="page-header">
      <h1><i class="fas fa-phone"></i> الأرقام (accounts.json)</h1>
      <p style="color:var(--text-muted);">إدارة قائمة الأرقام (كل رقم في سطر)</p>
    </div>

    <div class="card">
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px; align-items:center;">
        <button id="loadAccountsBtn" class="btn" style="width:auto;">
          <i class="fas fa-download"></i> تحميل
        </button>

        <button id="saveAccountsBtn" class="btn btn-primary" style="width:auto;">
          <i class="fas fa-save"></i> حفظ
        </button>

        <span id="accountsCount" style="color:var(--text-muted); font-size:13px;">
          0 رقم
        </span>
      </div>

      <textarea
        id="accountsArea"
        style="width:100%; min-height:200px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:8px; padding:12px; font-family:'Consolas',monospace; font-size:13px; resize:vertical; direction:ltr; text-align:left;"
      ></textarea>

      <div id="accountsStatus" class="status" style="margin-top:12px;"></div>
    </div>
  \`;
}

async function loadMessages() {
  const area = document.getElementById('messagesArea');
  const status = document.getElementById('messagesStatus');
  status.textContent = 'جاري التحميل...';
  status.className = 'status';
  try {
    const text = await loadFile('messages');
    if (text === null) throw new Error('فشل التحميل');
    area.value = text;
    const count = text.split('\\n').filter(Boolean).length;
    document.getElementById('messagesCount').textContent = count + ' رسالة';
    status.textContent = '✓ تم التحميل';
    status.className = 'status ok';
  } catch (e) {
    status.textContent = 'خطأ: ' + e.message;
    status.className = 'status err';
  }
}

async function saveMessages() {
  const area = document.getElementById('messagesArea');
  const status = document.getElementById('messagesStatus');
  status.textContent = 'جاري الحفظ...';
  status.className = 'status';
  try {
    const ok = await saveFile('messages', area.value);
    if (ok) {
      const count = area.value.split('\\n').filter(Boolean).length;
      document.getElementById('messagesCount').textContent = count + ' رسالة';
      status.textContent = '✓ تم الحفظ';
      status.className = 'status ok';
    } else {
      status.textContent = 'فشل الحفظ';
      status.className = 'status err';
    }
  } catch (e) {
    status.textContent = 'خطأ: ' + e.message;
    status.className = 'status err';
  }
}

function initMessages() {
  loadMessages();
  document.getElementById('loadMessagesBtn').addEventListener('click', loadMessages);
  document.getElementById('saveMessagesBtn').addEventListener('click', saveMessages);
  // تحديث العدد عند الكتابة
  document.getElementById('messagesArea').addEventListener('input', function() {
    const count = this.value.split('\\n').filter(Boolean).length;
    document.getElementById('messagesCount').textContent = count + ' رسالة';
  });
}

async function loadAccounts() {
  const area = document.getElementById("accountsArea");
  const status = document.getElementById("accountsStatus");

  status.textContent = "جاري التحميل...";
  status.className = "status";

  try {
    const text = await loadFile("accounts");

    if (text === null) throw new Error("فشل التحميل");

    area.value = text;

    const count = text.split("\n").filter(Boolean).length;

    document.getElementById("accountsCount").textContent =
      count + " رقم";

    status.textContent = "✓ تم التحميل";
    status.className = "status ok";

  } catch (e) {

    status.textContent = "خطأ: " + e.message;
    status.className = "status err";

  }
}

async function saveAccounts() {

  const area = document.getElementById("accountsArea");
  const status = document.getElementById("accountsStatus");

  status.textContent = "جاري الحفظ...";
  status.className = "status";

  try {

    const ok = await saveFile("accounts", area.value);

    if (ok) {

      const count = area.value.split("\n").filter(Boolean).length;

      document.getElementById("accountsCount").textContent =
        count + " رقم";

      status.textContent = "✓ تم الحفظ";
      status.className = "status ok";

    } else {

      status.textContent = "فشل الحفظ";
      status.className = "status err";

    }

  } catch (e) {

    status.textContent = "خطأ: " + e.message;
    status.className = "status err";

  }
}

function initAccounts() {

  loadAccounts();

  document
    .getElementById("loadAccountsBtn")
    .addEventListener("click", loadAccounts);

  document
    .getElementById("saveAccountsBtn")
    .addEventListener("click", saveAccounts);

  document
    .getElementById("accountsArea")
    .addEventListener("input", function () {

      const count = this.value.split("\n").filter(Boolean).length;

      document.getElementById("accountsCount").textContent =
        count + " رقم";

    });

}

// ----- صفحة الإرسال (Sender) مع progress bar -----
function renderSender() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-paper-plane"></i> الإرسال</h1>
      <p style="color:var(--text-muted);">تشغيل الـ Workflow لإرسال الرسائل مع عرض التقدم</p>
    </div>
    <div class="card">
      <div style="display:flex; gap:12px; flex-wrap:wrap; margin-bottom:16px;">
        <button id="runWorkflowBtn" class="btn btn-success" style="width:auto;"><i class="fas fa-play"></i> تشغيل الـ Workflow</button>
        <button id="stopWorkflowBtn" class="btn btn-danger" style="width:auto;"><i class="fas fa-stop"></i> إيقاف</button>
        <button id="refreshSenderBtn" class="btn" style="width:auto;"><i class="fas fa-sync"></i> تحديث</button>
      </div>
      <div style="background:var(--bg-main); padding:16px; border-radius:8px; margin-bottom:16px;">
        <div style="display:flex; justify-content:space-between; flex-wrap:wrap; gap:8px;">
          <span><strong>عدد الأرقام:</strong> <span id="senderNumbersCount">-</span></span>
          <span><strong>عدد الرسائل:</strong> <span id="senderMessagesCount">-</span></span>
          <span><strong>الوقت المتوقع:</strong> <span id="senderEstimatedTime">-</span></span>
        </div>
      </div>
      <div>
        <div class="progress-text" id="progressText">0%</div>
        <div class="progress-container">
          <div class="progress-bar" id="progressBar" style="width:0%;">0%</div>
        </div>
      </div>
      <div id="senderStatus" class="status"></div>
    </div>
  \`;
}

let senderInterval = null;

async function updateSenderStats() {
  try {
    // جلب عدد الأرقام من accounts.json
    const accountsRes = await fetch('/api/load?type=accounts', { headers: getHeaders() });
    const accountsData = await accountsRes.json();
    let numbersCount = 0;
    if (accountsData.ok && accountsData.text) {
      numbersCount = accountsData.text.split('\\n').filter(Boolean).length;
    }
    document.getElementById('senderNumbersCount').textContent = numbersCount;

    // جلب عدد الرسائل من messages.json
    const messagesRes = await fetch('/api/load?type=messages', { headers: getHeaders() });
    const messagesData = await messagesRes.json();
    let messagesCount = 0;
    if (messagesData.ok && messagesData.text) {
      messagesCount = messagesData.text.split('\\n').filter(Boolean).length;
    }
    document.getElementById('senderMessagesCount').textContent = messagesCount;

    // حساب الوقت المتوقع (20-40 ثانية لكل رقم)
    if (numbersCount > 0) {
      const minTime = numbersCount * 20;
      const maxTime = numbersCount * 40;
      document.getElementById('senderEstimatedTime').textContent = minTime + ' - ' + maxTime + ' ثانية';
    } else {
      document.getElementById('senderEstimatedTime').textContent = 'لا توجد أرقام';
    }
  } catch (e) {
    console.error('Error updating sender stats:', e);
  }
}

// محاكاة التقدم (للعرض فقط، لأننا لا نستطيع تتبع تقدم الـ Workflow الفعلي)
function startProgressSimulation() {
  let progress = 0;
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  if (senderInterval) clearInterval(senderInterval);
  senderInterval = setInterval(() => {
    progress += Math.random() * 5;
    if (progress >= 100) {
      progress = 100;
      clearInterval(senderInterval);
      senderInterval = null;
      showToast('اكتمل الإرسال!', 'success');
    }
    bar.style.width = progress + '%';
    bar.textContent = Math.round(progress) + '%';
    text.textContent = Math.round(progress) + '%';
  }, 1000);
}

function stopProgressSimulation() {
  if (senderInterval) {
    clearInterval(senderInterval);
    senderInterval = null;
  }
  const bar = document.getElementById('progressBar');
  const text = document.getElementById('progressText');
  bar.style.width = '0%';
  bar.textContent = '0%';
  text.textContent = '0%';
}

function initSender() {
  updateSenderStats();
  document.getElementById('refreshSenderBtn').addEventListener('click', updateSenderStats);

  document.getElementById('runWorkflowBtn').addEventListener('click', async function() {
    const status = document.getElementById('senderStatus');
    status.textContent = 'جاري تشغيل الـ Workflow...';
    status.className = 'status';
    try {
      const res = await fetch('/api/run-workflow', {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      status.textContent = '✓ تم التشغيل';
      status.className = 'status ok';
      showToast('تم تشغيل الـ Workflow بنجاح', 'success');
      // بدء محاكاة التقدم
      startProgressSimulation();
    } catch (e) {
      status.textContent = 'خطأ: ' + e.message;
      status.className = 'status err';
      showToast('فشل تشغيل الـ Workflow', 'error');
    }
  });

  document.getElementById('stopWorkflowBtn').addEventListener('click', async function() {
    const status = document.getElementById('senderStatus');
    status.textContent = 'جاري إيقاف الـ Workflow...';
    status.className = 'status';
    try {
      const res = await fetch('/api/stop-workflow', {
        method: 'POST',
        headers: getHeaders()
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      status.textContent = '✓ تم الإيقاف';
      status.className = 'status ok';
      showToast('تم إيقاف الـ Workflow', 'info');
      stopProgressSimulation();
    } catch (e) {
      status.textContent = 'خطأ: ' + e.message;
      status.className = 'status err';
      showToast('فشل إيقاف الـ Workflow', 'error');
    }
  });
}

// ----- صفحة الجدولة (Schedule) -----
function renderSchedule() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-clock"></i> الجدولة</h1>
      <p style="color:var(--text-muted);">تحديد وقت تشغيل الـ Workflow (توقيت المغرب -2 ساعة UTC)</p>
    </div>
    <div class="card">
      <div style="margin-bottom:16px;">
        <span class="schedule-status inactive" id="scheduleIndicator">غير مفعل</span>
        <span id="currentCronDisplay" style="font-size:13px; color:var(--text-muted); display:block; margin-top:5px;"></span>
      </div>
      <div class="schedule-inputs">
        <label>الساعة <input type="number" id="hourInput" min="0" max="23" value="10" style="width:70px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:6px; padding:8px; text-align:center; font-size:16px;" /></label>
        <label>الدقيقة <input type="number" id="minuteInput" min="0" max="59" value="0" style="width:70px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:6px; padding:8px; text-align:center; font-size:16px;" /></label>
      </div>
      <div class="btn-row" style="margin-top:10px;">
        <button id="loadScheduleBtn" class="btn" style="width:auto;"><i class="fas fa-history"></i> تحميل</button>
        <button id="updateScheduleBtn" class="btn btn-warning" style="width:auto;"><i class="fas fa-sync-alt"></i> تحديث</button>
      </div>
      <div id="scheduleStatus" class="status"></div>
    </div>
  \`;
}

function initSchedule() {
  const hourInput = document.getElementById('hourInput');
  const minuteInput = document.getElementById('minuteInput');
  const statusEl = document.getElementById('scheduleStatus');
  const indicator = document.getElementById('scheduleIndicator');
  const disp = document.getElementById('currentCronDisplay');

  async function loadSchedule() {
    statusEl.textContent = 'جاري التحميل...';
    statusEl.className = 'status';
    try {
      const res = await fetch('/api/schedule', { headers: getHeaders() });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      if (data.hasSchedule && data.cron) {
        indicator.textContent = 'مفعل';
        indicator.className = 'schedule-status active';
        disp.textContent = 'التوقيت (المغرب): ' + data.cron;
        const parts = data.cron.trim().split(/\\s+/);
        if (parts.length >= 2) { minuteInput.value = parts[0]; hourInput.value = parts[1]; }
        statusEl.textContent = 'تم التحميل ✓';
        statusEl.className = 'status ok';
      } else {
        indicator.textContent = 'غير مفعل';
        indicator.className = 'schedule-status inactive';
        disp.textContent = '(لا توجد جدولة)';
        statusEl.textContent = 'الجدولة غير مفعلة';
        statusEl.className = 'status';
      }
    } catch (e) {
      statusEl.textContent = 'خطأ: ' + e.message;
      statusEl.className = 'status err';
    }
  }

  async function saveSchedule(cron) {
    statusEl.textContent = 'جاري الحفظ...';
    statusEl.className = 'status';
    try {
      const res = await fetch('/api/schedule', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ action: 'add', cron })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      statusEl.textContent = 'تم التحديث ✓';
      statusEl.className = 'status ok';
      showToast('تم تحديث الجدولة', 'success');
      loadSchedule();
    } catch (e) {
      statusEl.textContent = 'خطأ: ' + e.message;
      statusEl.className = 'status err';
    }
  }

  document.getElementById('loadScheduleBtn').addEventListener('click', loadSchedule);
  document.getElementById('updateScheduleBtn').addEventListener('click', () => {
    const h = parseInt(hourInput.value, 10);
    const m = parseInt(minuteInput.value, 10);
    if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
      statusEl.textContent = 'أدخل قيم صحيحة';
      statusEl.className = 'status err';
      return;
    }
    saveSchedule(m + ' ' + h + ' * * *');
  });
  loadSchedule();
}

// ----- صفحة الإحصائيات (Stats) -----
let statsChartInstance = null;

function renderStats() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-chart-bar"></i> الإحصائيات</h1>
      <p style="color:var(--text-muted);">ملخص أداء عمليات الإرسال</p>
    </div>
    <div class="card">
      <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:12px; margin-bottom:16px;">
        <button id="refreshStatsBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-sync"></i> تحديث</button>
      </div>
      <div id="statsContainer">
        <div style="max-height:250px; overflow-y:auto; border:1px solid var(--border-color); border-radius:8px; margin-bottom:20px;">
          <table style="width:100%; border-collapse:collapse; font-size:14px;">
            <thead style="background:var(--card-bg); position:sticky; top:0;">
              <tr><th style="padding:8px 4px; text-align:right;">التاريخ</th><th style="padding:8px 4px; text-align:center;">محاولات</th><th style="padding:8px 4px; text-align:center;">نجاح</th><th style="padding:8px 4px; text-align:center;">فشل</th></tr>
            </thead>
            <tbody id="statsTableBody"></tbody>
          </table>
        </div>
        <div style="background:var(--bg-main); border-radius:8px; padding:20px; height:300px;">
          <canvas id="statsChart"></canvas>
        </div>
      </div>
      <div id="statsStatus" class="status"></div>
    </div>
  \`;
}

async function loadStats() {
  const statusEl = document.getElementById('statsStatus');
  statusEl.textContent = 'جاري التحميل...';
  statusEl.className = 'status';
  try {
    const res = await fetch('/api/stats', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    if (data.data.length === 0) {
      statusEl.textContent = 'لا توجد إحصائيات';
      statusEl.className = 'status';
      return;
    }
    statusEl.textContent = '✓ تم التحميل';
    statusEl.className = 'status ok';

    const tbody = document.getElementById('statsTableBody');
    tbody.innerHTML = '';
    let totalAtt = 0, totalSuc = 0, totalFail = 0;
    data.data.forEach(row => {
      totalAtt += row.attempted || 0;
      totalSuc += row.success || 0;
      totalFail += row.failed || 0;
      tbody.innerHTML += \`
        <tr>
          <td style="padding:6px 4px;">\${row.date}</td>
          <td style="padding:6px 4px; text-align:center;">\${row.attempted || 0}</td>
          <td style="padding:6px 4px; text-align:center; color:var(--success);">\${row.success || 0}</td>
          <td style="padding:6px 4px; text-align:center; color:var(--danger);">\${row.failed || 0}</td>
        </tr>
      \`;
    });
    tbody.innerHTML += \`
      <tr style="font-weight:bold; border-top:2px solid var(--accent);">
        <td style="padding:6px 4px;">المجموع</td>
        <td style="padding:6px 4px; text-align:center;">\${totalAtt}</td>
        <td style="padding:6px 4px; text-align:center; color:var(--success);">\${totalSuc}</td>
        <td style="padding:6px 4px; text-align:center; color:var(--danger);">\${totalFail}</td>
      </tr>
    \`;

    const ctx = document.getElementById('statsChart').getContext('2d');
    if (statsChartInstance) statsChartInstance.destroy();
    statsChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.data.map(r => r.date),
        datasets: [
          { label: 'محاولات', data: data.data.map(r => r.attempted||0), backgroundColor: 'rgba(53,114,238,0.6)', borderColor: 'rgba(53,114,238,1)', borderWidth: 1 },
          { label: 'نجاح', data: data.data.map(r => r.success||0), backgroundColor: 'rgba(37,211,102,0.6)', borderColor: 'rgba(37,211,102,1)', borderWidth: 1 },
          { label: 'فشل', data: data.data.map(r => r.failed||0), backgroundColor: 'rgba(241,92,109,0.6)', borderColor: 'rgba(241,92,109,1)', borderWidth: 1 }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#E9EDEF', font: { family: 'Tajawal', size: 13 } } } },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#8696A0' }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { ticks: { color: '#8696A0' }, grid: { display: false } }
        }
      }
    });
  } catch (e) {
    statusEl.textContent = 'خطأ: ' + e.message;
    statusEl.className = 'status err';
    showToast('فشل تحميل الإحصائيات', 'error');
  }
}

function initStats() {
  loadStats();
  document.getElementById('refreshStatsBtn').addEventListener('click', loadStats);
}

// ----- صفحة السجلات (Logs) -----
function renderLogs() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-terminal"></i> السجلات</h1>
      <p style="color:var(--text-muted);">عرض ملفات السجل من مجلد logs</p>
    </div>
    <div class="card">
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px;">
        <button id="refreshLogsBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-sync"></i> تحديث</button>
      </div>
      <div id="logsList" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px;"></div>
      <div style="border:1px solid var(--border-color); border-radius:8px; background:var(--bg-main); padding:16px; min-height:200px; max-height:400px; overflow:auto; font-family:monospace; font-size:13px; white-space:pre-wrap;" id="logContent">اختر ملف سجل لعرض محتواه</div>
      <div id="logsStatus" class="status"></div>
    </div>
  \`;
}

async function loadLogsList() {
  const listEl = document.getElementById('logsList');
  const statusEl = document.getElementById('logsStatus');
  statusEl.textContent = 'جاري التحميل...';
  statusEl.className = 'status';
  try {
    const res = await fetch('/api/logs', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    listEl.innerHTML = '';
    if (data.files.length === 0) {
      listEl.innerHTML = '<span style="color:var(--text-muted);">لا توجد سجلات</span>';
      statusEl.textContent = 'لا توجد ملفات';
      statusEl.className = 'status';
      return;
    }
    data.files.forEach(file => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = file.name;
      btn.style.width = 'auto';
      btn.addEventListener('click', () => loadLogContent(file.name));
      listEl.appendChild(btn);
    });
    statusEl.textContent = '✓ تم التحميل';
    statusEl.className = 'status ok';
  } catch (e) {
    statusEl.textContent = 'خطأ: ' + e.message;
    statusEl.className = 'status err';
    showToast('فشل تحميل قائمة السجلات', 'error');
  }
}

async function loadLogContent(filename) {
  const contentEl = document.getElementById('logContent');
  contentEl.textContent = 'جاري التحميل...';
  try {
    const res = await fetch('/api/log-content?file=' + encodeURIComponent(filename), { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    contentEl.textContent = data.content || '(فارغ)';
  } catch (e) {
    contentEl.textContent = 'خطأ: ' + e.message;
    showToast('فشل تحميل المحتوى', 'error');
  }
}

function initLogs() {
  loadLogsList();
  document.getElementById('refreshLogsBtn').addEventListener('click', loadLogsList);
}

// ----- صفحة الصور (Images) -----
let selectedFiles = [];

function renderImages() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-images"></i> إدارة الصور</h1>
      <p style="color:var(--text-muted);">رفع وحذف الصور (الحد الأقصى 3 صور)</p>
    </div>
    <div class="card">
      <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--border-color); margin-bottom:16px;">
        <input type="file" id="imagesInput" accept="image/*" multiple style="width:100%; margin-bottom:10px;" />
        <div id="imagePreviewArea" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
      </div>
      <div class="btn-row" style="margin-top:0;">
        <button id="uploadImagesBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-upload"></i> رفع الصور</button>
        <button id="refreshImagesBtn" class="btn" style="width:auto;"><i class="fas fa-sync"></i> تحديث القائمة</button>
      </div>
      <div id="imageGallery" style="margin-top:16px; display:none;">
        <div style="margin-bottom:10px;"><span style="font-size:14px; color:var(--text-muted);">الصور الموجودة (<span id="imageCount">0</span>/3)</span></div>
        <div id="imageList" style="display:flex; flex-wrap:wrap; gap:12px;"></div>
      </div>
      <div id="imagesStatus" class="status"></div>
    </div>
  \`;
}

async function loadImages() {
  const gallery = document.getElementById('imageGallery');
  const list = document.getElementById('imageList');
  const countSpan = document.getElementById('imageCount');
  const status = document.getElementById('imagesStatus');
  status.textContent = 'جاري التحميل...';
  status.className = 'status';
  try {
    const res = await fetch('/api/images', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    const files = data.files || [];
    countSpan.textContent = files.length;
    if (files.length === 0) { gallery.style.display = 'none'; status.textContent = 'لا توجد صور'; status.className = 'status'; return; }
    gallery.style.display = 'block';
    list.innerHTML = '';
    files.forEach(file => {
      const div = document.createElement('div');
      div.className = 'image-item';
      div.innerHTML = \`
        <img src="\${file.download_url}" style="width:100%; height:100%; object-fit:cover;" />
        <button class="delete-btn" data-filename="\${file.name}" style="position:absolute; top:4px; right:4px; background:var(--danger); border:none; color:white; border-radius:50%; width:24px; height:24px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:11px; box-shadow:0 2px 8px rgba(0,0,0,0.5);"><i class="fas fa-trash"></i></button>
      \`;
      list.appendChild(div);
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const filename = this.dataset.filename;
        if (!confirm('تأكيد حذف الصورة "' + filename + '"؟')) return;
        try {
          const res = await fetch('/api/delete-image', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ filename })
          });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          showToast('تم حذف الصورة', 'success');
          loadImages();
        } catch (e) {
          showToast('خطأ في الحذف: ' + e.message, 'error');
        }
      });
    });
    status.textContent = '✓ تم التحميل';
    status.className = 'status ok';
  } catch (e) {
    status.textContent = 'خطأ: ' + e.message;
    status.className = 'status err';
  }
}

function initImages() {
  const input = document.getElementById('imagesInput');
  const preview = document.getElementById('imagePreviewArea');
  input.addEventListener('change', function(e) {
    selectedFiles = Array.from(this.files);
    renderPreviews();
  });

  function renderPreviews() {
    preview.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function(ev) {
        const div = document.createElement('div');
        div.style.cssText = 'width:80px; height:80px; border-radius:8px; overflow:hidden; position:relative; border:1px solid var(--border-color);';
        div.innerHTML = \`
          <img src="\${ev.target.result}" style="width:100%; height:100%; object-fit:cover;" />
          <button data-index="\${index}" style="position:absolute; top:2px; right:2px; background:var(--danger); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px;">X</button>
        \`;
        preview.appendChild(div);
        div.querySelector('button').onclick = function() {
          selectedFiles.splice(index, 1);
          renderPreviews();
        };
      };
      reader.readAsDataURL(file);
    });
  }

  document.getElementById('uploadImagesBtn').addEventListener('click', uploadImages);
  document.getElementById('refreshImagesBtn').addEventListener('click', loadImages);
  loadImages();

  async function uploadImages() {
    if (selectedFiles.length === 0) { showToast('اختر صورة أولاً', 'warning'); return; }
    try {
      const checkRes = await fetch('/api/images', { headers: getHeaders() });
      const checkData = await checkRes.json();
      if (!checkData.ok) throw new Error(checkData.error);
      const currentCount = checkData.files ? checkData.files.length : 0;
      if (currentCount >= 3) { showToast('لا يمكن رفع أكثر من 3 صور', 'error'); return; }
      const remaining = 3 - currentCount;
      if (selectedFiles.length > remaining) {
        showToast('يمكنك رفع ' + remaining + ' صورة فقط', 'warning');
        return;
      }
    } catch (e) {
      showToast('خطأ في التحقق: ' + e.message, 'error');
      return;
    }
    let success = 0;
    for (const file of selectedFiles) {
      try {
        const base64 = await new Promise((resolve, reject) => {
          const r = new FileReader();
          r.onload = () => resolve(r.result.split(',')[1]);
          r.onerror = reject;
          r.readAsDataURL(file);
        });
        const res = await fetch('/api/upload-image', {
          method: 'POST',
          headers: getHeaders(),
          body: JSON.stringify({ filename: file.name, dataBase64: base64 })
        });
        const data = await res.json();
        if (data.ok) success++;
      } catch (e) {}
    }
    showToast(success + '/' + selectedFiles.length + ' تم رفعها', success === selectedFiles.length ? 'success' : 'warning');
    if (success === selectedFiles.length) {
      selectedFiles = [];
      document.getElementById('imagesInput').value = '';
      document.getElementById('imagePreviewArea').innerHTML = '';
    }
    loadImages();
  }
}

// ----- صفحة التحقق من الجلسة (Session) -----
let sessionQRInterval = null;

function renderSession() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-qrcode"></i> التحقق من الجلسة</h1>
      <p style="color:var(--text-muted);">عرض حالة جلسة واتساب ورمز QR عند الحاجة</p>
    </div>
    <div class="card">
      <div style="display:flex; gap:12px; align-items:center; flex-wrap:wrap; margin-bottom:16px;">
        <button id="checkSessionBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-sync"></i> تحقق الآن</button>
        <button id="stopQRBtn" class="btn btn-danger" style="width:auto;"><i class="fas fa-stop"></i> إيقاف تحديث QR</button>
      </div>
      <div class="session-status">
        <span class="session-indicator unknown" id="sessionIndicator"></span>
        <span id="sessionStatusText" style="font-weight:bold;">غير معروف</span>
        <span style="color:var(--text-muted); margin-right:auto;">آخر تحديث: <span id="sessionLastUpdate">-</span></span>
      </div>
      <div id="sessionQRContainer" style="display:none;" class="qr-container">
        <img id="sessionQRImage" src="" alt="QR Code" />
        <div style="font-size:12px; color:var(--text-muted); margin-top:8px;">امسح الرمز لتسجيل الدخول</div>
      </div>
      <div id="sessionStatus" class="status"></div>
    </div>
  \`;
}

async function checkSession() {
  const statusText = document.getElementById('sessionStatusText');
  const indicator = document.getElementById('sessionIndicator');
  const qrContainer = document.getElementById('sessionQRContainer');
  const lastUpdate = document.getElementById('sessionLastUpdate');
  const statusEl = document.getElementById('sessionStatus');

  statusEl.textContent = 'جاري التحقق...';
  statusEl.className = 'status';

  try {
    // جلب حالة الجلسة
    const res = await fetch('/api/live/status', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);

    const status = data.status;
    const statusMap = {
      'connected': { label: '🟢 متصل', class: 'connected' },
      'waiting_scan': { label: '🟡 في انتظار المسح', class: 'waiting' },
      'starting': { label: '🟡 جاري التشغيل', class: 'waiting' },
      'disconnected': { label: '🔴 غير متصل', class: 'disconnected' }
    };
    const info = statusMap[status] || { label: '⚪ غير معروف', class: 'unknown' };
    statusText.textContent = info.label;
    indicator.className = 'session-indicator ' + info.class;

    lastUpdate.textContent = new Date().toLocaleTimeString();

    // إذا كانت الحالة غير متصلة أو في انتظار المسح، نجلب QR
    if (status === 'waiting_scan' || status === 'disconnected' || status === 'starting') {
      await fetchQR();
      // نبدأ تحديث QR كل 2 ثانية
      if (!sessionQRInterval) {
        sessionQRInterval = setInterval(fetchQR, 2000);
      }
    } else {
      qrContainer.style.display = 'none';
      if (sessionQRInterval) {
        clearInterval(sessionQRInterval);
        sessionQRInterval = null;
      }
    }

    statusEl.textContent = '✓ تم التحقق';
    statusEl.className = 'status ok';
  } catch (e) {
    statusEl.textContent = 'خطأ: ' + e.message;
    statusEl.className = 'status err';
    showToast('فشل التحقق من الجلسة', 'error');
  }
}

async function fetchQR() {
  try {
    const res = await fetch('/api/live/qr', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok && data.qr) {
      const img = document.getElementById('sessionQRImage');
      img.src = data.qr;
      document.getElementById('sessionQRContainer').style.display = 'block';
    }
  } catch (e) {}
}

function stopQRUpdate() {
  if (sessionQRInterval) {
    clearInterval(sessionQRInterval);
    sessionQRInterval = null;
    showToast('تم إيقاف تحديث QR', 'info');
  }
}

function initSession() {
  checkSession();
  document.getElementById('checkSessionBtn').addEventListener('click', checkSession);
  document.getElementById('stopQRBtn').addEventListener('click', stopQRUpdate);
  // إيقاف التحديث عند مغادرة الصفحة
  window.addEventListener('hashchange', () => {
    if (window.location.hash !== '#session') {
      stopQRUpdate();
    }
  });
}

// ----- التوجيه (Router) -----
const routes = {
  'login': { render: renderLoginPage, init: initLogin },
  'dashboard': { render: renderDashboard, init: initDashboard },
  'contacts': { render: renderContacts, init: initContacts },
  'messages': { render: renderMessages, init: initMessages },
  'sender': { render: renderSender, init: initSender },
  'schedule': { render: renderSchedule, init: initSchedule },
  'stats': { render: renderStats, init: initStats },
  'logs': { render: renderLogs, init: initLogs },
  'images': { render: renderImages, init: initImages },
  'session': { render: renderSession, init: initSession }
};

function navigate(hash) {
  const page = hash.replace('#', '') || 'dashboard';
  const main = document.getElementById('pageContent');
  if (!main) return;

  if (page !== 'login' && !isLoggedIn()) {
    window.location.hash = '#login';
    return;
  }

  const route = routes[page];
  if (!route) {
    main.innerHTML = '<h2 style="text-align:center;color:var(--text-muted);">الصفحة غير موجودة</h2>';
    return;
  }

  main.innerHTML = route.render();
  if (route.init) route.init();

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + page);
  });
}

// ----- تهيئة التطبيق -----
function initApp() {
  const app = document.getElementById('app');
  if (app) {
    app.innerHTML = renderLayout();
    initLayout();
    window.addEventListener('hashchange', () => navigate(window.location.hash));
    navigate(window.location.hash || '#dashboard');
    if (isLoggedIn()) {
      showToast('مرحباً بك في لوحة التحكم', 'success');
    }
  }
}

document.addEventListener('DOMContentLoaded', initApp);
</script>
</body>
</html>
`;
