-- Migration 002: Row Level Security (RLS) & Atomic RPC Functions
-- Created: 2026-10-08
-- Compliant with: docs/ROLES_AND_PERMISSIONS.md

-- 1. Enable RLS on ALL tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE commission_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;

-- 2. Security Helper Functions
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role AS $$
    SELECT role FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
    SELECT (get_current_user_role() = 'admin');
$$ LANGUAGE sql STABLE SECURITY DEFINER;

CREATE OR REPLACE FUNCTION is_secretary_or_admin()
RETURNS BOOLEAN AS $$
    SELECT (get_current_user_role() IN ('secretary', 'admin'));
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- ----------------------------------------------------
-- 3. PROFILES Policies
-- ----------------------------------------------------
-- Anyone can view basic public profile of active advisors
CREATE POLICY "Public profiles are viewable by everyone"
ON profiles FOR SELECT
USING (is_active = true);

-- Users can update their own profile (name, phone, avatar)
CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Admin can manage all profiles
CREATE POLICY "Admin can manage all profiles"
ON profiles FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ----------------------------------------------------
-- 4. PROPERTIES Policies
-- ----------------------------------------------------
-- Public access: anyone can view public properties
CREATE POLICY "Public properties viewable by anyone"
ON properties FOR SELECT
USING (is_public = true);

-- Authenticated: Advisors can view their own properties (even unlisted)
CREATE POLICY "Advisors can view their own properties"
ON properties FOR SELECT
TO authenticated
USING (advisor_id = auth.uid());

-- Secretary & Admin can view ALL properties
CREATE POLICY "Staff can view all properties"
ON properties FOR SELECT
TO authenticated
USING (is_secretary_or_admin());

-- Insert: Advisor can insert for themselves, Secretary/Admin for anyone
CREATE POLICY "Advisors can create properties for themselves"
ON properties FOR INSERT
TO authenticated
WITH CHECK (
    (advisor_id = auth.uid() AND get_current_user_role() = 'advisor')
    OR is_secretary_or_admin()
);

-- Update: Advisor can update their own properties, Secretary/Admin can update all
CREATE POLICY "Advisors can update own properties"
ON properties FOR UPDATE
TO authenticated
USING (
    advisor_id = auth.uid()
    OR is_secretary_or_admin()
)
WITH CHECK (
    advisor_id = auth.uid()
    OR is_secretary_or_admin()
);

-- Delete: ONLY Admin can delete properties (soft delete preferred)
CREATE POLICY "Only admin can delete properties"
ON properties FOR DELETE
TO authenticated
USING (is_admin());

-- ----------------------------------------------------
-- 5. LEADS Policies
-- ----------------------------------------------------
-- Anyone (public visitors) can insert a lead via website consultation forms
CREATE POLICY "Public visitors can create leads"
ON leads FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Advisors can view leads strictly associated with their own properties
CREATE POLICY "Advisors can view leads for their properties"
ON leads FOR SELECT
TO authenticated
USING (
    property_id IN (
        SELECT id FROM properties WHERE advisor_id = auth.uid()
    )
);

-- Secretary & Admin can view ALL leads
CREATE POLICY "Secretary and Admin can view all leads"
ON leads FOR SELECT
TO authenticated
USING (is_secretary_or_admin());

-- Secretary & Admin can update lead status and notes
CREATE POLICY "Secretary and Admin can update leads"
ON leads FOR UPDATE
TO authenticated
USING (is_secretary_or_admin())
WITH CHECK (is_secretary_or_admin());

-- Only Admin can delete leads
CREATE POLICY "Only admin can delete leads"
ON leads FOR DELETE
TO authenticated
USING (is_admin());

-- ----------------------------------------------------
-- 6. SALES Policies
-- ----------------------------------------------------
-- Advisors can view only their own sales
CREATE POLICY "Advisors can view own sales"
ON sales FOR SELECT
TO authenticated
USING (advisor_id = auth.uid());

-- Admin can view all sales
CREATE POLICY "Admin can view all sales"
ON sales FOR SELECT
TO authenticated
USING (is_admin());

-- Direct client inserts/updates on sales are BLOCKED: Must use atomic record_sale function!
-- Only Admin has direct rescue modification access if needed
CREATE POLICY "Admin can modify sales in emergency"
ON sales FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ----------------------------------------------------
-- 7. WALLET TRANSACTIONS Policies (Append-Only Ledger)
-- ----------------------------------------------------
-- Advisors can read their own wallet transactions
CREATE POLICY "Advisors can view own wallet ledger"
ON wallet_transactions FOR SELECT
TO authenticated
USING (advisor_id = auth.uid());

-- Admin can view all wallet transactions
CREATE POLICY "Admin can view all wallet ledgers"
ON wallet_transactions FOR SELECT
TO authenticated
USING (is_admin());

-- Direct inserts, updates, or deletes are strictly forbidden to all client roles!
-- Ledger is append-only via database RPC functions only.

