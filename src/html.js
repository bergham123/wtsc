export const HTML_PAGE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>WhatsApp Manager Dashboard</title>
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
    --blue: #53A8E2;
    --blue-glow: rgba(83, 168, 226, 0.2);
    --purple: #A371E0;
    --purple-glow: rgba(163, 113, 224, 0.2);
    --orange: #FF8C42;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Tajawal', sans-serif;
    background: var(--bg-main);
    color: var(--text-main);
    min-height: 100vh;
    display: flex;
  }
  .sidebar {
    width: 300px; background: var(--card-bg); height: 100vh;
    position: sticky; top: 0; display: flex; flex-direction: column;
    padding: 24px; border-left: 1px solid var(--border-color);
    flex-shrink: 0; overflow-y: auto;
  }
  .sidebar-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 24px; padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
  }
  .logo-icon {
    width: 40px; height: 40px; background: var(--accent);
    border-radius: 10px; display: flex; align-items: center;
    justify-content: center; font-size: 20px; color: #111B21;
  }
  .logo-text { font-size: 18px; font-weight: 800; }
  .logo-text span { color: var(--accent); }
  .nav-cards { display: flex; flex-direction: column; gap: 14px; flex-grow: 1; }
  .sidebar-card {
    background: var(--bg-main); border: 1px solid var(--border-color);
    border-radius: 10px; padding: 16px; transition: border-color 0.3s;
  }
  .sidebar-card:hover { border-color: var(--accent); }
  .main-content {
    flex: 1; padding: 30px; display: flex; flex-direction: column;
    gap: 24px; max-width: calc(100% - 300px); width: 100%;
  }
  .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width: 1024px) {
    body { flex-direction: column; }
    .sidebar { width: 100%; height: auto; position: relative; border-left: none; border-bottom: 1px solid var(--border-color); }
    .main-content { max-width: 100%; padding: 20px; }
    .content-grid { grid-template-columns: 1fr; }
  }
  .card {
    background: var(--card-bg); border: 1px solid var(--border-color);
    border-radius: 12px; padding: 24px; transition: border-color 0.3s;
  }
  .card:hover { border-color: rgba(37, 211, 102, 0.4); }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .card-header i { font-size: 18px; color: var(--accent); }
  .card-header h2 { font-size: 16px; font-weight: 700; }
  .card-hint { color: var(--text-muted); font-size: 12px; margin-bottom: 16px; }
  textarea {
    width: 100%; min-height: 140px; background: var(--input-bg);
    color: var(--text-main); border: 1px solid var(--border-color);
    border-radius: 8px; padding: 12px; font-family: 'Consolas', monospace;
    font-size: 13px; resize: vertical; direction: ltr; text-align: left;
  }
  textarea:focus { outline: none; border-color: var(--accent); }
  .btn-row { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
  .btn {
    background: var(--input-bg); color: var(--text-main);
    border: 1px solid var(--border-color); padding: 10px 16px;
    border-radius: 8px; cursor: pointer; font-family: 'Tajawal', sans-serif;
    font-size: 13px; font-weight: 500; transition: all 0.2s;
    display: inline-flex; align-items: center; gap: 8px;
    width: 100%; justify-content: center;
  }
  .btn:hover { background: var(--border-color); }
  .btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .btn-primary { background: var(--accent); color: #111B21; border: none; font-weight: 700; }
  .btn-primary:hover { background: #1FB855; box-shadow: 0 4px 12px var(--accent-glow); }
  .btn-warning { background: var(--warning); border: none; color: #111B21; font-weight: 700; }
  .btn-danger { background: var(--danger); border: none; color: #111B21; font-weight: 700; }
  .btn-danger:hover { background: #c0392b; }
  .btn-blue { background: var(--blue); border: none; color: #111B21; font-weight: 700; }
  .btn-blue:hover { background: #3d8ec4; box-shadow: 0 4px 12px var(--blue-glow); }
  .btn-purple { background: var(--purple); border: none; color: #fff; font-weight: 700; }
  .btn-purple:hover { background: #8b5cc7; box-shadow: 0 4px 12px var(--purple-glow); }
  .btn-orange { background: var(--orange); border: none; color: #111B21; font-weight: 700; }
  .btn-sm { padding: 6px 10px; font-size: 12px; width: auto; }
  .status { margin-top: 10px; font-size: 12px; min-height: 18px; color: var(--text-muted); text-align: center; }
  .status.ok { color: var(--success); }
  .status.err { color: var(--danger); }
  .schedule-status { padding: 4px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; display: inline-block; margin-bottom: 10px; }
  .schedule-status.active { background: rgba(37, 211, 102, 0.15); color: var(--success); border: 1px solid rgba(37, 211, 102, 0.3); }
  .schedule-status.inactive { background: rgba(241, 92, 109, 0.15); color: var(--danger); border: 1px solid rgba(241, 92, 109, 0.3); }
  .schedule-inputs { display: flex; gap: 12px; margin-bottom: 12px; justify-content: center; }
  .schedule-inputs label { display: flex; flex-direction: column; gap: 5px; font-size: 12px; color: var(--text-muted); align-items: center; }
  .schedule-inputs input {
    width: 70px; background: var(--input-bg); color: var(--text-main);
    border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; text-align: center;
    font-family: 'Tajawal'; font-size: 16px;
  }
  .stats-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
  .stats-table th { text-align: right; padding: 12px; background: var(--input-bg); color: var(--text-muted); border-bottom: 1px solid var(--border-color); font-weight: 500; }
  .stats-table td { padding: 12px; border-bottom: 1px solid var(--border-color); color: var(--text-main); }
  .stats-table tr:last-child td { border-bottom: none; }
  .modal-overlay {
    display: none; position: fixed; inset: 0;
    background: rgba(0,0,0,0.85); backdrop-filter: blur(8px);
    z-index: 999; align-items: center; justify-content: center; padding: 20px;
  }
  .modal-overlay.active { display: flex; }
  .modal {
    background: var(--card-bg); border: 1px solid var(--border-color);
    border-radius: 12px; max-width: 900px; width: 100%; max-height: 80vh;
    padding: 24px; display: flex; flex-direction: column; gap: 16px;
  }
  .log-files-list { display: flex; gap: 10px; flex-wrap: wrap; }
  .log-file-btn { background: var(--input-bg); border: 1px solid var(--border-color); color: var(--text-main); padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: all 0.2s; }
  .log-file-btn:hover { background: var(--border-color); }
  .log-file-btn.active { background: var(--accent); border-color: var(--accent); color: #111B21; font-weight: 700; }
  .log-content { background: var(--bg-main); border-radius: 8px; padding: 16px; overflow-y: auto; font-family: 'Consolas', monospace; font-size: 13px; flex-grow: 1; border: 1px solid var(--border-color); }
  .image-item { position: relative; width: 90px; height: 90px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); flex-shrink: 0; }
  .image-item img { width: 100%; height: 100%; object-fit: cover; }
  .image-item .delete-btn {
    position: absolute; top: 4px; right: 4px; background: var(--danger);
    border: none; color: white; border-radius: 50%; width: 24px; height: 24px;
    cursor: pointer; display: flex; align-items: center; justify-content: center;
    font-size: 11px; box-shadow: 0 2px 8px rgba(0,0,0,0.5);
  }
  #imageGallery { margin-top: 16px; }
  #imageList { display: flex; flex-wrap: wrap; gap: 12px; }
  .running-indicator { display: inline-flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 20px; margin-top: 8px; }
  .running-indicator.active { background: rgba(37,211,102,0.15); color: var(--success); }
  .running-indicator.idle { background: rgba(134,150,160,0.15); color: var(--text-muted); }
  .running-indicator .dot { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
  .running-indicator.active .dot { animation: pulse 1.2s ease-in-out infinite; }
  @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.7); } }

  /* ===== Mylist Styles ===== */
  .mylist-add-row {
    display: flex; gap: 10px; flex-wrap: wrap; align-items: flex-end;
    background: var(--bg-main); padding: 14px; border-radius: 8px;
    border: 1px solid var(--border-color); margin-bottom: 14px;
  }
  .mylist-add-row label { display: flex; flex-direction: column; gap: 4px; font-size: 11px; color: var(--text-muted); flex: 1; min-width: 100px; }
  .mylist-add-row input, .mylist-add-row select {
    background: var(--input-bg); color: var(--text-main);
    border: 1px solid var(--border-color); border-radius: 6px;
    padding: 8px 10px; font-family: 'Tajawal'; font-size: 13px; width: 100%;
  }
  .mylist-add-row input:focus, .mylist-add-row select:focus { outline: none; border-color: var(--accent); }
  .mylist-filters {
    display: flex; gap: 10px; flex-wrap: wrap; align-items: center; margin-bottom: 14px;
  }
  .mylist-filters select, .mylist-filters input {
    background: var(--input-bg); color: var(--text-main);
    border: 1px solid var(--border-color); border-radius: 6px;
    padding: 7px 10px; font-family: 'Tajawal'; font-size: 12px;
  }
  .mylist-filters select:focus, .mylist-filters input:focus { outline: none; border-color: var(--accent); }
  .mylist-filters input { width: 65px; text-align: center; }
  .mylist-table-wrapper { max-height: 350px; overflow-y: auto; border-radius: 8px; border: 1px solid var(--border-color); margin-bottom: 14px; }
  .mylist-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .mylist-table th {
    text-align: right; padding: 10px 12px; background: var(--input-bg);
    color: var(--text-muted); border-bottom: 1px solid var(--border-color);
    position: sticky; top: 0; z-index: 2; font-weight: 500; font-size: 12px;
  }
  .mylist-table td { padding: 8px 12px; border-bottom: 1px solid var(--border-color); }
  .mylist-table tr:last-child td { border-bottom: none; }
  .mylist-table tr:hover td { background: rgba(37, 211, 102, 0.05); }
  .mylist-table .edit-input {
    background: var(--bg-main); color: var(--text-main);
    border: 1px solid var(--accent); border-radius: 4px;
    padding: 4px 8px; font-family: 'Tajawal'; font-size: 12px; width: 100%;
  }
  .mylist-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px; }
  .mylist-footer span { font-size: 13px; color: var(--text-muted); }
  .gender-badge {
    display: inline-block; padding: 2px 10px; border-radius: 12px;
    font-size: 11px; font-weight: 700;
  }
  .gender-badge.male { background: rgba(83,168,226,0.15); color: var(--blue); }
  .gender-badge.female { background: rgba(163,113,224,0.15); color: var(--purple); }
  .gender-badge.unknown { background: rgba(134,150,160,0.15); color: var(--text-muted); }
</style>
</head>
<body>

  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo-icon"><i class="fab fa-whatsapp"></i></div>
      <div class="logo-text">مدير <span>واتساب</span></div>
    </div>
    <div class="nav-cards">
      <div class="sidebar-card">
        <div class="card-header"><i class="fas fa-paper-plane" style="color:var(--blue)"></i><h2>إرسال الرسائل</h2></div>
        <div id="sendRunningIndicator" class="running-indicator idle"><span class="dot"></span> متوقف</div>
        <div class="btn-row" style="margin-top:10px;">
          <button class="btn btn-blue" id="sendRunBtn"><i class="fas fa-play"></i> إرسال الرسائل</button>
          <button class="btn btn-danger" id="sendStopBtn" disabled><i class="fas fa-stop"></i> إيقاف الإرسال</button>
        </div>
        <div class="status" id="sendStatus"></div>
      </div>
      <div class="sidebar-card">
        <div class="card-header"><i class="fas fa-robot" style="color:var(--purple)"></i><h2>الرد الذكي</h2></div>
        <div id="replyRunningIndicator" class="running-indicator idle"><span class="dot"></span> متوقف</div>
        <div class="btn-row" style="margin-top:10px;">
          <button class="btn btn-purple" id="replyRunBtn"><i class="fas fa-brain"></i> تفعيل الرد الذكي</button>
          <button class="btn btn-danger" id="replyStopBtn" disabled><i class="fas fa-stop"></i> إيقاف الرد الذكي</button>
        </div>
        <div class="status" id="replyStatus"></div>
      </div>
      <div class="sidebar-card">
        <div class="card-header"><i class="fas fa-terminal"></i><h2>السجلات</h2></div>
        <div class="btn-row" style="margin-top: 12px;">
          <button class="btn" id="viewLogsBtn"><i class="fas fa-folder-open"></i> عرض السجلات</button>
        </div>
        <div class="status" id="logsStatus"></div>
      </div>
      <div class="sidebar-card">
        <div class="card-header"><i class="fas fa-clock"></i><h2>الجدولة</h2></div>
        <div class="card-hint">وقت المغرب (-2 ساعة UTC)</div>
        <div>
          <span class="schedule-status inactive" id="scheduleIndicator">غير مفعل</span>
          <span id="currentCronDisplay" style="font-size:12px;color:var(--text-muted);display:block;margin-top:5px;"></span>
        </div>
        <div class="schedule-inputs">
          <label>الساعة<input type="number" id="hourInput" min="0" max="23" value="10" /></label>
          <label>الدقيقة<input type="number" id="minuteInput" min="0" max="59" value="0" /></label>
        </div>
        <div class="btn-row">
          <button class="btn" id="loadScheduleBtn"><i class="fas fa-history"></i> تحميل</button>
          <button class="btn btn-warning" id="updateScheduleBtn"><i class="fas fa-sync-alt"></i> تحديث</button>
        </div>
        <div class="status" id="scheduleStatus"></div>
      </div>
    </div>
  </aside>

  <main class="main-content">

    <!-- ===== قائمة الأرقام التفصيلية ===== -->
    <div class="card">
      <div class="card-header"><i class="fas fa-list-ol" style="color:var(--orange)"></i><h2>قائمة الأرقام التفصيلية</h2></div>
      <div class="card-hint">إدارة الأرقام مع العمر والجنس — data/mylist.json</div>

      <div class="mylist-add-row">
        <label>الرقم<input type="text" id="mylistNumber" placeholder="212600000000" /></label>
        <label>العمر<input type="number" id="mylistAge" placeholder="25" min="0" max="120" /></label>
        <label>الجنس
          <select id="mylistGender">
            <option value="ذكر">ذكر</option>
            <option value="أنثى">أنثى</option>
          </select>
        </label>
        <button class="btn btn-primary btn-sm" id="mylistAddBtn" style="width:auto;align-self:flex-end;margin-bottom:0;"><i class="fas fa-plus"></i> إضافة</button>
      </div>

      <div class="mylist-filters">
        <select id="mylistFilterGender">
          <option value="all">الجنس: الكل</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>
        <select id="mylistFilterAge">
          <option value="all">العمر: الكل</option>
          <option value="0-17">أقل من 18</option>
          <option value="18-25">18 - 25</option>
          <option value="25-35">25 - 35</option>
          <option value="35-45">35 - 45</option>
          <option value="46-200">أكثر من 45</option>
          <option value="custom">مخصص</option>
        </select>
        <span id="customAgeWrap" style="display:none;gap:4px;align-items:center;">
          <input type="number" id="mylistMinAge" placeholder="من" min="0" />
          <span style="color:var(--text-muted);">-</span>
          <input type="number" id="mylistMaxAge" placeholder="إلى" min="0" />
        </span>
        <select id="mylistSort">
          <option value="index-asc">ترتيب: الإضافة</option>
          <option value="age-asc">العمر: تصاعدي</option>
          <option value="age-desc">العمر: تنازلي</option>
          <option value="number-asc">الرقم: تصاعدي</option>
          <option value="number-desc">الرقم: تنازلي</option>
        </select>
        <button class="btn btn-sm" id="mylistFilterBtn" style="width:auto;background:var(--orange);color:#111B21;border:none;font-weight:700;"><i class="fas fa-filter"></i> فلتر</button>
      </div>

      <div class="mylist-table-wrapper">
        <table class="mylist-table">
          <thead><tr><th style="width:40px">#</th><th>الرقم</th><th>العمر</th><th>الجنس</th><th style="width:100px">إجراءات</th></tr></thead>
          <tbody id="mylistBody"><tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:30px;">اضغط "تحميل" لجلب البيانات</td></tr></tbody>
        </table>
      </div>

      <div class="mylist-footer">
        <span id="mylistCount">المجموع: 0 | يعرض: 0</span>
        <div class="btn-row" style="margin-top:0;">
          <button class="btn btn-sm" id="mylistLoadBtn"><i class="fas fa-download"></i> تحميل</button>
          <button class="btn btn-primary btn-sm" id="mylistSyncBtn"><i class="fas fa-exchange-alt"></i> نسخ إلى جهات الاتصال</button>
        </div>
      </div>
      <div class="status" id="mylistStatus"></div>
    </div>

    <!-- الإحصائيات -->
    <div class="card">
      <div class="card-header"><i class="fas fa-chart-line"></i><h2>إحصائيات الإرسال</h2></div>
      <div class="btn-row" style="margin-top: 0; margin-bottom: 16px;">
        <button class="btn btn-primary" id="loadStatsBtn" style="width: auto;"><i class="fas fa-database"></i> تحميل الإحصائيات</button>
      </div>
      <div id="statsContainer" style="display:none;">
        <div style="max-height: 250px; overflow-y: auto; margin-bottom: 20px; border-radius: 8px; border: 1px solid var(--border-color);">
          <table class="stats-table">
            <thead><tr><th>التاريخ</th><th>محاولات</th><th>نجاح</th><th>فشل</th></tr></thead>
            <tbody id="statsBody"></tbody>
          </table>
        </div>
        <div style="background: var(--bg-main); border-radius: 8px; padding: 20px; height: 300px;">
          <canvas id="statsChart"></canvas>
        </div>
      </div>
      <div class="status" id="statsStatus"></div>
    </div>

    <!-- حالة واتساب -->
    <div class="card">
      <div class="card-header"><i class="fab fa-whatsapp"></i><h2>حالة واتساب</h2></div>
      <div style="display:flex; flex-wrap:wrap; gap:20px; align-items:center;">
        <div>
          <div><strong>الحالة:</strong> <span id="sessionStatusText" style="color:var(--text-muted);">غير معروف</span></div>
          <div style="margin-top:10px;">
            <button class="btn btn-primary" id="runQRBtn" style="width:auto;"><i class="fas fa-play"></i> تشغيل QR</button>
            <button class="btn btn-danger" id="stopQRBtn" style="width:auto;"><i class="fas fa-stop"></i> إيقاف QR</button>
            <button class="btn" id="refreshSessionBtn" style="width:auto;"><i class="fas fa-sync"></i> تحديث</button>
          </div>
        </div>
        <div id="qrCodeContainer" style="flex-shrink:0;">
          <img id="qrImage" src="" alt="QR Code" style="display:none; width:200px; height:200px; border:2px solid var(--accent); border-radius:8px;"/>
        </div>
      </div>
      <div class="status" id="sessionStatus"></div>
    </div>

    <div class="content-grid">
      <div class="card">
        <div class="card-header"><i class="fas fa-comment-dots"></i><h2>الرسائل</h2></div>
        <div class="card-hint">كل رسالة في سطر</div>
        <textarea id="messagesArea" placeholder="اكتب رسالة في كل سطر..."></textarea>
        <div class="btn-row">
          <button class="btn" id="loadMessagesBtn"><i class="fas fa-download"></i> تحميل</button>
          <button class="btn btn-primary" id="saveMessagesBtn"><i class="fas fa-save"></i> حفظ</button>
        </div>
        <div class="status" id="messagesStatus"></div>
      </div>
      <div class="card">
        <div class="card-header"><i class="fas fa-address-book"></i><h2>جهات الاتصال</h2></div>
        <div class="card-hint">كل رقم في سطر</div>
        <textarea id="contactsArea" placeholder="اكتب رقم في كل سطر..."></textarea>
        <div class="btn-row">
          <button class="btn" id="loadContactsBtn"><i class="fas fa-download"></i> تحميل</button>
          <button class="btn btn-primary" id="saveContactsBtn"><i class="fas fa-save"></i> حفظ</button>
        </div>
        <div class="status" id="contactsStatus"></div>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><i class="fas fa-images"></i><h2>رفع الصور</h2></div>
      <div class="card-hint">الحد الأقصى 3 صور</div>
      <div style="background: var(--bg-main); padding: 15px; border-radius: 8px; border: 1px dashed var(--border-color);">
        <input type="file" id="imagesInput" accept="image/*" multiple style="width:100%; margin-bottom: 10px;" />
        <div id="imagePreviewArea" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
      </div>
      <div class="btn-row" style="justify-content: flex-start;">
        <button class="btn btn-primary" id="uploadImagesBtn" style="width: auto;"><i class="fas fa-upload"></i> رفع الصور</button>
        <button class="btn" id="refreshImagesBtn" style="width: auto;"><i class="fas fa-sync"></i> تحديث القائمة</button>
      </div>
      <div id="imageGallery" style="display: none; margin-top: 16px;">
        <div style="margin-bottom:10px;"><span style="font-size:14px; color:var(--text-muted);">الصور الموجودة (<span id="imageCount">0</span>/3)</span></div>
        <div id="imageList"></div>
      </div>
      <div class="status" id="imagesStatus"></div>
    </div>

    <div class="card">
      <div class="card-header"><i class="fas fa-file-image"></i><h2>قائمة الصور (images.json)</h2></div>
      <div class="card-hint">أسماء الصور المخزنة (كل مسار في سطر)</div>
      <textarea id="imagesListArea" placeholder="images/123_photo.jpg ..."></textarea>
      <div class="btn-row">
        <button class="btn" id="loadImagesListBtn"><i class="fas fa-download"></i> تحميل</button>
        <button class="btn btn-primary" id="saveImagesListBtn"><i class="fas fa-save"></i> حفظ</button>
      </div>
      <div class="status" id="imagesListStatus"></div>
    </div>
  </main>

  <div class="modal-overlay" id="logsModal">
    <div class="modal">
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <h2 style="color: var(--accent);"><i class="fas fa-clipboard-list"></i> السجلات</h2>
        <button class="btn" id="closeLogsModal" style="width: auto;"><i class="fas fa-times"></i> إغلاق</button>
      </div>
      <div class="log-files-list" id="logFilesList"></div>
      <div class="log-content" id="logContent">اختر ملف سجل لعرض محتواه...</div>
    </div>
  </div>

<script>
function setStatus(el, msg, type) { el.textContent = msg; el.className = "status" + (type ? " " + type : ""); }
function setIndicator(el, active, onText, offText) {
  el.className = "running-indicator " + (active ? "active" : "idle");
  el.innerHTML = '<span class="dot"></span> ' + (active ? onText : offText);
}

/* ========== ملفات عادية ========== */
async function loadFile(type, areaEl, statusEl) {
  setStatus(statusEl, "جاري التحميل...", "");
  try {
    const res = await fetch("/api/load?type=" + type);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    areaEl.value = data.text;
    setStatus(statusEl, "تم التحميل \u2713", "ok");
  } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
}
async function saveFile(type, areaEl, statusEl) {
  setStatus(statusEl, "جاري الحفظ...", "");
  try {
    const res = await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, text: areaEl.value }) });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(statusEl, "تم الحفظ \u2713", "ok");
  } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
}
document.getElementById("loadMessagesBtn").onclick = () => loadFile("messages", document.getElementById("messagesArea"), document.getElementById("messagesStatus"));
document.getElementById("saveMessagesBtn").onclick = () => saveFile("messages", document.getElementById("messagesArea"), document.getElementById("messagesStatus"));
document.getElementById("loadContactsBtn").onclick = () => loadFile("contacts", document.getElementById("contactsArea"), document.getElementById("contactsStatus"));
document.getElementById("saveContactsBtn").onclick = () => saveFile("contacts", document.getElementById("contactsArea"), document.getElementById("contactsStatus"));
document.getElementById("loadImagesListBtn").onclick = () => loadFile("images", document.getElementById("imagesListArea"), document.getElementById("imagesListStatus"));
document.getElementById("saveImagesListBtn").onclick = () => saveFile("images", document.getElementById("imagesListArea"), document.getElementById("imagesListStatus"));

/* ========== إرسال الرسائل ========== */
const sendRunBtn = document.getElementById("sendRunBtn");
const sendStopBtn = document.getElementById("sendStopBtn");
const sendStatusEl = document.getElementById("sendStatus");
const sendIndicator = document.getElementById("sendRunningIndicator");
sendRunBtn.onclick = async function() {
  setStatus(sendStatusEl, "جاري بدء الإرسال...", ""); sendRunBtn.disabled = true;
  try {
    const res = await fetch("/api/send/run", { method: "POST" });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(sendStatusEl, "تم بدء الإرسال \u2713", "ok");
    setIndicator(sendIndicator, true, "جاري الإرسال...", "متوقف");
    sendStopBtn.disabled = false;
    setTimeout(checkSendStatus, 5000);
  } catch (err) { setStatus(sendStatusEl, "خطأ: " + err.message, "err"); sendRunBtn.disabled = false; }
};
sendStopBtn.onclick = async function() {
  setStatus(sendStatusEl, "جاري الإيقاف...", ""); sendStopBtn.disabled = true;
  try {
    const res = await fetch("/api/send/stop", { method: "POST" });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(sendStatusEl, "تم الإيقاف \u2713", "ok");
    setIndicator(sendIndicator, false, "جاري الإرسال...", "متوقف");
    sendRunBtn.disabled = false;
  } catch (err) { setStatus(sendStatusEl, "خطأ: " + err.message, "err"); sendStopBtn.disabled = false; }
};
async function checkSendStatus() {
  try {
    const res = await fetch("/api/send/status"); const data = await res.json();
    if (data.ok && data.running) {
      setIndicator(sendIndicator, true, "جاري الإرسال...", "متوقف");
      sendStopBtn.disabled = false; sendRunBtn.disabled = true;
      setTimeout(checkSendStatus, 15000);
    } else {
      setIndicator(sendIndicator, false, "جاري الإرسال...", "متوقف");
      sendStopBtn.disabled = true; sendRunBtn.disabled = false;
    }
  } catch (e) { sendRunBtn.disabled = false; }
}

/* ========== الرد الذكي ========== */
const replyRunBtn = document.getElementById("replyRunBtn");
const replyStopBtn = document.getElementById("replyStopBtn");
const replyStatusEl = document.getElementById("replyStatus");
const replyIndicator = document.getElementById("replyRunningIndicator");
replyRunBtn.onclick = async function() {
  setStatus(replyStatusEl, "جاري التفعيل...", ""); replyRunBtn.disabled = true;
  try {
    const res = await fetch("/api/reply/run", { method: "POST" });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(replyStatusEl, "تم التفعيل \u2713", "ok");
    setIndicator(replyIndicator, true, "الرد الذكي يعمل", "متوقف");
    replyStopBtn.disabled = false;
    setTimeout(checkReplyStatus, 5000);
  } catch (err) { setStatus(replyStatusEl, "خطأ: " + err.message, "err"); replyRunBtn.disabled = false; }
};
replyStopBtn.onclick = async function() {
  setStatus(replyStatusEl, "جاري الإيقاف...", ""); replyStopBtn.disabled = true;
  try {
    const res = await fetch("/api/reply/stop", { method: "POST" });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(replyStatusEl, "تم الإيقاف \u2713", "ok");
    setIndicator(replyIndicator, false, "الرد الذكي يعمل", "متوقف");
    replyRunBtn.disabled = false;
  } catch (err) { setStatus(replyStatusEl, "خطأ: " + err.message, "err"); replyStopBtn.disabled = false; }
};
async function checkReplyStatus() {
  try {
    const res = await fetch("/api/reply/status"); const data = await res.json();
    if (data.ok && data.running) {
      setIndicator(replyIndicator, true, "الرد الذكي يعمل", "متوقف");
      replyStopBtn.disabled = false; replyRunBtn.disabled = true;
      setTimeout(checkReplyStatus, 15000);
    } else {
      setIndicator(replyIndicator, false, "الرد الذكي يعمل", "متوقف");
      replyStopBtn.disabled = true; replyRunBtn.disabled = false;
    }
  } catch (e) { replyRunBtn.disabled = false; }
}
checkSendStatus(); checkReplyStatus();

/* ========== قائمة الأرقام التفصيلية ========== */
let mylistFullData = [];
const mylistBody = document.getElementById("mylistBody");
const mylistStatusEl = document.getElementById("mylistStatus");
const mylistFilterAge = document.getElementById("mylistFilterAge");
const customAgeWrap = document.getElementById("customAgeWrap");

mylistFilterAge.onchange = function() {
  customAgeWrap.style.display = this.value === "custom" ? "inline-flex" : "none";
};

function genderBadge(g) {
  if (g === "ذكر") return '<span class="gender-badge male">\u0630\u0643\u0631</span>';
  if (g === "أنثى") return '<span class="gender-badge female">\u0623\u0646\u062b\u0649</span>';
  return '<span class="gender-badge unknown">' + (g || "غير محدد") + '</span>';
}

function getMylistParams() {
  const params = new URLSearchParams();
  const gender = document.getElementById("mylistFilterGender").value;
  const ageVal = mylistFilterAge.value;
  const sortVal = document.getElementById("mylistSort").value;

  params.set("gender", gender);

  if (ageVal === "custom") {
    const minA = document.getElementById("mylistMinAge").value;
    const maxA = document.getElementById("mylistMaxAge").value;
    if (minA !== "") params.set("minAge", minA);
    if (maxA !== "") params.set("maxAge", maxA);
  } else if (ageVal !== "all") {
    var parts = ageVal.split("-");
    params.set("minAge", parts[0]);
    params.set("maxAge", parts[1]);
  }

  if (sortVal) {
    var sp = sortVal.split("-");
    params.set("sort", sp[0]);
    params.set("order", sp[1]);
  }
  return params;
}

function renderMylist(data) {
  if (!data || data.length === 0) {
    mylistBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-muted);padding:30px;">لا توجد بيانات</td></tr>';
    return;
  }
  mylistBody.innerHTML = "";
  data.forEach(function(item, i) {
    var tr = document.createElement("tr");
    tr.setAttribute("data-index", item._index);
    tr.innerHTML =
      '<td style="color:var(--text-muted)">' + (i + 1) + '</td>' +
      '<td style="direction:ltr;text-align:right;font-family:Consolas,monospace;">' + (item.number || "") + '</td>' +
      '<td>' + (item.age || 0) + '</td>' +
      '<td>' + genderBadge(item.gender) + '</td>' +
      '<td>' +
        '<button class="btn btn-sm btn-blue mylist-edit-btn" data-idx="' + item._index + '"><i class="fas fa-pen"></i></button> ' +
        '<button class="btn btn-sm btn-danger mylist-del-btn" data-idx="' + item._index + '"><i class="fas fa-trash"></i></button>' +
      '</td>';
    mylistBody.appendChild(tr);
  });

  mylistBody.querySelectorAll(".mylist-del-btn").forEach(function(btn) {
    btn.onclick = async function() {
      var idx = parseInt(this.getAttribute("data-idx"));
      if (!confirm("حذف هذا الرقم؟")) return;
      setStatus(mylistStatusEl, "جاري الحذف...", "");
      try {
        var res = await fetch("/api/mylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", index: idx }) });
        var data = await res.json();
        if (!data.ok) throw new Error(data.error);
        setStatus(mylistStatusEl, "تم الحذف \u2713", "ok");
        loadMylist();
      } catch (err) { setStatus(mylistStatusEl, "خطأ: " + err.message, "err"); }
    };
  });

  mylistBody.querySelectorAll(".mylist-edit-btn").forEach(function(btn) {
    btn.onclick = function() {
      var idx = parseInt(this.getAttribute("data-idx"));
      var item = mylistFullData[idx];
      if (!item) return;
      var tr = this.closest("tr");
      tr.innerHTML =
        '<td style="color:var(--text-muted)">' + (Array.from(mylistBody.children).indexOf(tr) + 1) + '</td>' +
        '<td><input class="edit-input" id="editNum" value="' + (item.number || "") + '" /></td>' +
        '<td><input class="edit-input" type="number" id="editAge" value="' + (item.age || 0) + '" min="0" max="120" style="width:70px" /></td>' +
        '<td><select class="edit-input" id="editGender" style="width:90px"><option value="ذكر"' + (item.gender === "ذكر" ? " selected" : "") + '>\u0630\u0643\u0631</option><option value="أنثى"' + (item.gender === "أنثى" ? " selected" : "") + '>\u0623\u0646\u062b\u0649</option></select></td>' +
        '<td>' +
          '<button class="btn btn-sm btn-primary mylist-save-btn" data-idx="' + idx + '"><i class="fas fa-check"></i></button> ' +
          '<button class="btn btn-sm mylist-cancel-btn"><i class="fas fa-times"></i></button>' +
        '</td>';
      tr.querySelector(".mylist-save-btn").onclick = async function() {
        var num = document.getElementById("editNum").value;
        var age = document.getElementById("editAge").value;
        var gen = document.getElementById("editGender").value;
        setStatus(mylistStatusEl, "جاري الحفظ...", "");
        try {
          var res = await fetch("/api/mylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", index: idx, number: num, age: age, gender: gen }) });
          var data = await res.json();
          if (!data.ok) throw new Error(data.error);
          setStatus(mylistStatusEl, "تم التعديل \u2713", "ok");
          loadMylist();
        } catch (err) { setStatus(mylistStatusEl, "خطأ: " + err.message, "err"); }
      };
      tr.querySelector(".mylist-cancel-btn").onclick = function() { loadMylist(); };
    };
  });
}

