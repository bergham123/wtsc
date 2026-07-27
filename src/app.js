// src/app.js
import { initRouter } from './router.js';
import { showToast, isLoggedIn } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  // إذا كان المستخدم مسجلاً بالفعل، نضيف المفتاح إلى جميع الطلبات (سيتم إضافته في getHeaders)
  initRouter();

  // إظهار ترحيب
  if (isLoggedIn()) {
    showToast('مرحباً بك في لوحة التحكم', 'success');
  }
});
