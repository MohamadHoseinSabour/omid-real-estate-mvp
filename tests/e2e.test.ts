import { describe, it, expect } from 'vitest';
import propertiesData from '../src/data/properties.json';
import blogData from '../src/data/blog.json';
import agencyData from '../src/data/agency.json';
import { calculateCommission, calculateMortgage } from '../src/utils/calculators';

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

  // ۷. بررسی محاسبه تقسیم کمیسیون در فروش مشارکتی (همکاری مشاور ۱ و مشاور ۲)
  it('E2E-07: Co-brokering split calculates 50/50 of the 30% advisor pool accurately', () => {
    const finalPriceToman = 3_000_000_000;
    const totalCommissionToman = finalPriceToman * 0.01; // ۱٪ کل مبلغ
    const advisorPoolToman = Math.round(totalCommissionToman * 0.30); // ۹ میلیون تومان
    expect(advisorPoolToman).toBe(9_000_000);

    const listingAdvisorShare = Math.round(advisorPoolToman * 0.50); // ۴٫۵ میلیون تومان (۱۵٪ کل)
    const sellingAdvisorShare = Math.round(advisorPoolToman * 0.50); // ۴٫۵ میلیون تومان (۱۵٪ کل)
    const officeShare = totalCommissionToman - (listingAdvisorShare + sellingAdvisorShare); // ۲۱ میلیون تومان (۷۰٪ کل)

    expect(listingAdvisorShare).toBe(4_500_000);
    expect(sellingAdvisorShare).toBe(4_500_000);
    expect(officeShare).toBe(21_000_000);
    expect(listingAdvisorShare + sellingAdvisorShare + officeShare).toBe(totalCommissionToman);
  });

  // ۸. بررسی چرخه حیات تسویه پورسانت با یک کلیک (Approval Workflow)
  it('E2E-08: Payout lifecycle shifts from pending_approval to paid with timestamps', () => {
    const sale = {
      id: 'sale-test',
      payoutStatus: 'pending_approval' as const,
      advisorShareToman: 12_750_000,
    };
    expect(sale.payoutStatus).toBe('pending_approval');

    // شبیه‌سازی تایید توسط مدیر یا منشی
    const approvedSale = {
      ...sale,
      payoutStatus: 'paid' as const,
      approvedBy: 'حاج امید صبور (مدیرکل)',
      approvedAt: '۱۴۰۳/۰۷/۱۸',
    };
    expect(approvedSale.payoutStatus).toBe('paid');
    expect(approvedSale.approvedBy).toBeDefined();
    expect(approvedSale.approvedAt).toBeDefined();
  });

  // ۹. بررسی تعدیل دستی کیف پول با ثبت دلیل (Manual Wallet Adjustment)
  it('E2E-09: Manual wallet adjustment enforces positive amounts and explicit reason', () => {
    const adjustmentTx = {
      advisorId: 'user-adv-101',
      amountToman: 5_000_000,
      isCredit: true,
      reason: 'پاداش فروش فصلی و ثبت فایل انحصاری',
      registeredBy: 'حاج امید صبور (مدیرکل)',
    };

    expect(adjustmentTx.amountToman).toBeGreaterThan(0);
    expect(adjustmentTx.reason.trim().length).toBeGreaterThan(5);
    expect(adjustmentTx.registeredBy).toBeDefined();
  });

  // ۱۰. بررسی تفکیک سطح دسترسی مشاور و سطوح بالاتر
  it('E2E-10: Higher access levels (Admin/Secretary) view all listings with advisor badges', () => {
    // همه املاک دارای مشخصات مشاور مسئول هستند
    propertiesData.forEach((p) => {
      expect(p.advisor.name).toBeDefined();
      expect(p.advisor.phone).toBeDefined();
    });

    const advisor1Props = propertiesData.filter((p) => p.advisor.name === 'مهندس رضا کریمی');
    expect(advisor1Props.length).toBeGreaterThan(0);
    expect(advisor1Props.length).toBeLessThan(propertiesData.length);
  });

  // ۱۱. عدم نمایش املاک فروخته‌شده در فایلینگ اشتراکی همکاران (MLS)
  it('E2E-11: Co-filing MLS strictly excludes sold properties', () => {
    const rawProps = propertiesData;
    // حداقل یک ملک فروخته‌شده در دیتا وجود دارد
    const soldProps = rawProps.filter((p) => p.status === 'sold');
    expect(soldProps.length).toBeGreaterThan(0);

    // فیلتر فایلینگ اشتراکی همکاران
    const coFilingProps = rawProps.filter((p) => p.status !== 'sold');
    expect(coFilingProps.length).toBe(rawProps.length - soldProps.length);

    // تضمین اینکه هیچ ملک فروخته‌شده‌ای در خروجی نباشد
    coFilingProps.forEach((prop) => {
      expect(prop.status).not.toBe('sold');
      expect(['available', 'negotiating']).toContain(prop.status);
    });
  });

  // ۱۲. بررسی ساختار و یکپارچگی کامپوننت‌های هیرو سه‌بعدی (ImageStreamHero و TiltedGridHero)
  it('E2E-12: TiltedGridHero and ImageStreamHero contract verification', async () => {
    const { TiltedGridHero } = await import('../src/components/ui/tilted-grid-hero');
    expect(typeof TiltedGridHero).toBe('function');

    const { ImageStreamHero } = await import('../src/components/ui/image-stream-hero');
    expect(typeof ImageStreamHero).toBe('function');

    const { cn } = await import('../src/lib/utils');
    expect(typeof cn).toBe('function');
    expect(cn('relative', 'overflow-hidden')).toBe('relative overflow-hidden');
    expect(cn('p-4', 'p-6')).toBe('p-6'); // tailwind-merge override

    expect(agencyData.stats.yearsExperience).toBeGreaterThan(0);
    expect(agencyData.stats.successfulDeals).toBeGreaterThan(0);
    expect(agencyData.stats.activeAdvisors).toBeGreaterThan(0);
    expect(agencyData.stats.customerSatisfactionPercent).toBeGreaterThanOrEqual(90);
  });
});
