export const HTML_PAGE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>WhatsApp Nexus AI</title>
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
<script src="https://cdn.tailwindcss.com"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.css">
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastify-js/1.12.0/toastify.min.js"></script>
<style>
:root{
  --bg-deep:#06060f;--bg-primary:#0a0a1a;--bg-card:rgba(12,12,35,0.65);
  --bg-input:rgba(20,20,50,0.6);--text-1:#e8e8ff;--text-2:#7878aa;--text-3:#4a4a70;
  --cyan:#00f0ff;--purple:#b829ff;--pink:#ff2d95;--green:#00ff88;--blue:#4d8bff;
  --red:#ff3860;--orange:#ff8c42;--yellow:#ffe14d;
  --glass-border:rgba(0,240,255,0.12);--glass-blur:18px;
  --glow-cyan:0 0 15px rgba(0,240,255,0.3);--glow-purple:0 0 15px rgba(184,41,255,0.3);
  --glow-pink:0 0 15px rgba(255,45,149,0.3);--glow-green:0 0 15px rgba(0,255,136,0.3);
  --sidebar-w:280px;--header-h:60px;
}
.light-mode{
  --bg-deep:#e8e8f0;--bg-primary:#f0f0f8;--bg-card:rgba(255,255,255,0.75);
  --bg-input:rgba(240,240,255,0.8);--text-1:#1a1a2e;--text-2:#555580;--text-3:#9999bb;
  --glass-border:rgba(0,0,0,0.08);
  --glow-cyan:0 2px 8px rgba(0,150,200,0.15);--glow-purple:0 2px 8px rgba(140,41,200,0.15);
  --glow-pink:0 2px 8px rgba(200,30,120,0.15);--glow-green:0 2px 8px rgba(0,180,100,0.15);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg-deep);color:var(--text-1);min-height:100vh;overflow-x:hidden}
h1,h2,h3,.font-orbitron{font-family:'Orbitron',sans-serif}
::-webkit-scrollbar{width:6px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--cyan);border-radius:3px}

