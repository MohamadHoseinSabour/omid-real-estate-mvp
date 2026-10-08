-- Migration 001: Initial Schema for Omid Real Estate MVP
-- Created: 2026-10-08
-- Compliant with: docs/DATA_MODEL.md & docs/ROLES_AND_PERMISSIONS.md

-- 1. Create Enums
CREATE TYPE user_role AS ENUM ('advisor', 'secretary', 'admin');
CREATE TYPE property_status AS ENUM ('available', 'negotiating', 'sold');
CREATE TYPE property_type AS ENUM ('apartment', 'villa', 'commercial', 'land');
CREATE TYPE lead_request_type AS ENUM ('buy', 'sell', 'consult', 'contact');
CREATE TYPE lead_source AS ENUM ('consult_form', 'contact_form', 'social', 'ad', 'property_detail_page', 'homepage_hero');
CREATE TYPE lead_status AS ENUM ('new', 'contacted', 'converted', 'closed');
CREATE TYPE wallet_tx_type AS ENUM ('commission', 'bonus', 'adjustment');

-- 2. Profiles Table (Linked to Supabase auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    phone TEXT,
    email TEXT,
    avatar_url TEXT,
    role user_role NOT NULL DEFAULT 'advisor',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. Properties Table
CREATE TABLE properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    address TEXT NOT NULL,
    neighborhood TEXT NOT NULL DEFAULT 'گلستان، اهواز',
    price_toman BIGINT NOT NULL CHECK (price_toman >= 0),
    area_sqm INT NOT NULL CHECK (area_sqm > 0),
    bedrooms INT NOT NULL DEFAULT 1 CHECK (bedrooms >= 0),
    year_built INT NOT NULL DEFAULT 1400,
    floor INT,
    total_floors INT,
    latitude DOUBLE PRECISION NOT NULL DEFAULT 31.3055,
    longitude DOUBLE PRECISION NOT NULL DEFAULT 48.6645,
    status property_status NOT NULL DEFAULT 'available',
    image_urls TEXT[] NOT NULL DEFAULT '{}',
    features TEXT[] NOT NULL DEFAULT '{}',
    property_type property_type NOT NULL DEFAULT 'apartment',
    is_public BOOLEAN NOT NULL DEFAULT true,
    sample BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. Leads Table (Customer Inquiries)
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT,
    message TEXT,
    request_type lead_request_type NOT NULL DEFAULT 'buy',
    source lead_source NOT NULL DEFAULT 'consult_form',
    status lead_status NOT NULL DEFAULT 'new',
    notes TEXT,
    sample BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. Commission Settings Table (Singleton managed by Admin)
CREATE TABLE commission_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    default_advisor_rate NUMERIC(4, 2) NOT NULL DEFAULT 0.30 CHECK (default_advisor_rate BETWEEN 0.05 AND 0.90),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_by UUID REFERENCES profiles(id)
);

-- 6. Sales Table
CREATE TABLE sales (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID NOT NULL REFERENCES properties(id) ON DELETE RESTRICT,
    advisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    buyer_name TEXT NOT NULL,
    buyer_phone TEXT NOT NULL,
    final_price_toman BIGINT NOT NULL CHECK (final_price_toman > 0),
    total_commission_toman BIGINT NOT NULL CHECK (total_commission_toman >= 0),
    commission_rate_snapshot NUMERIC(4, 2) NOT NULL,
    advisor_share_toman BIGINT NOT NULL CHECK (advisor_share_toman >= 0),
    sale_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    sample BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. Wallet Transactions (Append-Only ledger)
CREATE TABLE wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    advisor_id UUID NOT NULL REFERENCES profiles(id) ON DELETE RESTRICT,
    sale_id UUID REFERENCES sales(id) ON DELETE RESTRICT,
    amount_toman BIGINT NOT NULL CHECK (amount_toman > 0),
    description TEXT NOT NULL,
    type wallet_tx_type NOT NULL DEFAULT 'commission',
    sample BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. Performance Indexes
CREATE INDEX idx_properties_status ON properties(status) WHERE is_public = true;
CREATE INDEX idx_properties_advisor ON properties(advisor_id);
CREATE UNIQUE INDEX idx_properties_slug ON properties(slug);
CREATE INDEX idx_leads_property ON leads(property_id);
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_sales_advisor ON sales(advisor_id);
CREATE INDEX idx_sales_property ON sales(property_id);
CREATE INDEX idx_wallet_advisor ON wallet_transactions(advisor_id);
