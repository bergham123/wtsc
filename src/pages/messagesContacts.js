import { layout } from './layout.js';

export function renderMessagesContacts(env) {
  const content = `
    <h2 style="margin-bottom: 20px;"><i class="fas fa-comment-dots" style="color:var(--accent);"></i> الرسائل وجهات الاتصال</h2>
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

    <div class="card">
      <div class="card-header"><i class="fas fa-address-book"></i><h2>جهات الاتصال (accounts.json)</h2></div>
      <div class="card-hint">كل رقم في سطر</div>
      <textarea id="contactsArea" placeholder="اكتب رقم في كل سطر..."></textarea>
      <div class="btn-row">
        <button class="btn" id="loadContactsBtn"><i class="fas fa-download"></i> تحميل</button>
        <button class="btn btn-primary" id="saveContactsBtn"><i class="fas fa-save"></i> حفظ</button>
      </div>
      <div class="status" id="contactsStatus"></div>
    </div>

    <script>
      (function() {
        const messagesArea = document.getElementById('messagesArea');
        const messagesStatus = document.getElementById('messagesStatus');
        const contactsArea = document.getElementById('contactsArea');
        const contactsStatus = document.getElementById('contactsStatus');

        document.getElementById("loadMessagesBtn").onclick = () => loadFile("messages", messagesArea, messagesStatus);
        document.getElementById("saveMessagesBtn").onclick = () => saveFile("messages", messagesArea, messagesStatus);
        document.getElementById("loadContactsBtn").onclick = () => loadFile("contacts", contactsArea, contactsStatus);
        document.getElementById("saveContactsBtn").onclick = () => saveFile("contacts", contactsArea, contactsStatus);

        // تحميل تلقائي
        loadFile("messages", messagesArea, messagesStatus);
        loadFile("contacts", contactsArea, contactsStatus);
      })();
    </script>
  `;
  return layout(content, 'messages');
}
