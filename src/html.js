// src/html.js
export const HTML_PAGE = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>WhatsApp Manager Dashboard</title>
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
    --info: #53BDEB;
    --input-bg: #2A3942;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Tajawal', sans-serif;
    background: var(--bg-main);
    color: var(--text-main);
    min-height: 100vh;
    display: flex;
    gap: 0;
  }

  .sidebar {
    width: 300px;
    background: var(--card-bg);
    height: 100vh;
    position: sticky;
    top: 0;
    display: flex;
    flex-direction: column;
    padding: 24px;
    border-left: 1px solid var(--border-color);
    flex-shrink: 0;
    transition: transform 0.3s ease;
    overflow-y: auto;
  }
  .sidebar-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
  }
  .logo-icon {
    width: 40px; height: 40px;
    background: var(--accent);
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    font-size: 20px; color: #111B21;
  }
  .logo-text { font-size: 18px; font-weight: 800; }
  .logo-text span { color: var(--accent); }

  .nav-cards {
    display: flex;
    flex-direction: column;
    gap: 16px;
    flex-grow: 1;
  }
  .sidebar-card {
    background: var(--bg-main);
    border: 1px solid var(--border-color);
    border-radius: 10px;
    padding: 16px;
    transition: border-color 0.3s;
  }
  .sidebar-card:hover { border-color: var(--accent); }

  .main-content {
    flex: 1;
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    max-width: calc(100% - 300px);
    width: 100%;
  }

  .content-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
  }
  @media (max-width: 1024px) {
    body { flex-direction: column; }
    .sidebar { width: 100%; height: auto; position: relative; border-left: none; border-bottom: 1px solid var(--border-color); }
    .main-content { max-width: 100%; padding: 20px; }
    .content-grid { grid-template-columns: 1fr; }
  }

  .card {
    background: var(--card-bg);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    padding: 24px;
    transition: border-color 0.3s ease;
  }
  .card:hover { border-color: rgba(37, 211, 102, 0.4); }
  .card-header { display: flex; align-items: center; gap: 12px; margin-bottom: 8px; }
  .card-header i { font-size: 18px; color: var(--accent); }
  .card-header h2 { font-size: 16px; font-weight: 700; }
  .card-hint { color: var(--text-muted); font-size: 12px; margin-bottom: 16px; }

  textarea {
    width: 100%;
    min-height: 140px;
    background: var(--input-bg);
    color: var(--text-main);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    padding: 12px;
    font-family: 'Consolas', monospace;
    font-size:
