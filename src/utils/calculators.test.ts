import { describe, it, expect } from 'vitest';
import {
  calculateCommission,
  calculateMortgage,
  formatToman,
  toPersianDigits
} from './calculators';

describe('Real Estate Commission Calculator', () => {
  it('should correctly calculate commission for property buy/sell at 3 billion toman', () => {
    const result = calculateCommission(3_000_000_000, 'buy_sell');
    // سهم هر طرف: 0.5% = 15,000,000
    expect(result.buyerShareToman).toBe(15_000_000);
    expect(result.sellerShareToman).toBe(15_000_000);
    expect(result.subtotalCommissionToman).toBe(30_000_000);
    // مالیات بر ارزش افزوده 10%
    expect(result.taxToman).toBe(3_000_000);
    // مجموع کل
    expect(result.totalCommissionToman).toBe(33_000_000);
  });

  it('should handle zero or negative amounts gracefully', () => {
    const result = calculateCommission(0, 'buy_sell');
    expect(result.totalCommissionToman).toBe(0);
    expect(result.buyerShareToman).toBe(0);
  });

  it('should correctly calculate commission for rent transaction', () => {
    // رهن 200 میلیون و اجاره ماهانه 10 میلیون
    const result = calculateCommission(10_000_000, 'rent');
    // فرض: 25% اجاره ماهانه از هر طرف = 2,500,000
    expect(result.buyerShareToman).toBe(2_500_000);
    expect(result.sellerShareToman).toBe(2_500_000);
    expect(result.subtotalCommissionToman).toBe(5_000_000);
    expect(result.taxToman).toBe(500_000);
    expect(result.totalCommissionToman).toBe(5_500_000);
  });
});

describe('Mortgage Calculator', () => {
  it('should correctly calculate monthly payment for 800 million loan, 23% interest, 12 years (144 months)', () => {
    const loan = 800_000_000;
    const rate = 23; // 23 percent annual
    const years = 12;

    const result = calculateMortgage(loan, rate, years);
    expect(result.monthlyPaymentToman).toBeGreaterThan(16_000_000);
    expect(result.monthlyPaymentToman).toBeLessThan(18_000_000);
    expect(result.totalPaymentToman).toBeGreaterThan(loan);
    expect(result.totalInterestToman).toBe(result.totalPaymentToman - loan);
  });

  it('should handle 0 loan amount', () => {
    const result = calculateMortgage(0, 23, 10);
    expect(result.monthlyPaymentToman).toBe(0);
    expect(result.totalPaymentToman).toBe(0);
  });
});

describe('Persian Formatting Utilities', () => {
  it('should format numbers with Persian digits and separator', () => {
    const formatted = formatToman(1_500_000);
    expect(formatted).toContain('۱٬۵۰۰٬۰۰۰');
    expect(formatted).toContain('تومان');
  });

  it('should convert english digits to persian digits', () => {
    expect(toPersianDigits('12345')).toBe('۱۲۳۴۵');
  });
});