/* ===== LOADING ===== */
#cyberLoader{position:fixed;inset:0;z-index:9999;background:var(--bg-deep);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:30px;transition:opacity .6s}
#cyberLoader.hide{opacity:0;pointer-events:none}
.loader-ring{width:80px;height:80px;border:3px solid transparent;border-top-color:var(--cyan);border-right-color:var(--purple);border-radius:50%;animation:spin 1s linear infinite}
.loader-ring::before{content:'';position:absolute;inset:6px;border:3px solid transparent;border-bottom-color:var(--pink);border-radius:50%;animation:spin 1.5s linear reverse infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.loader-text{font-family:'Orbitron';font-size:14px;color:var(--cyan);letter-spacing:4px;animation:glitch 2s infinite}
@keyframes glitch{0%,100%{opacity:1}50%{opacity:.5}}

/* ===== AUTH ===== */
#authScreen{position:fixed;inset:0;z-index:9998;background:var(--bg-deep);display:none;align-items:center;justify-content:center}
#authScreen.show{display:flex}
.auth-card{background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:20px;padding:40px;width:400px;max-width:90vw;text-align:center;box-shadow:var(--glow-cyan),var(--glow-purple)}
.auth-card h2{font-size:20px;color:var(--cyan);margin-bottom:8px}
.auth-card p{color:var(--text-2);font-size:13px;margin-bottom:24px}
.auth-input{width:100%;background:var(--bg-input);border:1px solid var(--glass-border);border-radius:10px;padding:14px 18px;color:var(--text-1);font-family:'Orbitron';font-size:13px;letter-spacing:2px;text-align:center;outline:none;transition:border .3s,box-shadow .3s}
.auth-input:focus{border-color:var(--cyan);box-shadow:var(--glow-cyan)}
.auth-btn{width:100%;margin-top:16px;padding:14px;background:linear-gradient(135deg,var(--cyan),var(--purple));border:none;border-radius:10px;color:#fff;font-family:'Orbitron';font-size:13px;font-weight:700;cursor:pointer;letter-spacing:2px;transition:transform .2s,box-shadow .2s}
.auth-btn:hover{transform:scale(1.03);box-shadow:var(--glow-cyan),var(--glow-purple)}
.auth-error{color:var(--red);font-size:12px;margin-top:10px;min-height:18px}

/* ===== LAYOUT ===== */
#mainApp{display:none;height:100vh}
#mainApp.show{display:flex}
.sidebar{width:var(--sidebar-w);background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border-left:1px solid var(--glass-border);height:100vh;position:fixed;right:0;top:0;z-index:100;display:flex;flex-direction:column;transition:transform .3s}
.sidebar.collapsed{transform:translateX(100%)}
.sidebar-header{padding:20px;border-bottom:1px solid var(--glass-border);display:flex;align-items:center;gap:12px}
.sidebar-logo{width:36px;height:36px;background:linear-gradient(135deg,var(--cyan),var(--purple));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;color:#fff}
.sidebar-title{font-size:13px;font-weight:900;background:linear-gradient(90deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sidebar-nav{flex:1;overflow-y:auto;padding:12px}
.nav-item{display:flex;align-items:center;gap:12px;padding:12px 16px;border-radius:10px;cursor:pointer;transition:all .2s;color:var(--text-2);font-size:13px;font-weight:500;margin-bottom:4px}
.nav-item:hover{background:rgba(0,240,255,0.06);color:var(--text-1)}
.nav-item.active{background:rgba(0,240,255,0.1);color:var(--cyan);box-shadow:inset 3px 0 0 var(--cyan)}
.nav-item i{width:20px;text-align:center;font-size:15px}

.content-area{flex:1;margin-right:var(--sidebar-w);display:flex;flex-direction:column;height:100vh;transition:margin .3s}
.content-area.expanded{margin-right:0}

.top-header{height:var(--header-h);background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border-bottom:1px solid var(--glass-border);display:flex;align-items:center;justify-content:space-between;padding:0 24px;position:sticky;top:0;z-index:50}
.header-left,.header-right{display:flex;align-items:center;gap:12px}
.header-search{background:var(--bg-input);border:1px solid var(--glass-border);border-radius:8px;padding:8px 14px;color:var(--text-1);font-size:13px;width:220px;outline:none;font-family:inherit}
.header-search:focus{border-color:var(--cyan)}
.header-btn{width:36px;height:36px;border-radius:8px;background:var(--bg-input);border:1px solid var(--glass-border);color:var(--text-2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;position:relative}
.header-btn:hover{color:var(--cyan);border-color:var(--cyan)}
.notif-dot{position:absolute;top:6px;right:6px;width:7px;height:7px;border-radius:50%;background:var(--green);display:none}
.notif-dot.show{display:block}

.notif-panel{position:absolute;top:calc(var(--header-h) - 4px);left:24px;width:320px;background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:12px;padding:16px;display:none;z-index:200;box-shadow:var(--glow-cyan)}
.notif-panel.show{display:block}
.notif-item{display:flex;align-items:center;gap:10px;padding:10px;border-radius:8px;margin-bottom:6px;font-size:12px;color:var(--text-2)}
.notif-item .dot{width:8px;height:8px;border-radius:50%;flex-shrink:0}

.page-content{flex:1;overflow-y:auto;padding:24px}
.content-section{display:none}
.content-section.active{display:block}

/* ===== GLASS CARDS ===== */
.glass{background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:16px;padding:24px;transition:border-color .3s,box-shadow .3s}
.glass:hover{border-color:rgba(0,240,255,0.25)}
.glass-sm{padding:16px;border-radius:12px}
.glass-header{display:flex;align-items:center;gap:10px;margin-bottom:6px}
.glass-header i{font-size:16px}
.glass-header h2{font-size:14px;font-weight:700;letter-spacing:0.5px}
.glass-hint{color:var(--text-3);font-size:11px;margin-bottom:14px}

/* ===== STAT CARDS ===== */
.stat-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:16px;margin-bottom:24px}
.stat-card{background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:14px;padding:20px;position:relative;overflow:hidden;transition:transform .2s}
.stat-card:hover{transform:translateY(-2px)}
.stat-card::before{content:'';position:absolute;top:0;right:0;width:80px;height:80px;border-radius:50%;filter:blur(40px);opacity:.3}
.stat-card.cyan::before{background:var(--cyan)}
.stat-card.purple::before{background:var(--purple)}
.stat-card.pink::before{background:var(--pink)}
.stat-card.green::before{background:var(--green)}
.stat-icon{width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:12px}
.stat-icon.cyan{background:rgba(0,240,255,0.12);color:var(--cyan)}
.stat-icon.purple{background:rgba(184,41,255,0.12);color:var(--purple)}
.stat-icon.pink{background:rgba(255,45,149,0.12);color:var(--pink)}
.stat-icon.green{background:rgba(0,255,136,0.12);color:var(--green)}
.stat-value{font-family:'Orbitron';font-size:24px;font-weight:900;margin-bottom:4px}
.stat-label{color:var(--text-2);font-size:11px;font-weight:600;letter-spacing:0.5px}

/* ===== BUTTONS ===== */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:10px 18px;border-radius:10px;font-family:inherit;font-size:13px;font-weight:600;cursor:pointer;transition:all .2s;border:1px solid var(--glass-border);background:var(--bg-input);color:var(--text-1)}
.btn:hover{border-color:var(--cyan);color:var(--cyan)}
.btn:disabled{opacity:.35;cursor:not-allowed;pointer-events:none}
.btn-cyan{background:linear-gradient(135deg,rgba(0,240,255,0.2),rgba(0,240,255,0.05));border-color:rgba(0,240,255,0.3);color:var(--cyan)}
.btn-cyan:hover{background:linear-gradient(135deg,rgba(0,240,255,0.3),rgba(0,240,255,0.1));box-shadow:var(--glow-cyan)}
.btn-purple{background:linear-gradient(135deg,rgba(184,41,255,0.2),rgba(184,41,255,0.05));border-color:rgba(184,41,255,0.3);color:var(--purple)}
.btn-purple:hover{background:linear-gradient(135deg,rgba(184,41,255,0.3),rgba(184,41,255,0.1));box-shadow:var(--glow-purple)}
.btn-pink{background:linear-gradient(135deg,rgba(255,45,149,0.2),rgba(255,45,149,0.05));border-color:rgba(255,45,149,0.3);color:var(--pink)}
.btn-pink:hover{box-shadow:var(--glow-pink)}
.btn-green{background:linear-gradient(135deg,rgba(0,255,136,0.2),rgba(0,255,136,0.05));border-color:rgba(0,255,136,0.3);color:var(--green)}
.btn-green:hover{box-shadow:var(--glow-green)}
.btn-red{background:linear-gradient(135deg,rgba(255,56,96,0.2),rgba(255,56,96,0.05));border-color:rgba(255,56,96,0.3);color:var(--red)}
.btn-red:hover{box-shadow:0 0 15px rgba(255,56,96,0.3)}
.btn-orange{background:linear-gradient(135deg,rgba(255,140,66,0.2),rgba(255,140,66,0.05));border-color:rgba(255,140,66,0.3);color:var(--orange)}
.btn-sm{padding:7px 12px;font-size:12px;border-radius:8px}

/* ===== INPUTS ===== */
.c-input{background:var(--bg-input);border:1px solid var(--glass-border);border-radius:8px;padding:10px 14px;color:var(--text-1);font-family:inherit;font-size:13px;outline:none;width:100%;transition:border .3s}
.c-input:focus{border-color:var(--cyan)}
textarea.c-input{min-height:120px;resize:vertical;font-family:'Consolas',monospace;direction:ltr;text-align:left}
select.c-input{cursor:pointer}

/* ===== INDICATORS ===== */
.run-dot{display:inline-flex;align-items:center;gap:6px;font-size:11px;font-weight:700;padding:4px 12px;border-radius:20px}
.run-dot.on{background:rgba(0,255,136,0.1);color:var(--green)}
.run-dot.off{background:rgba(120,120,170,0.1);color:var(--text-3)}
.run-dot .d{width:7px;height:7px;border-radius:50%;background:currentColor}
.run-dot.on .d{animation:pulse 1.2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.6)}}

/* ===== MYLIST ===== */
.mylist-add{display:flex;gap:10px;flex-wrap:wrap;align-items:flex-end;background:var(--bg-input);padding:14px;border-radius:10px;border:1px solid var(--glass-border);margin-bottom:14px}
.mylist-add label{display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--text-2);flex:1;min-width:100px}
.mylist-filters{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:14px}
.mylist-tbl-wrap{max-height:350px;overflow-y:auto;border-radius:10px;border:1px solid var(--glass-border);margin-bottom:14px}
.mylist-tbl{width:100%;border-collapse:collapse;font-size:12px}
.mylist-tbl th{text-align:right;padding:10px 12px;background:var(--bg-input);color:var(--text-2);border-bottom:1px solid var(--glass-border);position:sticky;top:0;z-index:2;font-size:11px;font-weight:600}
.mylist-tbl td{padding:8px 12px;border-bottom:1px solid var(--glass-border)}
.mylist-tbl tr:hover td{background:rgba(0,240,255,0.03)}
.mylist-tbl .edt{background:var(--bg-deep);color:var(--text-1);border:1px solid var(--cyan);border-radius:4px;padding:4px 8px;font-family:inherit;font-size:12px;width:100%}
.g-badge{display:inline-block;padding:2px 10px;border-radius:12px;font-size:10px;font-weight:700}
.g-badge.m{background:rgba(0,240,255,0.12);color:var(--cyan)}
.g-badge.f{background:rgba(184,41,255,0.12);color:var(--purple)}
.g-badge.u{background:rgba(120,120,170,0.12);color:var(--text-3)}

/* ===== STATS TABLE ===== */
.st-tbl{width:100%;border-collapse:collapse;font-size:13px}
.st-tbl th{text-align:right;padding:12px;background:var(--bg-input);color:var(--text-2);border-bottom:1px solid var(--glass-border);font-weight:600}
.st-tbl td{padding:12px;border-bottom:1px solid var(--glass-border)}

/* ===== LOGS ===== */
.log-files{display:flex;gap:8px;flex-wrap:wrap}
.log-fbtn{background:var(--bg-input);border:1px solid var(--glass-border);color:var(--text-2);padding:8px 14px;border-radius:8px;cursor:pointer;font-size:12px;font-family:inherit;transition:all .2s}
.log-fbtn:hover{border-color:var(--cyan);color:var(--cyan)}
.log-fbtn.active{background:rgba(0,240,255,0.15);border-color:var(--cyan);color:var(--cyan);font-weight:700}
.log-viewer{background:var(--bg-deep);border:1px solid var(--glass-border);border-radius:10px;padding:16px;min-height:300px;max-height:500px;overflow-y:auto;font-family:'Consolas',monospace;font-size:12px;color:var(--text-2);white-space:pre-wrap;word-break:break-all}

/* ===== IMAGES ===== */
.img-grid{display:flex;flex-wrap:wrap;gap:12px;margin-top:14px}
.img-card{position:relative;width:100px;height:100px;border-radius:10px;overflow:hidden;border:1px solid var(--glass-border)}
.img-card img{width:100%;height:100%;object-fit:cover}
.img-card .del{position:absolute;top:4px;right:4px;width:22px;height:22px;border-radius:50%;background:var(--red);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:10px;opacity:0;transition:opacity .2s}
.img-card:hover .del{opacity:1}

/* ===== QR ===== */
.qr-box{width:200px;height:200px;border:2px solid var(--cyan);border-radius:12px;overflow:hidden;box-shadow:var(--glow-cyan)}
.qr-box img{width:100%;height:100%}

/* ===== SCHEDULE ===== */
.sched-status{display:inline-block;padding:4px 12px;border-radius:8px;font-size:11px;font-weight:700;margin-bottom:10px}
.sched-status.on{background:rgba(0,255,136,0.12);color:var(--green);border:1px solid rgba(0,255,136,0.25)}
.sched-status.off{background:rgba(255,56,96,0.12);color:var(--red);border:1px solid rgba(255,56,96,0.25)}

/* ===== RESPONSIVE ===== */
@media(max-width:900px){
  .sidebar{transform:translateX(100%)}
  .sidebar.open{transform:translateX(0)}
  .content-area{margin-right:0!important}
  .stat-grid{grid-template-columns:1fr 1fr}
}
@media(max-width:600px){
  .stat-grid{grid-template-columns:1fr}
  .mylist-add{flex-direction:column}
  .mylist-filters{flex-direction:column}
}
</style>
</head>
<body>

<!-- ===== LOADER ===== -->
<div id="cyberLoader">
  <div class="loader-ring" style="position:relative"></div>
  <div class="loader-text">WHATSAPP NEXUS AI</div>
</div>

<!-- ===== AUTH ===== -->
<div id="authScreen">
  <div class="auth-card">
    <div style="font-size:40px;margin-bottom:16px"><i class="fas fa-shield-halved" style="color:var(--cyan)"></i></div>
    <h2 class="font-orbitron">QUANTUM GATEWAY</h2>
    <p>أدخل مفتاح الوصول السري للمتابعة</p>
    <input type="password" class="auth-input" id="authKeyInput" placeholder="XXXX-XXXX-XXXXXX" autocomplete="off">
    <button class="auth-btn" id="authSubmitBtn"><i class="fas fa-key"></i> UNLOCK</button>
    <div class="auth-error" id="authError"></div>
  </div>
</div>

<!-- ===== MAIN APP ===== -->
<div id="mainApp">
  <!-- Sidebar -->
  <aside class="sidebar" id="sidebar">
    <div class="sidebar-header">
      <div class="sidebar-logo"><i class="fab fa-whatsapp"></i></div>
      <div class="sidebar-title font-orbitron">NEXUS AI</div>
    </div>
    <nav class="sidebar-nav" id="sidebarNav">
      <div class="nav-item active" data-section="sec-dashboard"><i class="fas fa-gauge-high"></i> Dashboard</div>
      <div class="nav-item" data-section="sec-messages"><i class="fas fa-comment-dots"></i> Messages</div>
      <div class="nav-item" data-section="sec-qr"><i class="fas fa-qrcode"></i> QR Link</div>
      <div class="nav-item" data-section="sec-media"><i class="fas fa-images"></i> Media Vault</div>
      <div class="nav-item" data-section="sec-reply"><i class="fas fa-robot"></i> Auto Reply AI</div>
      <div class="nav-item" data-section="sec-data"><i class="fas fa-database"></i> Data Center</div>
      <div class="nav-item" data-section="sec-analytics"><i class="fas fa-chart-line"></i> Analytics</div>
      <div class="nav-item" data-section="sec-logs"><i class="fas fa-terminal"></i> System Logs</div>
      <div class="nav-item" data-section="sec-settings"><i class="fas fa-gear"></i> Settings</div>
    </nav>
  </aside>

  <!-- Content -->
  <div class="content-area" id="contentArea">
    <!-- Header -->
    <header class="top-header">
      <div class="header-left">
        <button class="header-btn" id="toggleSidebar" title="القائمة"><i class="fas fa-bars"></i></button>
        <input type="text" class="header-search" id="headerSearch" placeholder="بحث...">
      </div>
      <div class="header-right">
        <button class="header-btn" id="themeToggle" title="تبديل المظهر"><i class="fas fa-moon" id="themeIcon"></i></button>
        <button class="header-btn" id="notifBtn" title="الإشعارات">
          <i class="fas fa-bell"></i><span class="notif-dot" id="notifDot"></span>
        </button>
        <button class="header-btn" id="fullscreenBtn" title="ملء الشاشة"><i class="fas fa-expand"></i></button>
      </div>
      <!-- Notification Panel -->
      <div class="notif-panel" id="notifPanel">
        <div style="font-size:12px;font-weight:700;color:var(--text-2);margin-bottom:10px" class="font-orbitron">STATUS</div>
        <div class="notif-item"><span class="dot" id="notifSendDot" style="background:var(--text-3)"></span><span id="notifSendText">الإرسال: متوقف</span></div>
        <div class="notif-item"><span class="dot" id="notifReplyDot" style="background:var(--text-3)"></span><span id="notifReplyText">الرد الذكي: متوقف</span></div>
        <div class="notif-item"><span class="dot" id="notifSessionDot" style="background:var(--text-3)"></span><span id="notifSessionText">الجلسة: غير معروف</span></div>
      </div>
    </header>

    <!-- Page Content -->
    <div class="page-content">

      <!-- ===== DASHBOARD ===== -->
      <div class="content-section active" id="sec-dashboard">
        <div class="glass" style="margin-bottom:20px;background:linear-gradient(135deg,rgba(0,240,255,0.06),rgba(184,41,255,0.06))">
          <h2 class="font-orbitron" style="font-size:18px;background:linear-gradient(90deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:4px">WHATSAPP NEXUS AI</h2>
          <p style="color:var(--text-2);font-size:13px">لوحة التحكم الرئيسية — إدارة وتتبع كل شيء</p>
        </div>
        <div class="stat-grid" id="dashStats">
          <div class="stat-card cyan"><div class="stat-icon cyan"><i class="fas fa-paper-plane"></i></div><div class="stat-value" id="statSent">0</div><div class="stat-label">رسائل مرسلة</div></div>
          <div class="stat-card green"><div class="stat-icon green"><i class="fas fa-check-circle"></i></div><div class="stat-value" id="statSuccess">0</div><div class="stat-label">نجاح</div></div>
          <div class="stat-card pink"><div class="stat-icon pink"><i class="fas fa-times-circle"></i></div><div class="stat-value" id="statFailed">0</div><div class="stat-label">فشل</div></div>
          <div class="stat-card purple"><div class="stat-icon purple"><i class="fas fa-signal"></i></div><div class="stat-value" id="statActive">0</div><div class="stat-label">تشغيلات نشطة</div></div>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="glass glass-sm">
            <div class="glass-header"><i class="fas fa-paper-plane" style="color:var(--cyan)"></i><h2>إرسال الرسائل</h2></div>
            <div id="sendRunningIndicator" class="run-dot off" style="margin-bottom:10px"><span class="d"></span> متوقف</div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-cyan" id="sendRunBtn" style="flex:1"><i class="fas fa-play"></i> إرسال</button>
              <button class="btn btn-red" id="sendStopBtn" disabled style="flex:1"><i class="fas fa-stop"></i> إيقاف</button>
            </div>
          </div>
          <div class="glass glass-sm">
            <div class="glass-header"><i class="fas fa-robot" style="color:var(--purple)"></i><h2>الرد الذكي</h2></div>
            <div id="replyRunningIndicator" class="run-dot off" style="margin-bottom:10px"><span class="d"></span> متوقف</div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-purple" id="replyRunBtn" style="flex:1"><i class="fas fa-brain"></i> تفعيل</button>
              <button class="btn btn-red" id="replyStopBtn" disabled style="flex:1"><i class="fas fa-stop"></i> إيقاف</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== MESSAGES ===== -->
      <div class="content-section" id="sec-messages">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="glass">
            <div class="glass-header"><i class="fas fa-comment-dots" style="color:var(--cyan)"></i><h2>الرسائل</h2></div>
            <div class="glass-hint">كل رسالة في سطر</div>
            <textarea class="c-input" id="messagesArea" placeholder="اكتب رسالة في كل سطر..."></textarea>
            <div style="display:flex;gap:10px;margin-top:14px">
              <button class="btn btn-cyan btn-sm" id="loadMessagesBtn"><i class="fas fa-download"></i> تحميل</button>
              <button class="btn btn-green btn-sm" id="saveMessagesBtn"><i class="fas fa-save"></i> حفظ</button>
            </div>
          </div>
          <div class="glass">
            <div class="glass-header"><i class="fas fa-address-book" style="color:var(--purple)"></i><h2>جهات الاتصال</h2></div>
            <div class="glass-hint">كل رقم في سطر</div>
            <textarea class="c-input" id="contactsArea" placeholder="اكتب رقم في كل سطر..."></textarea>
            <div style="display:flex;gap:10px;margin-top:14px">
              <button class="btn btn-cyan btn-sm" id="loadContactsBtn"><i class="fas fa-download"></i> تحميل</button>
              <button class="btn btn-green btn-sm" id="saveContactsBtn"><i class="fas fa-save"></i> حفظ</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== QR LINK ===== -->
      <div class="content-section" id="sec-qr">
        <div class="glass" style="max-width:500px">
          <div class="glass-header"><i class="fas fa-qrcode" style="color:var(--cyan)"></i><h2>QR Link Session</h2></div>
          <div class="glass-hint">ربط جلسة واتساب عبر مسح QR Code</div>
          <div style="display:flex;gap:24px;align-items:center;flex-wrap:wrap">
            <div>
              <div style="margin-bottom:12px"><strong>الحالة:</strong> <span id="sessionStatusText" style="color:var(--text-2)">غير معروف</span></div>
              <div style="display:flex;gap:10px;flex-wrap:wrap">
                <button class="btn btn-cyan btn-sm" id="runQRBtn"><i class="fas fa-play"></i> تشغيل QR</button>
                <button class="btn btn-red btn-sm" id="stopQRBtn"><i class="fas fa-stop"></i> إيقاف QR</button>
                <button class="btn btn-sm" id="refreshSessionBtn"><i class="fas fa-sync"></i> تحديث</button>
              </div>
            </div>
            <div class="qr-box"><img id="qrImage" src="" alt="QR" style="display:none;width:100%;height:100%;object-fit:contain"></div>
          </div>
        </div>
      </div>

      <!-- ===== MEDIA VAULT ===== -->
      <div class="content-section" id="sec-media">
        <div class="glass">
          <div class="glass-header"><i class="fas fa-images" style="color:var(--pink)"></i><h2>Media Vault</h2></div>
          <div class="glass-hint">الحد الأقصى 3 صور</div>
          <div style="background:var(--bg-input);padding:14px;border-radius:10px;border:1px dashed var(--glass-border);margin-bottom:14px">
            <input type="file" id="imagesInput" accept="image/*" multiple style="width:100%;margin-bottom:10px">
            <div id="imagePreviewArea" style="display:flex;flex-wrap:wrap;gap:10px"></div>
          </div>
          <div style="display:flex;gap:10px;margin-bottom:14px">
            <button class="btn btn-green btn-sm" id="uploadImagesBtn"><i class="fas fa-upload"></i> رفع الصور</button>
            <button class="btn btn-sm" id="refreshImagesBtn"><i class="fas fa-sync"></i> تحديث</button>
          </div>
          <div id="imageGallery" style="display:none">
            <div style="font-size:12px;color:var(--text-2);margin-bottom:10px">الصور الموجودة (<span id="imageCount">0</span>/3)</div>
            <div class="img-grid" id="imageList"></div>
          </div>
        </div>
      </div>

      <!-- ===== AUTO REPLY AI ===== -->
      <div class="content-section" id="sec-reply">
        <div class="glass" style="max-width:500px">
          <div class="glass-header"><i class="fas fa-robot" style="color:var(--purple)"></i><h2>Auto Reply AI</h2></div>
          <div class="glass-hint">تشغيل وإيقاف الرد الذكي بالذكاء الاصطناعي</div>
          <div id="replyRunningIndicator2" class="run-dot off" style="margin-bottom:16px"><span class="d"></span> متوقف</div>
          <div style="display:flex;gap:10px">
            <button class="btn btn-purple" id="replyRunBtn2" style="flex:1"><i class="fas fa-brain"></i> تفعيل الرد الذكي</button>
            <button class="btn btn-red" id="replyStopBtn2" disabled style="flex:1"><i class="fas fa-stop"></i> إيقاف الرد الذكي</button>
          </div>
        </div>
      </div>

      <!-- ===== DATA CENTER ===== -->
      <div class="content-section" id="sec-data">
        <div class="glass">
          <div class="glass-header"><i class="fas fa-database" style="color:var(--orange)"></i><h2>Data Center — Mylist</h2></div>
          <div class="glass-hint">إدارة الأرقام التفصيلية مع الفلترة — data/mylist.json</div>
          <div class="mylist-add">
            <label>الرقم<input type="text" class="c-input" id="mylistNumber" placeholder="212600000000"></label>
            <label>العمر<input type="number" class="c-input" id="mylistAge" placeholder="25" min="0" max="120"></label>
            <label>الجنس<select class="c-input" id="mylistGender"><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select></label>
            <button class="btn btn-green btn-sm" id="mylistAddBtn" style="align-self:flex-end"><i class="fas fa-plus"></i> إضافة</button>
          </div>
          <div class="mylist-filters">
            <select class="c-input" id="mylistFilterGender" style="width:auto"><option value="all">الجنس: الكل</option><option value="ذكر">ذكر</option><option value="أنثى">أنثى</option></select>
            <select class="c-input" id="mylistFilterAge" style="width:auto"><option value="all">العمر: الكل</option><option value="0-17">أقل من 18</option><option value="18-25">18-25</option><option value="25-35">25-35</option><option value="35-45">35-45</option><option value="46-200">أكثر من 45</option><option value="custom">مخصص</option></select>
            <span id="customAgeWrap" style="display:none;align-items:center;gap:4px"><input type="number" class="c-input" id="mylistMinAge" placeholder="من" style="width:65px;text-align:center"><span style="color:var(--text-3)">-</span><input type="number" class="c-input" id="mylistMaxAge" placeholder="إلى" style="width:65px;text-align:center"></span>
            <select class="c-input" id="mylistSort" style="width:auto"><option value="index-asc">الإضافة</option><option value="age-asc">العمر ↑</option><option value="age-desc">العمر ↓</option><option value="number-asc">الرقم ↑</option><option value="number-desc">الرقم ↓</option></select>
            <button class="btn btn-orange btn-sm" id="mylistFilterBtn"><i class="fas fa-filter"></i> فلتر</button>
          </div>
          <div class="mylist-tbl-wrap">
            <table class="mylist-tbl"><thead><tr><th style="width:36px">#</th><th>الرقم</th><th>العمر</th><th>الجنس</th><th style="width:90px">إجراءات</th></tr></thead><tbody id="mylistBody"><tr><td colspan="5" style="text-align:center;color:var(--text-3);padding:30px">اضغط تحميل</td></tr></tbody></table>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px">
            <span id="mylistCount" style="font-size:12px;color:var(--text-2)">المجموع: 0 | يعرض: 0</span>
            <div style="display:flex;gap:10px">
              <button class="btn btn-sm" id="mylistLoadBtn"><i class="fas fa-download"></i> تحميل</button>
              <button class="btn btn-cyan btn-sm" id="mylistCopyBtn"><i class="fas fa-copy"></i> نسخ الأرقام المعروضة</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ===== ANALYTICS ===== -->
      <div class="content-section" id="sec-analytics">
        <div class="glass">
          <div class="glass-header"><i class="fas fa-chart-line" style="color:var(--cyan)"></i><h2>Analytics</h2></div>
          <div style="margin-bottom:16px"><button class="btn btn-cyan btn-sm" id="loadStatsBtn"><i class="fas fa-database"></i> تحميل الإحصائيات</button></div>
          <div id="statsContainer" style="display:none">
            <div style="max-height:250px;overflow-y:auto;border-radius:10px;border:1px solid var(--glass-border);margin-bottom:20px">
              <table class="st-tbl"><thead><tr><th>التاريخ</th><th>محاولات</th><th>نجاح</th><th>فشل</th></tr></thead><tbody id="statsBody"></tbody></table>
            </div>
            <div style="background:var(--bg-deep);border-radius:10px;border:1px solid var(--glass-border);padding:20px;height:300px"><canvas id="statsChart"></canvas></div>
          </div>
        </div>
      </div>

      <!-- ===== SYSTEM LOGS ===== -->
      <div class="content-section" id="sec-logs">
        <div class="glass">
          <div class="glass-header"><i class="fas fa-terminal" style="color:var(--green)"></i><h2>System Logs</h2></div>
          <div class="log-files" id="logFilesList" style="margin-bottom:14px"><span style="color:var(--text-3);font-size:12px">اضغط لتحميل ملفات السجل...</span></div>
          <div class="log-viewer" id="logContent">اختر ملف سجل لعرض محتواه...</div>
        </div>
      </div>

      <!-- ===== SETTINGS ===== -->
      <div class="content-section" id="sec-settings">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px">
          <div class="glass">
            <div class="glass-header"><i class="fas fa-clock" style="color:var(--yellow)"></i><h2>الجدولة</h2></div>
            <div class="glass-hint">وقت المغرب (-2 ساعة UTC)</div>
            <div><span class="sched-status off" id="scheduleIndicator">غير مفعل</span><span id="currentCronDisplay" style="font-size:11px;color:var(--text-3);display:block;margin-top:4px"></span></div>
            <div style="display:flex;gap:12px;margin-bottom:12px;justify-content:center">
              <label style="display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--text-2);align-items:center">الساعة<input type="number" class="c-input" id="hourInput" min="0" max="23" value="10" style="width:70px;text-align:center"></label>
              <label style="display:flex;flex-direction:column;gap:4px;font-size:11px;color:var(--text-2);align-items:center">الدقيقة<input type="number" class="c-input" id="minuteInput" min="0" max="59" value="0" style="width:70px;text-align:center"></label>
            </div>
            <div style="display:flex;gap:10px">
              <button class="btn btn-sm" id="loadScheduleBtn"><i class="fas fa-history"></i> تحميل</button>
              <button class="btn btn-orange btn-sm" id="updateScheduleBtn"><i class="fas fa-sync-alt"></i> تحديث</button>
            </div>
          </div>
          <div class="glass">
            <div class="glass-header"><i class="fas fa-file-image" style="color:var(--pink)"></i><h2>قائمة الصور (images.json)</h2></div>
            <div class="glass-hint">كل مسار في سطر</div>
            <textarea class="c-input" id="imagesListArea" placeholder="images/123_photo.jpg ..."></textarea>
            <div style="display:flex;gap:10px;margin-top:14px">
              <button class="btn btn-cyan btn-sm" id="loadImagesListBtn"><i class="fas fa-download"></i> تحميل</button>
              <button class="btn btn-green btn-sm" id="saveImagesListBtn"><i class="fas fa-save"></i> حفظ</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script>
/* ===== HELPERS ===== */
function toast(msg, type) {
  var bg = type === "ok" ? "linear-gradient(135deg,#00ff88,#00c96a)" : type === "err" ? "linear-gradient(135deg,#ff3860,#d63031)" : "linear-gradient(135deg,#00f0ff,#0099cc)";
  Toastify({ text: msg, duration: 3000, gravity: "top", position: "center", style: { background: bg, borderRadius: "10px", fontFamily: "'Plus Jakarta Sans'", fontSize: "13px", fontWeight: "600", padding: "10px 20px", boxShadow: "0 4px 20px rgba(0,0,0,0.3)" } }).showToast();
}
function setRunDot(el, active, onT, offT) {
  el.className = "run-dot " + (active ? "on" : "off");
  el.innerHTML = '<span class="d"></span> ' + (active ? onT : offT);
}
function gBadge(g) {
  if (g === "ذكر") return '<span class="g-badge m">ذكر</span>';
  if (g === "أنثى") return '<span class="g-badge f">أنثى</span>';
  return '<span class="g-badge u">' + (g || "—") + '</span>';
}

/* ===== LOADING ===== */
setTimeout(function() {
  document.getElementById("cyberLoader").classList.add("hide");
  setTimeout(function() { document.getElementById("authScreen").classList.add("show"); }, 600);
}, 2000);

/* ===== AUTH ===== */
var AUTH_KEY = "AI-2026-WHATSAPP";
document.getElementById("authSubmitBtn").onclick = function() {
  var val = document.getElementById("authKeyInput").value.trim();
  if (val === AUTH_KEY) {
    document.getElementById("authScreen").classList.remove("show");
    document.getElementById("mainApp").classList.add("show");
    initApp();
  } else {
    document.getElementById("authError").textContent = "مفتاح غير صحيح!";
    document.getElementById("authKeyInput").style.borderColor = "var(--red)";
    setTimeout(function() { document.getElementById("authError").textContent = ""; document.getElementById("authKeyInput").style.borderColor = ""; }, 2000);
  }
};
document.getElementById("authKeyInput").addEventListener("keydown", function(e) { if (e.key === "Enter") document.getElementById("authSubmitBtn").click(); });

/* ===== INIT ===== */
function initApp() {
  loadDashStats(); checkSendStatus(); checkReplyStatus(); refreshSession(); loadMylist(); loadImages(); loadSchedule(); loadLogs();
}

/* ===== SIDEBAR ===== */
var sidebar = document.getElementById("sidebar");
var contentArea = document.getElementById("contentArea");
document.getElementById("toggleSidebar").onclick = function() {
  if (window.innerWidth <= 900) { sidebar.classList.toggle("open"); }
  else { sidebar.classList.toggle("collapsed"); contentArea.classList.toggle("expanded"); }
};
document.querySelectorAll(".nav-item").forEach(function(item) {
  item.onclick = function() {
    document.querySelectorAll(".nav-item").forEach(function(n) { n.classList.remove("active"); });
    this.classList.add("active");
    var sec = this.getAttribute("data-section");
    document.querySelectorAll(".content-section").forEach(function(s) { s.classList.remove("active"); });
    document.getElementById(sec).classList.add("active");
    if (window.innerWidth <= 900) sidebar.classList.remove("open");
  };
});
document.getElementById("headerSearch").oninput = function() {
  var q = this.value.toLowerCase();
  document.querySelectorAll(".nav-item").forEach(function(n) {
    n.style.display = n.textContent.toLowerCase().includes(q) ? "flex" : "none";
  });
};

/* ===== HEADER ===== */
var isDark = true;
document.getElementById("themeToggle").onclick = function() {
  isDark = !isDark;
  document.body.classList.toggle("light-mode", !isDark);
  document.getElementById("themeIcon").className = isDark ? "fas fa-moon" : "fas fa-sun";
  if (statsChartInstance) { statsChartInstance.destroy(); statsChartInstance = null; }
  var sc = document.getElementById("statsContainer");
  if (sc.style.display !== "none") document.getElementById("loadStatsBtn").click();
};
var notifOpen = false;
document.getElementById("notifBtn").onclick = function(e) {
  e.stopPropagation(); notifOpen = !notifOpen;
  document.getElementById("notifPanel").classList.toggle("show", notifOpen);
};
document.addEventListener("click", function() { if (notifOpen) { notifOpen = false; document.getElementById("notifPanel").classList.remove("show"); } });
document.getElementById("fullscreenBtn").onclick = function() {
  if (!document.fullscreenElement) document.documentElement.requestFullscreen();
  else document.exitFullscreen();
};

function updateNotif() {
  var anyActive = sendRunning || replyRunning;
  document.getElementById("notifDot").classList.toggle("show", anyActive);
  document.getElementById("notifSendDot").style.background = sendRunning ? "var(--green)" : "var(--text-3)";
  document.getElementById("notifSendText").textContent = "الإرسال: " + (sendRunning ? "يعمل" : "متوقف");
  document.getElementById("notifReplyDot").style.background = replyRunning ? "var(--green)" : "var(--text-3)";
  document.getElementById("notifReplyText").textContent = "الرد الذكي: " + (replyRunning ? "يعمل" : "متوقف");
}

/* ===== FILE LOAD/SAVE ===== */
function loadFile(type, area) {
  toast("جاري التحميل...", "info");
  fetch("/api/load?type=" + type).then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error); area.value = d.text; toast("تم التحميل", "ok");
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
}
function saveFile(type, area) {
  toast("جاري الحفظ...", "info");
  fetch("/api/save", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: type, text: area.value }) }).then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error); toast("تم الحفظ", "ok");
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
}
document.getElementById("loadMessagesBtn").onclick = function() { loadFile("messages", document.getElementById("messagesArea")); };
document.getElementById("saveMessagesBtn").onclick = function() { saveFile("messages", document.getElementById("messagesArea")); };
document.getElementById("loadContactsBtn").onclick = function() { loadFile("contacts", document.getElementById("contactsArea")); };
document.getElementById("saveContactsBtn").onclick = function() { saveFile("contacts", document.getElementById("contactsArea")); };
document.getElementById("loadImagesListBtn").onclick = function() { loadFile("images", document.getElementById("imagesListArea")); };
document.getElementById("saveImagesListBtn").onclick = function() { saveFile("images", document.getElementById("imagesListArea")); };

