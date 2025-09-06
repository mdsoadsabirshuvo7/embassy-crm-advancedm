/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'en' | 'bn' | 'ar' | 'fr';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
  isRTL: boolean;
}

// Translation dictionaries
const translations = {
  en: {
    // Navigation
    'nav.dashboard': 'Dashboard',
    'nav.clients': 'Clients',
    'nav.accounting': 'Accounting',
    'nav.hr': 'Human Resources',
    'nav.documents': 'Documents',
    'nav.tasks': 'Tasks',
    'nav.reports': 'Reports',
    'nav.invoices': 'Invoices',
    'nav.expenses': 'Expenses',
    'nav.settings': 'Settings',

    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.delete': 'Delete',
    'common.edit': 'Edit',
    'common.add': 'Add',
    'common.search': 'Search',
    'common.loading': 'Loading...',
    'common.success': 'Success',
    'common.error': 'Error',
    'common.warning': 'Warning',

    // Dashboard
    'dashboard.title': 'Dashboard',
    'dashboard.welcome': 'Welcome back, {name}',
    'dashboard.totalClients': 'Total Clients',
    'dashboard.pendingTasks': 'Pending Tasks',
    'dashboard.monthlyRevenue': 'Monthly Revenue',

    // Clients
    'clients.title': 'Client Management',
    'clients.addClient': 'Add Client',
    'clients.clientName': 'Client Name',
    'clients.email': 'Email',
    'clients.phone': 'Phone',
    'clients.status': 'Status',

    // Settings
    'settings.title': 'Settings',
    'settings.general': 'General',
    'settings.branding': 'Branding',
    'settings.modules': 'Modules',
    'settings.language': 'Language',
    'settings.notifications': 'Notifications',

    // Module Management
    'modules.title': 'Module Management',
    'modules.description': 'Enable or disable features for your organization',
    'modules.core': 'Core Modules',
    'modules.business': 'Business Modules',
    'modules.advanced': 'Advanced Modules',
  },
  bn: {
    // Navigation
    'nav.dashboard': 'ড্যাশবোর্ড',
    'nav.clients': 'ক্লায়েন্ট',
    'nav.accounting': 'অ্যাকাউন্টিং',
    'nav.hr': 'মানব সম্পদ',
    'nav.documents': 'নথি',
    'nav.tasks': 'কাজ',
    'nav.reports': 'রিপোর্ট',
    'nav.invoices': 'ইনভয়েস',
    'nav.expenses': 'খরচ',
    'nav.settings': 'সেটিংস',

    // Common
    'common.save': 'সংরক্ষণ',
    'common.cancel': 'বাতিল',
    'common.delete': 'মুছে ফেলুন',
    'common.edit': 'সম্পাদনা',
    'common.add': 'যোগ করুন',
    'common.search': 'অনুসন্ধান',
    'common.loading': 'লোড হচ্ছে...',
    'common.success': 'সফল',
    'common.error': 'ত্রুটি',
    'common.warning': 'সতর্কতা',

    // Dashboard
    'dashboard.title': 'ড্যাশবোর্ড',
    'dashboard.welcome': 'স্বাগতম, {name}',
    'dashboard.totalClients': 'মোট ক্লায়েন্ট',
    'dashboard.pendingTasks': 'অপেক্ষমাণ কাজ',
    'dashboard.monthlyRevenue': 'মাসিক আয়',

    // Settings
    'settings.title': 'সেটিংস',
    'settings.general': 'সাধারণ',
    'settings.branding': 'ব্র্যান্ডিং',
    'settings.modules': 'মডিউল',
    'settings.language': 'ভাষা',
    'settings.notifications': 'বিজ্ঞপ্তি',

    // Module Management
    'modules.title': 'মডিউল ব্যবস্থাপনা',
    'modules.description': 'আপনার প্রতিষ্ঠানের জন্য বৈশিষ্ট্য সক্ষম বা নিষ্ক্রিয় করুন',
    'modules.core': 'মূল মডিউল',
    'modules.business': 'ব্যবসায়িক মডিউল',
    'modules.advanced': 'উন্নত মডিউল',
  },
  ar: {
    // Navigation
    'nav.dashboard': 'لوحة التحكم',
    'nav.clients': 'العملاء',
    'nav.accounting': 'المحاسبة',
    'nav.hr': 'الموارد البشرية',
    'nav.documents': 'المستندات',
    'nav.tasks': 'المهام',
    'nav.reports': 'التقارير',
    'nav.invoices': 'الفواتير',
    'nav.expenses': 'المصروفات',
    'nav.settings': 'الإعدادات',

    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.delete': 'حذف',
    'common.edit': 'تحرير',
    'common.add': 'إضافة',
    'common.search': 'بحث',
    'common.loading': 'جاري التحميل...',
    'common.success': 'نجح',
    'common.error': 'خطأ',
    'common.warning': 'تحذير',

    // Dashboard
    'dashboard.title': 'لوحة التحكم',
    'dashboard.welcome': 'مرحباً بك، {name}',
    'dashboard.totalClients': 'إجمالي العملاء',
    'dashboard.pendingTasks': 'المهام المعلقة',
    'dashboard.monthlyRevenue': 'الإيرادات الشهرية',

    // Settings
    'settings.title': 'الإعدادات',
    'settings.general': 'عام',
    'settings.branding': 'العلامة التجارية',
    'settings.modules': 'الوحدات',
    'settings.language': 'اللغة',
    'settings.notifications': 'الإشعارات',

    // Module Management
    'modules.title': 'إدارة الوحدات',
    'modules.description': 'تمكين أو تعطيل الميزات لمؤسستك',
    'modules.core': 'الوحدات الأساسية',
    'modules.business': 'وحدات الأعمال',
    'modules.advanced': 'الوحدات المتقدمة',
  },
  fr: {
    // Navigation
    'nav.dashboard': 'Tableau de bord',
    'nav.clients': 'Clients',
    'nav.accounting': 'Comptabilité',
    'nav.hr': 'Ressources humaines',
    'nav.documents': 'Documents',
    'nav.tasks': 'Tâches',
    'nav.reports': 'Rapports',
    'nav.invoices': 'Factures',
    'nav.expenses': 'Dépenses',
    'nav.settings': 'Paramètres',

    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.delete': 'Supprimer',
    'common.edit': 'Modifier',
    'common.add': 'Ajouter',
    'common.search': 'Rechercher',
    'common.loading': 'Chargement...',
    'common.success': 'Succès',
    'common.error': 'Erreur',
    'common.warning': 'Avertissement',

    // Dashboard
    'dashboard.title': 'Tableau de bord',
    'dashboard.welcome': 'Bienvenue, {name}',
    'dashboard.totalClients': 'Total des clients',
    'dashboard.pendingTasks': 'Tâches en attente',
    'dashboard.monthlyRevenue': 'Revenus mensuels',

    // Settings
    'settings.title': 'Paramètres',
    'settings.general': 'Général',
    'settings.branding': 'Image de marque',
    'settings.modules': 'Modules',
    'settings.language': 'Langue',
    'settings.notifications': 'Notifications',

    // Module Management
    'modules.title': 'Gestion des modules',
    'modules.description': 'Activer ou désactiver les fonctionnalités pour votre organisation',
    'modules.core': 'Modules de base',
    'modules.business': 'Modules métier',
    'modules.advanced': 'Modules avancés',
  }
};

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language') as Language;
    return saved || 'en';
  });

  const isRTL = language === 'ar';

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', isRTL ? 'rtl' : 'ltr');
  }, [language, isRTL]);

  const t = (key: string, params?: Record<string, string>): string => {
    let translation = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    if (params) {
      Object.entries(params).forEach(([param, value]) => {
        translation = translation.replace(`{${param}}`, value);
      });
    }
    
    return translation;
  };

  return (
    <I18nContext.Provider value={{
      language,
      setLanguage,
      t,
      isRTL
    }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};