# AdShield CoreKit

AdShield CoreKit is a client-side **Ad/Tracker Benchmark Dashboard**. It collects resource URLs from any web page, runs them through EasyList/EasyPrivacy, and visualizes how advertising and tracking signals appear on the page. Everything runs in the browser—perfect for GitHub Pages.

## Features
- 🌐 Client-only benchmarking (Vite + React + TypeScript)
- 🔍 Real EasyList-compatible filter engine (cached for 24h)
- 📡 Resource harvesting via Performance API, DOM scraping, and sandboxed iframes
- 🧭 DOM heuristic scanner for ad slots and trackers
- 🧠 Blended Protection Score (BPS) summarizing network + DOM risk
- 🌎 Visitor IP/Geo/ISP with VPN/Proxy heuristic
- 🌓 Modern, responsive UI with history & comparison
- 🚀 Ready for GitHub Pages (base path + deploy workflow)

## How the benchmark works
1. **List loading**: EasyList + EasyPrivacy are fetched and cached locally for 24 hours.
2. **Resource collection**: The target URL is fetched when CORS allows. An invisible sandboxed iframe plus the Performance API gather resource URLs (scripts, images, iframes, media, links).
3. **Filter matching**: Each collected URL is evaluated against the filter engine to flag likely ad/tracker requests.
4. **DOM heuristics**: The HTML snapshot is parsed and scanned for ad-like containers (keyword classes/ids, common banner sizes, iframes/ins/aside blocks).
5. **Scoring**:
   - **ARD**: Ad Request Density (percentage of resources matching filters)
   - **ADE**: Ad DOM Exposure (normalized count of ad-like nodes)
   - **BPS**: Blended Protection Score = 60% ARD + 40% ADE
6. **Notes**: Limitations and collection issues are surfaced in the UI.

### Technical constraints & limitations
- Runs 100% in the browser—no proxying or headless crawler. Some sites block cross-origin fetch/iframe.
- Resource capture is best-effort; iframes may hide subresources and interactive ads.
- VPN/Proxy detection is heuristic (IP privacy flags or common datacenter ASNs).

## Visitor IP/GEO/VPN detection
- IP via `https://api.ipify.org?format=json`
- Geo/ISP/ASN via `https://ipapi.co/{ip}/json/`
- VPN/Proxy flags come from provider privacy fields or heuristic matches against common datacenter ISPs.

## Running locally
```bash
npm install
npm run dev
```
Open http://localhost:5173 to use the dashboard.

Build for production:
```bash
npm run build
npm run preview
```

## Deploying to GitHub Pages
The project is configured with `base: "/AdShield-CoreKit/"` and a GitHub Actions workflow to build and publish `dist` to the `gh-pages` branch.

Manual deploy (optional):
```bash
npm run deploy
```

## Roadmap
- Better iframe instrumentation for third-party iframes
- Offline list updates packaged with releases
- Optional user-provided HTML snapshots for blocked pages

---

## آدشیلد کورکیت (Persian)
**آدشیلد کورکیت** یک داشبورد ارزیابی تبلیغات و ردیاب‌ها است که به صورت کامل در مرورگر اجرا می‌شود. لینک صفحه موردنظر را وارد کنید تا منابع لود‌شده جمع‌آوری و با EasyList/EasyPrivacy بررسی شوند و نتیجه به همراه امتیاز محافظتی نمایش داده شود.

### ویژگی‌ها
- بدون نیاز به بک‌اند؛ مناسب برای GitHub Pages
- موتور فیلتر واقعی و سازگار با EasyList
- جمع‌آوری منابع از DOM، Performance API و آی‌فریم سندباکس
- تشخیص تجربی عناصر تبلیغاتی در DOM
- نمایش IP، کشور، ISP و حدس VPN/Proxy
- رابط کاربری مدرن، واکنش‌گرا با تاریخچه و مقایسه سایت‌ها

### نحوه کار
1. دانلود و کش EasyList/EasyPrivacy (به مدت ۲۴ ساعت در مرورگر)
2. تلاش برای دریافت HTML با CORS؛ در صورت امکان لود در آی‌فریم مخفی برای جمع‌آوری منابع
3. تطبیق لینک‌ها با قوانین تبلیغاتی
4. اسکن DOM برای عناصر مشکوک به تبلیغات
5. محاسبه امتیازهای ARD، ADE و BPS

### اجرای محلی
```bash
npm install
npm run dev
```

### محدودیت‌ها
- برخی سایت‌ها دسترسی CORS یا لود در آی‌فریم را مسدود می‌کنند.
- جمع‌آوری ترافیک دقیق مانند افزونه‌های مسدودکننده ممکن نیست و نتایج تقریبی است.

## مجوز
کد تحت مجوز MIT منتشر شده است. مشارکت‌ها استقبال می‌شود.
