export const HTML_EDIT = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>تحرير - مدير واتساب</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<style>
  /* الأنماط (نفسها من الصفحة الرئيسية مع إضافات خاصة بالتحرير) */
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
  textarea {
    width: 100%;
    min-height: 120px;
    background: var(--input-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 12px;
    font-family: 'Consolas', monospace;
    font-size: 13px;
    resize: vertical;
    direction: ltr; text-align: left;
  }
  textarea:focus { outline: none; border-color: var(--accent); }
  .content-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
  @media (max-width:768px) { .content-grid { grid-template-columns:1fr; } }

  /* أنماط جهات الاتصال */
  .contact-form { display: flex; flex-wrap: wrap; gap: 12px; align-items: end; background: var(--bg-main); padding: 16px; border-radius: 8px; margin-bottom: 16px; border: 1px solid var(--border-color); }
  .contact-form .field { display: flex; flex-direction: column; gap: 4px; flex: 1 0 120px; }
  .contact-form .field label { font-size: 12px; color: var(--text-muted); }
  .contact-form .field input, .contact-form .field select { background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 8px; color: var(--text-main); font-family: 'Tajawal'; }
  .contact-form .field input:focus, .contact-form .field select:focus { outline: none; border-color: var(--accent); }
  .contact-table-wrap { max-height: 300px; overflow-y: auto; border-radius: 8px; border: 1px solid var(--border-color); }
  .contact-table { width: 100%; border-collapse: collapse; font-size: 14px; }
  .contact-table th { text-align: right; padding: 10px 12px; background: var(--input-bg); color: var(--text-muted); border-bottom: 1px solid var(--border-color); font-weight: 500; position: sticky; top: 0; z-index: 2; }
  .contact-table td { padding: 10px 12px; border-bottom: 1px solid var(--border-color); color: var(--text-main); }
  .contact-table tr:last-child td { border-bottom: none; }
  .contact-table .actions { display: flex; gap: 6px; }
  .contact-table .actions button { background: transparent; border: none; color: var(--text-muted); cursor: pointer; padding: 4px 6px; border-radius: 4px; transition: 0.2s; }
  .contact-table .actions button:hover { background: var(--border-color); color: var(--text-main); }
  .contact-table .actions .edit-btn:hover { color: var(--warning); }
  .contact-table .actions .del-btn:hover { color: var(--danger); }
  .filter-row { display: flex; flex-wrap: wrap; gap: 16px; align-items: center; margin-bottom: 16px; }
  .filter-row label { display: flex; flex-direction: column; gap: 4px; font-size: 12px; color: var(--text-muted); }
  .filter-row select, .filter-row input { background: var(--input-bg); border: 1px solid var(--border-color); border-radius: 6px; padding: 6px 10px; color: var(--text-main); font-family: 'Tajawal'; }
  .filter-row select:focus, .filter-row input:focus { outline: none; border-color: var(--accent); }
  .image-item { position: relative; width: 90px; height: 90px; border-radius: 8px; overflow: hidden; border: 1px solid var(--border-color); flex-shrink: 0; }
  .image-item img { width: 100%; height: 100%; object-fit: cover; }
  .image-item .delete-btn { position: absolute; top: 4px; right: 4px; background: var(--danger); border: none; color: white; border-radius: 50%; width: 24px; height: 24px; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 11px; box-shadow: 0 2px 8px rgba(0,0,0,0.5); }
  #imageList { display: flex; flex-wrap: wrap; gap: 12px; }
</style>
</head>
<body>

<nav class="navbar">
  <div class="brand"><i class="fab fa-whatsapp"></i> مدير واتساب</div>
  <div class="nav-links">
    <a href="/"><i class="fas fa-home"></i> الرئيسية</a>
    <a href="/edit" class="active"><i class="fas fa-edit"></i> تحرير</a>
    <a href="/stats"><i class="fas fa-chart-bar"></i> إحصائيات</a>
  </div>
</nav>

<div class="main-content">
  <!-- قسم الرسائل -->
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

  <!-- قسم جهات الاتصال المتقدمة -->
  <div class="card">
    <div class="card-header"><i class="fas fa-address-book"></i><h2>جهات الاتصال (من contact.json)</h2></div>
    <div class="card-hint">إدارة جهات الاتصال مع فلتر وتصدير الأرقام إلى Contacts Area</div>

    <!-- فلتر -->
    <div class="filter-row">
      <label>الجنس
        <select id="genderFilter">
          <option value="all">الكل</option>
          <option value="ذكر">ذكر</option>
          <option value="أنثى">أنثى</option>
        </select>
      </label>
      <label>العمر من
        <input type="number" id="ageFrom" value="0" min="0" max="100" style="width:70px;" />
      </label>
      <label>إلى
        <input type="number" id="ageTo" value="100" min="0" max="100" style="width:70px;" />
      </label>
      <button class="btn btn-primary" id="applyFilterBtn" style="width:auto;"><i class="fas fa-filter"></i> تطبيق</button>
      <button class="btn" id="resetFilterBtn" style="width:auto;"><i class="fas fa-undo"></i> إعادة ضبط</button>
    </div>

    <!-- نموذج إضافة/تعديل -->
    <div class="contact-form">
      <div class="field"><label>الاسم</label><input type="text" id="contactName" placeholder="الاسم" /></div>
      <div class="field"><label>الجنس</label>
        <select id="contactGender"><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select>
      </div>
      <div class="field"><label>الرقم</label><input type="text" id="contactNumber" placeholder="رقم الهاتف" /></div>
      <div class="field"><label>العمر</label><input type="number" id="contactAge" placeholder="العمر" min="1" max="100" /></div>
      <div class="field" style="flex:0 0 auto;">
        <button class="btn btn-primary" id="addContactBtn"><i class="fas fa-plus"></i> إضافة</button>
        <button class="btn btn-warning" id="updateContactBtn" style="display:none;"><i class="fas fa-save"></i> تحديث</button>
        <button class="btn" id="cancelEditBtn" style="display:none;"><i class="fas fa-times"></i> إلغاء</button>
      </div>
    </div>

    <!-- جدول جهات الاتصال -->
    <div class="contact-table-wrap">
      <table class="contact-table">
        <thead><tr><th>#</th><th>الاسم</th><th>الجنس</th><th>الرقم</th><th>العمر</th><th>إجراءات</th></tr></thead>
        <tbody id="contactsTableBody"></tbody>
      </table>
    </div>

    <!-- أزرار حفظ وتصدير -->
    <div class="btn-row">
      <button class="btn btn-primary" id="saveContactsBtn"><i class="fas fa-save"></i> حفظ جهات الاتصال (contact.json)</button>
      <button class="btn btn-warning" id="exportNumbersBtn"><i class="fas fa-arrow-left"></i> تصدير الأرقام (المفلترة) إلى Contacts Area</button>
    </div>
    <div class="status" id="contactsStatus"></div>
  </div>

  <!-- Contacts Area (النصية) -->
  <div class="card">
    <div class="card-header"><i class="fas fa-list-ul"></i><h2>Contacts Area (للإرسال)</h2></div>
    <div class="card-hint">هنا يتم وضع الأرقام المستوردة من الجدول (كل رقم في سطر)</div>
    <textarea id="contactsArea" placeholder="سيتم ملؤها تلقائياً عند تصدير الأرقام..."></textarea>
    <div class="btn-row">
      <button class="btn" id="loadContactsAreaBtn"><i class="fas fa-download"></i> تحميل (من accounts.json)</button>
      <button class="btn btn-primary" id="saveContactsAreaBtn"><i class="fas fa-save"></i> حفظ (إلى accounts.json)</button>
    </div>
    <div class="status" id="contactsAreaStatus"></div>
  </div>

  <!-- قسم الصور -->
  <div class="card">
    <div class="card-header"><i class="fas fa-images"></i><h2>رفع الصور</h2></div>
    <div class="card-hint">الحد الأقصى 3 صور</div>
    <div style="background:var(--bg-main); padding:15px; border-radius:8px; border:1px dashed var(--border-color);">
      <input type="file" id="imagesInput" accept="image/*" multiple style="width:100%; margin-bottom:10px;" />
      <div id="imagePreviewArea" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
    </div>
    <div class="btn-row" style="justify-content:flex-start;">
      <button class="btn btn-primary" id="uploadImagesBtn" style="width:auto;"><i class="fas fa-upload"></i> رفع الصور</button>
      <button class="btn" id="refreshImagesBtn" style="width:auto;"><i class="fas fa-sync"></i> تحديث القائمة</button>
    </div>
    <div id="imageGallery" style="display:none; margin-top:16px;">
      <div style="margin-bottom:10px;">
        <span style="font-size:14px; color:var(--text-muted);">الصور الموجودة (<span id="imageCount">0</span>/3)</span>
      </div>
      <div id="imageList"></div>
    </div>
    <div class="status" id="imagesStatus"></div>
  </div>

  <!-- images.json -->
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
</div>

<script>
function setStatus(el, msg, type) { el.textContent = msg; el.className = "status" + (type ? " " + type : ""); }

// ===== الرسائل =====
async function loadFile(type, areaEl, statusEl) {
  setStatus(statusEl, "جاري التحميل...", "");
  try {
    const res = await fetch("/api/load?type=" + type);
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    areaEl.value = data.text;
    setStatus(statusEl, "تم التحميل ✓", "ok");
  } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
}
async function saveFile(type, areaEl, statusEl) {
  setStatus(statusEl, "جاري الحفظ...", "");
  try {
    const res = await fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type, text: areaEl.value }) });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(statusEl, "تم الحفظ ✓", "ok");
  } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
}
document.getElementById("loadMessagesBtn").onclick = () => loadFile("messages", document.getElementById("messagesArea"), document.getElementById("messagesStatus"));
document.getElementById("saveMessagesBtn").onclick = () => saveFile("messages", document.getElementById("messagesArea"), document.getElementById("messagesStatus"));