/* ===== SEND ===== */
var sendRunning = false;
function bindSendBtns(runId, stopId) {
  document.getElementById(runId).onclick = function() {
    var btn = this; btn.disabled = true; toast("جاري بدء الإرسال...", "info");
    fetch("/api/send/run", { method: "POST" }).then(function(r) { return r.json(); }).then(function(d) {
      if (!d.ok) throw new Error(d.error); toast("تم بدء الإرسال", "ok"); setTimeout(checkSendStatus, 5000);
    }).catch(function(e) { toast("خطأ: " + e.message, "err"); btn.disabled = false; });
  };
  document.getElementById(stopId).onclick = function() {
    var btn = this; btn.disabled = true; toast("جاري الإيقاف...", "info");
    fetch("/api/send/stop", { method: "POST" }).then(function(r) { return r.json(); }).then(function(d) {
      if (!d.ok) throw new Error(d.error); toast("تم إيقاف الإرسال", "ok");
    }).catch(function(e) { toast("خطأ: " + e.message, "err"); btn.disabled = false; });
  };
}
bindSendBtns("sendRunBtn", "sendStopBtn");

function checkSendStatus() {
  fetch("/api/send/status").then(function(r) { return r.json(); }).then(function(d) {
    sendRunning = d.ok && d.running;
    setRunDot(document.getElementById("sendRunningIndicator"), sendRunning, "جاري الإرسال...", "متوقف");
    document.getElementById("sendRunBtn").disabled = sendRunning;
    document.getElementById("sendStopBtn").disabled = !sendRunning;
    updateNotif();
    if (sendRunning) setTimeout(checkSendStatus, 15000);
  }).catch(function() { document.getElementById("sendRunBtn").disabled = false; });
}

