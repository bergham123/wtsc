export const HTML_PAGE = `<!DOCTYPE html>
<html lang="en" dir="ltr">
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
  --bg-deep:#06060f;--bg-primary:#0a0a1a;--bg-card:rgba(12,12,35,0.7);
  --bg-input:rgba(20,20,50,0.6);--text-1:#e8e8ff;--text-2:#7878aa;--text-3:#4a4a70;
  --cyan:#00f0ff;--purple:#b829ff;--pink:#ff2d95;--green:#00ff88;--blue:#4d8bff;
  --red:#ff3860;--orange:#ff8c42;--yellow:#ffe14d;
  --glass-border:rgba(0,240,255,0.12);--glass-blur:18px;
  --glow-cyan:0 0 15px rgba(0,240,255,0.3);--glow-purple:0 0 15px rgba(184,41,255,0.3);
  --glow-green:0 0 15px rgba(0,255,136,0.3);--glow-red:0 0 15px rgba(255,56,96,0.3);
  --sidebar-w:260px;--header-h:56px;
}
.auth-step{display:none}
.auth-step.active{display:block}
.auth-link{color:var(--cyan);font-size:11px;cursor:pointer;background:none;border:none;font-family:inherit;margin-top:12px;transition:opacity .2s}
.auth-link:hover{opacity:.7}
.auth-back{color:var(--text-3);font-size:11px;cursor:pointer;background:none;border:none;font-family:inherit;margin-top:10px;display:inline-flex;align-items:center;gap:4px}
.auth-back:hover{color:var(--text-1)}
.auth-success-icon{font-size:48px;color:var(--green);margin-bottom:10px;animation:popIn .4s ease}
@keyframes popIn{0%{transform:scale(0);opacity:0}100%{transform:scale(1);opacity:1}}
.auth-loader{display:inline-block;width:16px;height:16px;border:2px solid var(--glass-border);border-top-color:var(--cyan);border-radius:50%;animation:spin .6s linear infinite;vertical-align:middle;margin-right:6px}
.light-mode{
  --bg-deep:#e4e4ee;--bg-primary:#eeeef6;--bg-card:rgba(255,255,255,0.8);
  --bg-input:rgba(230,230,250,0.8);--text-1:#1a1a2e;--text-2:#555580;--text-3:#9999bb;
  --glass-border:rgba(0,0,0,0.08);
  --glow-cyan:0 2px 8px rgba(0,150,200,0.12);--glow-purple:0 2px 8px rgba(140,41,200,0.12);
  --glow-green:0 2px 8px rgba(0,180,100,0.12);--glow-red:0 2px 8px rgba(200,30,60,0.12);
}
*{box-sizing:border-box;margin:0;padding:0}
body{font-family:'Plus Jakarta Sans',sans-serif;background:var(--bg-deep);color:var(--text-1);min-height:100vh;overflow-x:hidden}
h1,h2,h3,.font-orb{font-family:'Orbitron',sans-serif}
::-webkit-scrollbar{width:5px}
::-webkit-scrollbar-track{background:transparent}
::-webkit-scrollbar-thumb{background:var(--cyan);border-radius:3px}

/* LOADER */
#cyberLoader{position:fixed;inset:0;z-index:9999;background:var(--bg-deep);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:28px;transition:opacity .5s}
#cyberLoader.hide{opacity:0;pointer-events:none}
.l-ring{width:70px;height:70px;border:3px solid transparent;border-top-color:var(--cyan);border-right-color:var(--purple);border-radius:50%;animation:spin 1s linear infinite;position:relative}
.l-ring::before{content:'';position:absolute;inset:5px;border:3px solid transparent;border-bottom-color:var(--pink);border-radius:50%;animation:spin 1.5s linear reverse infinite}
@keyframes spin{to{transform:rotate(360deg)}}
.l-txt{font-family:'Orbitron';font-size:12px;color:var(--cyan);letter-spacing:4px;animation:glitch 2s infinite}
@keyframes glitch{0%,100%{opacity:1}50%{opacity:.4}}

/* AUTH */
#authScreen{position:fixed;inset:0;z-index:9998;background:var(--bg-deep);display:none;align-items:center;justify-content:center;padding:20px}
#authScreen.show{display:flex}
.auth-card{background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:20px;padding:36px;width:380px;max-width:100%;text-align:center;box-shadow:var(--glow-cyan),var(--glow-purple)}
.auth-card h2{font-size:18px;color:var(--cyan);margin-bottom:6px}
.auth-card p{color:var(--text-2);font-size:12px;margin-bottom:20px}
.auth-input{width:100%;background:var(--bg-input);border:1px solid var(--glass-border);border-radius:10px;padding:13px 16px;color:var(--text-1);font-family:'Orbitron';font-size:12px;letter-spacing:2px;text-align:center;outline:none;transition:border .3s,box-shadow .3s}
.auth-input:focus{border-color:var(--cyan);box-shadow:var(--glow-cyan)}
.auth-btn{width:100%;margin-top:14px;padding:13px;background:linear-gradient(135deg,var(--cyan),var(--purple));border:none;border-radius:10px;color:#fff;font-family:'Orbitron';font-size:12px;font-weight:700;cursor:pointer;letter-spacing:2px;transition:transform .2s,box-shadow .2s}
.auth-btn:hover{transform:scale(1.03);box-shadow:var(--glow-cyan),var(--glow-purple)}
.auth-err{color:var(--red);font-size:11px;margin-top:10px;min-height:16px}

/* LAYOUT */
#mainApp{display:none;height:100vh}
#mainApp.show{display:flex}

/* SIDEBAR OVERLAY (mobile only) */
#sidebarOverlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:90;backdrop-filter:blur(4px);opacity:0;transition:opacity .3s}
#sidebarOverlay.show{display:block;opacity:1}

/* SIDEBAR — desktop: always visible, mobile: off-screen by default */
.sidebar{
  width:var(--sidebar-w);background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));
  border-right:1px solid var(--glass-border);height:100vh;position:fixed;left:0;top:0;
  z-index:100;display:flex;flex-direction:column;
  transform:translateX(0);
  transition:transform .3s cubic-bezier(.4,0,.2,1);
}
.sidebar.open{transform:translateX(0)!important}

.sb-head{padding:18px;border-bottom:1px solid var(--glass-border);display:flex;align-items:center;gap:10px}
.sb-logo{width:34px;height:34px;background:linear-gradient(135deg,var(--cyan),var(--purple));border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:15px;color:#fff}
.sb-title{font-size:12px;font-weight:900;background:linear-gradient(90deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
.sb-nav{flex:1;overflow-y:auto;padding:10px}
.nav-i{display:flex;align-items:center;gap:11px;padding:11px 14px;border-radius:9px;cursor:pointer;transition:all .2s;color:var(--text-2);font-size:13px;font-weight:500;margin-bottom:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nav-i:hover{background:rgba(0,240,255,0.06);color:var(--text-1)}
.nav-i.active{background:rgba(0,240,255,0.1);color:var(--cyan);box-shadow:inset 3px 0 0 var(--cyan)}
.nav-i i{width:18px;text-align:center;font-size:14px;flex-shrink:0}

.content-area{flex:1;margin-left:var(--sidebar-w);display:flex;flex-direction:column;height:100vh;transition:margin-left .3s}

.top-hdr{height:var(--header-h);background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border-bottom:1px solid var(--glass-border);display:flex;align-items:center;justify-content:space-between;padding:0 16px;position:sticky;top:0;z-index:50;gap:8px}
.hdr-l,.hdr-r{display:flex;align-items:center;gap:8px}
.hdr-search{background:var(--bg-input);border:1px solid var(--glass-border);border-radius:8px;padding:7px 12px;color:var(--text-1);font-size:12px;width:180px;outline:none;font-family:inherit;transition:width .3s}
.hdr-search:focus{border-color:var(--cyan);width:220px}
.hdr-btn{width:34px;height:34px;border-radius:8px;background:var(--bg-input);border:1px solid var(--glass-border);color:var(--text-2);cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;position:relative;flex-shrink:0;font-size:14px}
.hdr-btn:hover{color:var(--cyan);border-color:var(--cyan)}
.n-dot{position:absolute;top:5px;right:5px;width:6px;height:6px;border-radius:50%;background:var(--green);display:none}
.n-dot.show{display:block}

.notif-panel{position:absolute;top:calc(var(--header-h) - 4px);right:16px;width:280px;background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:12px;padding:14px;display:none;z-index:200;box-shadow:var(--glow-cyan)}
.notif-panel.show{display:block}
.nf-item{display:flex;align-items:center;gap:8px;padding:8px;border-radius:7px;margin-bottom:4px;font-size:11px;color:var(--text-2)}
.nf-item .dot{width:7px;height:7px;border-radius:50%;flex-shrink:0}

.page-content{flex:1;overflow-y:auto;padding:20px}
.cs{display:none}
.cs.active{display:block}

/* GLASS */
.glass{background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:14px;padding:20px;transition:border-color .3s}
.glass:hover{border-color:rgba(0,240,255,0.2)}
.glass-sm{padding:16px;border-radius:12px}
.g-hdr{display:flex;align-items:center;gap:9px;margin-bottom:5px}
.g-hdr i{font-size:15px}
.g-hdr h2{font-size:13px;font-weight:700;letter-spacing:.3px}
.g-hint{color:var(--text-3);font-size:11px;margin-bottom:12px}

/* STATS GRID */
.sg{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px;margin-bottom:20px}
.sc{background:var(--bg-card);backdrop-filter:blur(var(--glass-blur));border:1px solid var(--glass-border);border-radius:12px;padding:16px;position:relative;overflow:hidden;transition:transform .2s}
.sc:hover{transform:translateY(-2px)}
.sc::before{content:'';position:absolute;top:-10px;left:-10px;width:60px;height:60px;border-radius:50%;filter:blur(30px);opacity:.25}
.sc.c1::before{background:var(--cyan)}.sc.c2::before{background:var(--green)}.sc.c3::before{background:var(--red)}.sc.c4::before{background:var(--purple)}
.si{width:36px;height:36px;border-radius:9px;display:flex;align-items:center;justify-content:center;font-size:14px;margin-bottom:10px}
.si.c1{background:rgba(0,240,255,.1);color:var(--cyan)}.si.c2{background:rgba(0,255,136,.1);color:var(--green)}
.si.c3{background:rgba(255,56,96,.1);color:var(--red)}.si.c4{background:rgba(184,41,255,.1);color:var(--purple)}
.sv{font-family:'Orbitron';font-size:22px;font-weight:900;margin-bottom:3px}
.sl{color:var(--text-2);font-size:10px;font-weight:600;letter-spacing:.5px;text-transform:uppercase}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:9px 16px;border-radius:9px;font-family:inherit;font-size:12px;font-weight:600;cursor:pointer;transition:all .2s;border:1px solid var(--glass-border);background:var(--bg-input);color:var(--text-1);white-space:nowrap}
.btn:hover{border-color:var(--cyan);color:var(--cyan)}
.btn:disabled{opacity:.3;cursor:not-allowed;pointer-events:none}
.btn-c{background:linear-gradient(135deg,rgba(0,240,255,.15),rgba(0,240,255,.04));border-color:rgba(0,240,255,.25);color:var(--cyan)}
.btn-c:hover{background:linear-gradient(135deg,rgba(0,240,255,.25),rgba(0,240,255,.08));box-shadow:var(--glow-cyan)}
.btn-p{background:linear-gradient(135deg,rgba(184,41,255,.15),rgba(184,41,255,.04));border-color:rgba(184,41,255,.25);color:var(--purple)}
.btn-p:hover{box-shadow:var(--glow-purple)}
.btn-g{background:linear-gradient(135deg,rgba(0,255,136,.15),rgba(0,255,136,.04));border-color:rgba(0,255,136,.25);color:var(--green)}
.btn-g:hover{box-shadow:var(--glow-green)}
.btn-r{background:linear-gradient(135deg,rgba(255,56,96,.15),rgba(255,56,96,.04));border-color:rgba(255,56,96,.25);color:var(--red)}
.btn-r:hover{box-shadow:var(--glow-red)}
.btn-o{background:linear-gradient(135deg,rgba(255,140,66,.15),rgba(255,140,66,.04));border-color:rgba(255,140,66,.25);color:var(--orange)}
.btn-sm{padding:6px 11px;font-size:11px;border-radius:7px}

/* INPUTS */
.ci{background:var(--bg-input);border:1px solid var(--glass-border);border-radius:8px;padding:9px 12px;color:var(--text-1);font-family:inherit;font-size:12px;outline:none;width:100%;transition:border .3s}
.ci:focus{border-color:var(--cyan)}
textarea.ci{min-height:110px;resize:vertical;font-family:'Consolas',monospace;direction:ltr;text-align:left}
select.ci{cursor:pointer}

/* RUN DOT */
.rd{display:inline-flex;align-items:center;gap:5px;font-size:10px;font-weight:700;padding:3px 10px;border-radius:20px}
.rd.on{background:rgba(0,255,136,.08);color:var(--green)}.rd.off{background:rgba(120,120,170,.08);color:var(--text-3)}
.rd .d{width:6px;height:6px;border-radius:50%;background:currentColor}
.rd.on .d{animation:pulse 1.2s ease-in-out infinite}
@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.3;transform:scale(.5)}}

/* MYLIST */
.ml-add{display:flex;gap:8px;flex-wrap:wrap;align-items:flex-end;background:var(--bg-input);padding:12px;border-radius:10px;border:1px solid var(--glass-border);margin-bottom:12px}
.ml-add label{display:flex;flex-direction:column;gap:3px;font-size:10px;color:var(--text-2);flex:1;min-width:90px}
.ml-filters{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:12px}
.ml-wrap{max-height:320px;overflow-y:auto;border-radius:10px;border:1px solid var(--glass-border);margin-bottom:12px}
.ml-tbl{width:100%;border-collapse:collapse;font-size:11px}
.ml-tbl th{text-align:left;padding:9px 10px;background:var(--bg-input);color:var(--text-2);border-bottom:1px solid var(--glass-border);position:sticky;top:0;z-index:2;font-size:10px;font-weight:600}
.ml-tbl td{padding:7px 10px;border-bottom:1px solid var(--glass-border)}
.ml-tbl tr:hover td{background:rgba(0,240,255,.02)}
.ml-tbl .edt{background:var(--bg-deep);color:var(--text-1);border:1px solid var(--cyan);border-radius:4px;padding:3px 7px;font-family:inherit;font-size:11px;width:100%}
.gb{display:inline-block;padding:2px 8px;border-radius:10px;font-size:9px;font-weight:700}
.gb.m{background:rgba(0,240,255,.1);color:var(--cyan)}.gb.f{background:rgba(184,41,255,.1);color:var(--purple)}.gb.u{background:rgba(120,120,170,.1);color:var(--text-3)}

/* STATS TABLE */
.st-tbl{width:100%;border-collapse:collapse;font-size:12px}
.st-tbl th{text-align:left;padding:10px;background:var(--bg-input);color:var(--text-2);border-bottom:1px solid var(--glass-border);font-weight:600}
.st-tbl td{padding:10px;border-bottom:1px solid var(--glass-border)}

/* LOGS */
.lf{display:flex;gap:6px;flex-wrap:wrap}
.lfb{background:var(--bg-input);border:1px solid var(--glass-border);color:var(--text-2);padding:7px 12px;border-radius:7px;cursor:pointer;font-size:11px;font-family:inherit;transition:all .2s}
.lfb:hover{border-color:var(--cyan);color:var(--cyan)}
.lfb.active{background:rgba(0,240,255,.12);border-color:var(--cyan);color:var(--cyan);font-weight:700}
.lv{background:var(--bg-deep);border:1px solid var(--glass-border);border-radius:10px;padding:14px;min-height:260px;max-height:450px;overflow-y:auto;font-family:'Consolas',monospace;font-size:11px;color:var(--text-2);white-space:pre-wrap;word-break:break-all}

/* IMAGES */
.ig{display:flex;flex-wrap:wrap;gap:10px;margin-top:12px}
.ic{position:relative;width:90px;height:90px;border-radius:10px;overflow:hidden;border:1px solid var(--glass-border)}
.ic img{width:100%;height:100%;object-fit:cover}
.ic .del{position:absolute;top:3px;right:3px;width:20px;height:20px;border-radius:50%;background:var(--red);border:none;color:#fff;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:9px;opacity:0;transition:opacity .2s}
.ic:hover .del{opacity:1}

/* QR */
.qr-box{width:180px;height:180px;border:2px solid var(--cyan);border-radius:10px;overflow:hidden;box-shadow:var(--glow-cyan);flex-shrink:0}
.qr-box img{width:100%;height:100%;object-fit:contain}

/* SCHEDULE */
.ss{display:inline-block;padding:3px 10px;border-radius:7px;font-size:10px;font-weight:700;margin-bottom:8px}
.ss.on{background:rgba(0,255,136,.1);color:var(--green);border:1px solid rgba(0,255,136,.2)}
.ss.off{background:rgba(255,56,96,.1);color:var(--red);border:1px solid rgba(255,56,96,.2)}

/* 2-COL GRID */
.g2{display:grid;grid-template-columns:1fr 1fr;gap:16px}

/* ==============================
   RESPONSIVE — SIDEBAR LOGIC
   Desktop (>900px): sidebar always visible, hamburger hidden
   Mobile (<=900px): sidebar hidden off-screen, hamburger shown, overlay on open
   ============================== */

/* Mobile: push sidebar off-screen, remove content margin */
@media(max-width:900px){
  .sidebar{transform:translateX(-100%)}
  .sidebar.open{transform:translateX(0)}
  .content-area{margin-left:0!important}
  .g2{grid-template-columns:1fr}
  .hdr-search{width:120px}
  .hdr-search:focus{width:160px}
}

/* Desktop: hide the hamburger button entirely */
@media(min-width:901px){
  #menuBtn{display:none!important}
}

@media(max-width:500px){
  .sg{grid-template-columns:1fr 1fr}
  .ml-add{flex-direction:column}
  .ml-filters{flex-direction:column}
  .qr-box{width:150px;height:150px}
  .page-content{padding:14px}
  .glass{padding:14px}
}
</style>
</head>
<body>

<div id="cyberLoader">
  <div class="l-ring"></div>
  <div class="l-txt">WHATSAPP NEXUS AI</div>
</div>

<div id="authScreen">
  <div class="auth-card">

    <!-- STEP: LOGIN -->
    <div class="auth-step active" id="authLogin">
      <div style="font-size:36px;margin-bottom:14px"><i class="fas fa-shield-halved" style="color:var(--cyan)"></i></div>
      <h2 class="font-orb">QUANTUM GATEWAY</h2>
      <p>Enter your password to proceed</p>
      <input type="password" class="auth-input" id="authPwd" placeholder="Password" autocomplete="off">
      <button class="auth-btn" id="authLoginBtn"><i class="fas fa-key"></i> UNLOCK</button>
      <div class="auth-err" id="authErr"></div>
      <button class="auth-link" id="authForgotBtn">Forgot password?</button>
    </div>

    <!-- STEP: SETUP (first time) -->
    <div class="auth-step" id="authSetup">
      <div style="font-size:36px;margin-bottom:14px"><i class="fas fa-user-shield" style="color:var(--purple)"></i></div>
      <h2 class="font-orb">INITIAL SETUP</h2>
      <p>Set your access password for the first time</p>
      <input type="password" class="auth-input" id="setupPwd" placeholder="Create password" autocomplete="off">
      <input type="password" class="auth-input" id="setupPwd2" placeholder="Confirm password" autocomplete="off" style="margin-top:10px">
      <button class="auth-btn" id="authSetupBtn"><i class="fas fa-lock"></i> SET PASSWORD</button>
      <div class="auth-err" id="setupErr"></div>
    </div>

    <!-- STEP: RESET REQUEST -->
    <div class="auth-step" id="authResetReq">
      <div style="font-size:36px;margin-bottom:14px"><i class="fas fa-paper-plane" style="color:var(--orange)"></i></div>
      <h2 class="font-orb">RESET PASSWORD</h2>
      <p>A 6-digit code will be sent to your Telegram</p>
      <button class="auth-btn" id="sendCodeBtn"><i class="fab fa-telegram"></i> SEND CODE TO TELEGRAM</button>
      <div class="auth-err" id="resetReqErr"></div>
      <button class="auth-back" id="backToLogin1"><i class="fas fa-arrow-left"></i> Back to login</button>
    </div>

    <!-- STEP: RESET VERIFY -->
    <div class="auth-step" id="authResetVerify">
      <div style="font-size:36px;margin-bottom:14px"><i class="fas fa-check-double" style="color:var(--yellow)"></i></div>
      <h2 class="font-orb">VERIFY CODE</h2>
      <p>Enter the code sent to Telegram + your new password</p>
      <input type="text" class="auth-input" id="resetCode" placeholder="6-digit code" maxlength="6" autocomplete="off" style="letter-spacing:8px;font-size:18px">
      <input type="password" class="auth-input" id="newPwd" placeholder="New password" autocomplete="off" style="margin-top:10px">
      <input type="password" class="auth-input" id="newPwd2" placeholder="Confirm new password" autocomplete="off" style="margin-top:10px">
      <button class="auth-btn" id="verifyCodeBtn"><i class="fas fa-check"></i> VERIFY & RESET</button>
      <div class="auth-err" id="resetVerErr"></div>
      <button class="auth-back" id="backToResetReq"><i class="fas fa-arrow-left"></i> Back</button>
    </div>

    <!-- STEP: SUCCESS -->
    <div class="auth-step" id="authSuccess">
      <div class="auth-success-icon"><i class="fas fa-check-circle"></i></div>
      <h2 class="font-orb" style="color:var(--green)">ACCESS GRANTED</h2>
      <p style="margin-top:8px">Redirecting to dashboard...</p>
    </div>

  </div>
</div>

<div id="mainApp">
  <div id="sidebarOverlay"></div>
  <aside class="sidebar" id="sidebar">
    <div class="sb-head">
      <div class="sb-logo"><i class="fab fa-whatsapp"></i></div>
      <div class="sb-title font-orb">NEXUS AI</div>
    </div>
    <nav class="sb-nav" id="sbNav">
      <div class="nav-i active" data-s="sec-dash"><i class="fas fa-gauge-high"></i> Dashboard</div>
      <div class="nav-i" data-s="sec-msg"><i class="fas fa-comment-dots"></i> Messages</div>
      <div class="nav-i" data-s="sec-qr"><i class="fas fa-qrcode"></i> QR Link</div>
      <div class="nav-i" data-s="sec-media"><i class="fas fa-images"></i> Media Vault</div>
      <div class="nav-i" data-s="sec-reply"><i class="fas fa-robot"></i> Auto Reply AI</div>
      <div class="nav-i" data-s="sec-data"><i class="fas fa-database"></i> Data Center</div>
      <div class="nav-i" data-s="sec-analytics"><i class="fas fa-chart-line"></i> Analytics</div>
      <div class="nav-i" data-s="sec-logs"><i class="fas fa-terminal"></i> System Logs</div>
      <div class="nav-i" data-s="sec-settings"><i class="fas fa-gear"></i> Settings</div>
    </nav>
  </aside>

  <div class="content-area" id="cArea">
    <header class="top-hdr">
      <div class="hdr-l">
        <button class="hdr-btn" id="menuBtn" title="Menu"><i class="fas fa-bars"></i></button>
        <input type="text" class="hdr-search" id="hdrSearch" placeholder="Search...">
      </div>
      <div class="hdr-r">
        <button class="hdr-btn" id="themeBtn" title="Theme"><i class="fas fa-moon" id="themeIco"></i></button>
        <button class="hdr-btn" id="notifBtn" title="Notifications"><i class="fas fa-bell"></i><span class="n-dot" id="nDot"></span></button>
        <button class="hdr-btn" id="fsBtn" title="Fullscreen"><i class="fas fa-expand"></i></button>
      </div>
      <div class="notif-panel" id="nPanel">
        <div style="font-size:11px;font-weight:700;color:var(--text-2);margin-bottom:8px" class="font-orb">STATUS</div>
        <div class="nf-item"><span class="dot" id="nfSDot" style="background:var(--text-3)"></span><span id="nfSTxt">Send: Idle</span></div>
        <div class="nf-item"><span class="dot" id="nfRDot" style="background:var(--text-3)"></span><span id="nfRTxt">Reply: Idle</span></div>
        <div class="nf-item"><span class="dot" id="nfQDot" style="background:var(--text-3)"></span><span id="nfQTxt">Session: Unknown</span></div>
      </div>
    </header>

    <div class="page-content">

      <!-- DASHBOARD -->
      <div class="cs active" id="sec-dash">
        <div class="glass" style="margin-bottom:18px;background:linear-gradient(135deg,rgba(0,240,255,.05),rgba(184,41,255,.05))">
          <h2 class="font-orb" style="font-size:16px;background:linear-gradient(90deg,var(--cyan),var(--purple));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:3px">WHATSAPP NEXUS AI</h2>
          <p style="color:var(--text-2);font-size:12px">Control center \\u2014 manage and track everything</p>
        </div>
        <div class="sg">
          <div class="sc c1"><div class="si c1"><i class="fas fa-paper-plane"></i></div><div class="sv" id="dSent">0</div><div class="sl">Sent</div></div>
          <div class="sc c2"><div class="si c2"><i class="fas fa-check-circle"></i></div><div class="sv" id="dOk">0</div><div class="sl">Success</div></div>
          <div class="sc c3"><div class="si c3"><i class="fas fa-times-circle"></i></div><div class="sv" id="dFail">0</div><div class="sl">Failed</div></div>
          <div class="sc c4"><div class="si c4"><i class="fas fa-signal"></i></div><div class="sv" id="dAct">0</div><div class="sl">Active</div></div>
        </div>
        <div class="g2">
          <div class="glass glass-sm">
            <div class="g-hdr"><i class="fas fa-paper-plane" style="color:var(--cyan)"></i><h2>Send Messages</h2></div>
            <div id="sendRD" class="rd off" style="margin-bottom:10px"><span class="d"></span> Idle</div>
            <div style="display:flex;gap:8px"><button class="btn btn-c" id="sendRunBtn" style="flex:1"><i class="fas fa-play"></i> Send</button><button class="btn btn-r" id="sendStopBtn" disabled style="flex:1"><i class="fas fa-stop"></i> Stop</button></div>
          </div>
          <div class="glass glass-sm">
            <div class="g-hdr"><i class="fas fa-robot" style="color:var(--purple)"></i><h2>Auto Reply AI</h2></div>
            <div id="replyRD" class="rd off" style="margin-bottom:10px"><span class="d"></span> Idle</div>
            <div style="display:flex;gap:8px"><button class="btn btn-p" id="replyRunBtn" style="flex:1"><i class="fas fa-brain"></i> Activate</button><button class="btn btn-r" id="replyStopBtn" disabled style="flex:1"><i class="fas fa-stop"></i> Stop</button></div>
          </div>
        </div>
      </div>

      <!-- MESSAGES -->
      <div class="cs" id="sec-msg">
        <div class="g2">
          <div class="glass">
            <div class="g-hdr"><i class="fas fa-comment-dots" style="color:var(--cyan)"></i><h2>Messages</h2></div>
            <div class="g-hint">One message per line</div>
            <textarea class="ci" id="msgArea" placeholder="Type one message per line..."></textarea>
            <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-c btn-sm" id="loadMsgBtn"><i class="fas fa-download"></i> Load</button><button class="btn btn-g btn-sm" id="saveMsgBtn"><i class="fas fa-save"></i> Save</button></div>
          </div>
          <div class="glass">
            <div class="g-hdr"><i class="fas fa-address-book" style="color:var(--purple)"></i><h2>Contacts</h2></div>
            <div class="g-hint">One number per line</div>
            <textarea class="ci" id="ctArea" placeholder="Type one number per line..."></textarea>
            <div style="display:flex;gap:8px;margin-top:12px"><button class="btn btn-c btn-sm" id="loadCtBtn"><i class="fas fa-download"></i> Load</button><button class="btn btn-g btn-sm" id="saveCtBtn"><i class="fas fa-save"></i> Save</button></div>
          </div>
        </div>
      </div>

      <!-- QR LINK -->
      <div class="cs" id="sec-qr">
        <div class="glass" style="max-width:480px">
          <div class="g-hdr"><i class="fas fa-qrcode" style="color:var(--cyan)"></i><h2>QR Link Session</h2></div>
          <div class="g-hint">Link WhatsApp session by scanning QR code</div>
          <div style="display:flex;gap:20px;align-items:center;flex-wrap:wrap">
            <div>
              <div style="margin-bottom:10px;font-size:13px"><strong>Status:</strong> <span id="sessTxt" style="color:var(--text-2)">Unknown</span></div>
              <div style="display:flex;gap:8px;flex-wrap:wrap">
                <button class="btn btn-c btn-sm" id="qrRunBtn"><i class="fas fa-play"></i> Run QR</button>
                <button class="btn btn-r btn-sm" id="qrStopBtn"><i class="fas fa-stop"></i> Stop QR</button>
                <button class="btn btn-sm" id="sessRefBtn"><i class="fas fa-sync"></i> Refresh</button>
              </div>
            </div>
            <div class="qr-box"><img id="qrImg" src="" alt="QR" style="display:none"></div>
          </div>
        </div>
      </div>

      <!-- MEDIA VAULT -->
      <div class="cs" id="sec-media">
        <div class="glass">
          <div class="g-hdr"><i class="fas fa-images" style="color:var(--pink)"></i><h2>Media Vault</h2></div>
          <div class="g-hint">Maximum 3 images</div>
          <div style="background:var(--bg-input);padding:12px;border-radius:10px;border:1px dashed var(--glass-border);margin-bottom:12px">
            <input type="file" id="imgInput" accept="image/*" multiple style="width:100%;margin-bottom:8px">
            <div id="imgPreview" style="display:flex;flex-wrap:wrap;gap:8px"></div>
          </div>
          <div style="display:flex;gap:8px;margin-bottom:12px">
            <button class="btn btn-g btn-sm" id="upImgBtn"><i class="fas fa-upload"></i> Upload</button>
            <button class="btn btn-sm" id="refImgBtn"><i class="fas fa-sync"></i> Refresh</button>
          </div>
          <div id="imgGal" style="display:none">
            <div style="font-size:11px;color:var(--text-2);margin-bottom:8px">Stored (<span id="imgCnt">0</span>/3)</div>
            <div class="ig" id="imgList"></div>
          </div>
        </div>
      </div>

      <!-- AUTO REPLY AI -->
      <div class="cs" id="sec-reply">
        <div class="glass" style="max-width:480px">
          <div class="g-hdr"><i class="fas fa-robot" style="color:var(--purple)"></i><h2>Auto Reply AI Configurator</h2></div>
          <div class="g-hint">Toggle AI-powered auto reply on/off</div>
          <div id="replyRD2" class="rd off" style="margin-bottom:14px"><span class="d"></span> Idle</div>
          <div style="display:flex;gap:8px">
            <button class="btn btn-p" id="replyRunBtn2" style="flex:1"><i class="fas fa-brain"></i> Activate</button>
            <button class="btn btn-r" id="replyStopBtn2" disabled style="flex:1"><i class="fas fa-stop"></i> Stop</button>
          </div>
        </div>
      </div>

      <!-- DATA CENTER -->
      <div class="cs" id="sec-data">
        <div class="glass">
          <div class="g-hdr"><i class="fas fa-database" style="color:var(--orange)"></i><h2>Data Center \\u2014 Mylist</h2></div>
          <div class="g-hint">Manage numbers with age/gender filters \\u2014 data/mylist.json</div>
          <div class="ml-add">
            <label>Number<input type="text" class="ci" id="mlNum" placeholder="212600000000"></label>
            <label>Age<input type="number" class="ci" id="mlAge" placeholder="25" min="0" max="120"></label>
            <label>Gender<select class="ci" id="mlGen"><option value="Male">Male</option><option value="Female">Female</option></select></label>
            <button class="btn btn-g btn-sm" id="mlAddBtn" style="align-self:flex-end"><i class="fas fa-plus"></i> Add</button>
          </div>
          <div class="ml-filters">
            <select class="ci" id="mlFG" style="width:auto"><option value="all">Gender: All</option><option value="Male">Male</option><option value="Female">Female</option></select>
            <select class="ci" id="mlFA" style="width:auto"><option value="all">Age: All</option><option value="0-17">Under 18</option><option value="18-25">18-25</option><option value="25-35">25-35</option><option value="35-45">35-45</option><option value="46-200">45+</option><option value="custom">Custom</option></select>
            <span id="cAgeW" style="display:none;align-items:center;gap:4px"><input type="number" class="ci" id="mlMinA" placeholder="Min" style="width:60px;text-align:center"><span style="color:var(--text-3)">-</span><input type="number" class="ci" id="mlMaxA" placeholder="Max" style="width:60px;text-align:center"></span>
            <select class="ci" id="mlSort" style="width:auto"><option value="index-asc">Added</option><option value="age-asc">Age Asc</option><option value="age-desc">Age Desc</option><option value="number-asc">Num Asc</option><option value="number-desc">Num Desc</option></select>
            <button class="btn btn-o btn-sm" id="mlFiltBtn"><i class="fas fa-filter"></i> Filter</button>
          </div>
          <div class="ml-wrap">
            <table class="ml-tbl"><thead><tr><th style="width:32px">#</th><th>Number</th><th>Age</th><th>Gender</th><th style="width:80px">Actions</th></tr></thead><tbody id="mlBody"><tr><td colspan="5" style="text-align:center;color:var(--text-3);padding:24px">Click Load</td></tr></tbody></table>
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">
            <span id="mlCnt" style="font-size:11px;color:var(--text-2)">Total: 0 | Showing: 0</span>
            <div style="display:flex;gap:8px">
              <button class="btn btn-sm" id="mlLoadBtn"><i class="fas fa-download"></i> Load</button>
              <button class="btn btn-c btn-sm" id="mlCopyBtn"><i class="fas fa-copy"></i> Copy Shown Numbers</button>
            </div>
          </div>
        </div>
      </div>

      <!-- ANALYTICS -->
      <div class="cs" id="sec-analytics">
        <div class="glass">
          <div class="g-hdr"><i class="fas fa-chart-line" style="color:var(--cyan)"></i><h2>Analytics</h2></div>
          <div style="margin-bottom:14px"><button class="btn btn-c btn-sm" id="loadStBtn"><i class="fas fa-database"></i> Load Statistics</button></div>
          <div id="stCon" style="display:none">
            <div style="max-height:220px;overflow-y:auto;border-radius:10px;border:1px solid var(--glass-border);margin-bottom:16px">
              <table class="st-tbl"><thead><tr><th>Date</th><th>Attempted</th><th>Success</th><th>Failed</th></tr></thead><tbody id="stBody"></tbody></table>
            </div>
            <div style="background:var(--bg-deep);border-radius:10px;border:1px solid var(--glass-border);padding:16px;height:280px"><canvas id="stChart"></canvas></div>
          </div>
        </div>
      </div>

      <!-- SYSTEM LOGS -->
      <div class="cs" id="sec-logs">
        <div class="glass">
          <div class="g-hdr"><i class="fas fa-terminal" style="color:var(--green)"></i><h2>System Logs</h2></div>
          <div class="lf" id="logFiles" style="margin-bottom:12px"><span style="color:var(--text-3);font-size:11px">Click to load log files...</span></div>
          <div class="lv" id="logView">Select a log file to view content...</div>
        </div>
      </div>

      <!-- SETTINGS -->
      <div class="cs" id="sec-settings">
        <div class="g2">
          <div class="glass">
            <div class="g-hdr"><i class="fas fa-clock" style="color:var(--yellow)"></i><h2>Schedule</h2></div>
            <div class="g-hint">Morocco time (UTC-2)</div>
            <div><span class="ss off" id="schInd">Inactive</span><span id="cronDisp" style="font-size:10px;color:var(--text-3);display:block;margin-top:3px"></span></div>
            <div style="display:flex;gap:10px;margin-bottom:10px;justify-content:center">
              <label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:var(--text-2);align-items:center">Hour<input type="number" class="ci" id="hIn" min="0" max="23" value="10" style="width:65px;text-align:center"></label>
              <label style="display:flex;flex-direction:column;gap:3px;font-size:10px;color:var(--text-2);align-items:center">Min<input type="number" class="ci" id="mIn" min="0" max="59" value="0" style="width:65px;text-align:center"></label>
            </div>
            <div style="display:flex;gap:8px">
              <button class="btn btn-sm" id="loadSchBtn"><i class="fas fa-history"></i> Load</button>
              <button class="btn btn-o btn-sm" id="updSchBtn"><i class="fas fa-sync-alt"></i> Update</button>
            </div>
          </div>
          <div class="glass">
            <div class="g-hdr"><i class="fas fa-file-image" style="color:var(--pink)"></i><h2>Image List (images.json)</h2></div>
            <div class="g-hint">One path per line</div>
            <textarea class="ci" id="ilArea" placeholder="images/123_photo.jpg ..."></textarea>
            <div style="display:flex;gap:8px;margin-top:12px">
              <button class="btn btn-c btn-sm" id="loadIlBtn"><i class="fas fa-download"></i> Load</button>
              <button class="btn btn-g btn-sm" id="saveIlBtn"><i class="fas fa-save"></i> Save</button>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</div>

<script>
function toast(m,t){
  var bg=t==="ok"?"linear-gradient(135deg,#00ff88,#00c96a)":t==="err"?"linear-gradient(135deg,#ff3860,#d63031)":"linear-gradient(135deg,#00f0ff,#0099cc)";
  Toastify({text:m,duration:2500,gravity:"top",position:"center",style:{background:bg,borderRadius:"9px",fontFamily:"'Plus Jakarta Sans'",fontSize:"12px",fontWeight:"600",padding:"9px 18px",boxShadow:"0 4px 20px rgba(0,0,0,0.3)"}}).showToast();
}
function setRD(el,on,ot,ft){el.className="rd "+(on?"on":"off");el.innerHTML='<span class="d"></span> '+(on?ot:ft);}
function gB(g){return g==="Male"?'<span class="gb m">Male</span>':g==="Female"?'<span class="gb f">Female</span>':'<span class="gb u">'+(g||"\\u2014")+'</span>';}


/* LOADER */
setTimeout(function(){document.getElementById("cyberLoader").classList.add("hide");setTimeout(function(){document.getElementById("authScreen").classList.add("show");checkSession();},500);},1800);

/* AUTH HELPERS */
function showStep(id){document.querySelectorAll(".auth-step").forEach(function(s){s.classList.remove("active");});document.getElementById(id).classList.add("active");}
function authErr(el,msg){el.textContent=msg;el.style.color="var(--red)";setTimeout(function(){el.textContent="";},3000);}
function enterApp(token){localStorage.setItem("nexus_token",token);showStep("authSuccess");setTimeout(function(){document.getElementById("authScreen").classList.remove("show");document.getElementById("mainApp").classList.add("show");initApp();},800);}

/* CHECK SESSION ON LOAD */
function checkSession(){
  var token=localStorage.getItem("nexus_token");
  if(!token){fetchAuthStatus();return;}
  fetch("/api/auth/check?token="+token).then(function(r){return r.json();}).then(function(d){
    if(d.ok&&d.valid){enterApp(token);}
    else{localStorage.removeItem("nexus_token");fetchAuthStatus();}
  }).catch(function(){fetchAuthStatus();});
}

/* FETCH AUTH STATUS (setup needed?) */
function fetchAuthStatus(){
  fetch("/api/auth/status").then(function(r){return r.json();}).then(function(d){
    if(d.ok&&d.setup){showStep("authLogin");}
    else{showStep("authSetup");}
  }).catch(function(){showStep("authLogin");});
}

/* LOGIN */
document.getElementById("authLoginBtn").onclick=function(){
  var pwd=document.getElementById("authPwd").value;
  if(!pwd){authErr(document.getElementById("authErr"),"Enter your password");return;}
  var btn=this;btn.disabled=true;btn.innerHTML='<span class="auth-loader"></span> VERIFYING';
  fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:pwd})}).then(function(r){return r.json();}).then(function(d){
    if(d.ok){enterApp(d.token);}
    else{authErr(document.getElementById("authErr"),d.error||"Invalid password");document.getElementById("authPwd").style.borderColor="var(--red)";setTimeout(function(){document.getElementById("authPwd").style.borderColor="";},2000);}
    btn.disabled=false;btn.innerHTML='<i class="fas fa-key"></i> UNLOCK';
  }).catch(function(e){authErr(document.getElementById("authErr"),"Error: "+e.message);btn.disabled=false;btn.innerHTML='<i class="fas fa-key"></i> UNLOCK';});
};
document.getElementById("authPwd").addEventListener("keydown",function(e){if(e.key==="Enter")document.getElementById("authLoginBtn").click();});

/* SETUP */
document.getElementById("authSetupBtn").onclick=function(){
  var p1=document.getElementById("setupPwd").value,p2=document.getElementById("setupPwd2").value;
  if(!p1){authErr(document.getElementById("setupErr"),"Enter a password");return;}
  if(p1.length<4){authErr(document.getElementById("setupErr"),"Minimum 4 characters");return;}
  if(p1!==p2){authErr(document.getElementById("setupErr"),"Passwords do not match");return;}
  var btn=this;btn.disabled=true;btn.innerHTML='<span class="auth-loader"></span> SETTING UP';
  fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({password:p1})}).then(function(r){return r.json();}).then(function(d){
    if(d.ok){enterApp(d.token);}
    else{authErr(document.getElementById("setupErr"),d.error);}
    btn.disabled=false;btn.innerHTML='<i class="fas fa-lock"></i> SET PASSWORD';
  }).catch(function(e){authErr(document.getElementById("setupErr"),"Error: "+e.message);btn.disabled=false;btn.innerHTML='<i class="fas fa-lock"></i> SET PASSWORD';});
};

/* FORGOT -> RESET REQUEST */
document.getElementById("authForgotBtn").onclick=function(){showStep("authResetReq");};
document.getElementById("backToLogin1").onclick=function(){showStep("authLogin");};
document.getElementById("sendCodeBtn").onclick=function(){
  var btn=this;btn.disabled=true;btn.innerHTML='<span class="auth-loader"></span> SENDING';
  fetch("/api/auth/reset-request",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({})}).then(function(r){return r.json();}).then(function(d){
    if(d.ok){showStep("authResetVerify");}
    else{authErr(document.getElementById("resetReqErr"),d.error);}
    btn.disabled=false;btn.innerHTML='<i class="fab fa-telegram"></i> SEND CODE TO TELEGRAM';
  }).catch(function(e){authErr(document.getElementById("resetReqErr"),"Error: "+e.message);btn.disabled=false;btn.innerHTML='<i class="fab fa-telegram"></i> SEND CODE TO TELEGRAM';});
};

/* RESET VERIFY */
document.getElementById("verifyCodeBtn").onclick=function(){
  var code=document.getElementById("resetCode").value.trim();
  var p1=document.getElementById("newPwd").value,p2=document.getElementById("newPwd2").value;
  if(!code){authErr(document.getElementById("resetVerErr"),"Enter the code");return;}
  if(!p1){authErr(document.getElementById("resetVerErr"),"Enter new password");return;}
  if(p1.length<4){authErr(document.getElementById("resetVerErr"),"Minimum 4 characters");return;}
  if(p1!==p2){authErr(document.getElementById("resetVerErr"),"Passwords do not match");return;}
  var btn=this;btn.disabled=true;btn.innerHTML='<span class="auth-loader"></span> VERIFYING';
  fetch("/api/auth/reset-verify",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({code:code,newPassword:p1})}).then(function(r){return r.json();}).then(function(d){
    if(d.ok){
      showStep("authLogin");
      document.getElementById("authPwd").value="";
      toast("Password reset successfully! Login with your new password.","ok");
    }else{authErr(document.getElementById("resetVerErr"),d.error);}
    btn.disabled=false;btn.innerHTML='<i class="fas fa-check"></i> VERIFY & RESET';
  }).catch(function(e){authErr(document.getElementById("resetVerErr"),"Error: "+e.message);btn.disabled=false;btn.innerHTML='<i class="fas fa-check"></i> VERIFY & RESET';});
};
document.getElementById("backToResetReq").onclick=function(){showStep("authResetReq");};


/* ================================================
   SIDEBAR — clean responsive logic
   Desktop (>900px): always visible, hamburger hidden by CSS
   Mobile (<=900px): hidden by CSS, toggled via .open class
   ================================================ */
var sb=document.getElementById("sidebar");
var ov=document.getElementById("sidebarOverlay");

function isMobile(){return window.innerWidth<=900;}

function openSB(){
  sb.classList.add("open");
  ov.classList.add("show");
}

function closeSB(){
  sb.classList.remove("open");
  ov.classList.remove("show");
}

/* Hamburger button: toggle sidebar on mobile */
document.getElementById("menuBtn").onclick=function(){
  if(sb.classList.contains("open")){closeSB();}
  else{openSB();}
};

/* Click overlay to close sidebar */
ov.onclick=closeSB;

/* On resize: clean up state so CSS takes over correctly */
window.addEventListener("resize",function(){
  if(!isMobile()){
    /* Went to desktop: remove mobile-only classes, CSS shows sidebar */
    closeSB();
  }else{
    /* Went to mobile: ensure sidebar is hidden unless overlay is open */
    if(!ov.classList.contains("show")){
      sb.classList.remove("open");
    }
  }
});

/* Navigation clicks */
document.querySelectorAll(".nav-i").forEach(function(n){
  n.onclick=function(){
    document.querySelectorAll(".nav-i").forEach(function(x){x.classList.remove("active");});
    this.classList.add("active");
    document.querySelectorAll(".cs").forEach(function(x){x.classList.remove("active");});
    document.getElementById(this.getAttribute("data-s")).classList.add("active");
    /* On mobile, close sidebar after navigation */
    if(isMobile()){closeSB();}
  };
});
document.getElementById("hdrSearch").oninput=function(){var q=this.value.toLowerCase();document.querySelectorAll(".nav-i").forEach(function(n){n.style.display=n.textContent.toLowerCase().includes(q)?"flex":"none";});};

/* HEADER */
var isDk=true;
document.getElementById("themeBtn").onclick=function(){isDk=!isDk;document.body.classList.toggle("light-mode",!isDk);document.getElementById("themeIco").className=isDk?"fas fa-moon":"fas fa-sun";if(stCI){stCI.destroy();stCI=null;}var sc=document.getElementById("stCon");if(sc.style.display!=="none")document.getElementById("loadStBtn").click();};
var nOpen=false;
document.getElementById("notifBtn").onclick=function(e){e.stopPropagation();nOpen=!nOpen;document.getElementById("nPanel").classList.toggle("show",nOpen);};
document.addEventListener("click",function(){if(nOpen){nOpen=false;document.getElementById("nPanel").classList.remove("show");}});
document.getElementById("fsBtn").onclick=function(){if(!document.fullscreenElement)document.documentElement.requestFullscreen();else document.exitFullscreen();};

function updNf(){var a=sendRun||replyRun;document.getElementById("nDot").classList.toggle("show",a);document.getElementById("nfSDot").style.background=sendRun?"var(--green)":"var(--text-3)";document.getElementById("nfSTxt").textContent="Send: "+(sendRun?"Running":"Idle");document.getElementById("nfRDot").style.background=replyRun?"var(--green)":"var(--text-3)";document.getElementById("nfRTxt").textContent="Reply: "+(replyRun?"Running":"Idle");}

/* INIT */
function initApp(){loadDash();chkSend();chkReply();refSess();loadML();loadImg();loadSch();loadLogF();}

/* FILE IO */
function loadF(t,a){toast("Loading...","info");fetch("/api/load?type="+t).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);a.value=d.text;toast("Loaded","ok");}).catch(function(e){toast("Error: "+e.message,"err");});}
function saveF(t,a){toast("Saving...","info");fetch("/api/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({type:t,text:a.value})}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Saved","ok");}).catch(function(e){toast("Error: "+e.message,"err");});}
document.getElementById("loadMsgBtn").onclick=function(){loadF("messages",document.getElementById("msgArea"));};
document.getElementById("saveMsgBtn").onclick=function(){saveF("messages",document.getElementById("msgArea"));};
document.getElementById("loadCtBtn").onclick=function(){loadF("contacts",document.getElementById("ctArea"));};
document.getElementById("saveCtBtn").onclick=function(){saveF("contacts",document.getElementById("ctArea"));};
document.getElementById("loadIlBtn").onclick=function(){loadF("images",document.getElementById("ilArea"));};
document.getElementById("saveIlBtn").onclick=function(){saveF("images",document.getElementById("ilArea"));};

/* SEND */
var sendRun=false;
function bindS(rid,sid){document.getElementById(rid).onclick=function(){var b=this;b.disabled=true;toast("Starting send...","info");fetch("/api/send/run",{method:"POST"}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Send started","ok");setTimeout(chkSend,5000);}).catch(function(e){toast("Error: "+e.message,"err");b.disabled=false;});};document.getElementById(sid).onclick=function(){var b=this;b.disabled=true;toast("Stopping send...","info");fetch("/api/send/stop",{method:"POST"}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Send stopped","ok");}).catch(function(e){toast("Error: "+e.message,"err");b.disabled=false;});};}
bindS("sendRunBtn","sendStopBtn");
function chkSend(){fetch("/api/send/status").then(function(r){return r.json();}).then(function(d){sendRun=d.ok&&d.running;setRD(document.getElementById("sendRD"),sendRun,"Sending...","Idle");document.getElementById("sendRunBtn").disabled=sendRun;document.getElementById("sendStopBtn").disabled=!sendRun;updNf();if(sendRun)setTimeout(chkSend,15000);}).catch(function(){document.getElementById("sendRunBtn").disabled=false;});}

/* REPLY */
var replyRun=false;
function bindR(rid,sid){document.getElementById(rid).onclick=function(){var b=this;b.disabled=true;toast("Activating reply AI...","info");fetch("/api/reply/run",{method:"POST"}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Reply AI activated","ok");setTimeout(chkReply,5000);}).catch(function(e){toast("Error: "+e.message,"err");b.disabled=false;});};document.getElementById(sid).onclick=function(){var b=this;b.disabled=true;toast("Stopping reply AI...","info");fetch("/api/reply/stop",{method:"POST"}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Reply AI stopped","ok");}).catch(function(e){toast("Error: "+e.message,"err");b.disabled=false;});};}
bindR("replyRunBtn","replyStopBtn");bindR("replyRunBtn2","replyStopBtn2");
function chkReply(){fetch("/api/reply/status").then(function(r){return r.json();}).then(function(d){replyRun=d.ok&&d.running;setRD(document.getElementById("replyRD"),replyRun,"AI Active","Idle");setRD(document.getElementById("replyRD2"),replyRun,"AI Active","Idle");document.getElementById("replyRunBtn").disabled=replyRun;document.getElementById("replyStopBtn").disabled=!replyRun;document.getElementById("replyRunBtn2").disabled=replyRun;document.getElementById("replyStopBtn2").disabled=!replyRun;updNf();if(replyRun)setTimeout(chkReply,15000);}).catch(function(){document.getElementById("replyRunBtn").disabled=false;document.getElementById("replyRunBtn2").disabled=false;});}

/* DASH */
function loadDash(){fetch("/api/stats").then(function(r){return r.json();}).then(function(d){if(!d.ok||!d.data||!d.data.length)return;var l=d.data[d.data.length-1];document.getElementById("dSent").textContent=l.attempted||0;document.getElementById("dOk").textContent=l.success||0;document.getElementById("dFail").textContent=l.failed||0;document.getElementById("dAct").textContent=(sendRun?1:0)+(replyRun?1:0);}).catch(function(){});}

/* QR/SESSION */
function refSess(){fetch("/api/session/status").then(function(r){return r.json();}).then(function(d){if(d.ok){var s=d.status||"Unknown",el=document.getElementById("sessTxt");el.textContent=s;el.style.color=s==="connected"?"var(--green)":s==="waiting_scan"?"var(--yellow)":"var(--text-2)";document.getElementById("nfQDot").style.background=s==="connected"?"var(--green)":"var(--text-3)";document.getElementById("nfQTxt").textContent="Session: "+s;}}).catch(function(){});fetch("/api/session/qr").then(function(r){return r.json();}).then(function(d){var img=document.getElementById("qrImg");if(d.ok&&d.qr){img.src=d.qr;img.style.display="block";}else img.style.display="none";}).catch(function(){});}
document.getElementById("sessRefBtn").onclick=refSess;
document.getElementById("qrRunBtn").onclick=function(){toast("Starting QR...","info");fetch("/api/qr/run",{method:"POST"}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("QR started","ok");setTimeout(refSess,3000);}).catch(function(e){toast("Error: "+e.message,"err");});};
document.getElementById("qrStopBtn").onclick=function(){toast("Stopping QR...","info");fetch("/api/qr/stop",{method:"POST"}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("QR stopped","ok");setTimeout(refSess,2000);}).catch(function(e){toast("Error: "+e.message,"err");});};
setInterval(refSess,30000);

/* IMAGES */
var selFiles=[],imgIn=document.getElementById("imgInput");
imgIn.addEventListener("change",function(){selFiles=Array.from(this.files);renderPrev();});
function renderPrev(){var a=document.getElementById("imgPreview");a.innerHTML="";selFiles.forEach(function(f,i){var r=new FileReader();r.onload=function(ev){var d=document.createElement("div");d.style.cssText="width:65px;height:65px;border-radius:8px;overflow:hidden;position:relative;border:1px solid var(--glass-border)";d.innerHTML='<img src="'+ev.target.result+'" style="width:100%;height:100%;object-fit:cover"><button data-i="'+i+'" style="position:absolute;top:2px;right:2px;background:var(--red);color:#fff;border:none;border-radius:50%;width:16px;height:16px;cursor:pointer;font-size:8px">X</button>';a.appendChild(d);d.querySelector("button").onclick=function(){selFiles.splice(i,1);renderPrev();};};r.readAsDataURL(f);});}
function loadImg(){var gal=document.getElementById("imgGal"),list=document.getElementById("imgList"),cnt=document.getElementById("imgCnt");fetch("/api/images").then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);var files=d.files||[];cnt.textContent=files.length;if(!files.length){gal.style.display="none";return;}gal.style.display="block";list.innerHTML="";files.forEach(function(f){var d=document.createElement("div");d.className="ic";var img=document.createElement("img");img.src=f.download_url;var del=document.createElement("button");del.className="del";del.innerHTML='<i class="fas fa-trash"></i>';del.onclick=function(){Swal.fire({title:"Delete image?",text:f.name,icon:"warning",showCancelButton:true,confirmButtonText:"Delete",cancelButtonText:"Cancel",confirmButtonColor:"#ff3860",background:"var(--bg-card)",color:"var(--text-1)"}).then(function(res){if(!res.isConfirmed)return;fetch("/api/delete-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:f.name})}).then(function(r){return r.json();}).then(function(dd){if(!dd.ok)throw new Error(dd.error);d.remove();var nc=parseInt(cnt.textContent)-1;cnt.textContent=nc;if(!nc)gal.style.display="none";toast("Deleted","ok");}).catch(function(e){toast("Error: "+e.message,"err");});});};d.appendChild(img);d.appendChild(del);list.appendChild(d);});}).catch(function(){gal.style.display="none";});}
document.getElementById("refImgBtn").onclick=loadImg;
document.getElementById("upImgBtn").onclick=function(){if(!selFiles.length){toast("Select images first","err");return;}fetch("/api/images").then(function(r){return r.json();}).then(function(d){var cc=d.files?d.files.length:0;if(cc>=3){toast("Max 3 images","err");return;}var rem=3-cc;if(selFiles.length>rem){toast("Only "+rem+" more allowed","err");return;}var ok=0,ch=Promise.resolve();selFiles.forEach(function(f){ch=ch.then(function(){return new Promise(function(res){var r=new FileReader();r.onload=function(){res(r.result.split(",")[1]);};r.readAsDataURL(f);});}).then(function(b64){return fetch("/api/upload-image",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({filename:f.name,dataBase64:b64})}).then(function(r){return r.json();});}).then(function(d){if(d.ok)ok++;});});ch.then(function(){toast(ok+"/"+selFiles.length+" uploaded",ok===selFiles.length?"ok":"err");if(ok===selFiles.length){selFiles=[];imgIn.value="";renderPrev();}loadImg();});}).catch(function(e){toast("Error: "+e.message,"err");});};

/* MYLIST */
var mlFull=[],mlFilt=[],mlBody=document.getElementById("mlBody");
document.getElementById("mlFA").onchange=function(){document.getElementById("cAgeW").style.display=this.value==="custom"?"inline-flex":"none";};
function getMLP(){var p=new URLSearchParams();p.set("gender",document.getElementById("mlFG").value);var av=document.getElementById("mlFA").value;if(av==="custom"){var mn=document.getElementById("mlMinA").value,mx=document.getElementById("mlMaxA").value;if(mn!=="")p.set("minAge",mn);if(mx!=="")p.set("maxAge",mx);}else if(av!=="all"){var pts=av.split("-");p.set("minAge",pts[0]);p.set("maxAge",pts[1]);}var sv=document.getElementById("mlSort").value,sp=sv.split("-");p.set("sort",sp[0]);p.set("order",sp[1]);return p;}
function renderML(data){if(!data||!data.length){mlBody.innerHTML='<tr><td colspan="5" style="text-align:center;color:var(--text-3);padding:24px">No data</td></tr>';return;}mlBody.innerHTML="";data.forEach(function(it,i){var tr=document.createElement("tr");tr.setAttribute("data-index",it._index);tr.innerHTML='<td style="color:var(--text-3)">'+(i+1)+'</td><td style="direction:ltr;text-align:left;font-family:Consolas,monospace;font-size:11px">'+(it.number||"")+'</td><td>'+(it.age||0)+'</td><td>'+gB(it.gender)+'</td><td><button class="btn btn-c btn-sm me" data-idx="'+it._index+'"><i class="fas fa-pen"></i></button> <button class="btn btn-r btn-sm md" data-idx="'+it._index+'"><i class="fas fa-trash"></i></button></td>';mlBody.appendChild(tr);});mlBody.querySelectorAll(".md").forEach(function(b){b.onclick=function(){var idx=parseInt(this.getAttribute("data-idx"));Swal.fire({title:"Delete this number?",icon:"warning",showCancelButton:true,confirmButtonText:"Delete",cancelButtonText:"Cancel",confirmButtonColor:"#ff3860",background:"var(--bg-card)",color:"var(--text-1)"}).then(function(res){if(!res.isConfirmed)return;fetch("/api/mylist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"delete",index:idx})}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Deleted","ok");loadML();}).catch(function(e){toast("Error: "+e.message,"err");});});};});mlBody.querySelectorAll(".me").forEach(function(b){b.onclick=function(){var idx=parseInt(this.getAttribute("data-idx")),it=mlFull[idx];if(!it)return;var tr=this.closest("tr");tr.innerHTML='<td style="color:var(--text-3)">'+(Array.from(mlBody.children).indexOf(tr)+1)+'</td><td><input class="edt" id="eN" value="'+(it.number||"")+'"></td><td><input class="edt" type="number" id="eA" value="'+(it.age||0)+'" min="0" max="120" style="width:65px"></td><td><select class="edt" id="eG" style="width:75px"><option value="Male"'+(it.gender==="Male"?" selected":"")+'>Male</option><option value="Female"'+(it.gender==="Female"?" selected":"")+'>Female</option></select></td><td><button class="btn btn-g btn-sm ms" data-idx="'+idx+'"><i class="fas fa-check"></i></button> <button class="btn btn-sm mc"><i class="fas fa-times"></i></button></td>';tr.querySelector(".ms").onclick=function(){fetch("/api/mylist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"update",index:idx,number:document.getElementById("eN").value,age:document.getElementById("eA").value,gender:document.getElementById("eG").value})}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Updated","ok");loadML();}).catch(function(e){toast("Error: "+e.message,"err");});};tr.querySelector(".mc").onclick=function(){loadML();};};});}
function loadML(){var params=getMLP();fetch("/api/mylist?"+params.toString()).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);mlFilt=d.data||[];return fetch("/api/mylist?sort=index&order=asc").then(function(r2){return r2.json();});}).then(function(d2){mlFull=d2.data||[];renderML(mlFilt);document.getElementById("mlCnt").textContent="Total: "+mlFull.length+" | Showing: "+mlFilt.length;}).catch(function(e){toast("Error: "+e.message,"err");});}
document.getElementById("mlAddBtn").onclick=function(){var num=document.getElementById("mlNum").value.trim();var age=parseInt(document.getElementById("mlAge").value)||0;var gen=document.getElementById("mlGen").value;if(!num){toast("Enter a number","err");return;}toast("Adding...","info");fetch("/api/mylist",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({action:"add",number:num,age:age,gender:gen})}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Added","ok");document.getElementById("mlNum").value="";document.getElementById("mlAge").value="";loadML();}).catch(function(e){toast("Error: "+e.message,"err");});};
document.getElementById("mlFiltBtn").onclick=loadML;
document.getElementById("mlLoadBtn").onclick=loadML;
document.getElementById("mlCopyBtn").onclick=function(){if(!mlFilt.length){toast("No numbers to copy","err");return;}var nums=mlFilt.map(function(it){return it.number;}).join(String.fromCharCode(10));navigator.clipboard.writeText(nums).then(function(){toast("Copied "+mlFilt.length+" numbers","ok");}).catch(function(){toast("Copy failed","err");});};

/* SCHEDULE */
function loadSch(){fetch("/api/schedule").then(function(r){return r.json();}).then(function(d){if(d.ok){document.getElementById("hIn").value=d.hour||10;document.getElementById("mIn").value=d.minute||0;document.getElementById("schInd").className="ss "+(d.active?"on":"off");document.getElementById("schInd").textContent=d.active?"Active":"Inactive";document.getElementById("cronDisp").textContent=d.cron||"";}}).catch(function(){});}
document.getElementById("loadSchBtn").onclick=loadSch;
document.getElementById("updSchBtn").onclick=function(){var h=parseInt(document.getElementById("hIn").value)||0;var m=parseInt(document.getElementById("mIn").value)||0;toast("Updating schedule...","info");fetch("/api/schedule",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({hour:h,minute:m})}).then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);toast("Schedule updated","ok");loadSch();}).catch(function(e){toast("Error: "+e.message,"err");});};

/* LOG FILES */
function loadLogF(){fetch("/api/logs").then(function(r){return r.json();}).then(function(d){if(!d.ok||!d.files||!d.files.length){document.getElementById("logFiles").innerHTML='<span style="color:var(--text-3);font-size:11px">No log files found</span>';return;}var cont=document.getElementById("logFiles");cont.innerHTML="";d.files.forEach(function(f){var btn=document.createElement("button");btn.className="lfb";btn.textContent=f;btn.onclick=function(){cont.querySelectorAll(".lfb").forEach(function(b){b.classList.remove("active");});this.classList.add("active");toast("Loading log...","info");fetch("/api/logs?file="+encodeURIComponent(f)).then(function(r){return r.json();}).then(function(d2){if(!d2.ok)throw new Error(d2.error);document.getElementById("logView").textContent=d2.content||"(empty)";toast("Log loaded","ok");}).catch(function(e){toast("Error: "+e.message,"err");});};cont.appendChild(btn);});}).catch(function(){document.getElementById("logFiles").innerHTML='<span style="color:var(--text-3);font-size:11px">Failed to load log files</span>';});}

/* ANALYTICS / CHART */
var stCI=null;
document.getElementById("loadStBtn").onclick=function(){toast("Loading statistics...","info");fetch("/api/stats").then(function(r){return r.json();}).then(function(d){if(!d.ok)throw new Error(d.error);var data=d.data||[];if(!data.length){toast("No data","err");return;}document.getElementById("stCon").style.display="block";var tbody=document.getElementById("stBody");tbody.innerHTML="";data.forEach(function(r){var tr=document.createElement("tr");tr.innerHTML="<td>"+(r.date||"")+"</td><td>"+(r.attempted||0)+"</td><td style='color:var(--green)'>"+(r.success||0)+"</td><td style='color:var(--red)'>"+(r.failed||0)+"</td>";tbody.appendChild(tr);});if(stCI){stCI.destroy();stCI=null;}var ctx=document.getElementById("stChart").getContext("2d");var textColor=getComputedStyle(document.body).getPropertyValue("--text-2").trim()||"#7878aa";var gridColor=getComputedStyle(document.body).getPropertyValue("--glass-border").trim()||"rgba(0,240,255,0.12)";stCI=new Chart(ctx,{type:"line",data:{labels:data.map(function(r){return r.date||"";}),datasets:[{label:"Attempted",data:data.map(function(r){return r.attempted||0;}),borderColor:"#00f0ff",backgroundColor:"rgba(0,240,255,0.1)",tension:0.3,fill:true},{label:"Success",data:data.map(function(r){return r.success||0;}),borderColor:"#00ff88",backgroundColor:"rgba(0,255,136,0.1)",tension:0.3,fill:true},{label:"Failed",data:data.map(function(r){return r.failed||0;}),borderColor:"#ff3860",backgroundColor:"rgba(255,56,96,0.1)",tension:0.3,fill:true}]},options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{labels:{color:textColor,font:{size:10}}}},scales:{x:{ticks:{color:textColor,font:{size:9}},grid:{color:gridColor}},y:{ticks:{color:textColor,font:{size:9}},grid:{color:gridColor},beginAtZero:true}}}});toast("Statistics loaded","ok");}).catch(function(e){toast("Error: "+e.message,"err");});};
</script>
</body>
</html>`;
