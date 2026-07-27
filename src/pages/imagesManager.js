import { layout } from './layout.js';

export function renderImagesManager(env) {
  const content = `
    <h2 style="margin-bottom: 20px;"><i class="fas fa-images" style="color:var(--accent);"></i> إدارة الصور</h2>
    <div class="card">
      <div class="card-header"><i class="fas fa-upload"></i><h2>رفع الصور</h2></div>
      <div class="card-hint">الحد الأقصى 3 صور</div>
      <div style="background: var(--bg-main); padding: 15px; border-radius: 8px; border: 1px dashed var(--border-color);">
        <input type="file" id="imagesInput" accept="image/*" multiple style="width:100%; margin-bottom: 10px;" />
        <div id="imagePreviewArea" style="display:flex; flex-wrap:wrap; gap:10px;"></div>
      </div>
      <div class="btn-row" style="justify-content: flex-start;">
        <button class="btn btn-primary" id="uploadImagesBtn" style="width: auto;"><i class="fas fa-upload"></i> رفع الصور</button>
        <button class="btn" id="refreshImagesBtn" style="width: auto;"><i class="fas fa-sync"></i> تحديث القائمة</button>
      </div>
      <div id="imageGallery" style="display: none; margin-top: 16px;">
        <div style="margin-bottom:10px;">
          <span style="font-size:14px; color:var(--text-muted);">الصور الموجودة (<span id="imageCount">0</span>/3)</span>
        </div>
        <div id="imageList"></div>
      </div>
      <div class="status" id="imagesStatus"></div>
    </div>

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

    <script>
      (function() {
        const imagesInput = document.getElementById('imagesInput');
        const previewArea = document.getElementById('imagePreviewArea');
        let selectedFiles = [];
        imagesInput.addEventListener('change', function(e) {
          selectedFiles = Array.from(this.files);
          renderPreviews();
        });
        function renderPreviews() {
          previewArea.innerHTML = "";
          selectedFiles.forEach((file, index) => {
            const reader = new FileReader();
            reader.onload = function(ev) {
              const div = document.createElement('div');
              div.style.cssText = "width:80px; height:80px; border-radius:8px; overflow:hidden; position:relative; border:1px solid var(--border-color);";
              div.innerHTML = '<img src="' + ev.target.result + '" style="width:100%; height:100%; object-fit:cover;" />' +
                              '<button data-index="' + index + '" style="position:absolute; top:2px; right:2px; background:var(--danger); color:white; border:none; border-radius:50%; width:20px; height:20px; cursor:pointer; font-size:10px;">X</button>';
              previewArea.appendChild(div);
              div.querySelector('button').onclick = function() {
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
          const status = document.getElementById('imagesStatus');
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
                    headers: getHeaders(),
                    body: JSON.stringify({ filename: file.name })
                  });
                  const dataDel = await resDel.json();
                  if (!dataDel.ok) throw new Error(dataDel.error);
                  div.remove();
                  const newCount = parseInt(countSpan.textContent) - 1;
                  countSpan.textContent = newCount;
                  if (newCount === 0) gallery.style.display = 'none';
                  setStatus(status, 'تم حذف الصورة ✓', 'ok');
                } catch (err) {
                  setStatus(status, 'خطأ في الحذف: ' + err.message, 'err');
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
              const res = await fetch("/api/upload-image", {
                method: "POST",
                headers: getHeaders(),
                body: JSON.stringify({ filename: file.name, dataBase64: base64 })
              });
              const data = await res.json();
              if (data.ok) success++;
            } catch (err) {}
          }
          setStatus(document.getElementById('imagesStatus'), success + "/" + selectedFiles.length + " تم رفعها", success === selectedFiles.length ? "ok" : "err");
          if (success === selectedFiles.length) { selectedFiles = []; imagesInput.value = ""; renderPreviews(); }
          loadImages();
        };

        // images.json
        const imagesListArea = document.getElementById('imagesListArea');
        const imagesListStatus = document.getElementById('imagesListStatus');
        document.getElementById("loadImagesListBtn").onclick = () => loadFile("images", imagesListArea, imagesListStatus);
        document.getElementById("saveImagesListBtn").onclick = () => saveFile("images", imagesListArea, imagesListStatus);

        loadImages();
        loadFile("images", imagesListArea, imagesListStatus);
      })();
    </script>
  `;
  return layout(content, 'images');
}