async function loadMylist() {
  setStatus(mylistStatusEl, "جاري التحميل...", "");
  try {
    var params = getMylistParams();
    var res = await fetch("/api/mylist?" + params.toString());
    var data = await res.json();
    if (!data.ok) throw new Error(data.error);

    // جلب الكل بدون فلتر لحفظ البيانات الكاملة
    var resAll = await fetch("/api/mylist?sort=index&order=asc");
    var dataAll = await resAll.json();
    mylistFullData = dataAll.data || [];

    document.getElementById("mylistCount").textContent = "المجموع: " + data.total + " | يعرض: " + data.filtered;
    renderMylist(data.data);
    setStatus(mylistStatusEl, "\u2713 تم التحميل", "ok");
  } catch (err) { setStatus(mylistStatusEl, "خطأ: " + err.message, "err"); }
}

document.getElementById("mylistLoadBtn").onclick = loadMylist;
document.getElementById("mylistFilterBtn").onclick = loadMylist;

document.getElementById("mylistAddBtn").onclick = async function() {
  var num = document.getElementById("mylistNumber").value.trim();
  var age = document.getElementById("mylistAge").value;
  var gen = document.getElementById("mylistGender").value;
  if (!num) { setStatus(mylistStatusEl, "أدخل الرقم", "err"); return; }
  setStatus(mylistStatusEl, "جاري الإضافة...", "");
  try {
    var res = await fetch("/api/mylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", number: num, age: age, gender: gen }) });
    var data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(mylistStatusEl, "تمت الإضافة \u2713", "ok");
    document.getElementById("mylistNumber").value = "";
    document.getElementById("mylistAge").value = "";
    loadMylist();
  } catch (err) { setStatus(mylistStatusEl, "خطأ: " + err.message, "err"); }
};