// ===== Contacts Area (accounts.json) =====
document.getElementById("loadContactsAreaBtn").onclick = () => loadFile("contacts", document.getElementById("contactsArea"), document.getElementById("contactsAreaStatus"));
document.getElementById("saveContactsAreaBtn").onclick = () => saveFile("contacts", document.getElementById("contactsArea"), document.getElementById("contactsAreaStatus"));

// ===== images.json =====
document.getElementById("loadImagesListBtn").onclick = () => loadFile("images", document.getElementById("imagesListArea"), document.getElementById("imagesListStatus"));
document.getElementById("saveImagesListBtn").onclick = () => saveFile("images", document.getElementById("imagesListArea"), document.getElementById("imagesListStatus"));

// ===== إدارة الصور =====
const imagesInput = document.getElementById("imagesInput");
const previewArea = document.getElementById("imagePreviewArea");
let selectedFiles = [];
imagesInput.addEventListener("change", function(e) {
  selectedFiles = Array.from(this.files);
  renderPreviews();
});
function renderPreviews() {
  previewArea.innerHTML = "";
  selectedFiles.forEach((file, index) => {
    const reader = new FileReader();
    reader.onload = function(ev) {
      const div = document.createElement("div");
      div.style.cssText = "width:80px; height:80px; border-radius:8px; overflow:hidden; position:relative; border:1px solid var(--border-color);";
      div.innerHTML = '<img src="' + ev.target.result + '" style="width:100%; height:100%; object-fit:cover;" />' +
                      '<button data-index="' + index + '" style="position:absolute; top:2px; right:2px; background:var(--danger); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px;">X</button>';
      previewArea.appendChild(div);
      div.querySelector("button").onclick = function() {
        selectedFiles.splice(index, 1);
        renderPreviews();
      };
    };
    reader.readAsDataURL(file);
  });
}