-- ----------------------------------------------------
-- 8. COMMISSION SETTINGS Policies
-- ----------------------------------------------------
-- Only Admin can view or update commission settings
CREATE POLICY "Admin full access to commission settings"
ON commission_settings FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

-- ----------------------------------------------------
-- 9. ATOMIC RPC FUNCTION: record_sale()
-- ----------------------------------------------------
CREATE OR REPLACE FUNCTION record_sale(
    p_property_id UUID,
    p_buyer_name TEXT,
    p_buyer_phone TEXT,
    p_final_price_toman BIGINT,
    p_total_commission_toman BIGINT
)
RETURNS JSONB AS $$
DECLARE
    v_property RECORD;
    v_caller_role user_role;
    v_commission_rate NUMERIC(4, 2);
    v_advisor_share BIGINT;
    v_sale_id UUID;
    v_tx_id UUID;
BEGIN
    -- 1. Input Validation
    IF p_buyer_name IS NULL OR length(trim(p_buyer_name)) = 0 THEN
        RAISE EXCEPTION 'نام خریدار الزامی است.';
    END IF;
    IF p_buyer_phone IS NULL OR length(trim(p_buyer_phone)) = 0 THEN
        RAISE EXCEPTION 'شماره تماس خریدار الزامی است.';
    END IF;
    IF p_final_price_toman <= 0 THEN
        RAISE EXCEPTION 'مبلغ نهایی معامله باید بزرگتر از صفر باشد.';
    END IF;
    IF p_total_commission_toman < 0 THEN
        RAISE EXCEPTION 'کمیسیون نمی‌تواند منفی باشد.';
    END IF;

    -- 2. Fetch property details & verify existence
    SELECT * INTO v_property
    FROM properties
    WHERE id = p_property_id
    FOR UPDATE; -- Lock row for atomic transaction

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ملک مورد نظر یافت نشد.';
    END IF;

    IF v_property.status = 'sold' THEN
        RAISE EXCEPTION 'این ملک قبلاً فروخته شده است.';
    END IF;

    -- 3. Check caller permissions (Must be either the listing advisor or Admin)
    v_caller_role := get_current_user_role();
    IF v_caller_role IS NULL THEN
        RAISE EXCEPTION 'کاربر احراز هویت نشده است.';
    END IF;

    IF v_caller_role = 'secretary' THEN
        RAISE EXCEPTION 'نقش منشی دسترسی ثبت فروش و امور مالی ندارد.';
    END IF;

    IF v_caller_role = 'advisor' AND v_property.advisor_id != auth.uid() THEN
        RAISE EXCEPTION 'مشاور فقط مجاز به ثبت فروش برای فایل‌های شخصی خود است.';
    END IF;

    -- 4. Get current commission rate snapshot
    SELECT default_advisor_rate INTO v_commission_rate
    FROM commission_settings
    ORDER BY updated_at DESC
    LIMIT 1;

    -- Fallback default 30% if settings table is empty
    IF v_commission_rate IS NULL THEN
        v_commission_rate := 0.30;
    END IF;

    -- Calculate advisor's share integer Toman
    v_advisor_share := round(p_total_commission_toman * v_commission_rate);

    -- 5. Mark Property as 'sold'
    UPDATE properties
    SET status = 'sold',
        updated_at = timezone('utc'::text, now())
    WHERE id = p_property_id;

    -- 6. Insert into sales table (with snapshot rate)
    INSERT INTO sales (
        property_id,
        advisor_id,
        buyer_name,
        buyer_phone,
        final_price_toman,
        total_commission_toman,
        commission_rate_snapshot,
        advisor_share_toman,
        sale_date
    ) VALUES (
        p_property_id,
        v_property.advisor_id,
        p_buyer_name,
        p_buyer_phone,
        p_final_price_toman,
        p_total_commission_toman,
        v_commission_rate,
        v_advisor_share,
        timezone('utc'::text, now())
    ) RETURNING id INTO v_sale_id;

    -- 7. Insert into wallet_transactions (append-only ledger)
    INSERT INTO wallet_transactions (
        advisor_id,
        sale_id,
        amount_toman,
        description,
        type
    ) VALUES (
        v_property.advisor_id,
        v_sale_id,
        v_advisor_share,
        format('سهم کارمزد فروش ملک: %s (نرخ %s٪)', v_property.title, round(v_commission_rate * 100)),
        'commission'
    ) RETURNING id INTO v_tx_id;

    -- 8. Return success response
    RETURN jsonb_build_object(
        'success', true,
        'sale_id', v_sale_id,
        'wallet_tx_id', v_tx_id,
        'advisor_share_toman', v_advisor_share,
        'commission_rate', v_commission_rate,
        'message', 'معامله با موفقیت ثبت شد و سهم کارمزد در کیف پول مشاور شارژ گردید.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
