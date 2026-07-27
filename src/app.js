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

  /* Progress bar */
  .progress-container {
    margin: 16px 0;
    background: var(--input-bg);
    border-radius: 8px;
    overflow: hidden;
    height: 24px;
    position: relative;
  }
  .progress-bar {
    height: 100%;
    background: var(--accent);
    width: 0%;
    transition: width 0.5s ease;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13px;
    font-weight: bold;
    color: #111B21;
  }

  .qr-container {
    text-align: center;
    padding: 20px;
  }
  .qr-container img { max-width: 250px; border-radius: 8px; border: 1px solid var(--border-color); }

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

// ----- نظام تسجيل الدخول -----
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
        <a href="#send" class="nav-link"><i class="fas fa-paper-plane"></i> الإرسال</a>
        <a href="#schedule" class="nav-link"><i class="fas fa-clock"></i> الجدولة</a>
        <a href="#stats" class="nav-link"><i class="fas fa-chart-bar"></i> الإحصائيات</a>
        <a href="#logs" class="nav-link"><i class="fas fa-terminal"></i> السجلات</a>
        <a href="#images" class="nav-link"><i class="fas fa-images"></i> الصور</a>
        <a href="#session" class="nav-link"><i class="fas fa-mobile-alt"></i> الجلسة</a>
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

// ----- صفحة الرئيسية (Dashboard) - بدون تغيير -----
function renderDashboard() { ... } // محذوف للاختصار، نفس السابق
async function initDashboard() { ... } // محذوف

// ----- صفحة جهات الاتصال (تستخدم mylist.json) -----
let contactsData = [];
let filteredData = [];

function renderContacts() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-address-book"></i> جهات الاتصال</h1>
      <p style="color:var(--text-muted);">إدارة جهات الاتصال من mylist.json (الاسم، النوع، الرقم، العمر)</p>
    </div>
    <div class="card">
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px; align-items:center;">
        <input type="text" id="contactsFilter" placeholder="فلترة..." style="flex:1; min-width:200px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:6px; padding:10px 14px; font-family:'Tajawal';" />
        <button id="addContactBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-plus"></i> إضافة</button>
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

