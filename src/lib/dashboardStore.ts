/**
 * Dashboard State Store & Management Engine
 * Handles properties, sales (direct & co-brokered), consultant wallets,
 * approval workflows, and role-based permissions.
 */

export interface AdvisorProfile {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  role: string;
  email?: string;
  specialty?: string;
}

export interface DashboardProperty {
  id: string;
  slug: string;
  title: string;
  propertyType: 'apartment' | 'villa' | 'commercial' | 'land';
  propertyTypeLabel: string;
  status: 'available' | 'negotiating' | 'sold';
  statusLabel: string;
  priceToman: number;
  pricePerMeterToman: number;
  areaSqm: number;
  bedrooms: number;
  yearBuilt: number;
  floor?: number;
  totalFloors?: number;
  neighborhood: string;
  address: string;
  advisor: {
    id: string;
    name: string;
    phone: string;
    avatar: string;
    role: string;
  };
  features: string[];
  description: string;
  images: {
    url: string;
    alt: string;
    isPrimary?: boolean;
  }[];
  isPublic: boolean;
  sample: true;
  createdAt: string;
}

export type SaleType = 'direct' | 'co_brokered';
export type PayoutStatus = 'pending_approval' | 'paid';

export interface SaleRecord {
  id: string;
  propertyId: string;
  propertyTitle: string;
  saleType: SaleType;
  listingAdvisorId: string;
  listingAdvisorName: string;
  sellingAdvisorId?: string;
  sellingAdvisorName?: string;
  buyerName: string;
  buyerPhone: string;
  finalPriceToman: number;
  totalCommissionToman: number;
  commissionRateSnapshot: number; // e.g. 0.30 (30% pool for advisors)
  listingAdvisorShareToman: number;
  sellingAdvisorShareToman?: number;
  officeShareToman: number;
  payoutStatus: PayoutStatus;
  approvedBy?: string;
  approvedAt?: string;
  saleDate: string;
  notes?: string;
}

export type WalletTxType = 'commission' | 'co_commission' | 'bonus' | 'deduction' | 'adjustment';

export interface WalletTransaction {
  id: string;
  advisorId: string;
  advisorName: string;
  amountToman: number;
  isCredit: boolean; // true = addition (+), false = deduction (-)
  type: WalletTxType;
  typeLabel: string;
  description: string;
  reason?: string;
  saleId?: string;
  registeredBy: string;
  date: string;
}

export const ADVISORS: AdvisorProfile[] = [
  {
    id: 'user-adv-101',
    name: 'مهندس رضا کریمی',
    role: 'مشاور',
    specialty: 'آپارتمان‌های ۳ خوابه خیابان اردیبهشت و فروردین',
    phone: '۰۹۱۶۱۱۱۱۲۳۴',
    email: 'karimi@omidrealestate.ir',
    avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'user-adv-102',
    name: 'علیرضا احمدی',
    role: 'مشاور',
    specialty: 'خانه‌های ویلایی و پنت‌هاوس‌های کوی بوستان و آبان',
    phone: '۰۹۱۶۳۳۳۴۵۶۷',
    email: 'ahmadi@omidrealestate.ir',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'user-adv-103',
    name: 'سارا محمدی',
    role: 'مشاور',
    specialty: 'واحدهای خوش‌قیمت و خوش‌فروش ۱ و ۲ خوابه',
    phone: '۰۹۱۶۲۲۲۳۴۵۶',
    email: 'mohammadi@omidrealestate.ir',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'user-adv-104',
    name: 'محمدرضا رضایی',
    role: 'مشاور',
    specialty: 'مغازه، دفاتر کار و مجتمع‌های تجاری بلوار گلستان',
    phone: '۰۹۱۶۴۴۴۵۶۷۸',
    email: 'rezaei@omidrealestate.ir',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
  },
];

export const STAFF_USERS = [
  {
    id: 'user-sec-201',
    name: 'مریم سعیدی',
    role: 'secretary',
    roleLabel: 'منشی دفتر',
    phone: '۰۶۱-۳۳۳۳۳۳۳۴',
    email: 'saeedi@omidrealestate.ir',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
  },
  {
    id: 'user-adm-301',
    name: 'حاج امید صبور',
    role: 'admin',
    roleLabel: 'مدیرکل آژانس',
    phone: '۰۹۱۶۱۱۱۰۰۰۰',
    email: 'admin@omidrealestate.ir',
    avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80',
  },
];

export const ALL_USERS = [...ADVISORS, ...STAFF_USERS];

