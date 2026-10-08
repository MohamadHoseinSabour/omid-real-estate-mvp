# Data Model

> همه مبالغ به **تومان** و به‌صورت **عدد صحیح** (بدون float) ذخیره می‌شوند.
> تاریخ‌ها با `timestamptz` (UTC) ذخیره و در UI به شمسی نمایش داده می‌شوند.

## Entity Relationship Diagram

```mermaid
erDiagram
    profiles ||--o{ properties : "advisor_id"
    profiles ||--o{ sales : "advisor_id"
    profiles ||--o{ wallet_transactions : "advisor_id"
    properties ||--o{ leads : "property_id"
    properties ||--o{ sales : "property_id"
    sales ||--o{ wallet_transactions : "sale_id"

    profiles {
        uuid id PK "= auth.users.id"
        text full_name
        text phone
        text email
        text avatar_url
        enum role "advisor | secretary | admin"
        boolean is_active
        timestamptz created_at
        timestamptz updated_at
    }

    properties {
        uuid id PK
        uuid advisor_id FK
        text title
        text slug "unique, kebab-case"
        text description
        text address
        text neighborhood "محله"
        bigint price_toman "عدد صحیح — تومان"
        int area_sqm "متر مربع"
        int bedrooms
        int year_built
        float latitude
        float longitude
        enum status "available | negotiating | sold"
        text[] image_urls
        jsonb features "ویژگی‌ها: پارکینگ، آسانسور..."
        enum property_type "apartment | villa | land | commercial"
        boolean is_public "true = نمایش در سایت عمومی"
        boolean sample "true = داده نمونه"
        timestamptz created_at
        timestamptz updated_at
    }

    leads {
        uuid id PK
        uuid property_id FK "nullable — ممکن است مستقل باشد"
        text full_name
        text phone
        text email
        text message
        enum request_type "buy | sell | consult | contact"
        enum source "consult_form | contact_form | social | ad"
        enum status "new | contacted | converted | closed"
        text notes
        boolean sample
        timestamptz created_at
        timestamptz updated_at
    }

    sales {
        uuid id PK
        uuid property_id FK
        uuid advisor_id FK
        text buyer_name
        text buyer_phone
        bigint final_price_toman
        bigint total_commission_toman
        numeric commission_rate_snapshot "نرخ لحظه فروش — ذخیره شده"
        bigint advisor_share_toman "= total_commission × rate"
        timestamptz sale_date
        boolean sample
        timestamptz created_at
    }

    wallet_transactions {
        uuid id PK
        uuid advisor_id FK
        uuid sale_id FK "nullable"
        bigint amount_toman "همیشه مثبت — فقط افزودنی"
        text description
        enum type "commission | bonus | adjustment"
        boolean sample
        timestamptz created_at
    }

    commission_settings {
        uuid id PK
        numeric default_rate "مثلاً 0.30 = 30%"
        timestamptz updated_at
        uuid updated_by FK
    }
```

## Public vs Private Fields

فیلدهای زیر در خروجی استاتیک سایت عمومی نمایش داده می‌شوند:

### properties (عمومی — فقط اگر `is_public = true`)
- `title`, `slug`, `description`, `address`, `neighborhood`
- `price_toman`, `area_sqm`, `bedrooms`, `year_built`
- `latitude`, `longitude`, `status`, `image_urls`
- `features`, `property_type`

### properties (خصوصی — فقط داشبورد)
- `advisor_id`, `is_public`, `sample`, `created_at`, `updated_at`

### leads, sales, wallet_transactions
- **هیچ فیلدی** در سایت عمومی نمایش داده نمی‌شود. فقط در داشبورد.

### profiles (عمومی — صفحه درباره ما)
- `full_name`, `avatar_url` (فقط مشاوران فعال)

### profiles (خصوصی)
- `phone`, `email`, `role`, `is_active`

## Indexes (Recommended)

```sql
-- Properties
CREATE INDEX idx_properties_status ON properties(status) WHERE is_public = true;
CREATE INDEX idx_properties_advisor ON properties(advisor_id);
CREATE UNIQUE INDEX idx_properties_slug ON properties(slug);

-- Leads
CREATE INDEX idx_leads_property ON leads(property_id);
CREATE INDEX idx_leads_status ON leads(status);

-- Sales
CREATE INDEX idx_sales_advisor ON sales(advisor_id);
CREATE INDEX idx_sales_property ON sales(property_id);

-- Wallet
CREATE INDEX idx_wallet_advisor ON wallet_transactions(advisor_id);
```

---

*تاریخ ایجاد: 2026-10-08*
