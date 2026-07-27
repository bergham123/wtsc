// src/pages/schedule.js
import { getHeaders, showToast } from '../utils.js';

export function render() {
  return `
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
  `;
}

export function init() {
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
        const parts = data.cron.trim().split(/\s+/);
        if (parts.length >= 2) {
          minuteInput.value = parts[0];
          hourInput.value = parts[1];
        }
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
    const cron = m + ' ' + h + ' * * *';
    saveSchedule(cron);
  });

  loadSchedule();
}
