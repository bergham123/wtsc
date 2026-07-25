export const HTML_PAGE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>الرئيسية - مدير واتساب</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  /* نفس الأنماط السابقة (تم حذف التكرار للاختصار) */
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
    display: flex;
    flex-direction: column;
  }
  /* Navbar */
  .navbar {
    background: var(--card-bg);
    border-bottom: 1px solid var(--border-color);
    padding: 12px 30px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 10px;
  }
  .navbar .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 800;
    font-size: 20px;
    color: var(--text-main);
  }
  .navbar .brand i { color: var(--accent); }
  .navbar .nav-links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .navbar .nav-links a {
    color: var(--text-muted);
    text-decoration: none;
    padding: 8px 16px;
    border-radius: 8px;
    font-weight: 500;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  .navbar .nav-links a:hover,
  .navbar .nav-links a.active {
    background: var(--bg-main);
    color: var(--accent);
    border: 1px solid var(--border-color);
  }
  .navbar .nav-links a.active {
    color: var(--accent);
    border-color: var(--accent);
  }
  .main-content {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.3s ease;
  }
  .card:hover { border-color: rgba(37, 211, 102, 0.4); }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .card-header i { font-size: 18px; color: var(--accent); }
  .card-header h2 { font-size: 16px; font-weight: 700; }
  .card-hint { color: var(--text-muted); font-size: 12px; margin-bottom: 16px; }
  .btn-row { display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap; }
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
    display: inline-flex; align-items: center; gap: 8px;
    justify-content: center;
  }
  .btn:hover { background: var(--border-color); }
  .btn-primary { background: var(--accent); color: #111B21; border: none; font-weight: 700; }
  .btn-primary:hover { background: #1FB855; box-shadow: 0 4px 12px var(--accent-glow); }
  .btn-warning { background: var(--warning); border: none; color: #111B21; font-weight: 700; }
  .btn-danger { background: var(--danger); border: none; color: #fff; font-weight: 700; }
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
</style>
</head>
<body>

<!-- Navbar -->
<nav class="navbar">
  <div class="brand"><i class="fab fa-whatsapp"></i> مدير واتساب</div>
  <div class="nav-links">
    <a href="/" class="active"><i class="fas fa-home"></i> الرئيسية</a>
    <a href="/edit"><i class="fas fa-edit"></i> تحرير</a>
    <a href="/stats"><i class="fas fa-chart-bar"></i> إحصائيات</a>
  </div>
</nav>

<div class="main-content">
  <div class="card">
    <div class="card-header"><i class="fas fa-chart-line"></i><h2>إحصائيات الإرسال</h2></div>
    <div class="btn-row" style="margin-top:0;margin-bottom:16px;">
      <button class="btn btn-primary" id="loadStatsBtn" style="width:auto;"><i class="fas fa-database"></i> تحميل الإحصائيات</button>
    </div>
    <div id="statsContainer" style="display:none;">
      <div style="max-height:250px; overflow-y:auto; margin-bottom:20px; border-radius:8px; border:1px solid var(--border-color);">
        <table class="stats-table"><thead><tr><th>التاريخ</th><th>محاولات</th><th>نجاح</th><th>فشل</th></tr></thead><tbody id="statsBody"></tbody></table>
      </div>
      <div style="background:var(--bg-main); border-radius:8px; padding:20px; height:300px;"><canvas id="statsChart"></canvas></div>
    </div>
    <div class="status" id="statsStatus"></div>
  </div>

  <div class="card">
    <div class="card-header"><i class="fas fa-clock"></i><h2>الجدولة والتشغيل</h2></div>
    <div class="btn-row"><button class="btn btn-primary" id="runWorkflowBtn"><i class="fas fa-play"></i> تشغيل الـ Workflow</button></div>
    <div class="status" id="workflowStatus"></div>
    <hr style="border-color:var(--border-color);margin:16px 0;" />
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

  <div class="card">
    <div class="card-header"><i class="fas fa-terminal"></i><h2>السجلات</h2></div>
    <div class="btn-row"><button class="btn" id="viewLogsBtn"><i class="fas fa-folder-open"></i> عرض السجلات</button></div>
    <div class="status" id="logsStatus"></div>
  </div>
</div>

<!-- Modal السجلات -->
<div class="modal-overlay" id="logsModal">
  <div class="modal">
    <div style="display:flex; justify-content:space-between; align-items:center;">
      <h2 style="color:var(--accent);"><i class="fas fa-clipboard-list"></i> السجلات</h2>
      <button class="btn" id="closeLogsModal" style="width:auto;"><i class="fas fa-times"></i> إغلاق</button>
    </div>
    <div class="log-files-list" id="logFilesList"></div>
    <div class="log-content" id="logContent">اختر ملف سجل لعرض محتواه...</div>
  </div>
</div>

<script>
function setStatus(el, msg, type) { el.textContent = msg; el.className = "status" + (type ? " " + type : ""); }

// Workflow
document.getElementById("runWorkflowBtn").onclick = async function() {
  const st = document.getElementById("workflowStatus");
  setStatus(st, "جاري التشغيل...", "");
  try {
    const res = await fetch("/api/run-workflow", { method: "POST" });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(st, "تم التشغيل ✓", "ok");
  } catch (err) { setStatus(st, "خطأ: " + err.message, "err"); }
};

// Logs
const logsModal = document.getElementById("logsModal");
document.getElementById("viewLogsBtn").onclick = async function() {
  logsModal.classList.add("active");
  const list = document.getElementById("logFilesList");
  list.innerHTML = "<span style='color:var(--text-muted)'>جاري التحميل...</span>";
  try {
    const res = await fetch("/api/logs");
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    list.innerHTML = "";
    if (data.files.length === 0) { list.innerHTML = "<span style='color:var(--text-muted)'>لا توجد سجلات</span>"; return; }
    data.files.forEach(file => {
      const btn = document.createElement("button");
      btn.className = "log-file-btn";
      btn.textContent = file.name;
      btn.onclick = async () => {
        document.querySelectorAll(".log-file-btn").forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        const contentEl = document.getElementById("logContent");
        contentEl.textContent = "جاري التحميل...";
        try {
          const r = await fetch("/api/log-content?file=" + encodeURIComponent(file.name));
          const d = await r.json();
          if (!d.ok) throw new Error(d.error);
          contentEl.textContent = d.content || " فارغ ";
        } catch (err) { contentEl.textContent = "خطأ: " + err.message; }
      };
      list.appendChild(btn);
    });
  } catch (err) { list.innerHTML = "<span style='color:var(--danger)'>خطأ: " + err.message + "</span>"; }
};
document.getElementById("closeLogsModal").onclick = () => logsModal.classList.remove("active");
logsModal.addEventListener("click", e => { if (e.target === logsModal) logsModal.classList.remove("active"); });

// Schedule
const scheduleStatus = document.getElementById("scheduleStatus");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");

async function loadSchedule() {
  setStatus(scheduleStatus, "جاري التحميل...", "");
  try {
    const res = await fetch("/api/schedule");
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    const ind = document.getElementById("scheduleIndicator");
    const disp = document.getElementById("currentCronDisplay");
    if (data.hasSchedule && data.cron) {
      ind.textContent = "مفعل"; ind.className = "schedule-status active";
      disp.textContent = "التوقيت (المغرب): " + data.cron;
      const parts = data.cron.trim().split(/\\s+/);
      if (parts.length >= 2) { minuteInput.value = parts[0]; hourInput.value = parts[1]; }
      setStatus(scheduleStatus, "تم التحميل ✓", "ok");
    } else {
      ind.textContent = "غير مفعل"; ind.className = "schedule-status inactive";
      disp.textContent = "(لا توجد جدولة)";
      setStatus(scheduleStatus, "الجدولة غير مفعلة", "");
    }
  } catch (err) { setStatus(scheduleStatus, "خطأ: " + err.message, "err"); }
}
async function saveSchedule(cron) {
  setStatus(scheduleStatus, "جاري الحفظ...", "");
  try {
    const res = await fetch("/api/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", cron: cron }) });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(scheduleStatus, "تم التحديث ✓", "ok");
    loadSchedule();
  } catch (err) { setStatus(scheduleStatus, "خطأ: " + err.message, "err"); }
}
document.getElementById("loadScheduleBtn").onclick = loadSchedule;
document.getElementById("updateScheduleBtn").onclick = function() {
  const h = parseInt(hourInput.value, 10);
  const m = parseInt(minuteInput.value, 10);
  if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
    setStatus(scheduleStatus, "أدخل قيم صحيحة", "err");
    return;
  }
  const cron = m + " " + h + " * * *";
  saveSchedule(cron);
};
loadSchedule();

