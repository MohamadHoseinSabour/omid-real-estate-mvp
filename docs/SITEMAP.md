# Site Map & URL Structure

## Public Pages (Static — GitHub Pages)

```
/                           → صفحه خانه (Home)
├── /properties/            → لیست املاک (Property Listing)
│   └── /properties/<slug>/ → جزئیات ملک (Property Detail)
├── /blog/                  → لیست مقالات (Blog Index)
│   └── /blog/<slug>/       → مقاله (Blog Post)
├── /about/                 → درباره ما (About Us)
├── /contact/               → تماس با ما (Contact)
├── /privacy/               → حریم خصوصی (Privacy Policy)
├── /terms/                 → قوانین استفاده (Terms of Service)
├── /thanks/                → ممنون از ارسال فرم (Thank You)
├── /404.html               → صفحه خطای ۴۰۴
├── /sitemap.xml            → نقشه سایت XML
└── /robots.txt             → فایل robots
```

## Dashboard Pages (SPA — Supabase Auth)

```
/dashboard/                     → ورود / صفحه اصلی داشبورد
├── /dashboard/login/           → صفحه ورود
├── /dashboard/properties/      → مدیریت املاک
│   ├── /dashboard/properties/new/      → ثبت ملک جدید
│   └── /dashboard/properties/<id>/     → ویرایش ملک
├── /dashboard/leads/           → لیست لیدها (منشی + مدیرکل)
├── /dashboard/sales/           → فروش‌ها
│   └── /dashboard/sales/new/           → ثبت فروش جدید
├── /dashboard/wallet/          → کیف پول (مشاور: خودش / مدیرکل: همه)
├── /dashboard/reports/         → گزارش‌ها (مدیرکل)
└── /dashboard/settings/        → تنظیمات (نرخ کمیسیون — فقط مدیرکل)
```

## URL Conventions

- **Slug format:** `kebab-case` بر اساس عنوان فارسی ملک/مقاله
- **Trailing slash:** همیشه `/` در انتهای URL
- **Canonical:** هر صفحه URL canonical خودش را دارد
- **Base URL:** `https://mohamadhoseinsabour.github.io/omid-real-estate-mvp/`

## Navigation Structure

### هدر عمومی
```
لوگو/نام | خانه | املاک | وبلاگ | درباره ما | تماس با ما | [دکمه: درخواست مشاوره]
```

### فوتر عمومی
```
اطلاعات آژانس | لینک‌های سریع | تماس | شبکه‌های اجتماعی | حریم خصوصی | قوانین
```

### منوی داشبورد (بر اساس نقش)
| آیتم | مشاور | منشی | مدیرکل |
|---|---|---|---|
| املاک من / همه | ✅ (من) | ✅ (همه) | ✅ (همه) |
| لیدها | ❌ | ✅ | ✅ |
| ثبت فروش | ✅ | ❌ | ✅ |
| کیف پول | ✅ (خودش) | ❌ | ✅ (همه) |
| گزارش‌ها | ✅ (خودش) | ❌ | ✅ (همه) |
| تنظیمات | ❌ | ❌ | ✅ |
| خروج | ✅ | ✅ | ✅ |

---

*تاریخ ایجاد: 2026-10-08*
