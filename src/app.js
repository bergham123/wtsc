// src/app.js
// هذا الملف يُصدّر HTML_PAGE فقط، ويشغل التطبيق في المتصفح

export const HTML_PAGE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>مدير واتساب</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
  /* ... كل الـ CSS كما هو موضح أعلاه ... */
</style>
</head>
<body>
  <div id="app"></div>
  <script type="module">
    // يتم تشغيل هذا الكود في المتصفح فقط
    document.addEventListener('DOMContentLoaded', () => {
      const app = document.getElementById('app');
      if (!app) return;
      
      // استيراد الوحدات ديناميكياً
      Promise.all([
        import('./layout.js'),
        import('./router.js'),
        import('./utils.js')
      ]).then(([{ renderLayout, initLayout }, { initRouter }, { showToast, isLoggedIn }]) => {
        app.innerHTML = renderLayout();
        initLayout();
        initRouter();
        if (isLoggedIn()) {
          showToast('مرحباً بك في لوحة التحكم', 'success');
        }
      }).catch(err => console.error('Failed to load app:', err));
    });
  </script>
</body>
</html>`;
