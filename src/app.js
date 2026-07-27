// src/app.js
import { initRouter } from './router.js';
import { showToast, isLoggedIn } from './utils.js';

// سنقوم ببناء HTML الكامل هنا
export const HTML_PAGE = `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>مدير واتساب</title>
<link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<style>
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
    --shadow: 0 8px 24px rgba(0,0,0,0.4);
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
  /* Navbar */
  .navbar {
    background: var(--card-bg);
    padding: 12px 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--border-color);
    flex-wrap: wrap;
    gap: 10px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .navbar-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 20px;
    font-weight: 800;
  }
  .navbar-brand span { color: var(--accent); }
  .navbar-links {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
  .nav-link {
    color: var(--text-muted);
    text-decoration: none;
    padding: 6px 12px;
    border-radius: 6px;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 14px;
  }
  .nav-link:hover, .nav-link.active {
    background: var(--input-bg);
    color: var(--text-main);
  }
  .nav-link.active { color: var(--accent); }
  .navbar-actions { display: flex; gap: 10px; align-items: center; }

  /* Page Content */
  .page-content {
    flex: 1;
    padding: 24px;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
  }
  .page-header {
    margin-bottom: 24px;
  }
  .page-header h1 { font-size: 24px; }
  .page-header p { color: var(--text-muted); }

  /* Cards */
  .card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    margin-bottom: 24px;
    transition: border-color 0.3s;
  }
  .card:hover { border-color: rgba(37, 211, 102, 0.3); }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .card-header i { color: var(--accent); }
  .card-header h2 { font-size: 18px; font-weight: 700; }

  /* Dashboard Grid */
  .dashboard-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 24px;
  }
  .stats-card {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 20px;
  }
  .stats-icon {
    font-size: 32px;
    color: var(--accent);
    width: 60px;
    height: 60px;
    background: var(--bg-main);
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .stats-card h3 { font-size: 14px; color: var(--text-muted); font-weight: 500; }
  .stats-card p { font-size: 20px; font-weight: 700; }

  /* Buttons */
  .btn {
    background: var(--input-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    font-family: 'Tajawal', sans-serif;
    font-size: 13px;
    font-weight: 500;
    transition: all 0.2s;
    display: inline-flex;
    align-items: center;
    gap: 8px;
  }
  .btn:hover { background: var(--border-color); }
  .btn-primary { background: var(--accent); color: #111B21; border: none; font-weight: 700; }
  .btn-primary:hover { background: #1FB855; box-shadow: 0 4px 12px var(--accent-glow); }
  .btn-warning { background: var(--warning); border: none; color: #111B21; font-weight: 700; }
  .btn-danger { background: var(--danger); border: none; color: white; font-weight: 700; }
  .btn-danger:hover { background: #d9534f; }

  .btn-row { display: flex; gap: 10px; flex-wrap: wrap; }

  /* Forms */
  input, textarea {
    font-family: 'Tajawal', sans-serif;
  }
  .status { margin-top: 10px; font-size: 13px; min-height: 20px; color: var(--text-muted); }
  .status.ok { color: var(--success); }
  .status.err { color: var(--danger); }

  /* Schedule */
  .schedule-status { padding: 4px 12px; border-radius: 6px; font-size: 12px; font-weight: 700; display: inline-block; }
  .schedule-status.active { background: rgba(37, 211, 102, 0.15); color: var(--success); border: 1px solid rgba(37, 211, 102, 0.3); }
  .schedule-status.inactive { background: rgba(241, 92, 109, 0.15); color: var(--danger); border: 1px solid rgba(241, 92, 109, 0.3); }
  .schedule-inputs { display: flex; gap: 16px; margin-bottom: 12px; justify-content: center; }
  .schedule-inputs label { display: flex; flex-direction: column; gap: 4px; font-size: 13px; color: var(--text-muted); align-items: center; }

  /* Login */
  .login-container {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 80vh;
    padding: 20px;
  }
  .login-card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 16px;
    padding: 40px;
    max-width: 400px;
    width: 100%;
    text-align: center;
  }
  .login-icon {
    font-size: 48px;
    color: var(--accent);
    margin-bottom: 16px;
  }

  /* Toast */
  .toast-container {
    position: fixed;
    top: 20px;
    right: 20px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    gap: 8px;
    max-width: 360px;
    width: 100%;
  }
  .toast {
    background: var(--card-bg);
    color: var(--text-main);
    padding: 12px 16px;
    border-radius: 8px;
    border-right: 4px solid var(--accent);
    box-shadow: var(--shadow);
    font-size: 14px;
    animation: slideIn 0.3s ease;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .toast-success { border-right-color: var(--success); }
  .toast-error { border-right-color: var(--danger); }
  .toast-warning { border-right-color: var(--warning); }
  .toast-info { border-right-color: var(--accent); }

  @keyframes slideIn {
    from { transform: translateX(100%); opacity: 0; }
    to { transform: translateX(0); opacity: 1; }
  }

  /* Image items */
  .image-item {
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid var(--border-color);
    flex-shrink: 0;
  }
  .image-item img { width: 100%; height: 100%; object-fit: cover; }

  /* Responsive */
  @media (max-width: 768px) {
    .navbar { flex-direction: column; align-items: stretch; }
    .navbar-links { justify-content: center; }
    .navbar-actions { justify-content: center; }
    .page-content { padding: 16px; }
    .dashboard-grid { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 480px) {
    .dashboard-grid { grid-template-columns: 1fr; }
    .schedule-inputs { flex-direction: column; align-items: center; }
  }
</style>
</head>
<body>
  <!-- سيتم إضافة الهيكل بواسطة layout.js -->
  <div id="app"></div>
  <script type="module">
    import './src/app.js';
  </script>
</body>
</html>
`;

// عند تحميل الصفحة، نقوم بتشغيل التطبيق
document.addEventListener('DOMContentLoaded', () => {
  // نضع المحتوى في #app
  const app = document.getElementById('app');
  if (app) {
    import('./router.js').then(({ initRouter }) => {
      initRouter();
    });
  }
});
