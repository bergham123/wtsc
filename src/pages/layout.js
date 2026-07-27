export function layout(content, activePage) {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>مدير واتساب</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
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
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Tajawal', sans-serif;
    background: var(--bg-main);
    color: var(--text-main);
    min-height: 100vh;
  }
  .navbar {
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    padding: 12px 24px;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 16px;
  }
  .navbar .logo {
    display: flex;
    align-items: center;
    gap: 8px;
    font-weight: 800;
    font-size: 18px;
    color: var(--text-main);
  }
  .navbar .logo i {
    color: var(--accent);
  }
  .navbar .nav-links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    margin-right: auto;
  }
  .navbar .nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    padding: 6px 14px;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.2s;
  }
  .navbar .nav-links a:hover {
    background: var(--input-bg);
    color: var(--text-main);
  }
  .navbar .nav-links a.active {
    background: var(--accent);
    color: #111B21;
    font-weight: 700;
  }
  .container {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 20px;
    transition: border-color 0.3s ease;
  }
  .card:hover { border-color: rgba(37, 211, 102, 0.4); }
  .card-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
  }
  .card-header i { font-size: 18px; color: var(--accent); }
  .card-header h2 { font-size: 16px; font-weight: 700; }
  .card-hint { color: var(--text-muted); font-size: 12px; margin-bottom: 16px; }
  .btn {
    background: var(--input-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    padding: 10px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
  }
  .btn:hover { background: var(--border-color); }
  .btn-primary { background: var(--accent); color: #111B21; border: none; font-weight: 700; }
  .btn-primary:hover { background: #1FB855; box-shadow: 0 4px 12px var(--accent-glow); }
  .btn-warning { background: var(--warning); border: none; color: #111B21; font-weight: 700; }
  .btn-danger { background: var(--danger); border: none; color: #111B21; font-weight: 700; }
  .btn-sm { padding: 4px 10px; font-size: 12px; }
  .status {
    margin-top: 10px;
    font-size: 12px;
    min-height: 18px;
    color: var(--text-muted);
    text-align: center;
  }
  .status.ok { color: var(--success); }
  .status.err { color: var(--danger); }
  textarea {
    width: 100%;
    min-height: 120px;
    background: var(--input-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 12px;
    font-family: 'Consolas', monospace;
    font-size: 13px;
    resize: vertical;
    direction: ltr;
    text-align: left;
  }
  textarea:focus { outline: none; border-color: var(--accent); }
  .btn-row { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  th, td {
    padding: 10px;
    border-bottom: 1px solid var(--border-color);
    text-align: right;
  }
  th {
    color: var(--text-muted);
    font-weight: 500;
  }
  .modal-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.85);
    backdrop-filter: blur(8px);
    z-index: 999;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }
  .modal-overlay.active { display: flex; }
  .modal {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    max-width: 500px;
    width: 100%;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  .modal input, .modal select {
    width: 100%;
    padding: 8px;
    background: var(--input-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: 6px;
    font-family: 'Tajawal';
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
  .image-item .delete-btn {
    position: absolute;
    top: 4px;
    right: 4px;
    background: var(--danger);
    border: none;
    color: white;
    border-radius: 50%;
    width: 24px;
    height: 24px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 11px;
    box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }
  #imageList { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 12px; }
  .schedule-status { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-block; margin-bottom: 10px; }
  .schedule-status.active { background: rgba(37, 211, 102, 0.15); color: var(--success); border: 1px solid rgba(37, 211, 102, 0.3); }
  .schedule-status.inactive { background: rgba(241, 92, 109, 0.15); color: var(--danger); border: 1px solid rgba(241, 92, 109, 0.3); }
  .log-files-list { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px; }
  .log-file-btn { background: var(--input-bg); border: 1px solid var(--border-color); color: var(--text-main); padding: 6px 12px; border-radius: 6px; cursor: pointer; transition: all 0.2s; }
  .log-file-btn:hover { background: var(--border-color); }
  .log-file-btn.active { background: var(--accent); border-color: var(--accent); color: #111B21; font-weight: 700; }
  .log-content { background: var(--bg-main); border-radius: 8px; padding: 16px; max-height: 300px; overflow-y: auto; font-family: 'Consolas', monospace; font-size: 13px; border: 1px solid var(--border-color); white-space: pre-wrap; }
  .inline-status { display: inline-block; width: 12px; height: 12px; border-radius: 50%; margin-left: 6px; }
  .inline-status.on { background: var(--success); }
  .inline-status.off { background: var(--danger); }
  .inline-status.warn { background: var(--warning); }
  @media (max-width: 768px) {
    .navbar .nav-links { margin-right: 0; width: 100%; justify-content: center; }
    .container { padding: 12px; }
  }
</style>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
  <nav class="navbar">
    <div class="logo"><i class="fab fa-whatsapp"></i> مدير واتساب</div>
    <div class="nav-links">
      <a href="/" class="${activePage === 'stats' ? 'active' : ''}"><i class="fas fa-chart-line"></i> الإحصائيات</a>
      <a href="/schedule" class="${activePage === 'schedule' ? 'active' : ''}"><i class="fas fa-clock"></i> الجدولة</a>
      <a href="/messages" class="${activePage === 'messages' ? 'active' : ''}"><i class="fas fa-comment-dots"></i> الرسائل</a>
      <a href="/images" class="${activePage === 'images' ? 'active' : ''}"><i class="fas fa-images"></i> الصور</a>
      <a href="/contacts" class="${activePage === 'contacts' ? 'active' : ''}"><i class="fas fa-address-book"></i> جهات الاتصال</a>
    </div>
  </nav>
  <div class="container">
    ${content}
  </div>
  <script>
    // دالة مساعدة للـ fetch مع API key
    function getHeaders() {
      return {
        'Content-Type': 'application/json',
        'X-API-Key': window.API_SECRET || ''
      };
    }
    function setStatus(el, msg, type) {
      el.textContent = msg;
      el.className = "status" + (type ? " " + type : "");
    }
    // دالة لتحميل ملف معين (messages, contacts, images, mycontacts)
    async function loadFile(type, areaEl, statusEl) {
      setStatus(statusEl, "جاري التحميل...", "");
      try {
        const res = await fetch("/api/load?type=" + type);
        const data = await res.json();
        if (!data.ok) throw new Error(data.error);
        areaEl.value = data.text;
        setStatus(statusEl, "تم التحميل ✓", "ok");
      } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
    }
    async function saveFile(type, areaEl, statusEl) {
      setStatus(statusEl, "جاري الحفظ...", "");
      try {
        const res = await fetch("/api/save", {
          method: "POST",
          headers: getHeaders(),
          body: JSON.stringify({ type, text: areaEl.value })
        });
        const data = await res.json();
        if (!data.ok) throw new Error(data.error);
        setStatus(statusEl, "تم الحفظ ✓", "ok");
      } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
    }
  </script>
</body>
</html>`;
}
