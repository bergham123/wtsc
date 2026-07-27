// src/utils.js

export function getHeaders() {
  const apiKey = localStorage.getItem('api_secret') || '';
  return {
    'Content-Type': 'application/json',
    'X-API-Key': apiKey
  };
}

export function setStatus(el, msg, type) {
  el.textContent = msg;
  el.className = 'status' + (type ? ' ' + type : '');
}

export function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.innerHTML = `<span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    if (toast.parentNode) toast.remove();
  }, duration);
}

export function isLoggedIn() {
  const apiKey = localStorage.getItem('api_secret');
  return apiKey && apiKey.length > 0;
}

export function logout() {
  localStorage.removeItem('api_secret');
  window.location.hash = '#login';
}

export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' });
}

export function copyToClipboard(text) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    return navigator.clipboard.writeText(text);
  } else {
    return new Promise((resolve, reject) => {
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        resolve();
      } catch (e) { reject(e); }
      ta.remove();
    });
  }
}
