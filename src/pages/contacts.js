// src/pages/contacts.js
import { getHeaders, showToast, copyToClipboard } from '../utils.js';

let contactsData = [];
let filteredData = [];

export function render() {
  return `
    <div class="page-header">
      <h1><i class="fas fa-address-book"></i> جهات الاتصال</h1>
      <p style="color:var(--text-muted);">إدارة جهات الاتصال من accounts.json</p>
    </div>
    <div class="card">
      <div style="display:flex; flex-wrap:wrap; gap:12px; margin-bottom:16px; align-items:center;">
        <input type="text" id="contactsFilter" placeholder="فلترة..." style="flex:1; min-width:200px; background:var(--input-bg); color:var(--text-main); border:1px solid var(--border-color); border-radius:6px; padding:10px 14px; font-family:'Tajawal';" />
        <button id="addContactBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-plus"></i> إضافة</button>
        <button id="copyNumbersBtn" class="btn" style="width:auto;"><i class="fas fa-copy"></i> نسخ الأرقام (المفلترة)</button>
        <button id="saveContactsBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-save"></i> حفظ</button>
        <span id="filteredCount" style="color:var(--text-muted); font-size:13px;">0 صف</span>
      </div>
      <div style="overflow:auto; border:1px solid var(--border-color); border-radius:8px;">
        <table style="width:100%; border-collapse:collapse; font-size:14px;">
          <thead style="background:var(--card-bg); position:sticky; top:0;">
            <tr>
              <th style="padding:10px 6px; text-align:center;">#</th>
              <th style="padding:10px 6px; text-align:right;">الاسم</th>
              <th style="padding:10px 6px; text-align:right;">النوع</th>
              <th style="padding:10px 6px; text-align:right;">الرقم</th>
              <th style="padding:10px 6px; text-align:right;">العمر</th>
              <th style="padding:10px 6px; text-align:center;">إجراء</th>
            </tr>
          </thead>
          <tbody id="contactsTableBody">
            <tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">جاري التحميل...</td></tr>
          </tbody>
        </table>
      </div>
      <div id="contactsStatus" class="status" style="margin-top:12px;"></div>
    </div>
  `;
}

export async function init() {
  await loadContacts();
  bindEvents();
}

async function loadContacts() {
  try {
    const res = await fetch('/api/contacts', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    contactsData = data.data || [];
    renderTable();
    showToast('تم تحميل البيانات', 'success');
  } catch (e) {
    showToast('خطأ في التحميل: ' + e.message, 'error');
  }
}

function renderTable() {
  const filter = document.getElementById('contactsFilter')?.value?.trim().toLowerCase() || '';
  filteredData = contactsData.filter(row => {
    return Object.values(row).some(val => String(val).toLowerCase().includes(filter));
  });
  document.getElementById('filteredCount').textContent = filteredData.length + ' صف';

  const tbody = document.getElementById('contactsTableBody');
  if (filteredData.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding:20px; color:var(--text-muted);">لا توجد بيانات</td></tr>`;
    return;
  }

  tbody.innerHTML = filteredData.map((row, idx) => {
    const realIndex = contactsData.indexOf(row);
    return `
      <tr data-index="${realIndex}">
        <td style="text-align:center; padding:6px;">${idx+1}</td>
        <td contenteditable="true" class="editable" data-field="name" style="padding:6px;">${row.name || ''}</td>
        <td contenteditable="true" class="editable" data-field="gender" style="padding:6px;">${row.gender || ''}</td>
        <td contenteditable="true" class="editable" data-field="number" style="padding:6px; direction:ltr;">${row.number || ''}</td>
        <td contenteditable="true" class="editable" data-field="age" style="padding:6px;">${row.age || ''}</td>
        <td style="text-align:center; padding:6px;">
          <button class="deleteRowBtn btn" style="width:auto; padding:2px 10px; background:var(--danger); color:white; border:none; border-radius:4px; cursor:pointer; font-size:12px;">حذف</button>
        </td>
      </tr>
    `;
  }).join('');

  // ربط أحداث التعديل
  document.querySelectorAll('.editable').forEach(cell => {
    cell.addEventListener('blur', function() {
      const tr = this.closest('tr');
      const index = parseInt(tr.dataset.index);
      const field = this.dataset.field;
      const newValue = this.textContent.trim();
      if (contactsData[index]) {
        contactsData[index][field] = newValue;
      }
    });
  });

  // ربط أحداث الحذف
  document.querySelectorAll('.deleteRowBtn').forEach(btn => {
    btn.addEventListener('click', function() {
      const tr = this.closest('tr');
      const index = parseInt(tr.dataset.index);
      if (confirm('تأكيد حذف هذا الصف؟')) {
        contactsData.splice(index, 1);
        renderTable();
        showToast('تم الحذف (لم يحفظ بعد)', 'info');
      }
    });
  });
}

function bindEvents() {
  // فلترة
  document.getElementById('contactsFilter').addEventListener('input', renderTable);

  // إضافة صف
  document.getElementById('addContactBtn').addEventListener('click', () => {
    contactsData.push({ name: '', gender: '', number: '', age: '' });
    renderTable();
    showToast('تمت الإضافة (لم يحفظ بعد)', 'info');
  });

  // حفظ التغييرات
  document.getElementById('saveContactsBtn').addEventListener('click', async () => {
    try {
      const res = await fetch('/api/contacts', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ data: contactsData })
      });
      const data = await res.json();
      if (!data.ok) throw new Error(data.error);
      showToast('تم حفظ التغييرات بنجاح ✓', 'success');
    } catch (e) {
      showToast('خطأ في الحفظ: ' + e.message, 'error');
    }
  });

  // نسخ الأرقام المفلترة
  document.getElementById('copyNumbersBtn').addEventListener('click', async () => {
    const numbers = filteredData.map(row => row.number).filter(Boolean);
    if (numbers.length === 0) {
      showToast('لا توجد أرقام للنسخ', 'warning');
      return;
    }
    try {
      await copyToClipboard(numbers.join('\n'));
      showToast('تم نسخ ' + numbers.length + ' رقم', 'success');
    } catch (e) {
      showToast('فشل النسخ', 'error');
    }
  });
}