document.getElementById("mylistSyncBtn").onclick = async function() {
  if (!confirm("سيتم نسخ كل الأرقام من القائمة التفصيلية إلى ملف جهات الاتصال. متأكد؟")) return;
  setStatus(mylistStatusEl, "جاري النسخ...", "");
  try {
    var res = await fetch("/api/mylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "sync-to-contacts" }) });
    var data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(mylistStatusEl, data.message + " \u2713", "ok");
  } catch (err) { setStatus(mylistStatusEl, "خطأ: " + err.message, "err"); }
};

loadMylist();

/* ========== الصور ========== */
var imagesInput = document.getElementById("imagesInput");
var previewArea = document.getElementById("imagePreviewArea");
var selectedFiles = [];
imagesInput.addEventListener("change", function() { selectedFiles = Array.from(this.files); renderPreviews(); });
function renderPreviews() {
  previewArea.innerHTML = "";
  selectedFiles.forEach(function(file, index) {
    var reader = new FileReader();
    reader.onload = function(ev) {
      var div = document.createElement("div");
      div.style.cssText = "width:80px;height:80px;border-radius:8px;overflow:hidden;position:relative;border:1px solid var(--border-color);";
      div.innerHTML = '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover;" /><button data-index="' + index + '" style="position:absolute;top:2px;right:2px;background:var(--danger);color:white;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:10px;">X</button>';
      previewArea.appendChild(div);
      div.querySelector("button").onclick = function() { selectedFiles.splice(index, 1); renderPreviews(); };
    };
    reader.readAsDataURL(file);
  });
}
async function loadImages() {
  var gallery = document.getElementById("imageGallery"); var list = document.getElementById("imageList"); var countSpan = document.getElementById("imageCount");
  try {
    var res = await fetch("/api/images"); var data = await res.json();
    if (!data.ok) throw new Error(data.error);
    var files = data.files || []; countSpan.textContent = files.length;
    if (files.length === 0) { gallery.style.display = "none"; return; }
    gallery.style.display = "block"; list.innerHTML = "";
    files.forEach(function(file) {
      var div = document.createElement("div"); div.className = "image-item";
      var img = document.createElement("img"); img.src = file.download_url;
      var delBtn = document.createElement("button"); delBtn.className = "delete-btn"; delBtn.innerHTML = '<i class="fas fa-trash"></i>';
      delBtn.onclick = async function() {
        if (!confirm("حذف الصورة؟")) return;
        try {
          var r = await fetch("/api/delete-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name }) });
          var d = await r.json(); if (!d.ok) throw new Error(d.error);
          div.remove(); var nc = parseInt(countSpan.textContent) - 1; countSpan.textContent = nc;
          if (nc === 0) gallery.style.display = "none";
          setStatus(document.getElementById("imagesStatus"), "تم الحذف \u2713", "ok");
        } catch (err) { setStatus(document.getElementById("imagesStatus"), "خطأ: " + err.message, "err"); }
      };
      div.appendChild(img); div.appendChild(delBtn); list.appendChild(div);
    });
  } catch (err) { gallery.style.display = "none"; }
}
document.getElementById("refreshImagesBtn").onclick = loadImages;
document.getElementById("uploadImagesBtn").onclick = async function() {
  if (selectedFiles.length === 0) { setStatus(document.getElementById("imagesStatus"), "اختر صورة أولاً", "err"); return; }
  try {
    var rc = await fetch("/api/images"); var dc = await rc.json();
    if (!dc.ok) throw new Error(dc.error);
    var cc = dc.files ? dc.files.length : 0;
    if (cc >= 3) { setStatus(document.getElementById("imagesStatus"), "الحد الأقصى 3 صور", "err"); return; }
    var rem = 3 - cc;
    if (selectedFiles.length > rem) { setStatus(document.getElementById("imagesStatus"), "يمكنك رفع " + rem + " صورة فقط", "err"); return; }
  } catch (err) { setStatus(document.getElementById("imagesStatus"), "خطأ: " + err.message, "err"); return; }
  var success = 0;
  for (var i = 0; i < selectedFiles.length; i++) {
    try {
      var b64 = await new Promise(function(resolve, reject) { var r = new FileReader(); r.onload = function() { resolve(r.result.split(",")[1]); }; r.onerror = reject; r.readAsDataURL(selectedFiles[i]); });
      var r = await fetch("/api/upload-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: selectedFiles[i].name, dataBase64: b64 }) });
      var d = await r.json(); if (d.ok) success++;
    } catch (e) {}
  }
  setStatus(document.getElementById("imagesStatus"), success + "/" + selectedFiles.length + " تم رفعها", success === selectedFiles.length ? "ok" : "err");
  if (success === selectedFiles.length) { selectedFiles = []; imagesInput.value = ""; renderPreviews(); }
  loadImages();
};
loadImages();

/* ========== السجلات ========== */
var logsModal = document.getElementById("logsModal");
document.getElementById("viewLogsBtn").onclick = async function() {
  logsModal.classList.add("active");
  var list = document.getElementById("logFilesList");
  list.innerHTML = "<span style='color:var(--text-muted)'>جاري التحميل...</span>";
  try {
    var res = await fetch("/api/logs"); var data = await res.json();
    if (!data.ok) throw new Error(data.error);
    list.innerHTML = "";
    if (data.files.length === 0) { list.innerHTML = "<span style='color:var(--text-muted)'>لا توجد سجلات</span>"; return; }
    data.files.forEach(function(file) {
      var btn = document.createElement("button"); btn.className = "log-file-btn"; btn.textContent = file.name;
      btn.onclick = async function() {
        document.querySelectorAll(".log-file-btn").forEach(function(b) { b.classList.remove("active"); });
        btn.classList.add("active");
        var ce = document.getElementById("logContent"); ce.textContent = "جاري التحميل...";
        try { var r = await fetch("/api/log-content?file=" + encodeURIComponent(file.name)); var d = await r.json(); if (!d.ok) throw new Error(d.error); ce.textContent = d.content || " فارغ "; }
        catch (err) { ce.textContent = "خطأ: " + err.message; }
      };
      list.appendChild(btn);
    });
  } catch (err) { list.innerHTML = "<span style='color:var(--danger)'>خطأ: " + err.message + "</span>"; }
};
document.getElementById("closeLogsModal").onclick = function() { logsModal.classList.remove("active"); };
logsModal.addEventListener("click", function(e) { if (e.target === logsModal) logsModal.classList.remove("active"); });

/* ========== الجدولة ========== */
var scheduleStatusEl = document.getElementById("scheduleStatus");
var hourInput = document.getElementById("hourInput");
var minuteInput = document.getElementById("minuteInput");
async function loadSchedule() {
  setStatus(scheduleStatusEl, "جاري التحميل...", "");
  try {
    var res = await fetch("/api/schedule"); var data = await res.json();
    if (!data.ok) throw new Error(data.error);
    var ind = document.getElementById("scheduleIndicator"); var disp = document.getElementById("currentCronDisplay");
    if (data.hasSchedule && data.cron) {
      ind.textContent = "مفعل"; ind.className = "schedule-status active"; disp.textContent = "التوقيت: " + data.cron;
      var p = data.cron.trim().split(/\\s+/); if (p.length >= 2) { minuteInput.value = p[0]; hourInput.value = p[1]; }
      setStatus(scheduleStatusEl, "تم التحميل \u2713", "ok");
    } else { ind.textContent = "غير مفعل"; ind.className = "schedule-status inactive"; disp.textContent = "(لا توجد جدولة)"; setStatus(scheduleStatusEl, "غير مفعلة", ""); }
  } catch (err) { setStatus(scheduleStatusEl, "خطأ: " + err.message, "err"); }
}
document.getElementById("loadScheduleBtn").onclick = loadSchedule;
document.getElementById("updateScheduleBtn").onclick = function() {
  var h = parseInt(hourInput.value, 10); var m = parseInt(minuteInput.value, 10);
  if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) { setStatus(scheduleStatusEl, "أدخل قيم صحيحة", "err"); return; }
  setStatus(scheduleStatusEl, "جاري الحفظ...", "");
  fetch("/api/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", cron: m + " " + h + " * * *" }) })
    .then(function(r) { return r.json(); }).then(function(data) {
      if (!data.ok) throw new Error(data.error);
      setStatus(scheduleStatusEl, "تم التحديث \u2713", "ok"); loadSchedule();
    }).catch(function(err) { setStatus(scheduleStatusEl, "خطأ: " + err.message, "err"); });
};
loadSchedule();

