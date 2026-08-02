export const HTML_PAGE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>مدير واتساب — لوحة تحكم متطورة</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/particles.js/2.0.0/particles.min.js">
  </script>
  <script src="https://cdn.jsdelivr.net/npm/chart.js">
  </script>
  <style>
    /* ─── RESET & BASE ─── */
    *,
    *::before,
    *::after {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    :root {
      --bg-primary: #f6f8fc;
      --bg-secondary: #ffffff;
      --bg-sidebar: #ffffff;
      --bg-card: rgba(0, 0, 0, 0.03);
      --bg-card-hover: rgba(0, 0, 0, 0.06);
      --border-subtle: rgba(0, 0, 0, 0.07);
      --border-subtle-2: rgba(0, 0, 0, 0.05);
      --text-primary: #0b0d15;
      --text-secondary: #4a4f66;
      --text-muted: #8a90a8;
      --text-sidebar: #1a1d2b;
      --text-sidebar-secondary: #5a6079;
      --accent: #6c5ce7;
      --accent-glow: rgba(108, 92, 231, 0.25);
      --accent-soft: #a29bfe;
      --green: #00b894;
      --red: #ff6b7a;
      --shadow: 0 20px 60px rgba(0, 0, 0, 0.08);
      --shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.04);
      --radius: 20px;
      --radius-sm: 12px;
      --radius-xs: 8px;
      --transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      --sidebar-width: 280px;
      --header-height: 68px;
      --badge-bg: rgba(108, 92, 231, 0.10);
      --badge-text: #6c5ce7;
      --modal-overlay: rgba(0, 0, 0, 0.4);
      --input-bg: #f0f2f8;
      --input-border: #dce0ea;
      --scrollbar-track: transparent;
      --scrollbar-thumb: #c8cce0;
      --auth-overlay: rgba(0, 0, 0, 0.55);
      --auth-bg: rgba(255, 255, 255, 0.92);
      --auth-text: #0b0d15;
      --auth-border: rgba(255, 255, 255, 0.25);
      --auth-backdrop: blur(16px);
    }
    [data-theme="dark"] {
      --bg-primary: #0b0d15;
      --bg-secondary: #131720;
      --bg-sidebar: #10141c;
      --bg-card: rgba(255, 255, 255, 0.04);
      --bg-card-hover: rgba(255, 255, 255, 0.08);
      --border-subtle: rgba(255, 255, 255, 0.06);
      --border-subtle-2: rgba(255, 255, 255, 0.04);
      --text-primary: #f0f2f8;
      --text-secondary: #9aa1b9;
      --text-muted: #5f677f;
      --text-sidebar: #e8ecf4;
      --text-sidebar-secondary: #8890a8;
      --accent: #6c5ce7;
      --accent-glow: rgba(108, 92, 231, 0.35);
      --accent-soft: #a29bfe;
      --green: #00d2a0;
      --red: #ff6b7a;
      --shadow: 0 20px 60px rgba(0, 0, 0, 0.7);
      --shadow-sm: 0 4px 16px rgba(0, 0, 0, 0.3);
      --badge-bg: rgba(108, 92, 231, 0.18);
      --badge-text: #a29bfe;
      --modal-overlay: rgba(0, 0, 0, 0.6);
      --input-bg: #1e2532;
      --input-border: #2d3548;
      --scrollbar-thumb: #2d3548;
      --auth-overlay: rgba(0, 0, 0, 0.70);
      --auth-bg: rgba(19, 23, 32, 0.92);
      --auth-text: #f0f2f8;
      --auth-border: rgba(255, 255, 255, 0.08);
      --auth-backdrop: blur(16px);
    }
    html {
      font-size: 16px;
      scroll-behavior: smooth;
    }
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: var(--bg-primary);
      color: var(--text-primary);
      min-height: 100vh;
      display: flex;
      transition: background var(--transition), color var(--transition);
      overflow: hidden;
    }
    ::-webkit-scrollbar {
      width: 4px;
      height: 4px;
    }
    ::-webkit-scrollbar-track {
      background: var(--scrollbar-track);
    }
    ::-webkit-scrollbar-thumb {
      background: var(--scrollbar-thumb);
      border-radius: 10px;
    }

    /* ─── PARTICLES ─── */
    #particles-js {
      position: fixed;
      inset: 0;
      z-index: 9998;
      background: radial-gradient(ellipse at 30% 40%, #1a1040, #0b0d15 80%);
      transition: background var(--transition);
    }
    [data-theme="light"] #particles-js {
      background: radial-gradient(ellipse at 30% 40%, #e8e4f8, #d5d0e8 80%);
    }

    /* ─── AUTH OVERLAY ─── */
    .auth-overlay {
      position: fixed;
      inset: 0;
      z-index: 9999;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      animation: fadeIn 0.5s ease;
      background: transparent;
    }
    .auth-overlay.hidden {
      display: none;
    }
    .auth-overlay.hidden~#particles-js {
      display: none;
    }
    @keyframes fadeIn {
      0% {
        opacity: 0;
        transform: scale(0.96);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
    .auth-box {
      background: var(--auth-bg);
      backdrop-filter: var(--auth-backdrop);
      -webkit-backdrop-filter: var(--auth-backdrop);
      border-radius: var(--radius);
      border: 1px solid var(--auth-border);
      max-width: 420px;
      width: 100%;
      padding: 40px 36px 34px;
      box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
      transition: background var(--transition), border-color var(--transition);
      position: relative;
      z-index: 9999;
    }
    .auth-box .auth-logo {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 28px;
      justify-content: center;
    }
    .auth-box .auth-logo .logo-icon {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), #a29bfe);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
      font-weight: 700;
      color: #fff;
      box-shadow: 0 0 40px var(--accent-glow);
    }
    .auth-box .auth-logo h2 {
      font-size: 22px;
      font-weight: 700;
      color: var(--auth-text);
      letter-spacing: -0.3px;
    }
    .auth-box .auth-logo h2 span {
      color: var(--accent-soft);
    }
    .auth-box .auth-subtitle {
      text-align: center;
      color: var(--text-secondary);
      font-size: 14px;
      margin-bottom: 24px;
    }
    .auth-box .form-group {
      margin-bottom: 16px;
    }
    .auth-box .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 4px;
    }
    .auth-box .form-group input {
      width: 100%;
      padding: 11px 14px;
      border-radius: var(--radius-xs);
      border: 1px solid var(--input-border);
      background: var(--input-bg);
      color: var(--auth-text);
      font-family: inherit;
      font-size: 14px;
      transition: var(--transition);
      outline: none;
    }
    .auth-box .form-group input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .auth-box .auth-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 6px 0 18px;
      font-size: 13px;
    }
    .auth-box .auth-actions .remember {
      display: flex;
      align-items: center;
      gap: 6px;
      color: var(--text-secondary);
      cursor: pointer;
    }
    .auth-box .auth-actions .remember input[type="checkbox"] {
      accent-color: var(--accent);
      width: 16px;
      height: 16px;
      cursor: pointer;
    }
    .auth-box .auth-actions a {
      color: var(--accent-soft);
      text-decoration: none;
      font-weight: 500;
      cursor: pointer;
      transition: var(--transition);
    }
    .auth-box .auth-actions a:hover {
      color: var(--accent);
      text-decoration: underline;
    }
    .auth-box .btn-auth {
      width: 100%;
      padding: 12px;
      border-radius: var(--radius-sm);
      border: none;
      background: linear-gradient(135deg, var(--accent), #8b7cf7);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      font-family: inherit;
      box-shadow: 0 0 20px var(--accent-glow);
    }
    .auth-box .btn-auth:hover {
      transform: scale(1.02);
      box-shadow: 0 0 32px var(--accent-glow);
    }
    .auth-box .btn-auth:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
    .auth-box .auth-toggle {
      text-align: center;
      margin-top: 18px;
      font-size: 14px;
      color: var(--text-secondary);
    }
    .auth-box .auth-toggle a {
      color: var(--accent-soft);
      font-weight: 600;
      cursor: pointer;
      text-decoration: none;
      transition: var(--transition);
    }
    .auth-box .auth-toggle a:hover {
      color: var(--accent);
      text-decoration: underline;
    }
    .auth-box .auth-error {
      background: rgba(255, 107, 122, 0.12);
      border: 1px solid rgba(255, 107, 122, 0.25);
      color: var(--red);
      padding: 10px 14px;
      border-radius: var(--radius-xs);
      font-size: 13px;
      margin-bottom: 14px;
      display: none;
    }
    .auth-box .auth-error.show {
      display: block;
    }
    .auth-box .auth-success {
      background: rgba(0, 210, 160, 0.12);
      border: 1px solid rgba(0, 210, 160, 0.25);
      color: var(--green);
      padding: 10px 14px;
      border-radius: var(--radius-xs);
      font-size: 13px;
      margin-bottom: 14px;
      display: none;
    }
    .auth-box .auth-success.show {
      display: block;
    }
    .auth-spinner {
      display: inline-block;
      width: 18px;
      height: 18px;
      border: 2px solid rgba(255, 255, 255, 0.3);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      vertical-align: middle;
      margin-right: 8px;
    }
    @keyframes spin {
      to {
        transform: rotate(360deg);
      }
    }

    /* ─── SIDEBAR ─── */
    .sidebar {
      width: var(--sidebar-width);
      height: 100vh;
      background: var(--bg-sidebar);
      border-right: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      position: sticky;
      top: 0;
      overflow-y: auto;
      padding: 20px 16px 16px;
      transition: background var(--transition), border-color var(--transition),
        transform 0.3s ease, width 0.3s ease;
      z-index: 100;
    }
    .sidebar-brand {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 0 4px 20px;
      border-bottom: 1px solid var(--border-subtle-2);
      margin-bottom: 16px;
    }
    .sidebar-brand .logo-icon {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), #a29bfe);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: 700;
      color: #fff;
      box-shadow: 0 0 24px var(--accent-glow);
      flex-shrink: 0;
    }
    .sidebar-brand h2 {
      font-size: 18px;
      font-weight: 700;
      color: var(--text-sidebar);
      letter-spacing: -0.3px;
    }
    .sidebar-brand h2 span {
      color: var(--accent-soft);
    }
    .sidebar-search {
      position: relative;
      margin-bottom: 18px;
    }
    .sidebar-search input {
      width: 100%;
      padding: 10px 14px 10px 40px;
      border-radius: var(--radius-xs);
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      color: var(--text-sidebar);
      font-size: 13px;
      font-family: inherit;
      transition: var(--transition);
      outline: none;
    }
    .sidebar-search input::placeholder {
      color: var(--text-sidebar-secondary);
    }
    .sidebar-search input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    .sidebar-search i {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-sidebar-secondary);
      font-size: 13px;
    }
    .sidebar-section {
      margin-bottom: 18px;
    }
    .sidebar-section .section-title {
      font-size: 11px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.6px;
      color: var(--text-sidebar-secondary);
      padding: 0 4px 8px;
    }
    .sidebar-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-radius: var(--radius-xs);
      cursor: pointer;
      transition: var(--transition);
      color: var(--text-sidebar-secondary);
      font-size: 13.5px;
      font-weight: 500;
      text-decoration: none;
    }
    .sidebar-item:hover {
      background: var(--bg-card-hover);
      color: var(--text-sidebar);
    }
    .sidebar-item .item-left {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .sidebar-item .item-left i {
      width: 18px;
      font-size: 14px;
      color: var(--text-sidebar-secondary);
    }
    .sidebar-item .badge {
      background: var(--badge-bg);
      color: var(--badge-text);
      font-size: 11px;
      font-weight: 600;
      padding: 2px 10px;
      border-radius: 20px;
      min-width: 24px;
      text-align: center;
    }
    .sidebar-item.active {
      background: var(--badge-bg);
      color: var(--text-sidebar);
    }
    .sidebar-item.active .item-left i {
      color: var(--accent-soft);
    }
    .sidebar-divider {
      height: 1px;
      background: var(--border-subtle-2);
      margin: 6px 0 16px;
    }
    .sidebar-user {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid var(--border-subtle-2);
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .sidebar-user .user-avatar {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: linear-gradient(135deg, var(--accent), #a29bfe);
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 600;
      font-size: 16px;
      color: #fff;
      flex-shrink: 0;
      text-transform: uppercase;
    }
    .sidebar-user .user-info {
      flex: 1;
      min-width: 0;
    }
    .sidebar-user .user-info .name {
      font-size: 14px;
      font-weight: 600;
      color: var(--text-sidebar);
    }
    .sidebar-user .user-info .email {
      font-size: 12px;
      color: var(--text-sidebar-secondary);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .sidebar-user .user-actions {
      display: flex;
      align-items: center;
      gap: 4px;
    }
    .sidebar-user .user-actions button {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      border: 1px solid var(--border-subtle);
      background: var(--bg-card);
      color: var(--text-sidebar-secondary);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: var(--transition);
      font-size: 14px;
    }
    .sidebar-user .user-actions button:hover {
      background: var(--bg-card-hover);
      color: var(--text-sidebar);
      border-color: var(--accent);
    }
    .sidebar-user .user-actions .logout-btn:hover {
      border-color: var(--red);
      color: var(--red);
    }

    /* ─── MAIN CONTENT ─── */
    .app-wrapper {
      display: none;
      width: 100%;
      min-height: 100vh;
    }
    .app-wrapper.authenticated {
      display: flex;
    }
    .main-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      height: 100vh;
      background: var(--bg-primary);
      transition: background var(--transition);
      min-width: 0;
      overflow-y: auto;
      padding: 24px 28px;
    }
    .page-header {
      margin-bottom: 20px;
    }
    .page-header h1 {
      font-size: 24px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .page-header p {
      color: var(--text-muted);
      font-size: 14px;
    }
    .card {
      background: var(--bg-secondary);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 24px;
      margin-bottom: 24px;
      transition: border-color var(--transition), background var(--transition);
    }
    .card:hover {
      border-color: rgba(108, 92, 231, 0.3);
    }
    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
    }
    .card-header i {
      color: var(--accent-soft);
      font-size: 18px;
    }
    .card-header h2 {
      font-size: 18px;
      font-weight: 700;
    }
    .card-hint {
      color: var(--text-muted);
      font-size: 13px;
      margin-bottom: 16px;
    }
    .btn {
      background: var(--bg-card);
      color: var(--text-primary);
      border: 1px solid var(--border-subtle);
      padding: 8px 16px;
      border-radius: var(--radius-xs);
      cursor: pointer;
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 500;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      gap: 8px;
    }
    .btn:hover {
      background: var(--bg-card-hover);
      border-color: var(--accent);
    }
    .btn-primary {
      background: linear-gradient(135deg, var(--accent), #8b7cf7);
      color: #fff;
      border: none;
      font-weight: 600;
      box-shadow: 0 0 20px var(--accent-glow);
    }
    .btn-primary:hover {
      transform: scale(1.02);
      box-shadow: 0 0 32px var(--accent-glow);
    }
    .btn-danger {
      background: var(--red);
      color: #fff;
      border: none;
    }
    .btn-danger:hover {
      background: #e55a6a;
    }
    .btn-success {
      background: var(--green);
      color: #fff;
      border: none;
    }
    .btn-success:hover {
      background: #00a382;
    }
    .btn-warning {
      background: #f39c12;
      color: #fff;
      border: none;
    }
    .btn-warning:hover {
      background: #d68910;
    }
    .btn-row {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }
    textarea,
    input[type="text"],
    input[type="number"],
    input[type="password"],
    input[type="email"] {
      font-family: 'Inter', sans-serif;
      background: var(--input-bg);
      color: var(--text-primary);
      border: 1px solid var(--input-border);
      border-radius: var(--radius-xs);
      padding: 10px 14px;
      font-size: 14px;
      transition: var(--transition);
      outline: none;
      width: 100%;
    }
    textarea:focus,
    input:focus {
      border-color: var(--accent);
      box-shadow: 0 0 0 3px var(--accent-glow);
    }
    textarea {
      resize: vertical;
      min-height: 120px;
    }
    .status {
      margin-top: 10px;
      font-size: 13px;
      min-height: 20px;
      color: var(--text-muted);
    }
    .status.ok {
      color: var(--green);
    }
    .status.err {
      color: var(--red);
    }
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
      font-size: 28px;
      color: var(--accent-soft);
      width: 54px;
      height: 54px;
      background: var(--bg-card);
      border-radius: var(--radius-sm);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .stats-card h3 {
      font-size: 13px;
      color: var(--text-muted);
      font-weight: 500;
    }
    .stats-card p {
      font-size: 20px;
      font-weight: 700;
    }

    /* ─── SCHEDULE ─── */
    .schedule-status {
      padding: 4px 12px;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 700;
      display: inline-block;
    }
    .schedule-status.active {
      background: rgba(0, 210, 160, 0.15);
      color: var(--green);
      border: 1px solid rgba(0, 210, 160, 0.3);
    }
    .schedule-status.inactive {
      background: rgba(255, 107, 122, 0.15);
      color: var(--red);
      border: 1px solid rgba(255, 107, 122, 0.3);
    }
    .schedule-inputs {
      display: flex;
      gap: 16px;
      margin-bottom: 12px;
      justify-content: center;
    }
    .schedule-inputs label {
      display: flex;
      flex-direction: column;
      gap: 4px;
      font-size: 13px;
      color: var(--text-muted);
      align-items: center;
    }
    .schedule-inputs input {
      width: 70px;
      text-align: center;
      padding: 8px;
      font-size: 16px;
    }

    /* ─── IMAGES ─── */
    .image-item {
      position: relative;
      width: 90px;
      height: 90px;
      border-radius: var(--radius-xs);
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      flex-shrink: 0;
    }
    .image-item img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    .image-item .delete-btn {
      position: absolute;
      top: 4px;
      right: 4px;
      background: var(--red);
      border: none;
      color: #fff;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 11px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
    }
    #imageGallery {
      margin-top: 16px;
    }
    #imageList {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
    }

    /* ─── SESSION ─── */
    .session-status {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      border-radius: var(--radius-xs);
      background: var(--bg-card);
      margin-bottom: 16px;
    }
    .session-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: inline-block;
    }
    .session-indicator.connected {
      background: var(--green);
    }
    .session-indicator.waiting {
      background: #f39c12;
    }
    .session-indicator.disconnected {
      background: var(--red);
    }
    .session-indicator.unknown {
      background: gray;
    }
    .qr-container {
      text-align: center;
      padding: 16px;
      background: var(--bg-card);
      border-radius: var(--radius-xs);
      border: 1px solid var(--border-subtle);
    }
    .qr-container img {
      max-width: 200px;
      border-radius: var(--radius-xs);
    }

    /* ─── STATS TABLE ─── */
    .stats-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .stats-table th {
      text-align: right;
      padding: 10px 12px;
      background: var(--bg-card);
      color: var(--text-muted);
      border-bottom: 1px solid var(--border-subtle);
      font-weight: 500;
    }
    .stats-table td {
      padding: 10px 12px;
      border-bottom: 1px solid var(--border-subtle);
    }
    .stats-table tr:last-child td {
      border-bottom: none;
    }

    /* ─── CONTACTS TABLE ─── */
    .contacts-table-wrap {
      overflow: auto;
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-xs);
    }
    .contacts-table-wrap table {
      width: 100%;
      border-collapse: collapse;
      font-size: 14px;
    }
    .contacts-table-wrap th {
      padding: 10px 6px;
      text-align: center;
      background: var(--bg-card);
      position: sticky;
      top: 0;
      font-weight: 500;
      color: var(--text-muted);
    }
    .contacts-table-wrap td {
      padding: 6px;
      text-align: center;
    }
    .contacts-table-wrap .editable {
      cursor: text;
      min-width: 60px;
      outline: none;
      padding: 4px 6px;
      border-radius: 4px;
      transition: var(--transition);
    }
    .contacts-table-wrap .editable:focus {
      background: var(--bg-card-hover);
      box-shadow: 0 0 0 2px var(--accent-glow);
    }

    /* ─── TOAST ─── */
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
      background: var(--bg-secondary);
      color: var(--text-primary);
      padding: 12px 16px;
      border-radius: var(--radius-xs);
      border-right: 4px solid var(--accent);
      box-shadow: var(--shadow);
      font-size: 14px;
      animation: slideIn 0.3s ease;
      display: flex;
      align-items: center;
      gap: 8px;
      border: 1px solid var(--border-subtle);
    }
    .toast-success {
      border-right-color: var(--green);
    }
    .toast-error {
      border-right-color: var(--red);
    }
    .toast-warning {
      border-right-color: #f39c12;
    }
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    /* ─── MODAL ─── */
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: var(--modal-overlay);
      backdrop-filter: blur(6px);
      display: none;
      align-items: center;
      justify-content: center;
      z-index: 999;
      padding: 20px;
      animation: fadeIn 0.25s ease;
    }
    .modal-overlay.open {
      display: flex;
    }
    .modal {
      background: var(--bg-secondary);
      border-radius: var(--radius);
      border: 1px solid var(--border-subtle);
      max-width: 500px;
      width: 100%;
      padding: 32px 36px 28px;
      box-shadow: var(--shadow);
      max-height: 90vh;
      overflow-y: auto;
      transition: background var(--transition), border-color var(--transition);
    }
    .modal-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 24px;
    }
    .modal-header h2 {
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
    }
    .modal-header .modal-close {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      border: none;
      background: var(--bg-card);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 18px;
      transition: var(--transition);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .modal-header .modal-close:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }
    .modal .form-group {
      margin-bottom: 18px;
    }
    .modal .form-group label {
      display: block;
      font-size: 13px;
      font-weight: 600;
      color: var(--text-secondary);
      margin-bottom: 5px;
    }
    .modal .btn-modal-save {
      width: 100%;
      padding: 12px;
      border-radius: var(--radius-sm);
      border: none;
      background: linear-gradient(135deg, var(--accent), #8b7cf7);
      color: #fff;
      font-size: 15px;
      font-weight: 600;
      cursor: pointer;
      transition: var(--transition);
      font-family: inherit;
      margin-top: 6px;
      box-shadow: 0 0 20px var(--accent-glow);
    }
    .modal .btn-modal-save:hover {
      transform: scale(1.02);
      box-shadow: 0 0 32px var(--accent-glow);
    }

    /* ─── PROGRESS ─── */
    .progress-container {
      width: 100%;
      background: var(--bg-card);
      border-radius: var(--radius-xs);
      height: 24px;
      overflow: hidden;
      margin: 12px 0;
    }
    .progress-bar {
      height: 100%;
      background: linear-gradient(90deg, var(--accent), #a29bfe);
      border-radius: var(--radius-xs);
      transition: width 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: #fff;
      width: 0%;
    }
    .progress-text {
      font-size: 14px;
      color: var(--text-muted);
      margin-bottom: 4px;
    }

    /* ─── LOGS MODAL ─── */
    .log-files-list {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .log-file-btn {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      color: var(--text-primary);
      padding: 8px 16px;
      border-radius: var(--radius-xs);
      cursor: pointer;
      transition: var(--transition);
      font-family: 'Inter', sans-serif;
      font-size: 13px;
    }
    .log-file-btn:hover {
      background: var(--bg-card-hover);
      border-color: var(--accent);
    }
    .log-file-btn.active {
      background: var(--accent);
      border-color: var(--accent);
      color: #fff;
    }
    .log-content {
      background: var(--bg-card);
      border-radius: var(--radius-xs);
      padding: 16px;
      overflow-y: auto;
      font-family: 'Consolas', monospace;
      font-size: 13px;
      max-height: 400px;
      border: 1px solid var(--border-subtle);
      white-space: pre-wrap;
    }

    /* ─── SIDEBAR OVERLAY (mobile) ─── */
    .sidebar-overlay {
      display: none;
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.3);
      z-index: 99;
      backdrop-filter: blur(2px);
    }
    .sidebar-overlay.active {
      display: block;
    }
    .sidebar-toggle-btn {
      display: none;
      background: transparent;
      border: none;
      color: var(--text-secondary);
      font-size: 20px;
      cursor: pointer;
      padding: 4px;
    }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 900px) {
      :root {
        --sidebar-width: 280px;
      }
      .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        bottom: 0;
        transform: translateX(-100%);
        width: var(--sidebar-width);
        border-radius: 0 16px 16px 0;
        box-shadow: var(--shadow);
      }
      .sidebar.open {
        transform: translateX(0);
      }
      .sidebar-toggle-btn {
        display: flex;
      }
      .main-content {
        padding: 16px;
      }
    }
    @media (max-width: 640px) {
      .main-content {
        padding: 12px;
      }
      .dashboard-grid {
        grid-template-columns: 1fr 1fr;
      }
      .card {
        padding: 16px;
      }
      .modal {
        padding: 24px 20px 20px;
      }
      .schedule-inputs {
        flex-direction: column;
        align-items: center;
      }
      .stats-card {
        padding: 14px;
      }
    }
    @media (max-width: 480px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      .main-content {
        padding: 10px;
      }
      .btn {
        font-size: 12px;
        padding: 6px 12px;
      }
      .auth-box {
        padding: 24px 16px 20px;
      }
    }
    @media (min-width: 901px) {
      .sidebar-overlay {
        display: none !important;
      }
    }

    /* ─── AI CHAT SPECIFIC ─── */
    .msg {
      display: flex;
      gap: 12px;
      max-width: 80%;
      animation: fadeSlide 0.35s ease-out;
    }
    .msg.user {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .msg.ai {
      align-self: flex-start;
    }
    @keyframes fadeSlide {
      0% {
        opacity: 0;
        transform: translateY(12px) scale(0.96);
      }
      100% {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }
    .msg-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      font-weight: 600;
      color: #fff;
      margin-top: 2px;
      text-transform: uppercase;
    }
    .msg.ai .msg-avatar {
      background: linear-gradient(135deg, var(--accent), #8b7cf7);
      box-shadow: 0 0 16px var(--accent-glow);
    }
    .msg.user .msg-avatar {
      background: linear-gradient(135deg, #2d3748, #4a5568);
    }
    .msg-bubble {
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px 18px;
      line-height: 1.65;
      font-size: 14.5px;
      color: var(--text-primary);
      word-break: break-word;
      backdrop-filter: blur(4px);
      box-shadow: var(--shadow-sm);
      transition: background var(--transition), border-color var(--transition),
        color var(--transition);
    }
    .msg.user .msg-bubble {
      background: linear-gradient(135deg, rgba(108, 92, 231, 0.15), rgba(108, 92, 231, 0.06));
      border-color: rgba(108, 92, 231, 0.2);
    }
    .msg-bubble .timestamp {
      display: block;
      font-size: 10px;
      color: var(--text-muted);
      margin-top: 6px;
      letter-spacing: 0.3px;
      font-weight: 400;
    }
    .typing-indicator {
      display: none;
      align-self: flex-start;
      gap: 12px;
      padding: 6px 0 4px;
    }
    .typing-indicator.active {
      display: flex;
    }
    .typing-dots {
      display: flex;
      gap: 5px;
      align-items: center;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 12px 20px;
      backdrop-filter: blur(4px);
    }
    .typing-dots span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-muted);
      animation: typingBounce 1.4s ease-in-out infinite;
    }
    .typing-dots span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-dots span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes typingBounce {
      0%,
      60%,
      100% {
        transform: translateY(0);
        opacity: 0.4;
      }
      30% {
        transform: translateY(-8px);
        opacity: 1;
        background: var(--accent-soft);
      }
    }
    .input-wrapper {
      display: flex;
      align-items: flex-end;
      gap: 12px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      padding: 4px 4px 4px 18px;
      transition: var(--transition);
      margin-top: 12px;
    }
    .input-wrapper:focus-within {
      border-color: var(--accent);
      box-shadow: 0 0 0 4px var(--accent-glow);
    }
    .input-wrapper textarea {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-primary);
      font-family: inherit;
      font-size: 14.5px;
      resize: none;
      padding: 12px 0;
      line-height: 1.5;
      min-height: 24px;
      max-height: 120px;
    }
    .input-wrapper textarea::placeholder {
      color: var(--text-muted);
    }
    .input-wrapper .btn-send {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-sm);
      border: none;
      background: linear-gradient(135deg, var(--accent), #8b7cf7);
      color: #fff;
      font-size: 18px;
      cursor: pointer;
      transition: var(--transition);
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 20px var(--accent-glow);
    }
    .input-wrapper .btn-send:hover {
      transform: scale(1.04);
      box-shadow: 0 0 32px var(--accent-glow);
    }
    .input-wrapper .btn-send:disabled {
      opacity: 0.4;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .input-footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 10px;
      padding: 0 4px;
      flex-wrap: wrap;
      gap: 8px;
    }
    .input-footer .tools {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 12px;
      color: var(--text-muted);
      flex-wrap: wrap;
    }
    .input-footer .tools span {
      display: flex;
      align-items: center;
      gap: 5px;
      cursor: pointer;
      padding: 4px 10px;
      border-radius: 20px;
      background: var(--bg-card);
      border: 1px solid var(--border-subtle-2);
      transition: var(--transition);
    }
    .input-footer .tools span:hover {
      border-color: var(--accent);
      color: var(--text-primary);
    }
    .input-footer .tools span i {
      font-size: 12px;
      color: var(--accent-soft);
    }
    .input-footer .model-select {
      font-size: 12px;
      color: var(--text-primary);
      background: var(--bg-card);
      border: 1px solid var(--border-subtle-2);
      border-radius: 20px;
      padding: 4px 12px;
      cursor: pointer;
      font-family: inherit;
      transition: var(--transition);
      outline: none;
    }
    .input-footer .model-select:focus {
      border-color: var(--accent);
    }
    .ai-error-banner {
      display: none;
      padding: 10px 18px;
      margin-bottom: 12px;
      border-radius: var(--radius-xs);
      background: rgba(255, 107, 122, 0.10);
      border: 1px solid rgba(255, 107, 122, 0.20);
      color: var(--red);
      font-size: 13px;
      flex-shrink: 0;
    }
    .ai-error-banner.show {
      display: block;
    }
    .ai-error-banner .close-banner {
      float: right;
      background: none;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 14px;
      padding: 0 4px;
    }
    .chat-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-primary);
    }
    .chat-header {
      padding: 12px 0 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--border-subtle);
      flex-shrink: 0;
      margin-bottom: 16px;
    }
    .chat-header .header-left {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .chat-header .header-actions button {
      background: transparent;
      border: none;
      color: var(--text-muted);
      width: 36px;
      height: 36px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 16px;
      transition: var(--transition);
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    .chat-header .header-actions button:hover {
      background: var(--bg-card-hover);
      color: var(--text-primary);
    }
    .messages {
      flex: 1;
      padding: 8px 0 12px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 16px;
      scroll-behavior: smooth;
    }
  </style>
</head>
<body>

  <!-- ─── PARTICLES ─── -->
  <div id="particles-js"></div>

  <!-- ─── AUTH OVERLAY ─── -->
  <div class="auth-overlay" id="authOverlay">
    <div class="auth-box" id="authBox">
      <div class="auth-logo">
        <div class="logo-icon">✦</div>
        <h2>مدير <span>واتساب</span></h2>
      </div>
      <div class="auth-subtitle" id="authSubtitle">سجل الدخول إلى لوحة التحكم</div>
      <div class="auth-error" id="authError"></div>
      <div class="auth-success" id="authSuccess"></div>
      <form id="authForm" autocomplete="off">
        <div class="form-group">
          <label for="authEmail">البريد الإلكتروني</label>
          <input type="email" id="authEmail" placeholder="admin@example.com" required />
        </div>
        <div class="form-group">
          <label for="authPassword">كلمة المرور</label>
          <input type="password" id="authPassword" placeholder="••••••••" required minlength="4" />
        </div>
        <div class="auth-actions">
          <label class="remember">
            <input type="checkbox" id="authRemember" checked /> تذكرني
          </label>
        </div>
        <button class="btn-auth" id="authBtn" type="submit">
          <span id="authBtnText">دخول</span>
        </button>
      </form>
    </div>
  </div>

  <!-- ─── SIDEBAR OVERLAY (mobile) ─── -->
  <div class="sidebar-overlay" id="sidebarOverlay"></div>

  <!-- ─── APP WRAPPER ─── -->
  <div class="app-wrapper" id="appWrapper">

    <!-- ─── SIDEBAR ─── -->
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="logo-icon">✦</div>
        <h2>مدير <span>واتساب</span></h2>
      </div>

      <div class="sidebar-search">
        <i class="fas fa-search"></i>
        <input type="text" placeholder="بحث..." id="sidebarSearch" />
      </div>

      <div class="sidebar-section">
        <div class="section-title">القائمة الرئيسية</div>
        <a class="sidebar-item active" data-page="dashboard" href="#"><span class="item-left"><i class="fas fa-home"></i> الرئيسية</span></a>
        <a class="sidebar-item" data-page="contacts" href="#"><span class="item-left"><i class="fas fa-address-book"></i> جهات الاتصال</span></a>
        <a class="sidebar-item" data-page="messages" href="#"><span class="item-left"><i class="fas fa-envelope"></i> الرسائل</span></a>
        <a class="sidebar-item" data-page="accounts" href="#"><span class="item-left"><i class="fas fa-phone"></i> الأرقام</span></a>
        <a class="sidebar-item" data-page="sender" href="#"><span class="item-left"><i class="fas fa-paper-plane"></i> الإرسال</span></a>
        <a class="sidebar-item" data-page="schedule" href="#"><span class="item-left"><i class="fas fa-clock"></i> الجدولة</span></a>
        <a class="sidebar-item" data-page="stats" href="#"><span class="item-left"><i class="fas fa-chart-bar"></i> الإحصائيات</span></a>
        <a class="sidebar-item" data-page="logs" href="#"><span class="item-left"><i class="fas fa-terminal"></i> السجلات</span></a>
        <a class="sidebar-item" data-page="images" href="#"><span class="item-left"><i class="fas fa-images"></i> الصور</span></a>
        <a class="sidebar-item" data-page="session" href="#"><span class="item-left"><i class="fas fa-qrcode"></i> الجلسة</span></a>
        <div class="sidebar-divider"></div>
        <a class="sidebar-item" data-page="aichat" href="#"><span class="item-left"><i class="fas fa-robot"></i> الدردشة الذكية</span><span class="badge">AI</span></a>
      </div>

      <div class="sidebar-user">
        <div class="user-avatar" id="sidebarUserAvatar">AD</div>
        <div class="user-info">
          <div class="name" id="sidebarUserName">Admin</div>
          <div class="email" id="sidebarUserEmail">admin@example.com</div>
        </div>
        <div class="user-actions">
          <button class="theme-toggle" id="themeToggle" aria-label="Toggle theme">
            <i class="fas fa-moon" id="themeIcon"></i>
          </button>
          <button class="logout-btn" id="logoutBtn" aria-label="Logout" title="خروج">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </aside>

    <!-- ─── MAIN CONTENT ─── -->
    <main class="main-content" id="mainContent">
      <!-- يتم تحميل المحتوى هنا عبر JavaScript -->
    </main>

  </div>

  <!-- ─── TOAST CONTAINER ─── -->
  <div class="toast-container" id="toastContainer"></div>

  <!-- ─── LOGS MODAL ─── -->
  <div class="modal-overlay" id="logsModal">
    <div class="modal">
      <div class="modal-header">
        <h2><i class="fas fa-clipboard-list" style="color:var(--accent-soft);margin-right:8px;"></i> السجلات</h2>
        <button class="modal-close" id="closeLogsModal"><i class="fas fa-times"></i></button>
      </div>
      <div class="log-files-list" id="logFilesList"></div>
      <div class="log-content" id="logContent">اختر ملف سجل لعرض محتواه...</div>
    </div>
  </div>

  <script>
    (function() {
      'use strict';

      // ─── CONFIG ───
      const API_SECRET = window.API_SECRET || '';

      // ─── HELPERS ───
      function getHeaders() {
        return {
          'Content-Type': 'application/json',
          'X-API-Key': API_SECRET
        };
      }

      function showToast(msg, type = 'info', duration = 4000) {
        const container = document.getElementById('toastContainer');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast toast-' + type;
        toast.innerHTML = '<span>' + msg + '</span>';
        container.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, duration);
      }

      function setStatus(el, msg, type) {
        if (!el) return;
        el.textContent = msg;
        el.className = 'status' + (type ? ' ' + type : '');
      }

      function getToday() { return new Date().toISOString().split('T')[0]; }

      function copyToClipboard(text) {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          return navigator.clipboard.writeText(text);
        } else {
          return new Promise((resolve, reject) => {
            const ta = document.createElement('textarea');
            ta.value = text;
            document.body.appendChild(ta);
            ta.select();
            try { document.execCommand('copy');
              resolve(); } catch (e) { reject(e); }
            ta.remove();
          });
        }
      }

      // ─── AUTH SYSTEM ───
      const authOverlay = document.getElementById('authOverlay');
      const authForm = document.getElementById('authForm');
      const authEmail = document.getElementById('authEmail');
      const authPassword = document.getElementById('authPassword');
      const authBtn = document.getElementById('authBtn');
      const authBtnText = document.getElementById('authBtnText');
      const authError = document.getElementById('authError');
      const authSuccess = document.getElementById('authSuccess');
      const authRemember = document.getElementById('authRemember');
      const appWrapper = document.getElementById('appWrapper');
      let currentUser = null;

      function showAuthError(msg) {
        authError.textContent = msg;
        authError.classList.add('show');
        authSuccess.classList.remove('show');
      }

      function showAuthSuccess(msg) {
        authSuccess.textContent = msg;
        authSuccess.classList.add('show');
        authError.classList.remove('show');
      }

      function hideAuthMessages() {
        authError.classList.remove('show');
        authSuccess.classList.remove('show');
      }

      function setAuthLoading(loading) {
        authBtn.disabled = loading;
        authBtnText.textContent = loading ? 'جاري التحقق...' : 'دخول';
      }

      function getUsers() {
        try { return JSON.parse(localStorage.getItem('wa-users')) || {}; } catch { return {}; }
      }

      function saveUsers(users) { localStorage.setItem('wa-users', JSON.stringify(users)); }

      function getSession() {
        try { return JSON.parse(localStorage.getItem('wa-session')); } catch { return null; }
      }

      function saveSession(email, name) {
        localStorage.setItem('wa-session', JSON.stringify({ email, name, loggedIn: true }));
      }

      function clearSession() { localStorage.removeItem('wa-session'); }

      function handleAuthSubmit(e) {
        e.preventDefault();
        hideAuthMessages();
        const email = authEmail.value.trim().toLowerCase();
        const password = authPassword.value;
        if (!email || !password) { showAuthError('يرجى ملء جميع الحقول.'); return; }
        // التحقق من API_SECRET (كلمة المرور = API_SECRET)
        if (password !== API_SECRET) {
          showAuthError('كلمة المرور غير صحيحة.');
          return;
        }
        const users = getUsers();
        if (!users[email]) {
          users[email] = { name: email.split('@')[0] || 'مدير', password, createdAt: new Date().toISOString() };
          saveUsers(users);
        }
        showAuthSuccess('مرحباً بك!');
        setTimeout(() => loginUser(email, users[email].name), 500);
      }

      function loginUser(email, name) {
        currentUser = { email, name };
        if (authRemember.checked) saveSession(email, name);
        updateUserUI(email, name);
        authOverlay.classList.add('hidden');
        document.getElementById('particles-js').style.display = 'none';
        appWrapper.classList.add('authenticated');
        document.body.style.overflow = '';
        navigate('dashboard');
        showToast('مرحباً بك في لوحة التحكم', 'success');
      }

      function logoutUser() {
        if (!confirm('هل أنت متأكد من تسجيل الخروج؟')) return;
        clearSession();
        currentUser = null;
        appWrapper.classList.remove('authenticated');
        document.getElementById('particles-js').style.display = 'block';
        authOverlay.classList.remove('hidden');
        authForm.reset();
        hideAuthMessages();
        document.body.style.overflow = 'hidden';
        showToast('تم تسجيل الخروج', 'info');
      }

      function updateUserUI(email, name) {
        const avatar = document.getElementById('sidebarUserAvatar');
        const nameEl = document.getElementById('sidebarUserName');
        const emailEl = document.getElementById('sidebarUserEmail');
        const displayName = name || email.split('@')[0] || 'مدير';
        const initials = displayName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
        avatar.textContent = initials || 'AD';
        nameEl.textContent = displayName;
        emailEl.textContent = email;
      }

      function checkSession() {
        const session = getSession();
        if (session && session.loggedIn && session.email) {
          const users = getUsers();
          const user = users[session.email];
          if (user) { loginUser(session.email, session.name || user.name); return true; }
        }
        return false;
      }

      authForm.addEventListener('submit', handleAuthSubmit);

      // ─── THEME ───
      let currentTheme = localStorage.getItem('wa-theme') || 'light';

      function setTheme(theme) {
        currentTheme = theme;
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('themeIcon').className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        localStorage.setItem('wa-theme', theme);
      }

      function toggleTheme() { setTheme(currentTheme === 'dark' ? 'light' : 'dark'); }

      setTheme(currentTheme);
      document.getElementById('themeToggle').addEventListener('click', toggleTheme);

      // ─── SIDEBAR ───
      const sidebar = document.getElementById('sidebar');
      const sidebarOverlay = document.getElementById('sidebarOverlay');

      function toggleSidebar() {
        sidebar.classList.toggle('open');
        sidebarOverlay.classList.toggle('active');
        document.body.style.overflow = sidebar.classList.contains('open') ? 'hidden' : '';
      }

      document.querySelector('.sidebar-toggle-btn')?.addEventListener('click', toggleSidebar);
      sidebarOverlay.addEventListener('click', () => {
        sidebar.classList.remove('open');
        sidebarOverlay.classList.remove('active');
        document.body.style.overflow = '';
      });

      document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          sidebarOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // ─── SIDEBAR SEARCH ───
      document.getElementById('sidebarSearch').addEventListener('input', function(e) {
        const q = e.target.value.toLowerCase().trim();
        document.querySelectorAll('.sidebar-item').forEach(item => {
          const text = item.textContent.toLowerCase();
          item.style.display = text.includes(q) ? 'flex' : 'none';
        });
      });

      // ─── SIDEBAR NAVIGATION ───
      const mainContent = document.getElementById('mainContent');
      let currentPage = 'dashboard';
      let pageInstances = {};

      function navigate(page) {
        if (page === 'aichat') {
          renderAIChat();
          currentPage = 'aichat';
          updateActiveSidebar('aichat');
          return;
        }
        // تحميل الصفحة حسب الاسم
        const renderFn = pageRenderers[page];
        if (!renderFn) { mainContent.innerHTML =
            '<div class="page-header"><h1>صفحة غير موجودة</h1></div>'; return; }
        mainContent.innerHTML = renderFn();
        currentPage = page;
        updateActiveSidebar(page);
        // تهيئة الصفحة
        const initFn = pageInits[page];
        if (initFn) setTimeout(initFn, 50);
      }

      function updateActiveSidebar(page) {
        document.querySelectorAll('.sidebar-item').forEach(el => {
          el.classList.toggle('active', el.dataset.page === page);
        });
        if (window.innerWidth <= 900) {
          sidebar.classList.remove('open');
          sidebarOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      }

      document.querySelectorAll('.sidebar-item[data-page]').forEach(item => {
        item.addEventListener('click', function(e) {
          e.preventDefault();
          navigate(this.dataset.page);
        });
      });

      document.getElementById('logoutBtn').addEventListener('click', logoutUser);

      // ─── PAGE RENDERERS ───
      const pageRenderers = {};

      // ---- DASHBOARD ----
      pageRenderers.dashboard = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-home" style="color:var(--accent-soft);margin-left:10px;"></i> لوحة التحكم</h1>
            <p>مرحباً بك في لوحة إدارة واتساب</p>
          </div>
          <div class="dashboard-grid">
            <div class="card stats-card">
              <div class="stats-icon"><i class="fas fa-users"></i></div>
              <div><h3>جهات الاتصال</h3><p id="dashContacts">-</p></div>
            </div>
            <div class="card stats-card">
              <div class="stats-icon"><i class="fas fa-clock"></i></div>
              <div><h3>آخر تشغيل</h3><p id="dashLastRun">-</p></div>
            </div>
            <div class="card stats-card">
              <div class="stats-icon"><i class="fas fa-check-circle"></i></div>
              <div><h3>حالة الجلسة</h3><p id="dashSession">-</p></div>
            </div>
            <div class="card stats-card">
              <div class="stats-icon"><i class="fas fa-calendar-day"></i></div>
              <div><h3>اليوم</h3><p>${getToday()}</p></div>
            </div>
          </div>
          <div class="card">
            <div class="card-header"><i class="fas fa-history"></i><h2>آخر النتائج</h2></div>
            <div id="dashRecent" style="padding:10px 0;"><div style="color:var(--text-muted);">جاري التحميل...</div></div>
          </div>
        `;
      };

      pageInits.dashboard = function() {
        // Contacts count
        fetch('/api/mylist', { headers: getHeaders() })
          .then(r => r.json()).then(d => {
            if (d.ok) document.getElementById('dashContacts').textContent = d.data.length;
          }).catch(() => {});
        // Stats
        fetch('/api/stats', { headers: getHeaders() })
          .then(r => r.json()).then(d => {
            if (d.ok && d.data.length > 0) {
              const last = d.data[d.data.length - 1];
              document.getElementById('dashLastRun').textContent = last.date;
              const recent = d.data.slice(-5).reverse();
              const container = document.getElementById('dashRecent');
              container.innerHTML = recent.map(row =>
                `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border-subtle);">
                  <span>${row.date}</span>
                  <span>محاولات: ${row.attempted||0} | نجاح: ${row.success||0} | فشل: ${row.failed||0}</span>
                </div>`
              ).join('');
            }
          }).catch(() => {});
        // Session status
        fetch('/api/live/status', { headers: getHeaders() })
          .then(r => r.json()).then(d => {
            const map = { 'connected': '🟢 متصل', 'waiting_scan': '🟡 في انتظار المسح', 'starting': '🟡 جاري التشغيل',
              'disconnected': '🔴 غير متصل' };
            document.getElementById('dashSession').textContent = d.ok ? (map[d.status] || 'غير معروف') : 'غير معروف';
          }).catch(() => {});
      };

      // ---- CONTACTS ----
      pageRenderers.contacts = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-address-book" style="color:var(--accent-soft);margin-left:10px;"></i> جهات الاتصال (mylist.json)</h1>
            <p>إدارة جهات الاتصال مع الاسم، الجنس، الرقم، العمر</p>
          </div>
          <div class="card">
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;align-items:center;">
              <input type="text" id="contactsFilter" placeholder="فلترة..." style="flex:1;min-width:180px;" />
              <button id="addContactBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-plus"></i> إضافة</button>
              <button id="copyNumbersBtn" class="btn" style="width:auto;"><i class="fas fa-copy"></i> نسخ الأرقام</button>
              <button id="saveContactsBtn" class="btn btn-primary" style="width:auto;"><i class="fas fa-save"></i> حفظ</button>
              <span id="contactsCount" style="color:var(--text-muted);font-size:13px;">0 صف</span>
            </div>
            <div class="contacts-table-wrap">
              <table>
                <thead><tr><th>#</th><th>الاسم</th><th>النوع</th><th>الرقم</th><th>العمر</th><th>إجراء</th></tr></thead>
                <tbody id="contactsBody"><tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">جاري التحميل...</td></tr></tbody>
              </table>
            </div>
            <div id="contactsStatus" class="status"></div>
          </div>
        `;
      };

      let contactsData = [];
      let filteredContacts = [];

      pageInits.contacts = function() {
        loadContactsData();

        document.getElementById('contactsFilter').addEventListener('input', renderContactsTable);
        document.getElementById('addContactBtn').addEventListener('click', () => {
          contactsData.push({ name: '', gender: '', number: '', age: '' });
          renderContactsTable();
          showToast('تمت الإضافة (لم يحفظ بعد)', 'info');
        });
        document.getElementById('saveContactsBtn').addEventListener('click', saveContactsData);
        document.getElementById('copyNumbersBtn').addEventListener('click', async () => {
          const nums = filteredContacts.map(r => r.number).filter(Boolean);
          if (!nums.length) { showToast('لا توجد أرقام', 'warning'); return; }
          await copyToClipboard(nums.join('\n'));
          showToast('تم نسخ ' + nums.length + ' رقم', 'success');
        });
      };

      async function loadContactsData() {
        const status = document.getElementById('contactsStatus');
        setStatus(status, 'جاري التحميل...');
        try {
          const res = await fetch('/api/mylist', { headers: getHeaders() });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          contactsData = data.data || [];
          renderContactsTable();
          setStatus(status, '✓ تم التحميل', 'ok');
        } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err');
          showToast('فشل التحميل', 'error'); }
      }

      function renderContactsTable() {
        const filter = document.getElementById('contactsFilter')?.value?.trim().toLowerCase() || '';
        filteredContacts = contactsData.filter(r => Object.values(r).some(v => String(v).toLowerCase().includes(filter)));
        document.getElementById('contactsCount').textContent = filteredContacts.length + ' صف';
        const tbody = document.getElementById('contactsBody');
        if (!filteredContacts.length) {
          tbody.innerHTML =
            '<tr><td colspan="6" style="text-align:center;padding:20px;color:var(--text-muted);">لا توجد بيانات</td></tr>';
          return;
        }
        tbody.innerHTML = filteredContacts.map((row, idx) => {
          const realIdx = contactsData.indexOf(row);
          return `
            <tr data-index="${realIdx}">
              <td>${idx+1}</td>
              <td contenteditable="true" class="editable" data-field="name">${row.name||''}</td>
              <td contenteditable="true" class="editable" data-field="gender">${row.gender||''}</td>
              <td contenteditable="true" class="editable" data-field="number" style="direction:ltr;">${row.number||''}</td>
              <td contenteditable="true" class="editable" data-field="age">${row.age||''}</td>
              <td><button class="delContactBtn btn btn-danger" style="width:auto;padding:2px 10px;font-size:12px;">حذف</button></td>
            </tr>
          `;
        }).join('');

        document.querySelectorAll('.editable').forEach(cell => {
          cell.addEventListener('blur', function() {
            const tr = this.closest('tr');
            const idx = parseInt(tr.dataset.index);
            const field = this.dataset.field;
            if (contactsData[idx]) contactsData[idx][field] = this.textContent.trim();
          });
        });
        document.querySelectorAll('.delContactBtn').forEach(btn => {
          btn.addEventListener('click', function() {
            const tr = this.closest('tr');
            const idx = parseInt(tr.dataset.index);
            if (confirm('تأكيد الحذف؟')) { contactsData.splice(idx, 1);
              renderContactsTable();
              showToast('تم الحذف (لم يحفظ بعد)', 'info'); }
          });
        });
      }

      async function saveContactsData() {
        const status = document.getElementById('contactsStatus');
        setStatus(status, 'جاري الحفظ...');
        try {
          const res = await fetch('/api/mylist', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ data: contactsData })
          });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          setStatus(status, '✓ تم الحفظ', 'ok');
          showToast('تم حفظ التغييرات', 'success');
        } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err');
          showToast('فشل الحفظ', 'error'); }
      }

      // ---- MESSAGES ----
      pageRenderers.messages = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-envelope" style="color:var(--accent-soft);margin-left:10px;"></i> الرسائل (messages.json)</h1>
            <p>إدارة قائمة الرسائل (كل رسالة في سطر)</p>
          </div>
          <div class="card">
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;align-items:center;">
              <button id="loadMessagesBtn" class="btn"><i class="fas fa-download"></i> تحميل</button>
              <button id="saveMessagesBtn" class="btn btn-primary"><i class="fas fa-save"></i> حفظ</button>
              <span id="messagesCount" style="color:var(--text-muted);font-size:13px;">0 رسالة</span>
            </div>
            <textarea id="messagesArea" placeholder="اكتب رسالة في كل سطر..."></textarea>
            <div id="messagesStatus" class="status"></div>
          </div>
        `;
      };

      pageInits.messages = function() {
        const area = document.getElementById('messagesArea');
        const status = document.getElementById('messagesStatus');
        const count = document.getElementById('messagesCount');

        async function loadMessages() {
          setStatus(status, 'جاري التحميل...');
          try {
            const res = await fetch('/api/load?type=messages', { headers: getHeaders() });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            area.value = data.text || '';
            const c = area.value.split('\n').filter(Boolean).length;
            count.textContent = c + ' رسالة';
            setStatus(status, '✓ تم التحميل', 'ok');
          } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err'); }
        }

        async function saveMessages() {
          setStatus(status, 'جاري الحفظ...');
          try {
            const res = await fetch('/api/save', {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify({ type: 'messages', text: area.value })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            const c = area.value.split('\n').filter(Boolean).length;
            count.textContent = c + ' رسالة';
            setStatus(status, '✓ تم الحفظ', 'ok');
            showToast('تم حفظ الرسائل', 'success');
          } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err'); }
        }

        document.getElementById('loadMessagesBtn').addEventListener('click', loadMessages);
        document.getElementById('saveMessagesBtn').addEventListener('click', saveMessages);
        area.addEventListener('input', () => {
          const c = area.value.split('\n').filter(Boolean).length;
          count.textContent = c + ' رسالة';
        });
        loadMessages();
      };

      // ---- ACCOUNTS ----
      pageRenderers.accounts = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-phone" style="color:var(--accent-soft);margin-left:10px;"></i> الأرقام (accounts.json)</h1>
            <p>إدارة قائمة الأرقام (مصفوفة JSON) - كل رقم في سطر</p>
          </div>
          <div class="card">
            <div style="display:flex;flex-wrap:wrap;gap:12px;margin-bottom:16px;align-items:center;">
              <button id="loadAccountsBtn" class="btn"><i class="fas fa-download"></i> تحميل</button>
              <button id="saveAccountsBtn" class="btn btn-primary"><i class="fas fa-save"></i> حفظ</button>
              <span id="accountsCount" style="color:var(--text-muted);font-size:13px;">0 رقم</span>
            </div>
            <textarea id="accountsArea" placeholder="أدخل رقم في كل سطر..."></textarea>
            <div id="accountsStatus" class="status"></div>
          </div>
        `;
      };

      pageInits.accounts = function() {
        const area = document.getElementById('accountsArea');
        const status = document.getElementById('accountsStatus');
        const count = document.getElementById('accountsCount');

        async function loadAccounts() {
          setStatus(status, 'جاري التحميل...');
          try {
            const res = await fetch('/api/load?type=accounts', { headers: getHeaders() });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            let nums = [];
            try { const p = JSON.parse(data.text || '[]'); if (Array.isArray(p)) nums = p; } catch (e) { nums = data.text.split(
                '\n').filter(Boolean); }
            area.value = nums.join('\n');
            count.textContent = nums.length + ' رقم';
            setStatus(status, '✓ تم التحميل', 'ok');
          } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err'); }
        }

        async function saveAccounts() {
          setStatus(status, 'جاري الحفظ...');
          try {
            const lines = area.value.split('\n').filter(Boolean);
            const json = JSON.stringify(lines, null, 2);
            const res = await fetch('/api/save', {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify({ type: 'accounts', text: json })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            count.textContent = lines.length + ' رقم';
            setStatus(status, '✓ تم الحفظ', 'ok');
            showToast('تم حفظ الأرقام', 'success');
          } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err'); }
        }

        document.getElementById('loadAccountsBtn').addEventListener('click', loadAccounts);
        document.getElementById('saveAccountsBtn').addEventListener('click', saveAccounts);
        area.addEventListener('input', () => {
          const c = area.value.split('\n').filter(Boolean).length;
          count.textContent = c + ' رقم';
        });
        loadAccounts();
      };

      // ---- SENDER ----
      pageRenderers.sender = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-paper-plane" style="color:var(--accent-soft);margin-left:10px;"></i> الإرسال</h1>
            <p>تشغيل الـ Workflow لإرسال الرسائل مع عرض التقدم</p>
          </div>
          <div class="card">
            <div style="display:flex;gap:12px;flex-wrap:wrap;margin-bottom:16px;">
              <button id="runWorkflowBtn" class="btn btn-success"><i class="fas fa-play"></i> تشغيل الـ Workflow</button>
              <button id="stopWorkflowBtn" class="btn btn-danger"><i class="fas fa-stop"></i> إيقاف</button>
              <button id="refreshSenderBtn" class="btn"><i class="fas fa-sync"></i> تحديث</button>
            </div>
            <div style="background:var(--bg-card);padding:16px;border-radius:var(--radius-xs);margin-bottom:16px;">
              <div style="display:flex;justify-content:space-between;flex-wrap:wrap;gap:8px;">
                <span><strong>عدد الأرقام:</strong> <span id="senderNumbers">-</span></span>
                <span><strong>عدد الرسائل:</strong> <span id="senderMessages">-</span></span>
                <span><strong>الوقت المتوقع:</strong> <span id="senderTime">-</span></span>
              </div>
            </div>
            <div>
              <div class="progress-text" id="progressText">0%</div>
              <div class="progress-container"><div class="progress-bar" id="progressBar" style="width:0%;">0%</div></div>
            </div>
            <div id="senderStatus" class="status"></div>
          </div>
        `;
      };

      let senderInterval = null;

      pageInits.sender = function() {
        updateSenderStats();

        document.getElementById('refreshSenderBtn').addEventListener('click', updateSenderStats);
        document.getElementById('runWorkflowBtn').addEventListener('click', async function() {
          const st = document.getElementById('senderStatus');
          setStatus(st, 'جاري التشغيل...');
          try {
            const res = await fetch('/api/run-workflow', { method: 'POST', headers: getHeaders() });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setStatus(st, '✓ تم التشغيل', 'ok');
            showToast('تم تشغيل الـ Workflow', 'success');
            startProgressSimulation();
          } catch (e) { setStatus(st, 'خطأ: ' + e.message, 'err');
            showToast('فشل التشغيل', 'error'); }
        });
        document.getElementById('stopWorkflowBtn').addEventListener('click', async function() {
          const st = document.getElementById('senderStatus');
          setStatus(st, 'جاري الإيقاف...');
          try {
            const res = await fetch('/api/stop-workflow', { method: 'POST', headers: getHeaders() });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setStatus(st, '✓ تم الإيقاف', 'ok');
            showToast('تم إيقاف الـ Workflow', 'info');
            stopProgressSimulation();
          } catch (e) { setStatus(st, 'خطأ: ' + e.message, 'err'); }
        });
      };

      async function updateSenderStats() {
        try {
          const ar = await fetch('/api/load?type=accounts', { headers: getHeaders() });
          const ad = await ar.json();
          let nums = 0;
          if (ad.ok && ad.text) {
            try { const p = JSON.parse(ad.text); if (Array.isArray(p)) nums = p.length; } catch (e) { nums = ad.text.split(
                '\n').filter(Boolean).length; }
          }
          document.getElementById('senderNumbers').textContent = nums;
          const mr = await fetch('/api/load?type=messages', { headers: getHeaders() });
          const md = await mr.json();
          let msgs = 0;
          if (md.ok && md.text) msgs = md.text.split('\n').filter(Boolean).length;
          document.getElementById('senderMessages').textContent = msgs;
          document.getElementById('senderTime').textContent = nums > 0 ? (nums * 20) + ' - ' + (nums * 40) + ' ثانية' :
          'لا توجد أرقام';
        } catch (e) {}
      }

      function startProgressSimulation() {
        let p = 0;
        const bar = document.getElementById('progressBar');
        const text = document.getElementById('progressText');
        if (senderInterval) clearInterval(senderInterval);
        senderInterval = setInterval(() => {
          p += Math.random() * 5;
          if (p >= 100) { p = 100;
            clearInterval(senderInterval);
            senderInterval = null;
            showToast('اكتمل الإرسال!', 'success'); }
          bar.style.width = p + '%';
          bar.textContent = Math.round(p) + '%';
          text.textContent = Math.round(p) + '%';
        }, 800);
      }

      function stopProgressSimulation() {
        if (senderInterval) { clearInterval(senderInterval);
          senderInterval = null; }
        const bar = document.getElementById('progressBar');
        const text = document.getElementById('progressText');
        bar.style.width = '0%';
        bar.textContent = '0%';
        text.textContent = '0%';
      }

      // ---- SCHEDULE ----
      pageRenderers.schedule = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-clock" style="color:var(--accent-soft);margin-left:10px;"></i> الجدولة</h1>
            <p>تحديد وقت تشغيل الـ Workflow (توقيت المغرب -2 ساعة UTC)</p>
          </div>
          <div class="card">
            <div style="margin-bottom:16px;">
              <span class="schedule-status inactive" id="schedIndicator">غير مفعل</span>
              <span id="schedDisplay" style="font-size:13px;color:var(--text-muted);display:block;margin-top:5px;"></span>
            </div>
            <div class="schedule-inputs">
              <label>الساعة <input type="number" id="hourInput" min="0" max="23" value="10" /></label>
              <label>الدقيقة <input type="number" id="minuteInput" min="0" max="59" value="0" /></label>
            </div>
            <div class="btn-row">
              <button id="loadSchedBtn" class="btn"><i class="fas fa-history"></i> تحميل</button>
              <button id="updateSchedBtn" class="btn btn-warning"><i class="fas fa-sync-alt"></i> تحديث</button>
            </div>
            <div id="schedStatus" class="status"></div>
          </div>
        `;
      };

      pageInits.schedule = function() {
        const hourInput = document.getElementById('hourInput');
        const minuteInput = document.getElementById('minuteInput');
        const statusEl = document.getElementById('schedStatus');
        const indicator = document.getElementById('schedIndicator');
        const disp = document.getElementById('schedDisplay');

        async function loadSchedule() {
          setStatus(statusEl, 'جاري التحميل...');
          try {
            const res = await fetch('/api/schedule', { headers: getHeaders() });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            if (data.hasSchedule && data.cron) {
              indicator.textContent = 'مفعل';
              indicator.className = 'schedule-status active';
              disp.textContent = 'التوقيت (المغرب): ' + data.cron;
              const parts = data.cron.trim().split(/\s+/);
              if (parts.length >= 2) { minuteInput.value = parts[0];
                hourInput.value = parts[1]; }
              setStatus(statusEl, 'تم التحميل ✓', 'ok');
            } else {
              indicator.textContent = 'غير مفعل';
              indicator.className = 'schedule-status inactive';
              disp.textContent = '(لا توجد جدولة)';
              setStatus(statusEl, 'الجدولة غير مفعلة');
            }
          } catch (e) { setStatus(statusEl, 'خطأ: ' + e.message, 'err'); }
        }

        async function saveSchedule(cron) {
          setStatus(statusEl, 'جاري الحفظ...');
          try {
            const res = await fetch('/api/schedule', {
              method: 'POST',
              headers: getHeaders(),
              body: JSON.stringify({ action: 'add', cron })
            });
            const data = await res.json();
            if (!data.ok) throw new Error(data.error);
            setStatus(statusEl, 'تم التحديث ✓', 'ok');
            showToast('تم تحديث الجدولة', 'success');
            loadSchedule();
          } catch (e) { setStatus(statusEl, 'خطأ: ' + e.message, 'err'); }
        }

        document.getElementById('loadSchedBtn').addEventListener('click', loadSchedule);
        document.getElementById('updateSchedBtn').addEventListener('click', () => {
          const h = parseInt(hourInput.value, 10);
          const m = parseInt(minuteInput.value, 10);
          if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) {
            setStatus(statusEl, 'أدخل قيم صحيحة', 'err');
            return;
          }
          saveSchedule(m + ' ' + h + ' * * *');
        });
        loadSchedule();
      };

      // ---- STATS ----
      let statsChart = null;

      pageRenderers.stats = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-chart-bar" style="color:var(--accent-soft);margin-left:10px;"></i> الإحصائيات</h1>
            <p>ملخص أداء عمليات الإرسال</p>
          </div>
          <div class="card">
            <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;margin-bottom:16px;">
              <button id="refreshStatsBtn" class="btn btn-primary"><i class="fas fa-sync"></i> تحديث</button>
            </div>
            <div>
              <div style="max-height:250px;overflow-y:auto;border:1px solid var(--border-subtle);border-radius:var(--radius-xs);margin-bottom:20px;">
                <table class="stats-table">
                  <thead><tr><th>التاريخ</th><th>محاولات</th><th>نجاح</th><th>فشل</th></tr></thead>
                  <tbody id="statsBody"></tbody>
                </table>
              </div>
              <div style="background:var(--bg-card);border-radius:var(--radius-xs);padding:20px;height:300px;">
                <canvas id="statsChart"></canvas>
              </div>
            </div>
            <div id="statsStatus" class="status"></div>
          </div>
        `;
      };

      pageInits.stats = function() {
        loadStatsData();
        document.getElementById('refreshStatsBtn').addEventListener('click', loadStatsData);
      };

      async function loadStatsData() {
        const status = document.getElementById('statsStatus');
        setStatus(status, 'جاري التحميل...');
        try {
          const res = await fetch('/api/stats', { headers: getHeaders() });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          if (!data.data.length) { setStatus(status, 'لا توجد إحصائيات'); return; }
          setStatus(status, '✓ تم التحميل', 'ok');
          const tbody = document.getElementById('statsBody');
          tbody.innerHTML = '';
          let ta = 0,
            ts = 0,
            tf = 0;
          data.data.forEach(r => {
            ta += r.attempted || 0;
            ts += r.success || 0;
            tf += r.failed || 0;
            tbody.innerHTML +=
              `<tr><td>${r.date}</td><td>${r.attempted||0}</td><td style="color:var(--green);">${r.success||0}</td><td style="color:var(--red);">${r.failed||0}</td></tr>`;
          });
          tbody.innerHTML +=
            `<tr style="font-weight:bold;border-top:2px solid var(--accent);"><td>المجموع</td><td>${ta}</td><td style="color:var(--green);">${ts}</td><td style="color:var(--red);">${tf}</td></tr>`;
          const ctx = document.getElementById('statsChart').getContext('2d');
          if (statsChart) statsChart.destroy();
          statsChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: data.data.map(r => r.date),
              datasets: [
                { label: 'محاولات', data: data.data.map(r => r.attempted || 0), backgroundColor: 'rgba(53,114,238,0.6)',
                  borderColor: 'rgba(53,114,238,1)', borderWidth: 1 },
                { label: 'نجاح', data: data.data.map(r => r.success || 0), backgroundColor: 'rgba(37,211,102,0.6)',
                  borderColor: 'rgba(37,211,102,1)', borderWidth: 1 },
                { label: 'فشل', data: data.data.map(r => r.failed || 0), backgroundColor: 'rgba(241,92,109,0.6)',
                  borderColor: 'rgba(241,92,109,1)', borderWidth: 1 }
              ]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: { legend: { labels: { color: getComputedStyle(document.documentElement)
                      .getPropertyValue('--text-secondary').trim() || '#4a4f66' } } },
              scales: {
                y: { beginAtZero: true, ticks: { color: getComputedStyle(document.documentElement)
                      .getPropertyValue('--text-muted').trim() || '#8a90a8' }, grid: { color: 'rgba(255,255,255,0.05)' } },
                x: { ticks: { color: getComputedStyle(document.documentElement).getPropertyValue('--text-muted')
                    .trim() || '#8a90a8' }, grid: { display: false } }
              }
            }
          });
        } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err');
          showToast('فشل تحميل الإحصائيات', 'error'); }
      }

      // ---- LOGS ----
      pageRenderers.logs = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-terminal" style="color:var(--accent-soft);margin-left:10px;"></i> السجلات</h1>
            <p>عرض ملفات السجل من مجلد logs</p>
          </div>
          <div class="card">
            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;">
              <button id="refreshLogsBtn" class="btn btn-primary"><i class="fas fa-sync"></i> تحديث</button>
              <button id="openLogsModalBtn" class="btn"><i class="fas fa-expand"></i> عرض في نافذة</button>
            </div>
            <div id="logsList" style="display:flex;gap:10px;flex-wrap:wrap;margin-bottom:16px;"></div>
            <div class="log-content" id="logContentDisplay">اختر ملف سجل لعرض محتواه</div>
            <div id="logsStatus" class="status"></div>
          </div>
        `;
      };

      pageInits.logs = function() {
        loadLogsList();
        document.getElementById('refreshLogsBtn').addEventListener('click', loadLogsList);
        document.getElementById('openLogsModalBtn').addEventListener('click', openLogsModal);
      };

      async function loadLogsList() {
        const list = document.getElementById('logsList');
        const status = document.getElementById('logsStatus');
        setStatus(status, 'جاري التحميل...');
        try {
          const res = await fetch('/api/logs', { headers: getHeaders() });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          list.innerHTML = '';
          if (!data.files.length) { list.innerHTML = '<span style="color:var(--text-muted);">لا توجد سجلات</span>';
            setStatus(status, 'لا توجد ملفات'); return; }
          data.files.forEach(f => {
            const btn = document.createElement('button');
            btn.className = 'btn';
            btn.textContent = f.name;
            btn.style.width = 'auto';
            btn.addEventListener('click', () => loadLogContent(f.name));
            list.appendChild(btn);
          });
          setStatus(status, '✓ تم التحميل', 'ok');
        } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err');
          showToast('فشل تحميل السجلات', 'error'); }
      }

      async function loadLogContent(filename) {
        const el = document.getElementById('logContentDisplay') || document.getElementById('logContent');
        if (!el) return;
        el.textContent = 'جاري التحميل...';
        try {
          const res = await fetch('/api/log-content?file=' + encodeURIComponent(filename), { headers: getHeaders() });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          el.textContent = data.content || '(فارغ)';
        } catch (e) { el.textContent = 'خطأ: ' + e.message; }
      }

      // LOGS MODAL
      function openLogsModal() {
        const modal = document.getElementById('logsModal');
        modal.classList.add('open');
        const list = document.getElementById('logFilesList');
        const content = document.getElementById('logContent');
        content.textContent = 'اختر ملف سجل لعرض محتواه...';
        fetch('/api/logs', { headers: getHeaders() })
          .then(r => r.json()).then(data => {
            if (!data.ok) throw new Error(data.error);
            list.innerHTML = '';
            if (!data.files.length) { list.innerHTML = '<span style="color:var(--text-muted);">لا توجد سجلات</span>'; return; }
            data.files.forEach(f => {
              const btn = document.createElement('button');
              btn.className = 'log-file-btn';
              btn.textContent = f.name;
              btn.onclick = () => {
                document.querySelectorAll('.log-file-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                content.textContent = 'جاري التحميل...';
                fetch('/api/log-content?file=' + encodeURIComponent(f.name), { headers: getHeaders() })
                  .then(r => r.json()).then(d => { if (d.ok) content.textContent = d.content || '(فارغ)'; else content
                      .textContent = 'خطأ'; }).catch(() => content.textContent = 'خطأ');
              };
              list.appendChild(btn);
            });
          }).catch(() => list.innerHTML = '<span style="color:var(--red);">خطأ في التحميل</span>');
        document.getElementById('closeLogsModal').onclick = () => modal.classList.remove('open');
        modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('open'); });
      }

      // ---- IMAGES ----
      let selectedImages = [];

      pageRenderers.images = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-images" style="color:var(--accent-soft);margin-left:10px;"></i> إدارة الصور</h1>
            <p>رفع وحذف الصور (الحد الأقصى 3 صور)</p>
          </div>
          <div class="card">
            <div style="background:var(--bg-card);padding:16px;border-radius:var(--radius-xs);border:1px dashed var(--border-subtle);margin-bottom:16px;">
              <input type="file" id="imagesInput" accept="image/*" multiple style="width:100%;margin-bottom:10px;" />
              <div id="imagePreviewArea" style="display:flex;flex-wrap:wrap;gap:10px;"></div>
            </div>
            <div class="btn-row">
              <button id="uploadImagesBtn" class="btn btn-primary"><i class="fas fa-upload"></i> رفع الصور</button>
              <button id="refreshImagesBtn" class="btn"><i class="fas fa-sync"></i> تحديث القائمة</button>
            </div>
            <div id="imageGallery" style="margin-top:16px;display:none;">
              <div style="margin-bottom:10px;"><span style="font-size:14px;color:var(--text-muted);">الصور الموجودة (<span id="imageCount">0</span>/3)</span></div>
              <div id="imageList" style="display:flex;flex-wrap:wrap;gap:12px;"></div>
            </div>
            <div id="imagesStatus" class="status"></div>
          </div>
        `;
      };

      pageInits.images = function() {
        const input = document.getElementById('imagesInput');
        const preview = document.getElementById('imagePreviewArea');

        input.addEventListener('change', function() {
          selectedImages = Array.from(this.files);
          renderImagePreviews();
        });

        function renderImagePreviews() {
          preview.innerHTML = '';
          selectedImages.forEach((file, idx) => {
            const reader = new FileReader();
            reader.onload = function(ev) {
              const div = document.createElement('div');
              div.style.cssText =
                'width:80px;height:80px;border-radius:8px;overflow:hidden;position:relative;border:1px solid var(--border-subtle);';
              div.innerHTML =
                `<img src="${ev.target.result}" style="width:100%;height:100%;object-fit:cover;" /><button data-index="${idx}" style="position:absolute;top:2px;right:2px;background:var(--red);color:#fff;border:none;border-radius:50%;width:20px;height:20px;cursor:pointer;font-size:10px;">X</button>`;
              preview.appendChild(div);
              div.querySelector('button').onclick = function() {
                selectedImages.splice(idx, 1);
                renderImagePreviews();
              };
            };
            reader.readAsDataURL(file);
          });
        }

        document.getElementById('uploadImagesBtn').addEventListener('click', uploadImages);
        document.getElementById('refreshImagesBtn').addEventListener('click', loadImages);
        loadImages();
      };

      async function loadImages() {
        const gallery = document.getElementById('imageGallery');
        const list = document.getElementById('imageList');
        const countSpan = document.getElementById('imageCount');
        const status = document.getElementById('imagesStatus');
        setStatus(status, 'جاري التحميل...');
        try {
          const res = await fetch('/api/images', { headers: getHeaders() });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          const files = data.files || [];
          countSpan.textContent = files.length;
          if (!files.length) { gallery.style.display = 'none';
            setStatus(status, 'لا توجد صور'); return; }
          gallery.style.display = 'block';
          list.innerHTML = '';
          files.forEach(f => {
            const div = document.createElement('div');
            div.className = 'image-item';
            div.innerHTML =
              `<img src="${f.download_url}" /><button class="delete-btn" data-filename="${f.name}"><i class="fas fa-trash"></i></button>`;
            list.appendChild(div);
          });
          document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', async function() {
              const fn = this.dataset.filename;
              if (!confirm('تأكيد حذف "' + fn + '"؟')) return;
              try {
                const r = await fetch('/api/delete-image', {
                  method: 'POST',
                  headers: getHeaders(),
                  body: JSON.stringify({ filename: fn })
                });
                const d = await r.json();
                if (!d.ok) throw new Error(d.error);
                showToast('تم الحذف', 'success');
                loadImages();
              } catch (e) { showToast('خطأ في الحذف', 'error'); }
            });
          });
          setStatus(status, '✓ تم التحميل', 'ok');
        } catch (e) { setStatus(status, 'خطأ: ' + e.message, 'err'); }
      }

      async function uploadImages() {
        const status = document.getElementById('imagesStatus');
        if (!selectedImages.length) { showToast('اختر صورة أولاً', 'warning'); return; }
        try {
          const chk = await fetch('/api/images', { headers: getHeaders() });
          const chkData = await chk.json();
          const current = chkData.files ? chkData.files.length : 0;
          if (current >= 3) { showToast('لا يمكن رفع أكثر من 3 صور', 'error'); return; }
          if (selectedImages.length > (3 - current)) { showToast('يمكنك رفع ' + (3 - current) + ' صورة فقط', 'warning'); return; }
        } catch (e) { showToast('خطأ في التحقق', 'error'); return; }
        let success = 0;
        for (const file of selectedImages) {
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
        showToast(success + '/' + selectedImages.length + ' تم رفعها', success === selectedImages.length ? 'success' :
          'warning');
        if (success === selectedImages.length) { selectedImages = [];
          document.getElementById('imagesInput').value = '';
          document.getElementById('imagePreviewArea').innerHTML = ''; }
        loadImages();
      }

      // ---- SESSION ----
      let qrInterval = null;

      pageRenderers.session = function() {
        return `
          <div class="page-header">
            <h1><i class="fas fa-qrcode" style="color:var(--accent-soft);margin-left:10px;"></i> التحقق من الجلسة</h1>
            <p>عرض حالة جلسة واتساب ورمز QR عند الحاجة</p>
          </div>
          <div class="card">
            <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin-bottom:16px;">
              <button id="checkSessionBtn" class="btn btn-primary"><i class="fas fa-sync"></i> تحقق الآن</button>
              <button id="stopQRBtn" class="btn btn-danger"><i class="fas fa-stop"></i> إيقاف تحديث QR</button>
            </div>
            <div class="session-status">
              <span class="session-indicator unknown" id="sessionIndicator"></span>
              <span id="sessionStatusText" style="font-weight:bold;">غير معروف</span>
              <span style="color:var(--text-muted);margin-right:auto;">آخر تحديث: <span id="sessionLastUpdate">-</span></span>
            </div>
            <div id="sessionQRContainer" style="display:none;" class="qr-container">
              <img id="sessionQRImage" src="" alt="QR Code" />
              <div style="font-size:12px;color:var(--text-muted);margin-top:8px;">امسح الرمز لتسجيل الدخول</div>
            </div>
            <div id="sessionStatus" class="status"></div>
          </div>
        `;
      };

      pageInits.session = function() {
        checkSessionStatus();
        document.getElementById('checkSessionBtn').addEventListener('click', checkSessionStatus);
        document.getElementById('stopQRBtn').addEventListener('click', () => {
          if (qrInterval) { clearInterval(qrInterval);
            qrInterval = null;
            showToast('تم إيقاف تحديث QR', 'info'); }
        });
      };

      async function checkSessionStatus() {
        const statusText = document.getElementById('sessionStatusText');
        const indicator = document.getElementById('sessionIndicator');
        const qrContainer = document.getElementById('sessionQRContainer');
        const lastUpdate = document.getElementById('sessionLastUpdate');
        const statusEl = document.getElementById('sessionStatus');
        setStatus(statusEl, 'جاري التحقق...');
        try {
          const res = await fetch('/api/live/status', { headers: getHeaders() });
          const data = await res.json();
          if (!data.ok) throw new Error(data.error);
          const s = data.status;
          const map = {
            'connected': { label: '🟢 متصل', cls: 'connected' },
            'waiting_scan': { label: '🟡 في انتظار المسح', cls: 'waiting' },
            'starting': { label: '🟡 جاري التشغيل', cls: 'waiting' },
            'disconnected': { label: '🔴 غير متصل', cls: 'disconnected' }
          };
          const info = map[s] || { label: '⚪ غير معروف', cls: 'unknown' };
          statusText.textContent = info.label;
          indicator.className = 'session-indicator ' + info.cls;
          lastUpdate.textContent = new Date().toLocaleTimeString();
          if (s === 'waiting_scan' || s === 'disconnected' || s === 'starting') {
            await fetchQR();
            if (!qrInterval) qrInterval = setInterval(fetchQR, 2000);
          } else {
            qrContainer.style.display = 'none';
            if (qrInterval) { clearInterval(qrInterval);
              qrInterval = null; }
          }
          setStatus(statusEl, '✓ تم التحقق', 'ok');
        } catch (e) { setStatus(statusEl, 'خطأ: ' + e.message, 'err'); }
      }

      async function fetchQR() {
        try {
          const res = await fetch('/api/live/qr', { headers: getHeaders() });
          const data = await res.json();
          if (data.ok && data.qr) {
            document.getElementById('sessionQRImage').src = data.qr;
            document.getElementById('sessionQRContainer').style.display = 'block';
          }
        } catch (e) {}
      }

      // ---- AI CHAT ----
      const OPENROUTER_API_KEY = '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';

      function renderAIChat() {
        mainContent.innerHTML = `
          <div class="chat-header">
            <div class="header-left">
              <span class="chat-title">🤖 الدردشة الذكية</span>
            </div>
            <div class="header-actions">
              <button id="btnClearChat" title="مسح المحادثة"><i class="fas fa-eraser"></i></button>
            </div>
          </div>
          <div class="ai-error-banner" id="aiErrorBanner">
            <button class="close-banner" id="closeErrorBanner">&times;</button>
            <span id="aiErrorText">حدث خطأ. حاول مرة أخرى.</span>
          </div>
          <div class="messages" id="messageContainer">
            <div class="msg ai">
              <div class="msg-avatar">✦</div>
              <div class="msg-bubble">
                <strong>مرحباً! كيف يمكنني مساعدتك؟</strong><br />
                أنا مساعد ذكي يمكنه الإجابة عن أسئلتك ومساعدتك في مهامك.
                <span class="timestamp">الآن</span>
              </div>
            </div>
            <div class="typing-indicator" id="typingIndicator">
              <div class="msg-avatar">✦</div>
              <div class="typing-dots"><span></span><span></span><span></span></div>
            </div>
          </div>
          <div class="input-wrapper">
            <textarea id="chatInput" rows="1" placeholder="اسألني أي شيء..." aria-label="Chat input"></textarea>
            <button class="btn-send" id="sendBtn" aria-label="Send"><i class="fas fa-arrow-up"></i></button>
          </div>
          <div class="input-footer">
            <div class="tools">
              <span><i class="fas fa-globe"></i> بحث عميق</span>
              <span><i class="fas fa-image"></i> إنشاء صور</span>
            </div>
            <select class="model-select" id="modelSelect">
              <option value="nvidia/nemotron-3-ultra-550b-a55b:free">Nemotron-3 Ultra</option>
              <option value="deepseek/deepseek-r1:free">DeepSeek R1</option>
              <option value="google/gemini-2.0-flash-exp:free">Gemini 2.0 Flash</option>
              <option value="meta-llama/llama-3.2-3b-instruct:free">Llama 3.2</option>
            </select>
          </div>
        `;
        initAIChat();
      }

      function initAIChat() {
        const messagesEl = document.getElementById('messageContainer');
        const inputEl = document.getElementById('chatInput');
        const sendBtn = document.getElementById('sendBtn');
        const typingEl = document.getElementById('typingIndicator');
        const modelSelect = document.getElementById('modelSelect');
        const errorBanner = document.getElementById('aiErrorBanner');
        const errorText = document.getElementById('aiErrorText');
        const closeError = document.getElementById('closeErrorBanner');
        let chatHistory = [];
        let isProcessing = false;

        function addMessage(text, sender, time) {
          const t = time || new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
          const div = document.createElement('div');
          div.className = 'msg ' + (sender === 'user' ? 'user' : 'ai');
          const avatar = document.createElement('div');
          avatar.className = 'msg-avatar';
          avatar.textContent = sender === 'user' ? (currentUser ? currentUser.name.charAt(0).toUpperCase() : 'U') : '✦';
          const bubble = document.createElement('div');
          bubble.className = 'msg-bubble';
          let formatted = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br />');
          bubble.innerHTML = formatted + ' <span class="timestamp">' + t + '</span>';
          div.appendChild(avatar);
          div.appendChild(bubble);
          messagesEl.insertBefore(div, typingEl);
          scrollToBottom();
          return div;
        }

        function scrollToBottom() { messagesEl.scrollTop = messagesEl.scrollHeight; }

        function showError(msg) { errorText.textContent = msg || 'حدث خطأ. حاول مرة أخرى.';
          errorBanner.classList.add('show'); }

        function hideError() { errorBanner.classList.remove('show'); }

        closeError.addEventListener('click', hideError);

        async function callOpenRouter(messages, model) {
          const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Authorization': 'Bearer ' + OPENROUTER_API_KEY,
              'Content-Type': 'application/json',
              'HTTP-Referer': window.location.origin,
              'X-Title': 'WhatsApp Manager'
            },
            body: JSON.stringify({ model, messages })
          });
          if (!res.ok) {
            let err = 'API error: ' + res.status;
            try { const d = await res.json(); if (d.error) err = d.error.message || err; } catch (e) {}
            throw new Error(err);
          }
          const data = await res.json();
          if (!data.choices || !data.choices.length) throw new Error('No response from AI.');
          return data.choices[0].message.content || '';
        }

        async function handleSend() {
          const raw = inputEl.value.trim();
          if (!raw || isProcessing) return;
          hideError();
          isProcessing = true;
          sendBtn.disabled = true;
          inputEl.disabled = true;
          addMessage(raw, 'user');
          inputEl.value = '';
          inputEl.style.height = 'auto';
          chatHistory.push({ role: 'user', content: raw });
          typingEl.classList.add('active');
          scrollToBottom();
          const model = modelSelect.value;
          try {
            const apiMessages = [
              { role: 'system', content: 'أنت مساعد ذكي. أجب بوضوح وإيجاز.' },
              ...chatHistory
            ];
            const result = await callOpenRouter(apiMessages, model);
            typingEl.classList.remove('active');
            addMessage(result, 'ai');
            chatHistory.push({ role: 'assistant', content: result });
          } catch (err) {
            typingEl.classList.remove('active');
            showError(err.message || 'فشل في الحصول على رد من الذكاء الاصطناعي.');
            chatHistory.pop();
            const msgs = messagesEl.querySelectorAll('.msg');
            if (msgs.length > 0 && msgs[msgs.length - 1].classList.contains('user')) msgs[msgs.length - 1].remove();
          } finally {
            isProcessing = false;
            sendBtn.disabled = false;
            inputEl.disabled = false;
            inputEl.focus();
            scrollToBottom();
          }
        }

        sendBtn.addEventListener('click', handleSend);
        inputEl.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault();
            handleSend(); }
        });
        inputEl.addEventListener('input', () => {
          inputEl.style.height = 'auto';
          inputEl.style.height = Math.min(inputEl.scrollHeight, 120) + 'px';
        });

        document.getElementById('btnClearChat').addEventListener('click', function() {
          if (isProcessing) return;
          if (messagesEl.querySelectorAll('.msg').length <= 1) return;
          if (confirm('مسح كل الرسائل؟')) {
            const msgs = messagesEl.querySelectorAll('.msg');
            for (let i = msgs.length - 1; i > 0; i--) msgs[i].remove();
            chatHistory = [];
            hideError();
            showToast('تم مسح المحادثة', 'info');
          }
        });

        inputEl.focus();
      }

      // ---- PAGE INITS MAP ----
      const pageInits = {};

      // ─── INIT ───
      function initApp() {
        const hasSession = checkSession();
        if (!hasSession) {
          authOverlay.classList.remove('hidden');
          document.getElementById('particles-js').style.display = 'block';
          document.body.style.overflow = 'hidden';
          appWrapper.classList.remove('authenticated');
        } else {
          authOverlay.classList.add('hidden');
          document.getElementById('particles-js').style.display = 'none';
          document.body.style.overflow = '';
          appWrapper.classList.add('authenticated');
          navigate('dashboard');
        }
      }

      // Handle resize for sidebar
      window.addEventListener('resize', () => {
        if (window.innerWidth > 900 && sidebar.classList.contains('open')) {
          sidebar.classList.remove('open');
          sidebarOverlay.classList.remove('active');
          document.body.style.overflow = '';
        }
      });

      // Keyboard shortcut: Ctrl+/ for settings
      document.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
          e.preventDefault();
          // Open settings or show help
          showToast('لوحة التحكم: استخدم القائمة الجانبية للتنقل', 'info');
        }
      });

      initApp();

      // Expose for debugging
      window.__wa = { navigate, showToast, currentUser };

    })();
  </script>

</body>
</html>`;
