// src/auth.js
import { showToast, isLoggedIn, getHeaders } from './utils.js';

export function renderLoginPage() {
  return `
    <div class="login-container">
      <div class="login-card">
        <div class="login-icon"><i class="fas fa-lock"></i></div>
        <h2>تسجيل الدخول</h2>
        <p style="color:var(--text-muted); font-size:14px; margin-bottom:20px;">أدخل مفتاح API للوصول إلى لوحة التحكم</p>
        <input type="password" id="loginApiKey" placeholder="API_SECRET" style="width:100%; padding:12px; border-radius:8px; border:1px solid var(--border-color); background:var(--input-bg); color:var(--text-main); font-size:16px; margin-bottom:16px; direction:ltr;" />
        <button id="loginBtn" class="btn btn-primary" style="width:100%;">دخول</button>
        <div id="loginError" style="color:var(--danger); margin-top:12px; font-size:13px;"></div>
      </div>
    </div>
  `;
}

export function initLogin() {
  const btn = document.getElementById('loginBtn');
  const input = document.getElementById('loginApiKey');
  const errorEl = document.getElementById('loginError');
  if (!btn || !input) return;

  const doLogin = async () => {
    const key = input.value.trim();
    if (!key) {
      errorEl.textContent = 'الرجاء إدخال المفتاح';
      return;
    }
    // اختبار المفتاح عن طريق استدعاء endpoint بسيط
    try {
      const res = await fetch('/api/contacts', {
        headers: { 'X-API-Key': key }
      });
      if (res.status === 401 || res.status === 403) {
        errorEl.textContent = 'مفتاح غير صحيح';
        return;
      }
      // تخزين المفتاح
      localStorage.setItem('api_secret', key);
      showToast('تم تسجيل الدخول بنجاح', 'success');
      // التوجيه إلى لوحة التحكم
      window.location.hash = '#dashboard';
      // إعادة تحميل التطبيق
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    } catch (e) {
      errorEl.textContent = 'خطأ في الاتصال: ' + e.message;
    }
  };

  btn.addEventListener('click', doLogin);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') doLogin();
  });
}
