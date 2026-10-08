/**
 * Pure functions for real estate commission & mortgage calculations.
 * All monetary amounts are handled as integer Tomans.
 */

export interface CommissionResult {
  buyerShareToman: number;
  sellerShareToman: number;
  subtotalCommissionToman: number;
  taxToman: number;
  totalCommissionToman: number;
}

export interface MortgageResult {
  monthlyPaymentToman: number;
  totalPaymentToman: number;
  totalInterestToman: number;
  monthsCount: number;
}

/**
 * Calculates standard legal real estate commission.
 * @param dealAmountToman Total transaction amount in Toman (integer)
 * @param dealType 'buy_sell' (0.5% per side) | 'rent' (25% of 1 month rent per side)
 */
export function calculateCommission(
  dealAmountToman: number,
  dealType: 'buy_sell' | 'rent' = 'buy_sell'
): CommissionResult {
  if (dealAmountToman <= 0) {
    return {
      buyerShareToman: 0,
      sellerShareToman: 0,
      subtotalCommissionToman: 0,
      taxToman: 0,
      totalCommissionToman: 0,
    };
  }

  let oneSideShare: number;
  if (dealType === 'buy_sell') {
    // عرف قانونی: نیم درصد (0.005) از هر طرف
    oneSideShare = Math.round(dealAmountToman * 0.005);
  } else {
    // رهن/اجاره: ۲۵ درصد یک ماه اجاره از هر طرف
    oneSideShare = Math.round(dealAmountToman * 0.25);
  }

  const subtotal = oneSideShare * 2;
  // ۱۰ درصد مالیات بر ارزش افزوده قانونی
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  return {
    buyerShareToman: oneSideShare,
    sellerShareToman: oneSideShare,
    subtotalCommissionToman: subtotal,
    taxToman: tax,
    totalCommissionToman: total,
  };
}

/**
 * Calculates monthly mortgage payment using standard amortized formula.
 * @param loanAmountToman Principal loan in Toman
 * @param annualInterestPercent Annual interest rate (e.g., 23 for 23%)
 * @param years Loan duration in years
 */
export function calculateMortgage(
  loanAmountToman: number,
  annualInterestPercent: number,
  years: number
): MortgageResult {
  if (loanAmountToman <= 0 || years <= 0 || annualInterestPercent <= 0) {
    return {
      monthlyPaymentToman: 0,
      totalPaymentToman: 0,
      totalInterestToman: 0,
      monthsCount: 0,
    };
  }

  const monthsCount = years * 12;
  const monthlyRate = annualInterestPercent / 100 / 12;

  // Formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const factor = Math.pow(1 + monthlyRate, monthsCount);
  const monthlyPayment = Math.round(
    (loanAmountToman * (monthlyRate * factor)) / (factor - 1)
  );

  const totalPayment = monthlyPayment * monthsCount;
  const totalInterest = totalPayment - loanAmountToman;

  return {
    monthlyPaymentToman: monthlyPayment,
    totalPaymentToman: totalPayment,
    totalInterestToman: totalInterest,
    monthsCount,
  };
}

/**
 * Formats a number with Persian digits and Toman suffix.
 */
export function formatToman(amount: number): string {
  const formatted = new Intl.NumberFormat('fa-IR').format(Math.round(amount));
  return `${formatted} تومان`;
}

/**
 * Converts ASCII digits to Persian digits.
 */
export function toPersianDigits(input: string | number): string {
  const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
  return String(input).replace(/[0-9]/g, (w) => persianDigits[+w]);
}
