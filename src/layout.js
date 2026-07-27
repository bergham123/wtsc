// src/layout.js
import { showToast } from './utils.js';

export function renderLayout() {
  return `
    <nav class="navbar">
      <div class="navbar-brand">
        <i class="fab fa-whatsapp" style="color:var(--accent);"></i>
        <span>مدير واتساب</span>
      </div>
      <div class="navbar-links" id="navLinks">
        <a href="#dashboard" class="nav-link active"><i class="fas fa-home"></i> الرئيسية</a>
        <a href="#contacts" class="nav-link"><i class="fas fa-address-book"></i> جهات الاتصال</a>
        <a href="#schedule" class="nav-link"><i class="fas fa-clock"></i> الجدولة</a>
        <a href="#stats" class="nav-link"><i class="fas fa-chart-bar"></i> الإحصائيات</a>
        <a href="#logs" class="nav-link"><i class="fas fa-terminal"></i> السجلات</a>
        <a href="#images" class="nav-link"><i class="fas fa-images"></i> الصور</a>
      </div>
      <div class="navbar-actions">
        <button id="logoutBtn" class="btn" style="width:auto; padding:6px 12px; background:transparent; border-color:var(--danger); color:var(--danger);">
          <i class="fas fa-sign-out-alt"></i> خروج
        </button>
      </div>
    </nav>
    <main id="pageContent" class="page-content">
      <!-- سيتم تحميل الصفحات هنا -->
    </main>
    <div id="toastContainer" class="toast-container"></div>
  `;
}

export function initLayout() {
  // تفعيل الروابط
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      this.classList.add('active');
    });
  });

  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('api_secret');
      window.location.hash = '#login';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
      showToast('تم تسجيل الخروج', 'info');
    });
  }
}