/* ===== REPLY ===== */
var replyRunning = false;
function bindReplyBtns(runId, stopId) {
  document.getElementById(runId).onclick = function() {
    var btn = this; btn.disabled = true; toast("جاري تفعيل الرد الذكي...", "info");
    fetch("/api/reply/run", { method: "POST" }).then(function(r) { return r.json(); }).then(function(d) {
      if (!d.ok) throw new Error(d.error); toast("تم تفعيل الرد الذكي", "ok"); setTimeout(checkReplyStatus, 5000);
    }).catch(function(e) { toast("خطأ: " + e.message, "err"); btn.disabled = false; });
  };
  document.getElementById(stopId).onclick = function() {
    var btn = this; btn.disabled = true; toast("جاري إيقاف الرد الذكي...", "info");
    fetch("/api/reply/stop", { method: "POST" }).then(function(r) { return r.json(); }).then(function(d) {
      if (!d.ok) throw new Error(d.error); toast("تم إيقاف الرد الذكي", "ok");
    }).catch(function(e) { toast("خطأ: " + e.message, "err"); btn.disabled = false; });
  };
}
bindReplyBtns("replyRunBtn", "replyStopBtn");
bindReplyBtns("replyRunBtn2", "replyStopBtn2");

function checkReplyStatus() {
  fetch("/api/reply/status").then(function(r) { return r.json(); }).then(function(d) {
    replyRunning = d.ok && d.running;
    setRunDot(document.getElementById("replyRunningIndicator"), replyRunning, "الرد الذكي يعمل", "متوقف");
    setRunDot(document.getElementById("replyRunningIndicator2"), replyRunning, "الرد الذكي يعمل", "متوقف");
    document.getElementById("replyRunBtn").disabled = replyRunning;
    document.getElementById("replyStopBtn").disabled = !replyRunning;
    document.getElementById("replyRunBtn2").disabled = replyRunning;
    document.getElementById("replyStopBtn2").disabled = !replyRunning;
    updateNotif();
    if (replyRunning) setTimeout(checkReplyStatus, 15000);
  }).catch(function() { document.getElementById("replyRunBtn").disabled = false; document.getElementById("replyRunBtn2").disabled = false; });
}