// Stats
let statsChartInstance = null;
document.getElementById("loadStatsBtn").onclick = async function() {
  const st = document.getElementById("statsStatus");
  setStatus(st, "جاري تحميل البيانات...", "");
  try {
    const res = await fetch("/api/stats");
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    if (data.data.length === 0) { setStatus(st, "لا توجد إحصائيات", "err"); return; }
    document.getElementById("statsContainer").style.display = "block";
    setStatus(st, "✓ تم التحميل", "ok");
    const tbody = document.getElementById("statsBody");
    tbody.innerHTML = "";
    let totalAtt = 0, totalSuc = 0, totalFail = 0;
    data.data.forEach(row => {
      totalAtt += row.attempted || 0;
      totalSuc += row.success || 0;
      totalFail += row.failed || 0;
      const tr = document.createElement("tr");
      tr.innerHTML = "<td>" + row.date + "</td><td>" + (row.attempted||0) + "</td><td style='color:var(--success)'>" + (row.success||0) + "</td><td style='color:var(--danger)'>" + (row.failed||0) + "</td>";
      tbody.appendChild(tr);
    });
    const trTotal = document.createElement("tr");
    trTotal.style.fontWeight = "bold";
    trTotal.style.borderTop = "2px solid var(--accent)";
    trTotal.innerHTML = "<td>المجموع</td><td>" + totalAtt + "</td><td style='color:var(--success)'>" + totalSuc + "</td><td style='color:var(--danger)'>" + totalFail + "</td>";
    tbody.appendChild(trTotal);
    const ctx = document.getElementById('statsChart').getContext('2d');
    if (statsChartInstance) statsChartInstance.destroy();
    statsChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: data.data.map(r => r.date),
        datasets: [
          { label: 'محاولات', data: data.data.map(r => r.attempted||0), backgroundColor: 'rgba(53, 114, 238, 0.6)', borderColor: 'rgba(53, 114, 238, 1)', borderWidth: 1, borderRadius: 4 },
          { label: 'نجاح', data: data.data.map(r => r.success||0), backgroundColor: 'rgba(37, 211, 102, 0.6)', borderColor: 'rgba(37, 211, 102, 1)', borderWidth: 1, borderRadius: 4 },
          { label: 'فشل', data: data.data.map(r => r.failed||0), backgroundColor: 'rgba(241, 92, 109, 0.6)', borderColor: 'rgba(241, 92, 109, 1)', borderWidth: 1, borderRadius: 4 }
        ]
      },
      options: {
        responsive: true, maintainAspectRatio: false,
        plugins: { legend: { labels: { color: '#E9EDEF', font: { family: 'Tajawal', size: 14 } } } },
        scales: {
          y: { beginAtZero: true, ticks: { color: '#8696A0', font: { family: 'Tajawal' } }, grid: { color: 'rgba(255,255,255,0.05)' } },
          x: { ticks: { color: '#8696A0', font: { family: 'Tajawal' } }, grid: { display: false } }
        }
      }
    });
  } catch (err) { setStatus(st, "خطأ: " + err.message, "err"); }
};
</script>
</body>
</html>`;