async function loadContacts() {
  try {
    // استخدام endpoint خاص بـ mylist.json
    const res = await fetch('/api/mylist', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    contactsData = data.data || [];
    renderContactsTable();
    showToast('تم تحميل البيانات', 'success');
  } catch (e) {
    showToast('خطأ في التحميل: ' + e.message, 'error');
  }
}

function renderContactsTable() {
  const filter = document.getElementById('contactsFilter')?.value?.trim().toLowerCase() || '';
  filteredData = contactsData.filter(row => Object.values(row).some(val => String(val).toLowerCase().includes(filter)));
  document.getElementById('filteredCount').textContent = filteredData.length + ' صف';

  const tbody = document.getElementById('contactsTableBody');
  if (filteredData.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">لا توجد بيانات</td></tr>';
    return;
  }
  tbody.innerHTML = filteredData.map((row, idx) => {
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

function initContacts() {
  loadContacts();
  document.getElementById('contactsFilter').addEventListener('input', renderContactsTable);
  document.getElementById('addContactBtn').addEventListener('click', () => {
    contactsData.push({ name: '', gender: '', number: '', age: '' });
    renderContactsTable();
    showToast('تمت الإضافة (لم يحفظ بعد)', 'info');
  });
  document.getElementById('saveContactsBtn').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/mylist', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ data: contactsData })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast('تم حفظ التغييرات بنجاح ✓', 'success');
    } catch (e) {
      showToast('خطأ في الحفظ: ' + e.message, 'error');
    }
  });
  document.getElementById('copyNumbersBtn').addEventListener('click', async () => {
    const numbers = filteredData.map(row => row.number).filter(Boolean);
    if (numbers.length === 0) { showToast('لا توجد أرقام للنسخ', 'warning'); return; }
    try {
      await copyToClipboard(numbers.join('\\n'));
      showToast('تم نسخ ' + numbers.length + ' رقم', 'success');
    } catch (e) {
      showToast('فشل النسخ', 'error');
    }
  });
}

// ----- صفحة الإرسال (Send) -----
let messagesText = '';
let accountsNumbers = [];

function renderSend() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-paper-plane"></i> الإرسال</h1>
      <p style="color:var(--text-muted);">إدارة الرسائل والأرقام وتشغيل الـ Workflow</p>
    </div>
    <div class="card">
      <div class="card-header"><i class="fas fa-comment-dots"></i><h2>الرسائل (messages.json)</h2></div>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:8px;">كل رسالة في سطر</p>
      <textarea id="messagesArea" style="width:100%; min-height:120px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:8px; padding:12px; font-family:'Consolas',monospace; font-size:13px; resize:vertical; direction:ltr; text-align:left;"></textarea>
      <div class="btn-row" style="margin-top:10px;">
        <button id="loadMessagesBtn" class="btn" style="width:auto;"><i class="fas fa-download"></i> تحميل</button>
        <button id="saveMessagesBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-save"></i> حفظ</button>
      </div>
      <div id="messagesStatus" class="status"></div>
    </div>

    <div class="card">
      <div class="card-header"><i class="fas fa-phone"></i><h2>الأرقام (accounts.json)</h2></div>
      <p style="color:var(--text-muted); font-size:13px; margin-bottom:8px;">كل رقم في سطر</p>
      <textarea id="accountsArea" style="width:100%; min-height:120px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:8px; padding:12px; font-family:'Consolas',monospace; font-size:13px; resize:vertical; direction:ltr; text-align:left;"></textarea>
      <div class="btn-row" style="margin-top:10px;">
        <button id="loadAccountsBtn" class="btn" style="width:auto;"><i class="fas fa-download"></i> تحميل</button>
        <button id="saveAccountsBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-save"></i> حفظ</button>
      </div>
      <div id="accountsStatus" class="status"></div>
    </div>

    <div class="card">
      <div class="card-header"><i class="fas fa-play"></i><h2>تشغيل الـ Workflow</h2></div>
      <div class="btn-row">
        <button id="runWorkflowBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-play"></i> تشغيل</button>
        <button id="stopWorkflowBtn" class="btn btn-danger" style="width:auto;"><i class="fas fa-stop"></i> إيقاف</button>
      </div>
      <div id="workflowProgress" style="margin-top:12px;">
        <div style="display:flex; justify-content:space-between; font-size:13px; color:var(--text-muted);">
          <span id="progressLabel">0 / 0</span>
          <span id="timeEstimate">الوقت المتوقع: -</span>
        </div>
        <div class="progress-container">
          <div id="progressBar" class="progress-bar" style="width:0%;">0%</div>
        </div>
      </div>
      <div id="workflowStatus" class="status"></div>
    </div>
  \`;
}

async function loadMessages() {
  try {
    const res = await fetch('/api/load?type=messages', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    document.getElementById('messagesArea').value = data.text || '';
    showToast('تم تحميل الرسائل', 'success');
  } catch (e) {
    showToast('خطأ في تحميل الرسائل: ' + e.message, 'error');
  }
}

async function saveMessages() {
  const text = document.getElementById('messagesArea').value;
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type: 'messages', text })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    showToast('تم حفظ الرسائل ✓', 'success');
  } catch (e) {
    showToast('خطأ في حفظ الرسائل: ' + e.message, 'error');
  }
}

async function loadAccounts() {
  try {
    const res = await fetch('/api/load?type=contacts', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    document.getElementById('accountsArea').value = data.text || '';
    showToast('تم تحميل الأرقام', 'success');
  } catch (e) {
    showToast('خطأ في تحميل الأرقام: ' + e.message, 'error');
  }
}

async function saveAccounts() {
  const text = document.getElementById('accountsArea').value;
  try {
    const res = await fetch('/api/save', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({ type: 'contacts', text })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    showToast('تم حفظ الأرقام ✓', 'success');
  } catch (e) {
    showToast('خطأ في حفظ الأرقام: ' + e.message, 'error');
  }
}

// دالة حساب الوقت المتوقع
function updateProgress(count) {
  const total = document.getElementById('accountsArea').value.split('\\n').filter(l => l.trim()).length;
  const progressBar = document.getElementById('progressBar');
  const progressLabel = document.getElementById('progressLabel');
  const timeEstimate = document.getElementById('timeEstimate');

  if (total === 0) {
    progressBar.style.width = '0%';
    progressBar.textContent = '0%';
    progressLabel.textContent = '0 / 0';
    timeEstimate.textContent = 'الوقت المتوقع: -';
    return;
  }

  const percent = Math.min((count / total) * 100, 100);
  progressBar.style.width = percent + '%';
  progressBar.textContent = Math.round(percent) + '%';
  progressLabel.textContent = count + ' / ' + total;

  // حساب الوقت المتبقي: متوسط 30 ثانية لكل رقم
  const remaining = total - count;
  const estimatedSeconds = remaining * 30;
  if (estimatedSeconds > 0) {
    const minutes = Math.floor(estimatedSeconds / 60);
    const seconds = Math.round(estimatedSeconds % 60);
    timeEstimate.textContent = 'الوقت المتبقي: ' + (minutes > 0 ? minutes + ' دقيقة ' : '') + seconds + ' ثانية';
  } else {
    timeEstimate.textContent = 'الوقت المتوقع: اكتمل!';
  }
}

// محاكاة تقدم (سيتم استدعاؤها عند تشغيل الـ workflow)
let progressInterval = null;
let currentProgress = 0;

function startProgressSimulation() {
  const total = document.getElementById('accountsArea').value.split('\\n').filter(l => l.trim()).length;
  if (total === 0) {
    showToast('لا توجد أرقام للإرسال', 'warning');
    return;
  }
  currentProgress = 0;
  updateProgress(0);
  // محاكاة تقدم عشوائي (للعرض فقط، في الواقع سيتم تحديثه من الخادم)
  if (progressInterval) clearInterval(progressInterval);
  progressInterval = setInterval(() => {
    if (currentProgress < total) {
      currentProgress += Math.floor(Math.random() * 3) + 1;
      if (currentProgress > total) currentProgress = total;
      updateProgress(currentProgress);
    } else {
      clearInterval(progressInterval);
      progressInterval = null;
    }
  }, 2000);
}

function stopProgressSimulation() {
  if (progressInterval) {
    clearInterval(progressInterval);
    progressInterval = null;
  }
  // إعادة تعيين التقدم إلى 0
  currentProgress = 0;
  updateProgress(0);
}

async function runWorkflow() {
  const statusEl = document.getElementById('workflowStatus');
  statusEl.textContent = 'جاري التشغيل...';
  statusEl.className = 'status';
  startProgressSimulation();
  try {
    const res = await fetch('/api/run-workflow', {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    statusEl.textContent = 'تم التشغيل ✓';
    statusEl.className = 'status ok';
    showToast('تم تشغيل الـ Workflow بنجاح', 'success');
    // بعد فترة، نكمل التقدم إلى 100%
    setTimeout(() => {
      const total = document.getElementById('accountsArea').value.split('\\n').filter(l => l.trim()).length;
      currentProgress = total;
      updateProgress(total);
      if (progressInterval) clearInterval(progressInterval);
    }, 5000);
  } catch (err) {
    statusEl.textContent = 'خطأ: ' + err.message;
    statusEl.className = 'status err';
    showToast('فشل التشغيل: ' + err.message, 'error');
    stopProgressSimulation();
  }
}

async function stopWorkflow() {
  const statusEl = document.getElementById('workflowStatus');
  statusEl.textContent = 'جاري الإيقاف...';
  statusEl.className = 'status';
  try {
    const res = await fetch('/api/stop-workflow', {
      method: 'POST',
      headers: getHeaders()
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    statusEl.textContent = 'تم الإيقاف ✓';
    statusEl.className = 'status ok';
    showToast('تم إيقاف الـ Workflow', 'success');
    stopProgressSimulation();
  } catch (err) {
    statusEl.textContent = 'خطأ: ' + err.message;
    statusEl.className = 'status err';
    showToast('فشل الإيقاف: ' + err.message, 'error');
  }
}

function initSend() {
  // تحميل الرسائل والأرقام
  loadMessages();
  loadAccounts();

  document.getElementById('loadMessagesBtn').addEventListener('click', loadMessages);
  document.getElementById('saveMessagesBtn').addEventListener('click', saveMessages);
  document.getElementById('loadAccountsBtn').addEventListener('click', loadAccounts);
  document.getElementById('saveAccountsBtn').addEventListener('click', saveAccounts);

  document.getElementById('runWorkflowBtn').addEventListener('click', runWorkflow);
  document.getElementById('stopWorkflowBtn').addEventListener('click', stopWorkflow);
}

// ----- صفحة الجلسة (Session) -----
let sessionPollInterval = null;

function renderSession() {
  return \`
    <div class="page-header">
      <h1><i class="fas fa-mobile-alt"></i> الجلسة</h1>
      <p style="color:var(--text-muted);">التحقق من حالة جلسة WhatsApp وعرض QR Code</p>
    </div>
    <div class="card">
      <div style="display:flex; align-items:center; gap:16px; margin-bottom:16px; flex-wrap:wrap;">
        <span id="sessionIndicator" style="display:inline-block; width:16px; height:16px; border-radius:50%; background:gray;"></span>
        <span id="sessionStatusText" style="font-size:18px; font-weight:bold;">غير معروف</span>
        <button id="refreshSessionBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-sync"></i> تحديث</button>
      </div>
      <div id="qrContainer" class="qr-container" style="display:none;">
        <img id="qrImage" src="" alt="QR Code" />
        <p style="color:var(--text-muted); margin-top:8px;">امسح الرمز لتسجيل الدخول</p>
      </div>
      <div id="sessionStatus" class="status"></div>
    </div>
  \`;
}

async function checkSession() {
  try {
    const res = await fetch('/api/live/status', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    const status = data.status;
    const indicator = document.getElementById('sessionIndicator');
    const text = document.getElementById('sessionStatusText');
    const qrContainer = document.getElementById('qrContainer');
    const qrImage = document.getElementById('qrImage');

    const statusMap = {
      'connected': { color: 'var(--success)', label: '🟢 متصل' },
      'waiting_scan': { color: 'var(--warning)', label: '🟡 في انتظار المسح' },
      'starting': { color: 'var(--warning)', label: '🟡 جاري التشغيل' },
      'disconnected': { color: 'var(--danger)', label: '🔴 غير متصل' },
      'null': { color: 'gray', label: '⚪ غير معروف' }
    };
    const info = statusMap[status] || { color: 'gray', label: 'غير معروف' };
    indicator.style.background = info.color;
    text.textContent = info.label;

    if (status === 'waiting_scan' || status === 'disconnected') {
      // جلب QR
      try {
        const qrRes = await fetch('/api/live/qr', { headers: getHeaders() });
        const qrData = await qrRes.json();
        if (qrData.ok && qrData.qr) {
          qrImage.src = qrData.qr;
          qrContainer.style.display = 'block';
        } else {
          qrContainer.style.display = 'none';
        }
      } catch (e) {
        qrContainer.style.display = 'none';
      }
    } else {
      qrContainer.style.display = 'none';
      // إذا كانت متصلة، نوقف الـ QR
    }
    document.getElementById('sessionStatus').textContent = '✓ تم التحديث';
    document.getElementById('sessionStatus').className = 'status ok';
  } catch (e) {
    document.getElementById('sessionStatus').textContent = 'خطأ: ' + e.message;
    document.getElementById('sessionStatus').className = 'status err';
  }
}

function initSession() {
  checkSession();
  document.getElementById('refreshSessionBtn').addEventListener('click', checkSession);
  // تحديث تلقائي كل 10 ثواني
  if (sessionPollInterval) clearInterval(sessionPollInterval);
  sessionPollInterval = setInterval(checkSession, 10000);
}

// ----- باقي الصفحات (schedule, stats, logs, images) كما هي (محذوفة للاختصار) -----
// ... (سيتم إعادة استخدامها من الكود السابق)

// ----- التوجيه (Router) -----
const routes = {
  'login': { render: renderLoginPage, init: initLogin },
  'dashboard': { render: renderDashboard, init: initDashboard },
  'contacts': { render: renderContacts, init: initContacts },
  'send': { render: renderSend, init: initSend },
  'schedule': { render: renderSchedule, init: initSchedule },
  'stats': { render: renderStats, init: initStats },
  'logs': { render: renderLogs, init: initLogs },
  'images': { render: renderImages, init: initImages },
  'session': { render: renderSession, init: initSession },
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