/* ===== DASH STATS ===== */
function loadDashStats() {
  fetch("/api/stats").then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok || !d.data || d.data.length === 0) return;
    var last = d.data[d.data.length - 1];
    document.getElementById("statSent").textContent = last.attempted || 0;
    document.getElementById("statSuccess").textContent = last.success || 0;
    document.getElementById("statFailed").textContent = last.failed || 0;
    var active = (sendRunning ? 1 : 0) + (replyRunning ? 1 : 0);
    document.getElementById("statActive").textContent = active;
  }).catch(function() {});
}

/* ===== QR / SESSION ===== */
function refreshSession() {
  fetch("/api/session/status").then(function(r) { return r.json(); }).then(function(d) {
    if (d.ok) {
      var s = d.status || "غير معروف";
      var el = document.getElementById("sessionStatusText");
      el.textContent = s;
      el.style.color = s === "connected" ? "var(--green)" : s === "waiting_scan" ? "var(--yellow)" : "var(--text-2)";
      document.getElementById("notifSessionDot").style.background = s === "connected" ? "var(--green)" : "var(--text-3)";
      document.getElementById("notifSessionText").textContent = "الجلسة: " + s;
    }
  }).catch(function() {});
  fetch("/api/session/qr").then(function(r) { return r.json(); }).then(function(d) {
    var img = document.getElementById("qrImage");
    if (d.ok && d.qr) { img.src = d.qr; img.style.display = "block"; } else { img.style.display = "none"; }
  }).catch(function() {});
}
document.getElementById("refreshSessionBtn").onclick = refreshSession;
document.getElementById("runQRBtn").onclick = function() {
  toast("جاري تشغيل QR...", "info");
  fetch("/api/qr/run", { method: "POST" }).then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error); toast("تم تشغيل QR", "ok"); setTimeout(refreshSession, 3000);
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
};
document.getElementById("stopQRBtn").onclick = function() {
  toast("جاري إيقاف QR...", "info");
  fetch("/api/qr/stop", { method: "POST" }).then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error); toast("تم إيقاف QR", "ok"); setTimeout(refreshSession, 2000);
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
};
setInterval(refreshSession, 30000);

