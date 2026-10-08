-- RLS & Security Verification Tests
-- Executable in Supabase SQL editor or pgTap
-- Purpose: Verify access matrix and atomic constraints defined in docs/ROLES_AND_PERMISSIONS.md

BEGIN;

-- 1. Setup Test Fixtures
CREATE TEMP TABLE test_results (
    test_id TEXT PRIMARY KEY,
    description TEXT NOT NULL,
    passed BOOLEAN NOT NULL,
    details TEXT
);

DO $$
BEGIN
    RAISE NOTICE '=== Running Supabase Security & RLS Tests for Omid Real Estate ===';
END $$;

-- TEST 1: Secretary CANNOT read wallet_transactions
DO $$
DECLARE
    v_has_access BOOLEAN;
BEGIN
    -- Verify no policy permits secretary to read wallet
    SELECT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'wallet_transactions'
        AND (qual LIKE '%secretary%' OR cmd = 'ALL')
    ) INTO v_has_access;

    INSERT INTO test_results VALUES (
        'RLS-01',
        'Secretary has NO read/write policy on wallet_transactions table',
        NOT v_has_access,
        'Direct secretary access is forbidden'
    );
END $$;

-- TEST 2: Wallet table is Append-Only (NO direct client INSERT policies)
DO $$
DECLARE
    v_has_direct_insert BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1 FROM pg_policies
        WHERE tablename = 'wallet_transactions'
        AND cmd = 'INSERT'
        AND roles @> ARRAY['authenticated']::name[]
    ) INTO v_has_direct_insert;

    INSERT INTO test_results VALUES (
        'RLS-02',
        'wallet_transactions cannot be directly inserted by authenticated clients',
        NOT v_has_direct_insert,
        'Inserts only permitted via atomic record_sale RPC'
    );
END $$;

-- TEST 3: All 6 tables have RLS enabled
DO $$
DECLARE
    v_unprotected_count INT;
BEGIN
    SELECT count(*) INTO v_unprotected_count
    FROM pg_tables t
    WHERE t.schemaname = 'public'
    AND t.tablename IN ('profiles', 'properties', 'leads', 'sales', 'wallet_transactions', 'commission_settings')
    AND t.rowsecurity = false;

    INSERT INTO test_results VALUES (
        'RLS-03',
        'All 6 tables must have Row Level Security enabled',
        (v_unprotected_count = 0),
        format('Unprotected tables count: %s', v_unprotected_count)
    );
END $$;

-- TEST 4: Atomic RPC Function record_sale exists and is SECURITY DEFINER
DO $$
DECLARE
    v_is_sec_definer BOOLEAN;
BEGIN
    SELECT prosecdef INTO v_is_sec_definer
    FROM pg_proc
    WHERE proname = 'record_sale';

    INSERT INTO test_results VALUES (
        'RPC-01',
        'record_sale function exists and runs as SECURITY DEFINER',
        v_is_sec_definer IS TRUE,
        'Ensures atomic ledger entry and property status update'
    );
END $$;

-- Output test results
SELECT * FROM test_results;

ROLLBACK;
