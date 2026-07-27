// src/pages/stats.js
import { getHeaders, showToast } from '../utils.js';
import Chart from 'chart.js/auto'; // يجب استيراد Chart.js (سيتم تضمينه عبر CDN في HTML)

let chartInstance = null;

export function render() {
  return `
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
              <tr>
                <th style="padding:8px 4px; text-align:right;">التاريخ</th>
                <th style="padding:8px 4px; text-align:center;">محاولات</th>
                <th style="padding:8px 4px; text-align:center;">نجاح</th>
                <th style="padding:8px 4px; text-align:center;">فشل</th>
              </tr>
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
  `;
}

export async function init() {
  await loadStats();
  document.getElementById('refreshStatsBtn').addEventListener('click', loadStats);
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

    // تعبئة الجدول
    const tbody = document.getElementById('statsTableBody');
    tbody.innerHTML = '';
    let totalAtt = 0, totalSuc = 0, totalFail = 0;
    data.data.forEach(row => {
      totalAtt += row.attempted || 0;
      totalSuc += row.success || 0;
      totalFail += row.failed || 0;
      tbody.innerHTML += `
        <tr>
          <td style="padding:6px 4px;">${row.date}</td>
          <td style="padding:6px 4px; text-align:center;">${row.attempted || 0}</td>
          <td style="padding:6px 4px; text-align:center; color:var(--success);">${row.success || 0}</td>
          <td style="padding:6px 4px; text-align:center; color:var(--danger);">${row.failed || 0}</td>
        </tr>
      `;
    });
    // إضافة صف المجموع
    tbody.innerHTML += `
      <tr style="font-weight:bold; border-top:2px solid var(--accent);">
        <td style="padding:6px 4px;">المجموع</td>
        <td style="padding:6px 4px; text-align:center;">${totalAtt}</td>
        <td style="padding:6px 4px; text-align:center; color:var(--success);">${totalSuc}</td>
        <td style="padding:6px 4px; text-align:center; color:var(--danger);">${totalFail}</td>
      </tr>
    `;

    // رسم البيان
    const ctx = document.getElementById('statsChart').getContext('2d');
    if (chartInstance) chartInstance.destroy();
    chartInstance = new Chart(ctx, {
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
        plugins: {
          legend: { labels: { color: '#E9EDEF', font: { family: 'Tajawal', size: 13 } } }
        },
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