/* ===== IMAGES ===== */
var selectedFiles = [];
var imgInput = document.getElementById("imagesInput");
imgInput.addEventListener("change", function() { selectedFiles = Array.from(this.files); renderPreviews(); });
function renderPreviews() {
  var area = document.getElementById("imagePreviewArea"); area.innerHTML = "";
  selectedFiles.forEach(function(file, i) {
    var reader = new FileReader();
    reader.onload = function(ev) {
      var d = document.createElement("div"); d.style.cssText = "width:70px;height:70px;border-radius:8px;overflow:hidden;position:relative;border:1px solid var(--glass-border)";
      d.innerHTML = '<img src="' + ev.target.result + '" style="width:100%;height:100%;object-fit:cover"><button data-i="' + i + '" style="position:absolute;top:2px;right:2px;background:var(--red);color:#fff;border:none;border-radius:50%;width:18px;height:18px;cursor:pointer;font-size:9px">X</button>';
      area.appendChild(d);
      d.querySelector("button").onclick = function() { selectedFiles.splice(i, 1); renderPreviews(); };
    }; reader.readAsDataURL(file);
  });
}
function loadImages() {
  var gal = document.getElementById("imageGallery"), list = document.getElementById("imageList"), cnt = document.getElementById("imageCount");
  fetch("/api/images").then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error); var files = d.files || []; cnt.textContent = files.length;
    if (!files.length) { gal.style.display = "none"; return; }
    gal.style.display = "block"; list.innerHTML = "";
    files.forEach(function(f) {
      var d = document.createElement("div"); d.className = "img-card";
      var img = document.createElement("img"); img.src = f.download_url;
      var del = document.createElement("button"); del.className = "del"; del.innerHTML = '<i class="fas fa-trash"></i>';
      del.onclick = function() {
        Swal.fire({ title: "حذف الصورة؟", text: f.name, icon: "warning", showCancelButton: true, confirmButtonText: "حذف", cancelButtonText: "إلغاء", confirmButtonColor: "#ff3860", background: "var(--bg-card)", color: "var(--text-1)" }).then(function(res) {
          if (!res.isConfirmed) return;
          fetch("/api/delete-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: f.name }) }).then(function(r) { return r.json(); }).then(function(dd) {
            if (!dd.ok) throw new Error(dd.error); d.remove(); var nc = parseInt(cnt.textContent) - 1; cnt.textContent = nc; if (!nc) gal.style.display = "none"; toast("تم الحذف", "ok");
          }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
        });
      };
      d.appendChild(img); d.appendChild(del); list.appendChild(d);
    });
  }).catch(function() { gal.style.display = "none"; });
}
document.getElementById("refreshImagesBtn").onclick = loadImages;
document.getElementById("uploadImagesBtn").onclick = function() {
  if (!selectedFiles.length) { toast("اختر صورة أولاً", "err"); return; }
  fetch("/api/images").then(function(r) { return r.json(); }).then(function(d) {
    var cc = d.files ? d.files.length : 0;
    if (cc >= 3) { toast("الحد الأقصى 3 صور", "err"); return; }
    var rem = 3 - cc;
    if (selectedFiles.length > rem) { toast("يمكنك رفع " + rem + " فقط", "err"); return; }
    var ok = 0;
    var chain = Promise.resolve();
    selectedFiles.forEach(function(file) {
      chain = chain.then(function() {
        return new Promise(function(resolve) {
          var reader = new FileReader(); reader.onload = function() { resolve(reader.result.split(",")[1]); }; reader.readAsDataURL(file);
        }).then(function(b64) {
          return fetch("/api/upload-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ filename: file.name, dataBase64: b64 }) }).then(function(r) { return r.json(); });
        }).then(function(d) { if (d.ok) ok++; });
      });
    });
    chain.then(function() {
      toast(ok + "/" + selectedFiles.length + " تم رفعها", ok === selectedFiles.length ? "ok" : "err");
      if (ok === selectedFiles.length) { selectedFiles = []; imgInput.value = ""; renderPreviews(); }
      loadImages();
    });
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
};

/* ===== MYLIST ===== */
var mylistFull = [], mylistFiltered = [];
var mlBody = document.getElementById("mylistBody");
document.getElementById("mylistFilterAge").onchange = function() {
  document.getElementById("customAgeWrap").style.display = this.value === "custom" ? "inline-flex" : "none";
};
function getMylistParams() {
  var p = new URLSearchParams();
  p.set("gender", document.getElementById("mylistFilterGender").value);
  var av = document.getElementById("mylistFilterAge").value;
  if (av === "custom") {
    var mn = document.getElementById("mylistMinAge").value, mx = document.getElementById("mylistMaxAge").value;
    if (mn !== "") p.set("minAge", mn); if (mx !== "") p.set("maxAge", mx);
  } else if (av !== "all") { var pts = av.split("-"); p.set("minAge", pts[0]); p.set("maxAge", pts[1]); }
  var sv = document.getElementById("mylistSort").value, sp = sv.split("-");
  p.set("sort", sp[0]); p.set("order", sp[1]);
  return p;
}
function renderMylist(data) {
  if (!data || !data.length) { mlBody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:var(--text-3);padding:30px">لا توجد بيانات</td></tr>'; return; }
  mlBody.innerHTML = "";
  data.forEach(function(item, i) {
    var tr = document.createElement("tr"); tr.setAttribute("data-index", item._index);
    tr.innerHTML = '<td style="color:var(--text-3)">' + (i + 1) + '</td><td style="direction:ltr;text-align:right;font-family:Consolas,monospace;font-size:12px">' + (item.number || "") + '</td><td>' + (item.age || 0) + '</td><td>' + gBadge(item.gender) + '</td><td><button class="btn btn-cyan btn-sm ml-edit" data-idx="' + item._index + '"><i class="fas fa-pen"></i></button> <button class="btn btn-red btn-sm ml-del" data-idx="' + item._index + '"><i class="fas fa-trash"></i></button></td>';
    mlBody.appendChild(tr);
  });
  mlBody.querySelectorAll(".ml-del").forEach(function(b) {
    b.onclick = function() {
      var idx = parseInt(this.getAttribute("data-idx"));
      Swal.fire({ title: "حذف هذا الرقم؟", icon: "warning", showCancelButton: true, confirmButtonText: "حذف", cancelButtonText: "إلغاء", confirmButtonColor: "#ff3860", background: "var(--bg-card)", color: "var(--text-1)" }).then(function(res) {
        if (!res.isConfirmed) return;
        fetch("/api/mylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "delete", index: idx }) }).then(function(r) { return r.json(); }).then(function(d) { if (!d.ok) throw new Error(d.error); toast("تم الحذف", "ok"); loadMylist(); }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
      });
    };
  });
  mlBody.querySelectorAll(".ml-edit").forEach(function(b) {
    b.onclick = function() {
      var idx = parseInt(this.getAttribute("data-idx")), item = mylistFull[idx]; if (!item) return;
      var tr = this.closest("tr");
      tr.innerHTML = '<td style="color:var(--text-3)">' + (Array.from(mlBody.children).indexOf(tr) + 1) + '</td><td><input class="edt" id="eN" value="' + (item.number || "") + '"></td><td><input class="edt" type="number" id="eA" value="' + (item.age || 0) + '" min="0" max="120" style="width:70px"></td><td><select class="edt" id="eG" style="width:80px"><option value="ذكر"' + (item.gender === "ذكر" ? " selected" : "") + '>ذكر</option><option value="أنثى"' + (item.gender === "أنثى" ? " selected" : "") + '>أنثى</option></select></td><td><button class="btn btn-green btn-sm ml-save" data-idx="' + idx + '"><i class="fas fa-check"></i></button> <button class="btn btn-sm ml-cancel"><i class="fas fa-times"></i></button></td>';
      tr.querySelector(".ml-save").onclick = function() {
        fetch("/api/mylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "update", index: idx, number: document.getElementById("eN").value, age: document.getElementById("eA").value, gender: document.getElementById("eG").value }) }).then(function(r) { return r.json(); }).then(function(d) { if (!d.ok) throw new Error(d.error); toast("تم التعديل", "ok"); loadMylist(); }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
      };
      tr.querySelector(".ml-cancel").onclick = function() { loadMylist(); };
    };
  });
}
function loadMylist() {
  var params = getMylistParams();
  fetch("/api/mylist?" + params.toString()).then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error);
    return fetch("/api/mylist?sort=index&order=asc").then(function(r2) { return r2.json(); }).then(function(d2) { mylistFull = d2.data || []; mylistFiltered = d.data || []; document.getElementById("mylistCount").textContent = "المجموع: " + d.total + " | يعرض: " + d.filtered; renderMylist(d.data); });
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
}
document.getElementById("mylistLoadBtn").onclick = loadMylist;
document.getElementById("mylistFilterBtn").onclick = loadMylist;
document.getElementById("mylistAddBtn").onclick = function() {
  var num = document.getElementById("mylistNumber").value.trim(), age = document.getElementById("mylistAge").value, gen = document.getElementById("mylistGender").value;
  if (!num) { toast("أدخل الرقم", "err"); return; }
  fetch("/api/mylist", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", number: num, age: age, gender: gen }) }).then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error); toast("تمت الإضافة", "ok"); document.getElementById("mylistNumber").value = ""; document.getElementById("mylistAge").value = ""; loadMylist();
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
};
document.getElementById("mylistCopyBtn").onclick = function() {
  if (!mylistFiltered.length) { toast("لا توجد أرقام معروضة", "err"); return; }
  var nums = mylistFiltered.map(function(i) { return i.number; }).filter(function(n) { return n; });
  var text = nums.join("\\n");
  navigator.clipboard.writeText(text).then(function() { toast("تم نسخ " + nums.length + " رقم", "ok"); }).catch(function() {
    var ta = document.createElement("textarea"); ta.value = text; ta.style.cssText = "position:fixed;opacity:0"; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta); toast("تم نسخ " + nums.length + " رقم", "ok");
  });
};

/* ===== LOGS ===== */
function loadLogs() {
  var list = document.getElementById("logFilesList");
  list.innerHTML = '<span style="color:var(--text-3);font-size:12px">جاري التحميل...</span>';
  fetch("/api/logs").then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error); list.innerHTML = "";
    if (!d.files.length) { list.innerHTML = '<span style="color:var(--text-3);font-size:12px">لا توجد سجلات</span>'; return; }
    d.files.forEach(function(f) {
      var btn = document.createElement("button"); btn.className = "log-fbtn"; btn.textContent = f.name;
      btn.onclick = function() {
        document.querySelectorAll(".log-fbtn").forEach(function(b) { b.classList.remove("active"); }); btn.classList.add("active");
        var el = document.getElementById("logContent"); el.textContent = "جاري التحميل...";
        fetch("/api/log-content?file=" + encodeURIComponent(f.name)).then(function(r) { return r.json(); }).then(function(dd) { if (!dd.ok) throw new Error(dd.error); el.textContent = dd.content || " فارغ "; }).catch(function(e) { el.textContent = "خطأ: " + e.message; });
      };
      list.appendChild(btn);
    });
  }).catch(function(e) { list.innerHTML = '<span style="color:var(--red);font-size:12px">خطأ: ' + e.message + '</span>'; });
}

/* ===== SCHEDULE ===== */
function loadSchedule() {
  fetch("/api/schedule").then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error);
    var ind = document.getElementById("scheduleIndicator"), disp = document.getElementById("currentCronDisplay");
    if (d.hasSchedule && d.cron) { ind.textContent = "مفعل"; ind.className = "sched-status on"; disp.textContent = "التوقيت: " + d.cron; var p = d.cron.trim().split(/\\s+/); if (p.length >= 2) { document.getElementById("minuteInput").value = p[0]; document.getElementById("hourInput").value = p[1]; } toast("تم تحميل الجدولة", "ok"); }
    else { ind.textContent = "غير مفعل"; ind.className = "sched-status off"; disp.textContent = "(لا توجد جدولة)"; }
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
}
document.getElementById("loadScheduleBtn").onclick = loadSchedule;
document.getElementById("updateScheduleBtn").onclick = function() {
  var h = parseInt(document.getElementById("hourInput").value, 10), m = parseInt(document.getElementById("minuteInput").value, 10);
  if (isNaN(h) || h < 0 || h > 23 || isNaN(m) || m < 0 || m > 59) { toast("أدخل قيم صحيحة", "err"); return; }
  fetch("/api/schedule", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "add", cron: m + " " + h + " * * *" }) }).then(function(r) { return r.json(); }).then(function(d) { if (!d.ok) throw new Error(d.error); toast("تم التحديث", "ok"); loadSchedule(); }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
};

