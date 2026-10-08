-- Migration 003: Co-Brokering (MLS) Support, Approval Workflow & Manual Wallet Adjustments
-- Compliant with Omid Real Estate MVP Business Rules

-- 1. Create New Types if not exist
DO $$ BEGIN
    CREATE TYPE sale_type AS ENUM ('direct', 'co_brokered');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE payout_status AS ENUM ('pending_approval', 'paid');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 2. Alter Sales Table
ALTER TABLE sales
    ADD COLUMN IF NOT EXISTS sale_type sale_type NOT NULL DEFAULT 'direct',
    ADD COLUMN IF NOT EXISTS secondary_advisor_id UUID REFERENCES profiles(id) ON DELETE RESTRICT,
    ADD COLUMN IF NOT EXISTS secondary_advisor_share_toman BIGINT NOT NULL DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payout_status payout_status NOT NULL DEFAULT 'pending_approval',
    ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- 3. Alter Wallet Transactions Table
ALTER TABLE wallet_transactions
    ADD COLUMN IF NOT EXISTS is_credit BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN IF NOT EXISTS reason TEXT,
    ADD COLUMN IF NOT EXISTS registered_by UUID REFERENCES profiles(id) ON DELETE SET NULL;

-- 4. RPC Function: record_co_sale()
-- Allows Advisor B to register a co-sale for Advisor A's listing with 50/50 split of the 30% advisor pool
CREATE OR REPLACE FUNCTION record_co_sale(
    p_property_id UUID,
    p_buyer_name TEXT,
    p_buyer_phone TEXT,
    p_final_price_toman BIGINT,
    p_total_commission_toman BIGINT,
    p_notes TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_property RECORD;
    v_seller_id UUID;
    v_listing_adv_id UUID;
    v_pool_amount BIGINT;
    v_half_share BIGINT;
    v_sale_id UUID;
BEGIN
    v_seller_id := auth.uid();
    IF v_seller_id IS NULL THEN
        RAISE EXCEPTION 'کاربر احراز هویت نشده است.';
    END IF;

    SELECT * INTO v_property
    FROM properties
    WHERE id = p_property_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'ملک مورد نظر یافت نشد.';
    END IF;

    v_listing_adv_id := v_property.advisor_id;

    -- Calculate 30% advisor pool, then 50% split for each advisor
    v_pool_amount := round(p_total_commission_toman * 0.30);
    v_half_share := round(v_pool_amount * 0.50);

    -- Mark property negotiating
    UPDATE properties
    SET status = 'negotiating',
        updated_at = timezone('utc'::text, now())
    WHERE id = p_property_id;

    -- Insert sale record in pending_approval status
    INSERT INTO sales (
        property_id,
        advisor_id,
        secondary_advisor_id,
        sale_type,
        buyer_name,
        buyer_phone,
        final_price_toman,
        total_commission_toman,
        commission_rate_snapshot,
        advisor_share_toman,
        secondary_advisor_share_toman,
        payout_status,
        sale_date
    ) VALUES (
        p_property_id,
        v_listing_adv_id,
        v_seller_id,
        'co_brokered',
        p_buyer_name,
        p_buyer_phone,
        p_final_price_toman,
        p_total_commission_toman,
        0.30,
        v_half_share,
        v_half_share,
        'pending_approval',
        timezone('utc'::text, now())
    ) RETURNING id INTO v_sale_id;

    RETURN jsonb_build_object(
        'success', true,
        'sale_id', v_sale_id,
        'listing_advisor_share', v_half_share,
        'selling_advisor_share', v_half_share,
        'payout_status', 'pending_approval'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. RPC Function: approve_sale_payout()
-- Admin or Secretary confirms settlement and deposits commission to consultant(s) with 1 click
CREATE OR REPLACE FUNCTION approve_sale_payout(p_sale_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_sale RECORD;
    v_approver_id UUID;
    v_approver_role user_role;
BEGIN
    v_approver_id := auth.uid();
    v_approver_role := get_current_user_role();

    IF v_approver_role NOT IN ('admin', 'secretary') THEN
        RAISE EXCEPTION 'تنها مدیرکل و منشی دفتر مجاز به تایید تسویه کمیسیون هستند.';
    END IF;

    SELECT * INTO v_sale
    FROM sales
    WHERE id = p_sale_id
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'معامله مورد نظر یافت نشد.';
    END IF;

    IF v_sale.payout_status = 'paid' THEN
        RAISE EXCEPTION 'کارمزد این معامله قبلاً تسویه و واریز شده است.';
    END IF;

    -- Update Sale status
    UPDATE sales
    SET payout_status = 'paid',
        approved_by = v_approver_id,
        approved_at = timezone('utc'::text, now())
    WHERE id = p_sale_id;

    -- Update property status to sold
    UPDATE properties
    SET status = 'sold',
        updated_at = timezone('utc'::text, now())
    WHERE id = v_sale.property_id;

    -- Deposit to listing advisor
    INSERT INTO wallet_transactions (
        advisor_id,
        sale_id,
        amount_toman,
        is_credit,
        type,
        description,
        registered_by
    ) VALUES (
        v_sale.advisor_id,
        v_sale.id,
        v_sale.advisor_share_toman,
        true,
        'commission',
        'تسویه و واریز پورسانت فروش معامله',
        v_approver_id
    );

    -- Deposit to secondary advisor if co-brokered
    IF v_sale.sale_type = 'co_brokered' AND v_sale.secondary_advisor_id IS NOT NULL THEN
        INSERT INTO wallet_transactions (
            advisor_id,
            sale_id,
            amount_toman,
            is_credit,
            type,
            description,
            registered_by
        ) VALUES (
            v_sale.secondary_advisor_id,
            v_sale.id,
            v_sale.secondary_advisor_share_toman,
            true,
            'commission',
            'تسویه و واریز پورسانت فروش مشارکتی (همکاری)',
            v_approver_id
        );
    END IF;

    RETURN jsonb_build_object(
        'success', true,
        'sale_id', p_sale_id,
        'message', 'تسویه کارمزد تایید و پورسانت به کیف پول مشاور(ها) واریز گردید.'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. RPC Function: admin_adjust_wallet()
-- Manager or Secretary manually credits or debits consultant wallet with mandatory reason
CREATE OR REPLACE FUNCTION admin_adjust_wallet(
    p_advisor_id UUID,
    p_amount_toman BIGINT,
    p_is_credit BOOLEAN,
    p_reason TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_approver_id UUID;
    v_approver_role user_role;
    v_tx_id UUID;
BEGIN
    v_approver_id := auth.uid();
    v_approver_role := get_current_user_role();

    IF v_approver_role NOT IN ('admin', 'secretary') THEN
        RAISE EXCEPTION 'فقط مدیرکل و منشی دفتر مجاز به تغییر موجودی کیف پول هستند.';
    END IF;

    IF p_amount_toman <= 0 THEN
        RAISE EXCEPTION 'مبلغ تراکنش باید بزرگتر از صفر باشد.';
    END IF;

    IF p_reason IS NULL OR length(trim(p_reason)) = 0 THEN
        RAISE EXCEPTION 'درج دلیل تغییر موجودی الزامی است.';
    END IF;

    INSERT INTO wallet_transactions (
        advisor_id,
        amount_toman,
        is_credit,
        type,
        description,
        reason,
        registered_by
    ) VALUES (
        p_advisor_id,
        p_amount_toman,
        p_is_credit,
        CASE WHEN p_is_credit THEN 'bonus'::wallet_tx_type ELSE 'adjustment'::wallet_tx_type END,
        CASE WHEN p_is_credit THEN 'افزایش دستی موجودی: ' || p_reason ELSE 'کسر دستی موجودی: ' || p_reason END,
        p_reason,
        v_approver_id
    ) RETURNING id INTO v_tx_id;

    RETURN jsonb_build_object(
        'success', true,
        'tx_id', v_tx_id,
        'amount_toman', p_amount_toman,
        'is_credit', p_is_credit
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