/* ========== الإحصائيات ========== */
var statsChartInstance = null;
document.getElementById("loadStatsBtn").onclick = async function() {
  var st = document.getElementById("statsStatus"); setStatus(st, "جاري التحميل...", "");
  try {
    var res = await fetch("/api/stats"); var data = await res.json();
    if (!data.ok) throw new Error(data.error);
    if (data.data.length === 0) { setStatus(st, "لا توجد إحصائيات", "err"); return; }
    document.getElementById("statsContainer").style.display = "block"; setStatus(st, "\u2713 تم التحميل", "ok");
    var tbody = document.getElementById("statsBody"); tbody.innerHTML = "";
    var tA = 0, tS = 0, tF = 0;
    data.data.forEach(function(row) {
      tA += row.attempted || 0; tS += row.success || 0; tF += row.failed || 0;
      var tr = document.createElement("tr");
      tr.innerHTML = "<td>" + row.date + "</td><td>" + (row.attempted||0) + "</td><td style='color:var(--success)'>" + (row.success||0) + "</td><td style='color:var(--danger)'>" + (row.failed||0) + "</td>";
      tbody.appendChild(tr);
    });
    var trT = document.createElement("tr"); trT.style.fontWeight = "bold"; trT.style.borderTop = "2px solid var(--accent)";
    trT.innerHTML = "<td>المجموع</td><td>" + tA + "</td><td style='color:var(--success)'>" + tS + "</td><td style='color:var(--danger)'>" + tF + "</td>";
    tbody.appendChild(trT);
    var ctx = document.getElementById("statsChart").getContext("2d");
    if (statsChartInstance) statsChartInstance.destroy();
    statsChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.data.map(function(r) { return r.date; }),
        datasets: [
          { label: "محاولات", data: data.data.map(function(r) { return r.attempted||0; }), backgroundColor: "rgba(53,114,238,0.6)", borderColor: "rgba(53,114,238,1)", borderWidth: 1, borderRadius: 4 },
          { label: "نجاح", data: data.data.map(function(r) { return r.success||0; }), backgroundColor: "rgba(37,211,102,0.6)", borderColor: "rgba(37,211,102,1)", borderWidth: 1, borderRadius: 4 },
          { label: "فشل", data: data.data.map(function(r) { return r.failed||0; }), backgroundColor: "rgba(241,92,109,0.6)", borderColor: "rgba(241,92,109,1)", borderWidth: 1, borderRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: "#E9EDEF", font: { family: "Tajawal", size: 14 } } } },
        scales: {
          y: { beginAtZero: true, ticks: { color: "#8696A0", font: { family: "Tajawal" } }, grid: { color: "rgba(255,255,255,0.05)" } },
          x: { ticks: { color: "#8696A0", font: { family: "Tajawal" } }, grid: { display: false } }
        }
      }
    });
  } catch (err) { setStatus(st, "خطأ: " + err.message, "err"); }
};