/* ===== ANALYTICS ===== */
var statsChartInstance = null;
document.getElementById("loadStatsBtn").onclick = function() {
  toast("جاري تحميل الإحصائيات...", "info");
  fetch("/api/stats").then(function(r) { return r.json(); }).then(function(d) {
    if (!d.ok) throw new Error(d.error);
    if (!d.data.length) { toast("لا توجد إحصائيات", "err"); return; }
    document.getElementById("statsContainer").style.display = "block"; toast("تم التحميل", "ok");
    var tbody = document.getElementById("statsBody"); tbody.innerHTML = "";
    var tA = 0, tS = 0, tF = 0;
    d.data.forEach(function(r) {
      tA += r.attempted || 0; tS += r.success || 0; tF += r.failed || 0;
      var tr = document.createElement("tr"); tr.innerHTML = "<td>" + r.date + "</td><td>" + (r.attempted||0) + "</td><td style='color:var(--green)'>" + (r.success||0) + "</td><td style='color:var(--red)'>" + (r.failed||0) + "</td>";
      tbody.appendChild(tr);
    });
    var trT = document.createElement("tr"); trT.style.fontWeight = "bold"; trT.style.borderTop = "2px solid var(--cyan)";
    trT.innerHTML = "<td>المجموع</td><td>" + tA + "</td><td style='color:var(--green)'>" + tS + "</td><td style='color:var(--red)'>" + tF + "</td>";
    tbody.appendChild(trT);
    document.getElementById("statSent").textContent = tA; document.getElementById("statSuccess").textContent = tS; document.getElementById("statFailed").textContent = tF;
    var ctx = document.getElementById("statsChart").getContext("2d");
    if (statsChartInstance) statsChartInstance.destroy();
    var gridC = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
    var txtC = isDark ? "#7878aa" : "#555580";
    statsChartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels: d.data.map(function(r) { return r.date; }),
        datasets: [
          { label: "محاولات", data: d.data.map(function(r) { return r.attempted||0; }), backgroundColor: "rgba(0,240,255,0.5)", borderColor: "#00f0ff", borderWidth: 1, borderRadius: 4 },
          { label: "نجاح", data: d.data.map(function(r) { return r.success||0; }), backgroundColor: "rgba(0,255,136,0.5)", borderColor: "#00ff88", borderWidth: 1, borderRadius: 4 },
          { label: "فشل", data: d.data.map(function(r) { return r.failed||0; }), backgroundColor: "rgba(255,56,96,0.5)", borderColor: "#ff3860", borderWidth: 1, borderRadius: 4 }
        ]
      },
      options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: txtC, font: { family: "'Plus Jakarta Sans'", size: 13 } } } }, scales: { y: { beginAtZero: true, ticks: { color: txtC }, grid: { color: gridC } }, x: { ticks: { color: txtC }, grid: { display: false } } } }
    });
  }).catch(function(e) { toast("خطأ: " + e.message, "err"); });
};
</script>
</body>
</html>
`;
