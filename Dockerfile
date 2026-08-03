# استخدام نسخة لينكس خفيفة ومستقرة
FROM node:20-slim

# تثبيت متصفح Chromium وجميع المكتبات التي يحتاجها للعمل بدون أخطاء
RUN apt-get update && apt-get install -y \
    chromium \
    libnss3 \
    libnspr4 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libdrm2 \
    libxkbcommon0 \
    libxcomposite1 \
    libxdamage1 \
    libxfixes3 \
    libxrandr2 \
    libgbm-dev \
    libasound2 \
    libpango-1.0-0 \
    libcairo2 \
    libatspi2.0-0 \
    --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# إعداد متغيرات البيئة ليستخدم البوت متصفح Chromium المثبت
ENV PUPPETEER_SKIP_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# إعداد مجلد العمل داخل الحاوية
WORKDIR /app

# نسخ ملفات المشروع وتثبيت المكتبات
COPY package*.json ./
RUN npm install

# نسخ باقي ملفات السكربت
COPY . .

# أمر التشغيل
CMD ["node", "index.js"]
