import { layout } from './layout.js';

export function renderStatsLogs(env) {
  const content = `
    <h2 style="margin-bottom: 20px;"><i class="fas fa-chart-line" style="color:var(--accent);"></i> الإحصائيات والسجلات</h2>
    <div class="card">
      <div class="card-header"><i class="fas fa-database"></i><h2>إحصائيات الإرسال</h2></div>
      <div class="btn-row" style="margin-top:0; margin-bottom:16px;">
        <button class="btn btn-primary" id="loadStatsBtn" style="width:auto;"><i class="fas fa-sync"></i> تحديث الإحصائيات</button>
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

    <div class="card">
      <div class="card-header"><i class="fas fa-terminal"></i><h2>السجلات (logs)</h2></div>
      <div class="btn-row" style="margin-top:0; margin-bottom:16px;">
        <button class="btn" id="viewLogsBtn"><i class="fas fa-folder-open"></i> عرض السجلات</button>
      </div>
      <div id="logContainer" style="display:none;">
        <div class="log-files-list" id="logFilesList"></div>
        <div class="log-content" id="logContent">اختر ملف سجل لعرض محتواه...</div>
      </div>
      <div class="status" id="logsStatus"></div>
    </div>

    <script>
      (function() {
        let statsChartInstance = null;
        const statsStatus = document.getElementById('statsStatus');
        const statsContainer = document.getElementById('statsContainer');
        const statsBody = document.getElementById('statsBody');

        async function loadStats() {
          setStatus(statsStatus, "جاري التحميل...", "");
          try {
            const res = await fetch("/api/stats");
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            if (data.data.length === 0) { setStatus(statsStatus, "لا توجد إحصائيات", "err"); return; }
            statsContainer.style.display = "block";
            setStatus(statsStatus, "✓ تم التحميل", "ok");
            statsBody.innerHTML = "";
            let totalAtt = 0, totalSuc = 0, totalFail = 0;
            data.data.forEach(row => {
              totalAtt += row.attempted || 0;
              totalSuc += row.success || 0;
              totalFail += row.failed || 0;
              const tr = document.createElement("tr");
              tr.innerHTML = "<td>" + row.date + "</td><td>" + (row.attempted||0) + "</td><td style='color:var(--success)'>" + (row.success||0) + "</td><td style='color:var(--danger)'>" + (row.failed||0) + "</td>";
              statsBody.appendChild(tr);
            });
            const trTotal = document.createElement("tr");
            trTotal.style.fontWeight = "bold";
            trTotal.style.borderTop = "2px solid var(--accent)";
            trTotal.innerHTML = "<td>المجموع</td><td>" + totalAtt + "</td><td style='color:var(--success)'>" + totalSuc + "</td><td style='color:var(--danger)'>" + totalFail + "</td>";
            statsBody.appendChild(trTotal);
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
          } catch (err) { setStatus(statsStatus, "خطأ: " + err.message, "err"); }
        }

        document.getElementById('loadStatsBtn').addEventListener('click', loadStats);

        // Logs
        const logContainer = document.getElementById('logContainer');
        const logFilesList = document.getElementById('logFilesList');
        const logContent = document.getElementById('logContent');
        const logsStatus = document.getElementById('logsStatus');

        document.getElementById('viewLogsBtn').addEventListener('click', async function() {
          logContainer.style.display = 'block';
          setStatus(logsStatus, "جاري التحميل...", "");
          try {
            const res = await fetch("/api/logs");
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            logFilesList.innerHTML = "";
            if (data.files.length === 0) { logFilesList.innerHTML = "<span style='color:var(--text-muted)'>لا توجد سجلات</span>"; return; }
            data.files.forEach(file => {
              const btn = document.createElement("button");
              btn.className = "log-file-btn";
              btn.textContent = file.name;
              btn.onclick = async () => {
                document.querySelectorAll(".log-file-btn").forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                logContent.textContent = "جاري التحميل...";
                try {
                  const r = await fetch("/api/log-content?file=" + encodeURIComponent(file.name));
                  const d = await r.json();
                  if (!d.ok) throw new Error(d.error);
                  logContent.textContent = d.content || " فارغ ";
                } catch (err) { logContent.textContent = "خطأ: " + err.message; }
              };
              logFilesList.appendChild(btn);
            });
            setStatus(logsStatus, "✓ تم التحميل", "ok");
          } catch (err) { setStatus(logsStatus, "خطأ: " + err.message, "err"); }
        });

        // تحميل الإحصائيات تلقائياً عند فتح الصفحة
        loadStats();
      })();
    </script>
  `;
  return layout(content, 'stats');
}
