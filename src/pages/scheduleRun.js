import { layout } from './layout.js';

export function renderScheduleRun(env) {
  const content = `
    <h2 style="margin-bottom: 20px;"><i class="fas fa-clock" style="color:var(--accent);"></i> الجدولة والتشغيل اليدوي</h2>
    <div class="card">
      <div class="card-header"><i class="fas fa-bolt"></i><h2>تشغيل يدوي</h2></div>
      <div class="btn-row" style="margin-top:12px;">
        <button class="btn btn-primary" id="runWorkflowBtn"><i class="fas fa-play"></i> تشغيل الـ Workflow</button>
        <button class="btn" id="checkSessionBtn"><i class="fas fa-check-circle"></i> التحقق من الجلسة</button>
      </div>
      <div class="status" id="workflowStatus"></div>
      <div id="sessionStatusDisplay" style="margin-top:8px; font-size:14px; display:flex; align-items:center; gap:8px;">
        <span>حالة الجلسة:</span>
        <span id="sessionStatusText" style="font-weight:bold;">غير معروف</span>
        <span class="inline-status off" id="sessionStatusIndicator"></span>
      </div>
    </div>

    <div class="card">
      <div class="card-header"><i class="fas fa-clock"></i><h2>الجدولة</h2></div>
      <div class="card-hint">وقت المغرب (-2 ساعة UTC)</div>
      <div>
        <span class="schedule-status inactive" id="scheduleIndicator">غير مفعل</span>
        <span id="currentCronDisplay" style="font-size:12px;color:var(--text-muted);display:block;margin-top:5px;"></span>
      </div>
      <div class="schedule-inputs" style="display:flex; gap:12px; margin-bottom:12px; justify-content:center;">
        <label style="display:flex; flex-direction:column; gap:5px; font-size:12px; color:var(--text-muted); align-items:center;">الساعة
          <input type="number" id="hourInput" min="0" max="23" value="10" style="width:70px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:6px; padding:8px; text-align:center; font-family:'Tajawal'; font-size:16px;" />
        </label>
        <label style="display:flex; flex-direction:column; gap:5px; font-size:12px; color:var(--text-muted); align-items:center;">الدقيقة
          <input type="number" id="minuteInput" min="0" max="59" value="0" style="width:70px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:6px; padding:8px; text-align:center; font-family:'Tajawal'; font-size:16px;" />
        </label>
      </div>
      <div class="btn-row">
        <button class="btn" id="loadScheduleBtn"><i class="fas fa-history"></i> تحميل الجدولة</button>
        <button class="btn btn-warning" id="updateScheduleBtn"><i class="fas fa-sync-alt"></i> تحديث الجدولة</button>
      </div>
      <div class="status" id="scheduleStatus"></div>
    </div>

    <script>
      (function() {
        const hourInput = document.getElementById('hourInput');
        const minuteInput = document.getElementById('minuteInput');
        const scheduleStatus = document.getElementById('scheduleStatus');

        // تشغيل الـ Workflow
        document.getElementById('runWorkflowBtn').onclick = async function() {
          const st = document.getElementById('workflowStatus');
          setStatus(st, "جاري التشغيل...", "");
          try {
            const res = await fetch("/api/run-workflow", {
              method: "POST",
              headers: getHeaders()
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setStatus(st, "تم التشغيل ✓", "ok");
          } catch (err) { setStatus(st, "خطأ: " + err.message, "err"); }
        };

        // التحقق من الجلسة
        document.getElementById('checkSessionBtn').onclick = async function() {
          const statusText = document.getElementById('sessionStatusText');
          const indicator = document.getElementById('sessionStatusIndicator');
          try {
            const res = await fetch('/api/live/status');
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            const status = data.status || 'غير معروف';
            statusText.textContent = status;
            indicator.className = 'inline-status';
            if (status === 'connected') indicator.classList.add('on');
            else if (status === 'disconnected') indicator.classList.add('off');
            else indicator.classList.add('warn');
            setStatus(document.getElementById('workflowStatus'), 'تم التحقق ✓', 'ok');
          } catch (err) {
            statusText.textContent = 'خطأ';
            indicator.className = 'inline-status off';
            setStatus(document.getElementById('workflowStatus'), 'خطأ: ' + err.message, 'err');
          }
        };

        // تحميل الجدولة
        async function loadSchedule() {
          setStatus(scheduleStatus, "جاري التحميل...", "");
          try {
            const res = await fetch("/api/schedule");
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            const ind = document.getElementById('scheduleIndicator');
            const disp = document.getElementById('currentCronDisplay');
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
            const res = await fetch("/api/schedule", {
              method: "POST",
              headers: getHeaders(),
              body: JSON.stringify({ action: "add", cron: cron })
            });
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
        // التحقق التلقائي عند التحميل (مرة واحدة)
        document.getElementById('checkSessionBtn').click();
      })();
    </script>
  `;
  return layout(content, 'schedule');
}
