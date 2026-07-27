// src/pages/images.js
import { getHeaders, showToast } from '../utils.js';

let selectedFiles = [];

export function render() {
  return `
    <div class="page-header">
      <h1><i class="fas fa-images"></i> إدارة الصور</h1>
      <p style="color:var(--text-muted);">رفع وحذف الصور (الحد الأقصى 3 صور)</p>
    </div>
    <div class="card">
      <div style="background:var(--bg-main); padding:16px; border-radius:8px; border:1px dashed var(--border-color); margin-bottom:16px;">
        <input type="file" id="imagesInput" accept="image/*" multiple style="width:100%; margin-bottom:10px;" />
        <div id="imagePreviewArea" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
      </div>
      <div class="btn-row" style="margin-top:0;">
        <button id="uploadImagesBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-upload"></i> رفع الصور</button>
        <button id="refreshImagesBtn" class="btn" style="width:auto;"><i class="fas fa-sync"></i> تحديث القائمة</button>
      </div>
      <div id="imageGallery" style="margin-top:16px; display:none;">
        <div style="margin-bottom:10px;">
          <span style="font-size:14px; color:var(--text-muted);">الصور الموجودة (<span id="imageCount">0</span>/3)</span>
        </div>
        <div id="imageList" style="display:flex; flex-wrap:wrap; gap:12px;"></div>
      </div>
      <div id="imagesStatus" class="status"></div>
    </div>
  `;
}

export function init() {
  const input = document.getElementById('imagesInput');
  const preview = document.getElementById('imagePreviewArea');

  input.addEventListener('change', function(e) {
    selectedFiles = Array.from(this.files);
    renderPreviews();
  });

  function renderPreviews() {
    preview.innerHTML = '';
    selectedFiles.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = function(ev) {
        const div = document.createElement('div');
        div.style.cssText = 'width:80px; height:80px; border-radius:8px; overflow:hidden; position:relative; border:1px solid var(--border-color);';
        div.innerHTML = `
          <img src="${ev.target.result}" style="width:100%; height:100%; object-fit:cover;" />
          <button data-index="${index}" style="position:absolute; top:2px; right:2px; background:var(--danger); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px;">X</button>
        `;
        preview.appendChild(div);
        div.querySelector('button').onclick = function() {
          selectedFiles.splice(index, 1);
          renderPreviews();
        };
      };
      reader.readAsDataURL(file);
    });
  }

  document.getElementById('uploadImagesBtn').addEventListener('click', uploadImages);
  document.getElementById('refreshImagesBtn').addEventListener('click', loadImages);
  loadImages();
}

async function loadImages() {
  const gallery = document.getElementById('imageGallery');
  const list = document.getElementById('imageList');
  const countSpan = document.getElementById('imageCount');
  const status = document.getElementById('imagesStatus');
  status.textContent = 'جاري التحميل...';
  status.className = 'status';
  try {
    const res = await fetch('/api/images', { headers: getHeaders() });
    const data = await res.json();
    if (!data.ok) throw new Error(data.error);
    const files = data.files || [];
    countSpan.textContent = files.length;
    if (files.length === 0) { gallery.style.display = 'none'; status.textContent = 'لا توجد صور'; status.className = 'status'; return; }
    gallery.style.display = 'block';
    list.innerHTML = '';
    files.forEach(file => {
      const div = document.createElement('div');
      div.className = 'image-item';
      div.innerHTML = `
        <img src="${file.download_url}" style="width:100%; height:100%; object-fit:cover;" />
        <button class="delete-btn" data-filename="${file.name}" style="position:absolute; top:4px; right:4px; background:var(--danger); border:none; color:white; border-radius:50%; width:24px; height:24px; cursor:pointer; display:flex; align-items:center; justify-content:center; font-size:11px; box-shadow:0 2px 8px rgba(0,0,0,0.5);"><i class="fas fa-trash"></i></button>
      `;
      list.appendChild(div);
    });
    // ربط أحداث الحذف
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async function() {
        const filename = this.dataset.filename;
        if (!confirm(`تأكيد حذف الصورة "${filename}"؟`)) return;
        try {
          const res = await fetch('/api/delete-image', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ filename })
          });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          showToast('تم حذف الصورة', 'success');
          loadImages();
        } catch (e) {
          showToast('خطأ في الحذف: ' + e.message, 'error');
        }
      });
    });
    status.textContent = '✓ تم التحميل';
    status.className = 'status ok';
  } catch (e) {
    status.textContent = 'خطأ: ' + e.message;
    status.className = 'status err';
  }
}

async function uploadImages() {
  const status = document.getElementById('imagesStatus');
  if (selectedFiles.length === 0) {
    showToast('اختر صورة أولاً', 'warning');
    return;
  }
  try {
    // التحقق من العدد الحالي
    const checkRes = await fetch('/api/images', { headers: getHeaders() });
    const checkData = await checkRes.json();
    if (!checkData.ok) throw new Error(checkData.error);
    const currentCount = checkData.files ? checkData.files.length : 0;
    if (currentCount >= 3) {
      showToast('لا يمكن رفع أكثر من 3 صور', 'error');
      return;
    }
    const remaining = 3 - currentCount;
    if (selectedFiles.length > remaining) {
      showToast(`يمكنك رفع ${remaining} صورة فقط`, 'warning');
      return;
    }
  } catch (e) {
    showToast('خطأ في التحقق: ' + e.message, 'error');
    return;
  }

  let success = 0;
  for (const file of selectedFiles) {
    try {
      const base64 = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(r.result.split(',')[1]);
        r.onerror = reject;
        r.readAsDataURL(file);
      });
      const res = await fetch('/api/upload-image', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ filename: file.name, dataBase64: base64 })
      });
      const data = await res.json();
      if (data.ok) success++;
    } catch (e) {}
  }
  showToast(`${success}/${selectedFiles.length} تم رفعها`, success === selectedFiles.length ? 'success' : 'warning');
  if (success === selectedFiles.length) {
    selectedFiles = [];
    document.getElementById('imagesInput').value = '';
    document.getElementById('imagePreviewArea').innerHTML = '';
  }
  loadImages();
}
