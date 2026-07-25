export const HTML_STATS = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>إحصائيات - مدير واتساب</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  /* الأنماط (نفسها) */
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
  .status { margin-top: 10px; font-size: 12px; min-height: 18px; color: var(--text-muted); text-align: center; }
  .status.ok { color: var(--success); }
  .status.err { color: var(--danger); }
  .stats-table { width: 100%; border-collapse: collapse; margin-top: 10px; font-size: 14px; }
  .stats-table th { text-align: right; padding: 12px; background: var(--input-bg); color: var(--text-muted); border-bottom: 1px solid var(--border-color); font-weight: 500; }
  .stats-table td { padding: 12px; border-bottom: 1px solid var(--border-color); color: var(--text-main); }
  .stats-table tr:last-child td { border-bottom: none; }
</style>
</head>
<body>

<nav class="navbar">
  <div class="brand"><i class="fab fa-whatsapp"></i> مدير واتساب</div>
  <div class="nav-links">
    <a href="/"><i class="fas fa-home"></i> الرئيسية</a>
    <a href="/edit"><i class="fas fa-edit"></i> تحرير</a>
    <a href="/stats" class="active"><i class="fas fa-chart-bar"></i> إحصائيات</a>
  </div>
</nav>

<div class="main-content">
  <div class="card">
    <div class="card-header"><i class="fas fa-chart-line"></i><h2>إحصائيات مفصلة</h2></div>
    <div class="btn-row"><button class="btn btn-primary" id="loadStatsBtn"><i class="fas fa-database"></i> تحميل الإحصائيات</button></div>
    <div id="statsContainer" style="display:none;">
      <div style="max-height:300px; overflow-y:auto; margin-bottom:20px; border-radius:8px; border:1px solid var(--border-color);">
        <table class="stats-table"><thead><tr><th>التاريخ</th><th>محاولات</th><th>نجاح</th><th>فشل</th></tr></thead><tbody id="statsBody"></tbody></table>
      </div>
      <div style="background:var(--bg-main); border-radius:8px; padding:20px; height:400px;"><canvas id="statsChart"></canvas></div>
    </div>
    <div class="status" id="statsStatus"></div>
  </div>
</div>

<script>
function setStatus(el, msg, type) { el.textContent = msg; el.className = "status" + (type ? " " + type : ""); }
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
