// src/pages/dashboard.js
import { getHeaders, showToast, getToday } from '../utils.js';

export function render() {
  return `
    <div class="page-header">
      <h1><i class="fas fa-home"></i> لوحة التحكم</h1>
      <p style="color:var(--text-muted);">مرحباً بك في لوحة إدارة واتساب</p>
    </div>
    <div class="dashboard-grid">
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-users"></i></div>
        <div>
          <h3>جهات الاتصال</h3>
          <p id="dashboardContactsCount">-</p>
        </div>
      </div>
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-clock"></i></div>
        <div>
          <h3>آخر تشغيل</h3>
          <p id="dashboardLastRun">-</p>
        </div>
      </div>
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-check-circle"></i></div>
        <div>
          <h3>حالة الجلسة</h3>
          <p id="dashboardSessionStatus">-</p>
        </div>
      </div>
      <div class="card stats-card">
        <div class="stats-icon"><i class="fas fa-calendar-day"></i></div>
        <div>
          <h3>اليوم</h3>
          <p id="dashboardToday">${getToday()}</p>
        </div>
      </div>
    </div>
    <div class="card" style="margin-top:24px;">
      <div class="card-header"><i class="fas fa-history"></i> <h2>آخر النتائج</h2></div>
      <div id="dashboardRecentStats" style="padding:10px 0;">
        <div style="color:var(--text-muted);">جاري التحميل...</div>
      </div>
    </div>
  `;
}

export async function init() {
  // جلب عدد جهات الاتصال
  try {
    const res = await fetch('/api/contacts', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok) {
      document.getElementById('dashboardContactsCount').textContent = data.data.length;
    }
  } catch (e) {}

  // جلب آخر تشغيل من aggregate.json
  try {
    const res = await fetch('/api/stats', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok && data.data.length > 0) {
      const last = data.data[data.data.length - 1];
      document.getElementById('dashboardLastRun').textContent = last.date;
      // عرض آخر 5 نتائج
      const recent = data.data.slice(-5).reverse();
      const container = document.getElementById('dashboardRecentStats');
      container.innerHTML = recent.map(row => `
        <div style="display:flex; justify-content:space-between; padding:8px 0; border-bottom:1px solid var(--border-color);">
          <span>${row.date}</span>
          <span>محاولات: ${row.attempted || 0} | نجاح: ${row.success || 0} | فشل: ${row.failed || 0}</span>
        </div>
      `).join('');
    }
  } catch (e) {}

  // جلب حالة الجلسة
  try {
    const res = await fetch('/api/live/status', { headers: getHeaders() });
    const data = await res.json();
    if (data.ok) {
      const statusMap = {
        'connected': '🟢 متصل',
        'waiting_scan': '🟡 في انتظار المسح',
        'starting': '🟡 جاري التشغيل',
        'disconnected': '🔴 غير متصل',
        'null': '⚪ غير معروف'
      };
      document.getElementById('dashboardSessionStatus').textContent = statusMap[data.status] || 'غير معروف';
    }
  } catch (e) {}
}
