// src/pages/logs.js
import { getHeaders, showToast } from '../utils.js';

export function render() {
  return `
    <div class="page-header">
      <h1><i class="fas fa-terminal"></i> السجلات</h1>
      <p style="color:var(--text-muted);">عرض ملفات السجل من مجلد logs</p>
    </div>
    <div class="card">
      <div style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px;">
        <button id="refreshLogsBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-sync"></i> تحديث</button>
      </div>
      <div id="logsList" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:16px;"></div>
      <div style="border:1px solid var(--border-color); border-radius:8px; background:var(--bg-main); padding:16px; min-height:200px; max-height:400px; overflow:auto; font-family:monospace; font-size:13px; white-space:pre-wrap;" id="logContent">اختر ملف سجل لعرض محتواه</div>
      <div id="logsStatus" class="status"></div>
    </div>
  `;
}

export async function init() {
  await loadLogsList();
  document.getElementById('refreshLogsBtn').addEventListener('click', loadLogsList);
}

async function loadLogsList() {
  const listEl = document.getElementById('logsList');
  const statusEl = document.getElementById('logsStatus');
  statusEl.textContent = 'جاري التحميل...';
  statusEl.className = 'status';
  try {
    const res = await fetch('/api/logs', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    listEl.innerHTML = '';
    if (data.files.length === 0) {
      listEl.innerHTML = '<span style="color:var(--text-muted);">لا توجد سجلات</span>';
      statusEl.textContent = 'لا توجد ملفات';
      statusEl.className = 'status';
      return;
    }
    data.files.forEach(file => {
      const btn = document.createElement('button');
      btn.className = 'btn';
      btn.textContent = file.name;
      btn.style.width = 'auto';
      btn.addEventListener('click', () => loadLogContent(file.name));
      listEl.appendChild(btn);
    });
    statusEl.textContent = '✓ تم التحميل';
    statusEl.className = 'status ok';
  } catch (e) {
    statusEl.textContent = 'خطأ: ' + e.message;
    statusEl.className = 'status err';
    showToast('فشل تحميل قائمة السجلات', 'error');
  }
}

async function loadLogContent(filename) {
  const contentEl = document.getElementById('logContent');
  contentEl.textContent = 'جاري التحميل...';
  try {
    const res = await fetch('/api/log-content?file=' + encodeURIComponent(filename), { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    contentEl.textContent = data.content || '(فارغ)';
  } catch (e) {
    contentEl.textContent = 'خطأ: ' + e.message;
    showToast('فشل تحميل المحتوى', 'error');
  }
}
