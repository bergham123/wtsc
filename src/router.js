// src/router.js
import { renderLoginPage, initLogin } from './auth.js';
import { isLoggedIn } from './utils.js';

// استيراد الصفحات
import * as dashboard from './pages/dashboard.js';
import * as contacts from './pages/contacts.js';
import * as schedule from './pages/schedule.js';
import * as stats from './pages/stats.js';
import * as logs from './pages/logs.js';
import * as images from './pages/images.js';

const routes = {
  'login': { render: renderLoginPage, init: initLogin },
  'dashboard': { render: dashboard.render, init: dashboard.init },
  'contacts': { render: contacts.render, init: contacts.init },
  'schedule': { render: schedule.render, init: schedule.init },
  'stats': { render: stats.render, init: stats.init },
  'logs': { render: logs.render, init: logs.init },
  'images': { render: images.render, init: images.init },
};

export function navigate(hash) {
  const page = hash.replace('#', '') || 'dashboard';
  const main = document.getElementById('pageContent');
  if (!main) return;

  // التحقق من تسجيل الدخول
  if (page !== 'login' && !isLoggedIn()) {
    window.location.hash = '#login';
    return;
  }

  const route = routes[page];
  if (!route) {
    main.innerHTML = '<h2 style="text-align:center;color:var(--text-muted);">الصفحة غير موجودة</h2>';
    return;
  }

  main.innerHTML = route.render();
  if (route.init) route.init();

  // تحديث الروابط النشطة
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === '#' + page);
  });
}

export function initRouter() {
  window.addEventListener('hashchange', () => {
    navigate(window.location.hash);
  });
  navigate(window.location.hash || '#dashboard');
}
