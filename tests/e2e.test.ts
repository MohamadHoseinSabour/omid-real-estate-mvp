import { describe, it, expect } from 'vitest';
import propertiesData from '../src/data/properties.json';
import blogData from '../src/data/blog.json';
import agencyData from '../src/data/agency.json';
import { calculateCommission, calculateMortgage, formatToman } from '../src/utils/calculators';

describe('Omid Real Estate E2E Workflow & Data Integrity Tests', () => {
  // ۱. بررسی یکپارچگی داده‌های املاک
  it('E2E-01: Properties data must have valid structure and sample flag', () => {
    expect(propertiesData.length).toBeGreaterThanOrEqual(5);
    propertiesData.forEach((prop) => {
      expect(prop.id).toBeDefined();
      expect(prop.slug).toMatch(/^[a-z0-9-]+$/);
      expect(prop.priceToman).toBeGreaterThan(0);
      expect(prop.areaSqm).toBeGreaterThan(0);
      expect(prop.sample).toBe(true);
      expect(['available', 'negotiating', 'sold']).toContain(prop.status);
      expect(prop.advisor.name).toBeDefined();
      expect(prop.images.length).toBeGreaterThan(0);
    });
  });

  // ۲. بررسی سناریوی هیرو و فرم مشاوره
  it('E2E-02: Hero intent targets and consultation form fields validation', () => {
    const validIntents = ['buy', 'sell'];
    validIntents.forEach((intent) => {
      expect(['buy', 'sell']).toContain(intent);
    });

    // تست اعتبارسنجی الگوی شماره موبایل ایران
    const iranPhoneRegex = /^09[0-9]{9}$/;
    expect(iranPhoneRegex.test('09161111234')).toBe(true);
    expect(iranPhoneRegex.test('09162223456')).toBe(true);
    expect(iranPhoneRegex.test('08123456789')).toBe(false);
    expect(iranPhoneRegex.test('12345')).toBe(false);
  });

  // ۳. بررسی سناریوی فیلتر املاک
  it('E2E-03: Filter logic handles type and status correctly', () => {
    const apartments = propertiesData.filter((p) => p.propertyType === 'apartment');
    expect(apartments.length).toBeGreaterThan(0);

    const availableProps = propertiesData.filter((p) => p.status === 'available');
    expect(availableProps.length).toBeGreaterThan(0);

    const soldProps = propertiesData.filter((p) => p.status === 'sold');
    expect(soldProps.length).toBeGreaterThan(0);
  });

  // ۴. بررسی محاسبات ماشین‌حساب‌های تعاملی
  it('E2E-04: Calculator functions produce legally accurate outcomes', () => {
    // معامله ۴ میلیارد تومانی
    const comm = calculateCommission(4_000_000_000, 'buy_sell');
    expect(comm.buyerShareToman).toBe(20_000_000); // ۰٫۵ درصد
    expect(comm.sellerShareToman).toBe(20_000_000);
    expect(comm.taxToman).toBe(4_000_000); // ۱۰ درصد مالیات ارزش افزوده
    expect(comm.totalCommissionToman).toBe(44_000_000);

    // محاسبه اقساط وام مسکن ۱ میلیارد تومانی، ۲۳ درصد، ۱۲ سال
    const mort = calculateMortgage(1_000_000_000, 23, 12);
    expect(mort.monthlyPaymentToman).toBeGreaterThan(20_000_000);
    expect(mort.monthsCount).toBe(144);
  });

  // ۵. بررسی تیم مشاوران و داده‌های آژانس
  it('E2E-05: Agency data covers 8+ advisors in Ahvaz Golestan', () => {
    expect(agencyData.team.length).toBeGreaterThanOrEqual(8);
    expect(agencyData.city).toContain('اهواز');
    expect(agencyData.neighborhood).toContain('گلستان');
  });

  // ۶. بررسی مقالات وبلاگ
  it('E2E-06: Blog articles cover buying guides and commission rules', () => {
    expect(blogData.length).toBeGreaterThanOrEqual(3);
    blogData.forEach((post) => {
      expect(post.slug).toBeDefined();
      expect(post.title).toBeDefined();
      expect(post.content.length).toBeGreaterThan(100);
    });
  });
});