async function loadImages() {
  const gallery = document.getElementById('imageGallery');
  const list = document.getElementById('imageList');
  const countSpan = document.getElementById('imageCount');
  try {
    const res = await fetch('/api/images');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    const files = data.files || [];
    countSpan.textContent = files.length;
    if (files.length === 0) { gallery.style.display = 'none'; return; }
    gallery.style.display = 'block';
    list.innerHTML = '';
    files.forEach(file => {
      const div = document.createElement('div');
      div.className = 'image-item';
      const img = document.createElement('img');
      img.src = file.download_url || \`https://raw.githubusercontent.com/bergham123/wtsc/main/images/\${file.name}\`;
      const deleteBtn = document.createElement('button');
      deleteBtn.className = 'delete-btn';
      deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
      deleteBtn.onclick = async () => {
        if (!confirm(\`تأكيد حذف الصورة "\${file.name}"؟\`)) return;
        try {
          const resDel = await fetch('/api/delete-image', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: file.name })
          });
          const dataDel = await resDel.json();
          if (!dataDel.ok) throw new Error(dataDel.error);
          div.remove();
          const newCount = parseInt(countSpan.textContent) - 1;
          countSpan.textContent = newCount;
          if (newCount === 0) gallery.style.display = 'none';
          setStatus(document.getElementById('imagesStatus'), 'تم حذف الصورة ✓', 'ok');
        } catch (err) {
          setStatus(document.getElementById('imagesStatus'), 'خطأ في الحذف: ' + err.message, 'err');
        }
      };
      div.appendChild(img);
      div.appendChild(deleteBtn);
      list.appendChild(div);
    });
  } catch (err) {
    console.error('Error loading images:', err);
    gallery.style.display = 'none';
  }
}
document.getElementById('refreshImagesBtn').onclick = loadImages;

document.getElementById('uploadImagesBtn').onclick = async function() {
  if (selectedFiles.length === 0) { setStatus(document.getElementById('imagesStatus'), 'اختر صورة أولاً', 'err'); return; }
  try {
    const resCheck = await fetch('/api/images');
    const dataCheck = await resCheck.json();
    if (!dataCheck.ok) throw new Error(dataCheck.error);
    const currentCount = dataCheck.files ? dataCheck.files.length : 0;
    if (currentCount >= 3) {
      setStatus(document.getElementById('imagesStatus'), 'لا يمكن رفع أكثر من 3 صور. قم بحذف بعض الصور أولاً.', 'err');
      return;
    }
    const remaining = 3 - currentCount;
    if (selectedFiles.length > remaining) {
      setStatus(document.getElementById('imagesStatus'), \`يمكنك رفع \${remaining} صورة فقط (الحد الأقصى 3)\`, 'err');
      return;
    }
  } catch (err) {
    setStatus(document.getElementById('imagesStatus'), 'خطأ في التحقق من عدد الصور: ' + err.message, 'err');
    return;
  }
  let success = 0;
  for (const file of selectedFiles) {
    try {
      const base64 = await new Promise((resolve, reject) => { const r = new FileReader(); r.onload = () => resolve(r.result.split(",")[1]); r.onerror = reject; r.readAsDataURL(file); });
      const res = await fetch("/api/upload-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, dataBase64: base64 }) });
      const data = await res.json();
      if (data.ok) success++;
    } catch (err) {}
  }
  setStatus(document.getElementById('imagesStatus'), success + "/" + selectedFiles.length + " تم رفعها", success === selectedFiles.length ? "ok" : "err");
  if (success === selectedFiles.length) { selectedFiles = []; imagesInput.value = ""; renderPreviews(); }
  loadImages();
};
loadImages();

// ===== إدارة جهات الاتصال المتقدمة =====
let contacts = [];
let editingIndex = null;

// تحميل جهات الاتصال من contact.json
async function loadContacts() {
  try {
    const res = await fetch('/api/structured-contacts');
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    contacts = data.data || [];
    renderContactsTable(contacts);
    setStatus(document.getElementById('contactsStatus'), 'تم تحميل جهات الاتصال ✓', 'ok');
  } catch (err) {
    contacts = [];
    renderContactsTable([]);
    setStatus(document.getElementById('contactsStatus'), 'خطأ في التحميل: ' + err.message, 'err');
  }
}

// عرض الجدول مع تطبيق الفلتر
function renderContactsTable(data) {
  const tbody = document.getElementById('contactsTableBody');
  tbody.innerHTML = '';
  data.forEach((c, idx) => {
    const tr = document.createElement('tr');
    tr.innerHTML = \`
      <td>\${idx+1}</td>
      <td>\${c.name || ''}</td>
      <td>\${c.gender || ''}</td>
      <td>\${c.number || ''}</td>
      <td>\${c.age || ''}</td>
      <td class="actions">
        <button class="edit-btn" data-index="\${idx}"><i class="fas fa-edit"></i></button>
        <button class="del-btn" data-index="\${idx}"><i class="fas fa-trash"></i></button>
      </td>
    \`;
    tbody.appendChild(tr);
  });
  // ربط الأحداث
  tbody.querySelectorAll('.edit-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.dataset.index);
      editContact(idx);
    };
  });
  tbody.querySelectorAll('.del-btn').forEach(btn => {
    btn.onclick = function() {
      const idx = parseInt(this.dataset.index);
      if (confirm('تأكيد حذف هذا الاتصال؟')) {
        contacts.splice(idx, 1);
        renderContactsTable(getFilteredData());
        setStatus(document.getElementById('contactsStatus'), 'تم الحذف، اضغط حفظ لتأكيد التغيير', 'ok');
      }
    };
  });
}

// الحصول على البيانات المفلترة
function getFilteredData() {
  const gender = document.getElementById('genderFilter').value;
  const ageFrom = parseInt(document.getElementById('ageFrom').value) || 0;
  const ageTo = parseInt(document.getElementById('ageTo').value) || 100;
  return contacts.filter(c => {
    if (gender !== 'all' && c.gender !== gender) return false;
    const age = parseInt(c.age) || 0;
    if (age < ageFrom || age > ageTo) return false;
    return true;
  });
}

// تطبيق الفلتر
document.getElementById('applyFilterBtn').onclick = function() {
  renderContactsTable(getFilteredData());
};
document.getElementById('resetFilterBtn').onclick = function() {
  document.getElementById('genderFilter').value = 'all';
  document.getElementById('ageFrom').value = '0';
  document.getElementById('ageTo').value = '100';
  renderContactsTable(contacts);
};

// إضافة جهة اتصال
document.getElementById('addContactBtn').onclick = function() {
  const name = document.getElementById('contactName').value.trim();
  const gender = document.getElementById('contactGender').value;
  const number = document.getElementById('contactNumber').value.trim();
  const age = parseInt(document.getElementById('contactAge').value) || 0;
  if (!name || !number) {
    setStatus(document.getElementById('contactsStatus'), 'الاسم والرقم مطلوبان', 'err');
    return;
  }
  contacts.push({ name, gender, number, age });
  // تنظيف الحقول
  document.getElementById('contactName').value = '';
  document.getElementById('contactNumber').value = '';
  document.getElementById('contactAge').value = '';
  renderContactsTable(getFilteredData());
  setStatus(document.getElementById('contactsStatus'), 'تمت الإضافة، اضغط حفظ لتأكيد التغيير', 'ok');
};

// تعديل جهة اتصال
function editContact(index) {
  const c = contacts[index];
  document.getElementById('contactName').value = c.name || '';
  document.getElementById('contactGender').value = c.gender || 'ذكر';
  document.getElementById('contactNumber').value = c.number || '';
  document.getElementById('contactAge').value = c.age || '';
  editingIndex = index;
  document.getElementById('addContactBtn').style.display = 'none';
  document.getElementById('updateContactBtn').style.display = 'inline-flex';
  document.getElementById('cancelEditBtn').style.display = 'inline-flex';
}

document.getElementById('cancelEditBtn').onclick = function() {
  document.getElementById('contactName').value = '';
  document.getElementById('contactNumber').value = '';
  document.getElementById('contactAge').value = '';
  editingIndex = null;
  document.getElementById('addContactBtn').style.display = 'inline-flex';
  document.getElementById('updateContactBtn').style.display = 'none';
  document.getElementById('cancelEditBtn').style.display = 'none';
};

document.getElementById('updateContactBtn').onclick = function() {
  if (editingIndex === null) return;
  const name = document.getElementById('contactName').value.trim();
  const gender = document.getElementById('contactGender').value;
  const number = document.getElementById('contactNumber').value.trim();
  const age = parseInt(document.getElementById('contactAge').value) || 0;
  if (!name || !number) {
    setStatus(document.getElementById('contactsStatus'), 'الاسم والرقم مطلوبان', 'err');
    return;
  }
  contacts[editingIndex] = { name, gender, number, age };
  renderContactsTable(getFilteredData());
  document.getElementById('cancelEditBtn').click(); // إلغاء التحرير
  setStatus(document.getElementById('contactsStatus'), 'تم التحديث، اضغط حفظ لتأكيد التغيير', 'ok');
};

// حفظ جهات الاتصال إلى contact.json
document.getElementById('saveContactsBtn').onclick = async function() {
  const st = document.getElementById('contactsStatus');
  setStatus(st, 'جاري الحفظ...', '');
  try {
    const res = await fetch('/api/structured-contacts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: contacts })
    });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    setStatus(st, 'تم الحفظ ✓', 'ok');
  } catch (err) {
    setStatus(st, 'خطأ في الحفظ: ' + err.message, 'err');
  }
};

// تصدير الأرقام المفلترة إلى contactsArea
document.getElementById('exportNumbersBtn').onclick = function() {
  const filtered = getFilteredData();
  const numbers = filtered.map(c => c.number).filter(n => n.trim() !== '');
  const area = document.getElementById('contactsArea');
  area.value = numbers.join('\n');
  setStatus(document.getElementById('contactsStatus'), 'تم تصدير ' + numbers.length + ' رقم إلى Contacts Area', 'ok');
};

// تحميل جهات الاتصال عند بدء الصفحة
loadContacts();
</script>
</body>
</html>`;
