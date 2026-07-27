import { layout } from './layout.js';

export function renderContactsManager(env) {
  const content = `
    <h2 style="margin-bottom: 20px;"><i class="fas fa-address-book" style="color:var(--accent);"></i> إدارة جهات الاتصال (myconatcts.json)</h2>
    <div class="card">
      <div class="card-header"><i class="fas fa-list"></i><h2>قائمة جهات الاتصال</h2></div>
      <div class="btn-row" style="margin-top:0; margin-bottom:16px;">
        <button class="btn btn-primary" id="addContactBtn"><i class="fas fa-plus"></i> إضافة جديد</button>
        <button class="btn" id="refreshContactsBtn"><i class="fas fa-sync"></i> تحديث القائمة</button>
      </div>
      <div style="overflow-x:auto;">
        <table>
          <thead><tr><th>الاسم</th><th>الجنس</th><th>الرقم</th><th>العمر</th><th>الإجراءات</th></tr></thead>
          <tbody id="contactsTableBody"></tbody>
        </table>
      </div>
      <div class="status" id="contactsManagerStatus"></div>
    </div>

    <!-- Modal للإضافة/التعديل -->
    <div class="modal-overlay" id="contactModal">
      <div class="modal">
        <h3 id="modalTitle">إضافة جهة اتصال</h3>
        <input type="text" id="contactName" placeholder="الاسم" />
        <select id="contactGender"><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select>
        <input type="text" id="contactNumber" placeholder="رقم الهاتف" />
        <input type="number" id="contactAge" placeholder="العمر" />
        <div class="btn-row">
          <button class="btn btn-primary" id="saveContactBtn">حفظ</button>
          <button class="btn" id="closeContactModal">إلغاء</button>
        </div>
        <div class="status" id="contactModalStatus"></div>
      </div>
    </div>

    <script>
      (function() {
        const tbody = document.getElementById('contactsTableBody');
        const statusEl = document.getElementById('contactsManagerStatus');
        const modal = document.getElementById('contactModal');
        const modalTitle = document.getElementById('modalTitle');
        const nameInput = document.getElementById('contactName');
        const genderSelect = document.getElementById('contactGender');
        const numberInput = document.getElementById('contactNumber');
        const ageInput = document.getElementById('contactAge');
        const saveBtn = document.getElementById('saveContactBtn');
        const closeBtn = document.getElementById('closeContactModal');
        const modalStatus = document.getElementById('contactModalStatus');

        let editingIndex = -1;

        async function loadContacts() {
          setStatus(statusEl, "جاري التحميل...", "");
          try {
            const res = await fetch('/api/load?type=mycontacts');
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            let contacts = [];
            try { contacts = JSON.parse(data.text); } catch (e) { contacts = []; }
            if (!Array.isArray(contacts)) contacts = [];
            renderTable(contacts);
            setStatus(statusEl, "✓ تم التحميل", "ok");
          } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
        }

        function renderTable(contacts) {
          tbody.innerHTML = '';
          if (contacts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; color:var(--text-muted);">لا توجد جهات اتصال</td></tr>';
            return;
          }
          contacts.forEach((contact, index) => {
            const tr = document.createElement('tr');
            tr.innerHTML = \`
              <td>\${contact.name || ''}</td>
              <td>\${contact.gender || ''}</td>
              <td>\${contact.number || ''}</td>
              <td>\${contact.age || ''}</td>
              <td>
                <button class="btn btn-sm btn-warning" data-index="\${index}"><i class="fas fa-edit"></i></button>
                <button class="btn btn-sm btn-danger" data-index="\${index}"><i class="fas fa-trash"></i></button>
              </td>
            \`;
            tbody.appendChild(tr);
          });
          // ربط الأزرار
          tbody.querySelectorAll('button[data-index]').forEach(btn => {
            btn.addEventListener('click', function() {
              const idx = parseInt(this.dataset.index);
              if (this.classList.contains('btn-warning')) editContact(idx);
              else deleteContact(idx);
            });
          });
        }

        async function saveContacts(contacts) {
          try {
            const res = await fetch('/api/save', {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify({ type: 'mycontacts', text: JSON.stringify(contacts, null, 2) })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            return true;
          } catch (err) { throw err; }
        }

        function openModal(title, data) {
          modalTitle.textContent = title;
          nameInput.value = data.name || '';
          genderSelect.value = data.gender || 'ذكر';
          numberInput.value = data.number || '';
          ageInput.value = data.age || '';
          modal.classList.add('active');
          modalStatus.textContent = '';
        }

        function closeModal() {
          modal.classList.remove('active');
          editingIndex = -1;
        }

        async function addContact() {
          openModal('إضافة جهة اتصال', {});
        }

        function editContact(index) {
          const contacts = getCurrentContacts();
          if (!contacts[index]) return;
          editingIndex = index;
          openModal('تعديل جهة اتصال', contacts[index]);
        }

        async function deleteContact(index) {
          if (!confirm('هل تريد حذف هذه الجهة؟')) return;
          const contacts = getCurrentContacts();
          contacts.splice(index, 1);
          try {
            await saveContacts(contacts);
            loadContacts();
          } catch (err) {
            setStatus(statusEl, 'خطأ: ' + err.message, 'err');
          }
        }

        function getCurrentContacts() {
          // نقرأ من الجدول أو من البيانات المخزنة مؤقتاً (نفضل إعادة تحميل من API)
          // لكننا سنحتفظ بمتغير محلي
          if (!window._contactsCache) window._contactsCache = [];
          return window._contactsCache;
        }

        function setContactsCache(contacts) {
          window._contactsCache = contacts;
        }

        // حفظ من المودال
        saveBtn.addEventListener('click', async function() {
          const name = nameInput.value.trim();
          const gender = genderSelect.value;
          const number = numberInput.value.trim();
          const age = parseInt(ageInput.value);
          if (!name || !number) {
            setStatus(modalStatus, 'الاسم والرقم مطلوبان', 'err');
            return;
          }
          const contact = { name, gender, number, age: isNaN(age) ? '' : age };
          let contacts = getCurrentContacts();
          if (editingIndex === -1) {
            contacts.push(contact);
          } else {
            contacts[editingIndex] = contact;
          }
          try {
            await saveContacts(contacts);
            setContactsCache(contacts);
            closeModal();
            loadContacts();
          } catch (err) {
            setStatus(modalStatus, 'خطأ: ' + err.message, 'err');
          }
        });

        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', function(e) { if (e.target === modal) closeModal(); });

        // تهيئة المتغير المؤقت
        window._contactsCache = [];

        // أزرار
        document.getElementById('addContactBtn').addEventListener('click', addContact);
        document.getElementById('refreshContactsBtn').addEventListener('click', loadContacts);

        // عند تحميل الصفحة نجلب البيانات ونخزنها في الكاش
        (async function init() {
          await loadContacts();
          // نخزن البيانات بعد التحميل
          // loadContacts يقوم بتحديث الجدول ولا يخزن الكاش مباشرة
          // سنقوم بتعديل loadContacts لتخزين الكاش
          const origLoad = loadContacts;
          loadContacts = async function() {
            setStatus(statusEl, "جاري التحميل...", "");
            try {
              const res = await fetch('/api/load?type=mycontacts');
              const data = await res.json();
              if (!data.ok) throw new Error(data.error);
              let contacts = [];
              try { contacts = JSON.parse(data.text); } catch (e) { contacts = []; }
              if (!Array.isArray(contacts)) contacts = [];
              setContactsCache(contacts);
              renderTable(contacts);
              setStatus(statusEl, "✓ تم التحميل", "ok");
            } catch (err) { setStatus(statusEl, "خطأ: " + err.message, "err"); }
          };
          // استدعاء الدالة الجديدة
          await loadContacts();
        })();

      })();
    </script>
  `;
  return layout(content, 'contacts');
}