/* ========== حالة واتساب ========== */
var sessionStatusEl = document.getElementById("sessionStatus");
var sessionStatusText = document.getElementById("sessionStatusText");
var qrImage = document.getElementById("qrImage");
async function refreshSession() {
  setStatus(sessionStatusEl, "جاري التحديث...", "");
  try {
    var rs = await fetch("/api/session/status"); var ds = await rs.json();
    if (ds.ok) {
      var s = ds.status || "غير معروف"; sessionStatusText.textContent = s;
      if (s === "connected") sessionStatusText.style.color = "var(--success)";
      else if (s === "waiting_scan") sessionStatusText.style.color = "var(--warning)";
      else sessionStatusText.style.color = "var(--text-muted)";
    } else throw new Error(ds.error);
    var rq = await fetch("/api/session/qr"); var dq = await rq.json();
    if (dq.ok && dq.qr) { qrImage.src = dq.qr; qrImage.style.display = "block"; } else { qrImage.style.display = "none"; }
    setStatus(sessionStatusEl, "\u2713 تم التحديث", "ok");
  } catch (err) { setStatus(sessionStatusEl, "خطأ: " + err.message, "err"); }
}
document.getElementById("refreshSessionBtn").addEventListener("click", refreshSession);
document.getElementById("runQRBtn").addEventListener("click", async function() {
  setStatus(sessionStatusEl, "جاري تشغيل QR...", "");
  try { var r = await fetch("/api/qr/run", { method: "POST" }); var d = await r.json(); if (!d.ok) throw new Error(d.error); setStatus(sessionStatusEl, "تم التشغيل \u2713", "ok"); setTimeout(refreshSession, 3000); }
  catch (err) { setStatus(sessionStatusEl, "خطأ: " + err.message, "err"); }
});
document.getElementById("stopQRBtn").addEventListener("click", async function() {
  setStatus(sessionStatusEl, "جاري الإيقاف...", "");
  try { var r = await fetch("/api/qr/stop", { method: "POST" }); var d = await r.json(); if (!d.ok) throw new Error(d.error); setStatus(sessionStatusEl, "تم الإيقاف \u2713", "ok"); setTimeout(refreshSession, 2000); }
  catch (err) { setStatus(sessionStatusEl, "خطأ: " + err.message, "err"); }
});
refreshSession(); setInterval(refreshSession, 30000);
</script>
</body>
</html>
`;