export const INITIAL_SALES: SaleRecord[] = [
  {
    id: 'sale-101',
    propertyId: 'prop-105',
    propertyTitle: 'پنت‌هاوس ۲۱۰ متری لوکس با روف‌گاردن اختصاصی خیابان آبان',
    saleType: 'direct',
    listingAdvisorId: 'user-adv-102',
    listingAdvisorName: 'علیرضا احمدی',
    buyerName: 'دکتر محمدرضا کیانی',
    buyerPhone: '۰۹۱۲۴۴۴۵۵۶۶',
    finalPriceToman: 6200000000,
    totalCommissionToman: 62000000,
    commissionRateSnapshot: 0.30,
    listingAdvisorShareToman: 18600000,
    officeShareToman: 43400000,
    payoutStatus: 'paid',
    approvedBy: 'حاج امید صبور (مدیرکل)',
    approvedAt: '۱۴۰۳/۰۶/۲۸',
    saleDate: '۱۴۰۳/۰۶/۲۸',
    notes: 'معامله با سند قطعی و تسویه کامل انجام شد.',
  },
  {
    id: 'sale-102',
    propertyId: 'prop-101',
    propertyTitle: 'آپارتمان ۱۶۵ متری ۳ خواب فول‌امکانات خیابان اردیبهشت',
    saleType: 'direct',
    listingAdvisorId: 'user-adv-101',
    listingAdvisorName: 'مهندس رضا کریمی',
    buyerName: 'مهندس حسینی',
    buyerPhone: '۰۹۱۶۷۷۷۸۸۹۹',
    finalPriceToman: 4250000000,
    totalCommissionToman: 42500000,
    commissionRateSnapshot: 0.30,
    listingAdvisorShareToman: 12750000,
    officeShareToman: 29750000,
    payoutStatus: 'pending_approval',
    saleDate: '۱۴۰۳/۰۷/۱۶',
    notes: 'مبایعه‌نامه تنظیم شد؛ در انتظار تایید تسویه و واریز کمیسیون به کیف پول مشاور.',
  },
  {
    id: 'sale-103',
    propertyId: 'prop-102',
    propertyTitle: 'آپارتمان ۱۱۰ متری ۲ خواب رو به نما خیابان فروردین',
    saleType: 'co_brokered',
    listingAdvisorId: 'user-adv-103', // سارا محمدی (صاحب فایل)
    listingAdvisorName: 'سارا محمدی',
    sellingAdvisorId: 'user-adv-102', // علیرضا احمدی (فروشنده با مشتری)
    sellingAdvisorName: 'علیرضا احمدی',
    buyerName: 'خانم دکتر افشار',
    buyerPhone: '۰۹۱۶۳۳۳۸۸۲۲',
    finalPriceToman: 2850000000,
    totalCommissionToman: 28500000,
    commissionRateSnapshot: 0.30,
    listingAdvisorShareToman: 4275000, // ۵۰٪ از پورسانت مشاوران (۱۵٪ کل)
    sellingAdvisorShareToman: 4275000, // ۵۰٪ از پورسانت مشاوران (۱۵٪ کل)
    officeShareToman: 19950000,
    payoutStatus: 'pending_approval',
    saleDate: '۱۴۰۳/۰۷/۱۷',
    notes: 'همکاری دوطرفه: فایل متعلق به سارا محمدی توسط علیرضا احمدی فروخته شد. نیازمند تایید مدیر/منشی جهت واریز سهم هر دو مشاور.',
  },
];

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx-101',
    advisorId: 'user-adv-102',
    advisorName: 'علیرضا احمدی',
    amountToman: 18600000,
    isCredit: true,
    type: 'commission',
    typeLabel: 'کمیسیون مستقیم',
    description: 'سهم کارمزد فروش ملک: پنت‌هاوس ۲۱۰ متری خیابان آبان (نرخ ۳۰٪)',
    registeredBy: 'حاج امید صبور (مدیرکل)',
    date: '۱۴۰۳/۰۶/۲۸',
    saleId: 'sale-101',
  },
  {
    id: 'tx-102',
    advisorId: 'user-adv-101',
    advisorName: 'مهندس رضا کریمی',
    amountToman: 14200000,
    isCredit: true,
    type: 'commission',
    typeLabel: 'کمیسیون مستقیم',
    description: 'سهم کارمزد فروش قرارداد دوره قبل: آپارتمان ۱۱۰ متری فروردین',
    registeredBy: 'مریم سعیدی (منشی)',
    date: '۱۴۰۳/۰۵/۱۴',
  },
  {
    id: 'tx-103',
    advisorId: 'user-adv-101',
    advisorName: 'مهندس رضا کریمی',
    amountToman: 29200000,
    isCredit: true,
    type: 'commission',
    typeLabel: 'کمیسیون مستقیم',
    description: 'سهم کارمزد فروش ملک: ویلایی خیابان بوستان',
    registeredBy: 'حاج امید صبور (مدیرکل)',
    date: '۱۴۰۳/۰۴/۰۲',
  },
  {
    id: 'tx-104',
    advisorId: 'user-adv-101',
    advisorName: 'مهندس رضا کریمی',
    amountToman: 5000000,
    isCredit: true,
    type: 'bonus',
    typeLabel: 'پاداش تشویقی',
    description: 'پاداش دستی مدیرکل: کسب رتبه نخست جذب مشتریان برتر در فصل بهار',
    reason: 'عملکرد درخشان در جذب فایل‌های انحصاری اردیبهشت',
    registeredBy: 'حاج امید صبور (مدیرکل)',
    date: '۱۴۰۳/۰۴/۰۵',
  },
  {
    id: 'tx-105',
    advisorId: 'user-adv-101',
    advisorName: 'مهندس رضا کریمی',
    amountToman: 4000000,
    isCredit: false,
    type: 'deduction',
    typeLabel: 'مساعده / کسر',
    description: 'مساعده نقدی پرداختی بنا به درخواست مشاور',
    reason: 'درخواست مساعده علی‌الحساب کارمزد',
    registeredBy: 'مریم سعیدی (منشی)',
    date: '۱۴۰۳/۰۵/۰۱',
  },
];
