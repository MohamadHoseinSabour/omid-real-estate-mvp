/**
 * Omid Real Estate MVP - Unified Dashboard Engine
 * Implements:
 * - Dynamic Role/User switching
 * - Property management with full Admin/Secretary CRUD & ownership badges
 * - Co-brokering / Co-filing MLS with 50/50 commission split
 * - Sales tracking with 1-click payout approval & automatic wallet deposits
 * - Manual wallet balance adjustments with audited reasons
 * - LocalStorage persistence and Supabase sync readiness
 */

(function () {
  'use strict';

  // 1. Initial Data Models & Definitions
  const USERS = [
    {
      id: 'user-adv-101',
      name: 'مهندس رضا کریمی',
      role: 'advisor',
      roleLabel: 'مشاور',
      specialty: 'آپارتمان‌های ۳ خوابه خیابان اردیبهشت و فروردین',
      phone: '۰۹۱۶۱۱۱۱۲۳۴',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'user-adv-102',
      name: 'علیرضا احمدی',
      role: 'advisor',
      roleLabel: 'مشاور',
      specialty: 'خانه‌های ویلایی و پنت‌هاوس‌های کوی بوستان و آبان',
      phone: '۰۹۱۶۳۳۳۴۵۶۷',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'user-adv-103',
      name: 'سارا محمدی',
      role: 'advisor',
      roleLabel: 'مشاور',
      specialty: 'واحدهای خوش‌قیمت و خوش‌فروش ۱ و ۲ خوابه',
      phone: '۰۹۱۶۲۲۲۳۴۵۶',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'user-adv-104',
      name: 'محمدرضا رضایی',
      role: 'advisor',
      roleLabel: 'مشاور',
      specialty: 'مغازه، دفاتر کار و مجتمع‌های تجاری بلوار گلستان',
      phone: '۰۹۱۶۴۴۴۵۶۷۸',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'user-sec-201',
      name: 'مریم سعیدی',
      role: 'secretary',
      roleLabel: 'منشی دفتر',
      phone: '۰۶۱-۳۳۳۳۳۳۳۴',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80',
    },
    {
      id: 'user-adm-301',
      name: 'حاج امید صبور',
      role: 'admin',
      roleLabel: 'مدیرکل آژانس',
      phone: '۰۹۱۶۱۱۱۰۰۰۰',
      avatar: 'https://images.unsplash.com/photo-1556157382-97eda2d62296?auto=format&fit=crop&w=300&q=80',
    },
  ];

  const INITIAL_PROPERTIES = [
    {
      id: 'prop-101',
      slug: 'apartment-165m-ordibehesht-golestan',
      title: 'آپارتمان ۱۶۵ متری ۳ خواب فول‌امکانات خیابان اردیبهشت',
      propertyType: 'apartment',
      propertyTypeLabel: 'آپارتمان',
      status: 'available',
      statusLabel: 'موجود',
      priceToman: 4250000000,
      pricePerMeterToman: 25757575,
      areaSqm: 165,
      bedrooms: 3,
      yearBuilt: 1402,
      floor: 4,
      totalFloors: 6,
      neighborhood: 'گلستان، اهواز',
      address: 'اهواز، محله گلستان، خیابان اردیبهشت، نبش فرعی ۲',
      advisor: {
        id: 'user-adv-101',
        name: 'مهندس رضا کریمی',
        phone: '۰۹۱۶۱۱۱۱۲۳۴',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
        role: 'کارشناس ارشد منطقه گلستان',
      },
      features: ['پارکینگ سندی', 'آسانسور اتوماتیک', 'انباری', 'کابینت های‌گلاس', 'سیستم سرمایش اسپلیت'],
      description: 'واحد بسیار تمیز و خوش‌نقشه در یکی از بهترین خیابان‌های گلستان اهواز. نورگیری عالی از جنوب، سالن مربع.',
      isPublic: true,
      sample: true,
      createdAt: '2026-10-01T10:00:00Z',
    },
    {
      id: 'prop-102',
      slug: 'apartment-110m-farvardin-golestan',
      title: 'آپارتمان ۱۱۰ متری ۲ خواب رو به نما خیابان فروردین',
      propertyType: 'apartment',
      propertyTypeLabel: 'آپارتمان',
      status: 'negotiating',
      statusLabel: 'در حال مذاکره',
      priceToman: 2850000000,
      pricePerMeterToman: 25909090,
      areaSqm: 110,
      bedrooms: 2,
      yearBuilt: 1399,
      floor: 2,
      totalFloors: 5,
      neighborhood: 'گلستان، اهواز',
      address: 'اهواز، گلستان، خیابان فروردین، بین اقبال و اصفهان',
      advisor: {
        id: 'user-adv-103',
        name: 'سارا محمدی',
        phone: '۰۹۱۶۲۲۲۳۴۵۶',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
        role: 'مشاور فروش واحدهای ۲ خوابه',
      },
      features: ['پارکینگ بدون مزاحمت', 'آسانسور', 'انباری', 'پکیج و رادیاتور', 'بالکن کاربردی'],
      description: 'واحد جمع‌وجور و فوق‌العاده شیک با پلان مهندسی بدون یک سانتیمتر پرتی. مشاعات تمیز.',
      isPublic: true,
      sample: true,
      createdAt: '2026-10-03T11:30:00Z',
    },
    {
      id: 'prop-103',
      slug: 'villa-250m-boostan-golestan',
      title: 'منزل ویلایی ۲۵۰ متری بازسازی کامل محدوده بوستان',
      propertyType: 'villa',
      propertyTypeLabel: 'ویلایی',
      status: 'available',
      statusLabel: 'موجود',
      priceToman: 6700000000,
      pricePerMeterToman: 26800000,
      areaSqm: 250,
      bedrooms: 4,
      yearBuilt: 1394,
      floor: 1,
      totalFloors: 1,
      neighborhood: 'گلستان، اهواز',
      address: 'اهواز، گلستان، کوی بوستان، خیابان مریم',
      advisor: {
        id: 'user-adv-102',
        name: 'علیرضا احمدی',
        phone: '۰۹۱۶۳۳۳۴۵۶۷',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        role: 'کارشناس ارشد املاک ویلایی و کلنگی',
      },
      features: ['حیاط مشجر با ۳ جای پارک', 'سند ملکی تک‌برگ', 'بازسازی صفر تا صد', 'استخر روباز تابستانه'],
      description: 'ویلای مستقل و اصیل در یکی از آرام‌ترین فرعی‌های کوی بوستان گلستان. دارای حیاط سرسبز با نخل.',
      isPublic: true,
      sample: true,
      createdAt: '2026-09-25T08:00:00Z',
    },
    {
      id: 'prop-104',
      slug: 'commercial-45m-main-boulevard-golestan',
      title: 'واحد تجاری اداری ۴۵ متری سند اداری بلوار اصلی گلستان',
      propertyType: 'commercial',
      propertyTypeLabel: 'تجاری / اداری',
      status: 'available',
      statusLabel: 'موجود',
      priceToman: 1900000000,
      pricePerMeterToman: 42222222,
      areaSqm: 45,
      bedrooms: 1,
      yearBuilt: 1401,
      floor: 3,
      totalFloors: 5,
      neighborhood: 'گلستان، اهواز',
      address: 'اهواز، گلستان، بلوار اصلی فروردین، مجتمع اداری نگین',
      advisor: {
        id: 'user-adv-101',
        name: 'مهندس رضا کریمی',
        phone: '۰۹۱۶۱۱۱۱۲۳۴',
        avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=250&q=80',
        role: 'کارشناس ارشد املاک تجاری و اداری',
      },
      features: ['سند اداری رسمی', '۲ خط تلفن رند', 'آسانسور اداری با ژنراتور', 'نگهبانی ۲۴ ساعته'],
      description: 'موقعیت استثنایی تابلوخور بر اصلی بلوار پرتردد گلستان اهواز با دسترسی بی‌نظیر.',
      isPublic: true,
      sample: true,
      createdAt: '2026-10-04T14:15:00Z',
    },
    {
      id: 'prop-105',
      slug: 'penthouse-210m-aban-golestan',
      title: 'پنت‌هاوس ۲۱۰ متری لوکس با روف‌گاردن اختصاصی خیابان آبان',
      propertyType: 'apartment',
      propertyTypeLabel: 'پنت‌هاوس',
      status: 'sold',
      statusLabel: 'فروخته شد',
      priceToman: 6200000000,
      pricePerMeterToman: 29523809,
      areaSqm: 210,
      bedrooms: 3,
      yearBuilt: 1403,
      floor: 7,
      totalFloors: 7,
      neighborhood: 'گلستان، اهواز',
      address: 'اهواز، گلستان، خیابان آبان، نبش آذر',
      advisor: {
        id: 'user-adv-102',
        name: 'علیرضا احمدی',
        phone: '۰۹۱۶۳۳۳۴۵۶۷',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
        role: 'کارشناس املاک لوکس و پنت‌هاوس',
      },
      features: ['روف‌گاردن اختصاصی با دید ابدی', '۲ پارکینگ سندی', 'مستر جکوزی‌دار', 'BMS هوشمند'],
      description: 'اثری فاخر از سازنده بنام منطقه گلستان با برترین متریال‌های وارداتی.',
      isPublic: true,
      sample: true,
      createdAt: '2026-09-18T16:00:00Z',
    },
  ];

  const INITIAL_SALES = [
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
      sellingAdvisorShareToman: 0,
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
      sellingAdvisorShareToman: 0,
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
      listingAdvisorShareToman: 4275000, // ۵۰٪ سهم مشاوران
      sellingAdvisorShareToman: 4275000, // ۵۰٪ سهم مشاوران
      officeShareToman: 19950000,
      payoutStatus: 'pending_approval',
      saleDate: '۱۴۰۳/۰۷/۱۷',
      notes: 'فروش مشارکتی: فایل سارا محمدی توسط علیرضا احمدی فروخته شد. نیازمند تایید تسویه برای هر دو مشاور.',
    },
  ];

  const INITIAL_TRANSACTIONS = [
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

  // Helper storage functions
  function getStored(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (e) {
      console.warn('LocalStorage error:', e);
      return fallback;
    }
  }

  function setStored(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }

  // Ensure storage is seeded
  if (!localStorage.getItem('omid_properties_v2')) {
    setStored('omid_properties_v2', INITIAL_PROPERTIES);
  }
  if (!localStorage.getItem('omid_sales_v2')) {
    setStored('omid_sales_v2', INITIAL_SALES);
  }
  if (!localStorage.getItem('omid_wallet_txs_v2')) {
    setStored('omid_wallet_txs_v2', INITIAL_TRANSACTIONS);
  }

  // Active User / Role resolution
  function getCurrentUserId() {
    return localStorage.getItem('omid_current_user_id') || 'user-adv-101';
  }

  function getCurrentUser() {
    const uid = getCurrentUserId();
    return USERS.find((u) => u.id === uid) || USERS[0];
  }

  function setCurrentUser(userId) {
    const user = USERS.find((u) => u.id === userId);
    if (user) {
      localStorage.setItem('omid_current_user_id', user.id);
      localStorage.setItem('omid_current_role', user.role);
    }
  }

  function formatToman(num) {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num)) + ' تومان';
  }

  function formatNumber(num) {
    return new Intl.NumberFormat('fa-IR').format(Math.round(num));
  }

  function getJalaliDate() {
    return new Intl.DateTimeFormat('fa-IR-u-ca-persian', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date());
  }

  // ----------------------------------------------------
  // Properties APIs
  // ----------------------------------------------------
  function getProperties() {
    return getStored('omid_properties_v2', INITIAL_PROPERTIES);
  }

  function saveProperties(props) {
    setStored('omid_properties_v2', props);
  }

  function getPropertyById(id) {
    return getProperties().find((p) => p.id === id);
  }

  function createProperty(propData) {
    const properties = getProperties();
    const currentUser = getCurrentUser();
    const newId = 'prop-' + (Date.now().toString().slice(-4));
    const newProp = {
      id: newId,
      slug: 'prop-' + Date.now(),
      title: propData.title,
      propertyType: propData.propertyType || 'apartment',
      propertyTypeLabel: propData.propertyType === 'villa' ? 'ویلایی' : propData.propertyType === 'commercial' ? 'تجاری / اداری' : 'آپارتمان',
      status: 'available',
      statusLabel: 'موجود',
      priceToman: Number(propData.priceToman) || 0,
      pricePerMeterToman: Math.round((Number(propData.priceToman) || 0) / (Number(propData.areaSqm) || 1)),
      areaSqm: Number(propData.areaSqm) || 0,
      bedrooms: Number(propData.bedrooms) || 1,
      yearBuilt: Number(propData.yearBuilt) || 1403,
      neighborhood: 'گلستان، اهواز',
      address: propData.address || 'اهواز، محله گلستان',
      advisor: propData.advisorId
        ? (function() {
            const adv = USERS.find((u) => u.id === propData.advisorId) || currentUser;
            return {
              id: adv.id,
              name: adv.name,
              phone: adv.phone,
              avatar: adv.avatar,
              role: adv.roleLabel || 'مشاور',
            };
          })()
        : {
            id: currentUser.id,
            name: currentUser.name,
            phone: currentUser.phone,
            avatar: currentUser.avatar,
            role: currentUser.roleLabel,
          },
      features: propData.features || ['پارکینگ سندی', 'آسانسور'],
      description: propData.description || 'ملک کارشناسی‌شده در گلستان اهواز.',
      isPublic: true,
      sample: true,
      createdAt: new Date().toISOString(),
    };

    properties.unshift(newProp);
    saveProperties(properties);
    return newProp;
  }

  function updateProperty(id, data) {
    const properties = getProperties();
    const idx = properties.findIndex((p) => p.id === id);
    if (idx === -1) return null;

    const prop = properties[idx];
    if (data.title) prop.title = data.title;
    if (data.priceToman) {
      prop.priceToman = Number(data.priceToman);
      prop.pricePerMeterToman = Math.round(prop.priceToman / (prop.areaSqm || 1));
    }
    if (data.areaSqm) {
      prop.areaSqm = Number(data.areaSqm);
      prop.pricePerMeterToman = Math.round((prop.priceToman || 0) / prop.areaSqm);
    }
    if (data.bedrooms) prop.bedrooms = Number(data.bedrooms);
    if (data.propertyType) {
      prop.propertyType = data.propertyType;
      prop.propertyTypeLabel = data.propertyType === 'villa' ? 'ویلایی' : data.propertyType === 'commercial' ? 'تجاری / اداری' : 'آپارتمان';
    }
    if (data.address) prop.address = data.address;
    if (data.status) {
      prop.status = data.status;
      prop.statusLabel = data.status === 'available' ? 'موجود' : data.status === 'negotiating' ? 'در حال مذاکره' : 'فروخته شد';
    }
    if (data.advisorId) {
      const adv = USERS.find((u) => u.id === data.advisorId);
      if (adv) {
        prop.advisor = {
          id: adv.id,
          name: adv.name,
          phone: adv.phone,
          avatar: adv.avatar,
          role: adv.roleLabel || 'مشاور',
        };
      }
    }

    properties[idx] = prop;
    saveProperties(properties);
    return prop;
  }

  function deleteProperty(id) {
    const properties = getProperties();
    const filtered = properties.filter((p) => p.id !== id);
    saveProperties(filtered);
    return true;
  }

  // ----------------------------------------------------
  // Sales & Co-Brokering APIs
  // ----------------------------------------------------
  function getSales() {
    return getStored('omid_sales_v2', INITIAL_SALES);
  }

  function saveSales(sales) {
    setStored('omid_sales_v2', sales);
  }

  /**
   * Register a direct sale (Advisor sells their own property)
   */
  function recordDirectSale(data) {
    const sales = getSales();
    const prop = getPropertyById(data.propertyId);
    if (!prop) throw new Error('ملک یافت نشد.');

    const finalPrice = Number(data.finalPriceToman);
    const totalComm = Number(data.totalCommissionToman);
    const advisorShare = Math.round(totalComm * 0.30);
    const officeShare = totalComm - advisorShare;

    const newSale = {
      id: 'sale-' + (Date.now().toString().slice(-4)),
      propertyId: prop.id,
      propertyTitle: prop.title,
      saleType: 'direct',
      listingAdvisorId: prop.advisor.id,
      listingAdvisorName: prop.advisor.name,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      finalPriceToman: finalPrice,
      totalCommissionToman: totalComm,
      commissionRateSnapshot: 0.30,
      listingAdvisorShareToman: advisorShare,
      sellingAdvisorShareToman: 0,
      officeShareToman: officeShare,
      payoutStatus: 'pending_approval',
      saleDate: getJalaliDate(),
      notes: data.notes || 'معامله مستقیم ثبت شد؛ در انتظار تایید تسویه کارمزد.',
    };

    sales.unshift(newSale);
    saveSales(sales);

    // Update property to negotiating / sold
    updateProperty(prop.id, { status: 'negotiating' });

    return newSale;
  }

  /**
   * Register a co-brokered sale (Advisor B sells Advisor A's listing)
   * 50/50 split of the 30% advisor pool
   */
  function recordCoSale(data) {
    const sales = getSales();
    const prop = getPropertyById(data.propertyId);
    if (!prop) throw new Error('ملک یافت نشد.');
    if (prop.status === 'sold') throw new Error('این ملک قبلاً به فروش رسیده است و امکان معامله مجدد آن وجود ندارد.');

    const currentUser = getCurrentUser();
    const finalPrice = Number(data.finalPriceToman);
    const totalComm = Number(data.totalCommissionToman);

    // Total advisor pool is 30%
    const totalAdvisorPool = Math.round(totalComm * 0.30);
    // Split equally between Listing Agent and Selling Agent
    const listingShare = Math.round(totalAdvisorPool * 0.50);
    const sellingShare = totalAdvisorPool - listingShare;
    const officeShare = totalComm - (listingShare + sellingShare);

    const newSale = {
      id: 'sale-' + (Date.now().toString().slice(-4)),
      propertyId: prop.id,
      propertyTitle: prop.title,
      saleType: 'co_brokered',
      listingAdvisorId: prop.advisor.id,
      listingAdvisorName: prop.advisor.name,
      sellingAdvisorId: currentUser.id,
      sellingAdvisorName: currentUser.name,
      buyerName: data.buyerName,
      buyerPhone: data.buyerPhone,
      finalPriceToman: finalPrice,
      totalCommissionToman: totalComm,
      commissionRateSnapshot: 0.30,
      listingAdvisorShareToman: listingShare,
      sellingAdvisorShareToman: sellingShare,
      officeShareToman: officeShare,
      payoutStatus: 'pending_approval',
      saleDate: getJalaliDate(),
      notes: data.notes || `فروش مشارکتی: فایل ${prop.advisor.name} توسط ${currentUser.name} فروخته شد.`,
    };

    sales.unshift(newSale);
    saveSales(sales);

    // Update property to negotiating
    updateProperty(prop.id, { status: 'negotiating' });

    return newSale;
  }

  /**
   * 1-Click Approve and Deposit Payout
   * Approves a sale and immediately deposits commission to consultant wallet(s)
   */
  function approveSalePayout(saleId) {
    const currentUser = getCurrentUser();
    if (currentUser.role !== 'admin' && currentUser.role !== 'secretary') {
      throw new Error('تنها مدیرکل و منشی دفتر مجاز به تایید تسویه کارمزد هستند.');
    }

    const sales = getSales();
    const sale = sales.find((s) => s.id === saleId);
    if (!sale) throw new Error('رکورد معامله یافت نشد.');
    if (sale.payoutStatus === 'paid') throw new Error('کارمزد این معامله قبلاً تسویه و واریز گردیده است.');

    // 1. Mark sale as paid
    sale.payoutStatus = 'paid';
    sale.approvedBy = `${currentUser.name} (${currentUser.roleLabel})`;
    sale.approvedAt = getJalaliDate();
    saveSales(sales);

    // 2. Mark property as officially sold
    updateProperty(sale.propertyId, { status: 'sold' });

    // 3. Deposit to wallet(s)
    const txs = getWalletTransactions();
    const txDate = getJalaliDate();

    if (sale.saleType === 'direct') {
      // Single advisor deposit
      const tx = {
        id: 'tx-' + (Date.now().toString().slice(-4)),
        advisorId: sale.listingAdvisorId,
        advisorName: sale.listingAdvisorName,
        amountToman: sale.listingAdvisorShareToman,
        isCredit: true,
        type: 'commission',
        typeLabel: 'کمیسیون مستقیم',
        description: `سهم کارمزد فروش مستقیم: ${sale.propertyTitle}`,
        registeredBy: `${currentUser.name} (${currentUser.roleLabel})`,
        date: txDate,
        saleId: sale.id,
      };
      txs.unshift(tx);
    } else {
      // Co-brokered: Deposit to BOTH Listing Agent and Selling Agent
      const txListing = {
        id: 'tx-' + (Date.now().toString().slice(-4)) + '-1',
        advisorId: sale.listingAdvisorId,
        advisorName: sale.listingAdvisorName,
        amountToman: sale.listingAdvisorShareToman,
        isCredit: true,
        type: 'co_commission',
        typeLabel: 'کمیسیون همکاری (صاحب فایل)',
        description: `سهم کارمزد فروش مشارکتی (مالک فایل): ${sale.propertyTitle} (فروخته‌شده با همکاری ${sale.sellingAdvisorName})`,
        registeredBy: `${currentUser.name} (${currentUser.roleLabel})`,
        date: txDate,
        saleId: sale.id,
      };

      const txSelling = {
        id: 'tx-' + (Date.now().toString().slice(-4)) + '-2',
        advisorId: sale.sellingAdvisorId,
        advisorName: sale.sellingAdvisorName,
        amountToman: sale.sellingAdvisorShareToman,
        isCredit: true,
        type: 'co_commission',
        typeLabel: 'کمیسیون همکاری (مشاور خریدار)',
        description: `سهم کارمزد فروش مشارکتی (مشاور فروشنده): ${sale.propertyTitle} (فایل متعلق به ${sale.listingAdvisorName})`,
        registeredBy: `${currentUser.name} (${currentUser.roleLabel})`,
        date: txDate,
        saleId: sale.id,
      };

      txs.unshift(txSelling);
      txs.unshift(txListing);
    }

    saveWalletTransactions(txs);
    return sale;
  }

  // ----------------------------------------------------
  // Wallet & Manual Adjustments APIs
  // ----------------------------------------------------
  function getWalletTransactions() {
    return getStored('omid_wallet_txs_v2', INITIAL_TRANSACTIONS);
  }

  function saveWalletTransactions(txs) {
    setStored('omid_wallet_txs_v2', txs);
  }

  function getAdvisorBalance(advisorId) {
    const txs = getWalletTransactions().filter((t) => t.advisorId === advisorId);
    return txs.reduce((sum, t) => sum + (t.isCredit ? t.amountToman : -t.amountToman), 0);
  }

  /**
   * Manager / Secretary manual wallet adjustment with explicit reason
   */
  function adjustAdvisorWallet({ advisorId, amountToman, isCredit, reason }) {
    const currentUser = getCurrentUser();
    if (currentUser.role !== 'admin' && currentUser.role !== 'secretary') {
      throw new Error('فقط مدیرکل و منشی دفتر مجاز به تغییر موجودی کیف پول هستند.');
    }

    const advisor = USERS.find((u) => u.id === advisorId);
    if (!advisor) throw new Error('مشاور یافت نشد.');

    const amount = Math.abs(Number(amountToman));
    if (!amount || amount <= 0) throw new Error('مبلغ باید بزرگتر از صفر باشد.');
    if (!reason || !reason.trim()) throw new Error('درج دلیل تغییر موجودی الزامی است.');

    const txs = getWalletTransactions();
    const newTx = {
      id: 'tx-' + (Date.now().toString().slice(-4)),
      advisorId: advisor.id,
      advisorName: advisor.name,
      amountToman: amount,
      isCredit: Boolean(isCredit),
      type: isCredit ? 'bonus' : 'deduction',
      typeLabel: isCredit ? 'افزایش دستی / پاداش' : 'کسر دستی / مساعده',
      description: isCredit
        ? `افزایش موجودی توسط ${currentUser.roleLabel}: ${reason.trim()}`
        : `کسر از موجودی توسط ${currentUser.roleLabel}: ${reason.trim()}`,
      reason: reason.trim(),
      registeredBy: `${currentUser.name} (${currentUser.roleLabel})`,
      date: getJalaliDate(),
    };

    txs.unshift(newTx);
    saveWalletTransactions(txs);
    return newTx;
  }

  // UI Toast notification
  function showToast(message, type = 'success') {
    const existing = document.getElementById('omid-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.id = 'omid-toast';
    const bgColor = type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-rose-600' : 'bg-primary-800';
    toast.className = `fixed bottom-6 start-6 z-50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-white/20 transition-all duration-300 transform translate-y-0 text-xs sm:text-sm font-bold ${bgColor}`;
    toast.innerHTML = `
      <span>${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
      <span>${message}</span>
    `;
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.classList.add('opacity-0', 'translate-y-4');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // Expose to window for all scripts
  window.OmidDashboard = {
    USERS,
    getCurrentUserId,
    getCurrentUser,
    setCurrentUser,
    formatToman,
    formatNumber,
    getJalaliDate,
    getProperties,
    getPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    getSales,
    recordDirectSale,
    recordCoSale,
    approveSalePayout,
    getWalletTransactions,
    getAdvisorBalance,
    adjustAdvisorWallet,
    showToast,
  };
})();
