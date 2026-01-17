import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
  ka: {
    translation: {
      // Navigation
      dashboard: 'მთავარი',
      fathers: 'მამები',
      quotes: 'ციტატები',
      feedback: 'უკუკავშირი',
      settings: 'პარამეტრები',
      logout: 'გასვლა',
      
      // Common
      save: 'შენახვა',
      cancel: 'გაუქმება',
      delete: 'წაშლა',
      edit: 'რედაქტირება',
      add: 'დამატება',
      search: 'ძიება',
      loading: 'იტვირთება...',
      noData: 'მონაცემები არ მოიძებნა',
      confirmDelete: 'დარწმუნებული ხართ, რომ გსურთ წაშლა?',
      actions: 'მოქმედებები',
      
      // Login
      login: 'შესვლა',
      email: 'ელ.ფოსტა',
      password: 'პაროლი',
      loginError: 'შესვლის შეცდომა',
      
      // Dashboard
      totalFathers: 'სულ მამები',
      totalQuotes: 'სულ ციტატები',
      publishedQuotes: 'გამოქვეყნებული',
      draftQuotes: 'დრაფტები',
      unreadFeedback: 'წაუკითხავი შეტყობინებები',
      quickActions: 'სწრაფი მოქმედებები',
      addFather: 'მამის დამატება',
      addQuote: 'ციტატის დამატება',
      
      // Fathers
      fatherName: 'სახელი',
      fatherNameKa: 'სახელი (ქართულად)',
      fatherNameRu: 'სახელი (რუსულად)',
      bio: 'ბიოგრაფია',
      bioKa: 'ბიოგრაფია (ქართულად)',
      bioRu: 'ბიოგრაფია (რუსულად)',
      avatar: 'ავატარი',
      profileImage: 'პროფილის სურათი',
      order: 'რიგი',
      quotesCount: 'ციტატების რაოდენობა',
      
      // Quotes
      quoteText: 'ციტატის ტექსტი',
      textKa: 'ტექსტი (ქართულად)',
      textRu: 'ტექსტი (რუსულად)',
      sourceKa: 'წყარო (ქართულად)',
      sourceRu: 'წყარო (რუსულად)',
      selectFather: 'აირჩიეთ მამა',
      quoteDate: 'თარიღი',
      isPublished: 'გამოქვეყნებული',
      published: 'გამოქვეყნებული',
      draft: 'დრაფტი',
      
      // Feedback
      message: 'შეტყობინება',
      contact: 'კონტაქტი',
      date: 'თარიღი',
      status: 'სტატუსი',
      read: 'წაკითხული',
      unread: 'წაუკითხავი',
      markAsRead: 'წაკითხულად მონიშვნა',
      
      // Settings
      subscriberCount: 'გამომწერების რაოდენობა',
      updateCount: 'რაოდენობის განახლება',
      language: 'ენა',
      languageDescription: 'აირჩიეთ ადმინ-პანელის ინტერფეისის ენა',
    }
  },
  ru: {
    translation: {
      // Navigation
      dashboard: 'Главная',
      fathers: 'Отцы',
      quotes: 'Цитаты',
      feedback: 'Обратная связь',
      settings: 'Настройки',
      logout: 'Выход',
      
      // Common
      save: 'Сохранить',
      cancel: 'Отмена',
      delete: 'Удалить',
      edit: 'Редактировать',
      add: 'Добавить',
      search: 'Поиск',
      loading: 'Загрузка...',
      noData: 'Данные не найдены',
      confirmDelete: 'Вы уверены, что хотите удалить?',
      actions: 'Действия',
      
      // Login
      login: 'Вход',
      email: 'Email',
      password: 'Пароль',
      loginError: 'Ошибка входа',
      
      // Dashboard
      totalFathers: 'Всего отцов',
      totalQuotes: 'Всего цитат',
      publishedQuotes: 'Опубликовано',
      draftQuotes: 'Черновики',
      unreadFeedback: 'Непрочитанных сообщений',
      quickActions: 'Быстрые действия',
      addFather: 'Добавить отца',
      addQuote: 'Добавить цитату',
      
      // Fathers
      fatherName: 'Имя',
      fatherNameKa: 'Имя (грузинский)',
      fatherNameRu: 'Имя (русский)',
      bio: 'Биография',
      bioKa: 'Биография (грузинский)',
      bioRu: 'Биография (русский)',
      avatar: 'Аватар',
      profileImage: 'Изображение профиля',
      order: 'Порядок',
      quotesCount: 'Кол-во цитат',
      
      // Quotes
      quoteText: 'Текст цитаты',
      textKa: 'Текст (грузинский)',
      textRu: 'Текст (русский)',
      sourceKa: 'Источник (грузинский)',
      sourceRu: 'Источник (русский)',
      selectFather: 'Выберите отца',
      quoteDate: 'Дата',
      isPublished: 'Опубликовано',
      published: 'Опубликовано',
      draft: 'Черновик',
      
      // Feedback
      message: 'Сообщение',
      contact: 'Контакт',
      date: 'Дата',
      status: 'Статус',
      read: 'Прочитано',
      unread: 'Непрочитано',
      markAsRead: 'Отметить как прочитанное',
      
      // Settings
      subscriberCount: 'Количество подписчиков',
      updateCount: 'Обновить количество',
      language: 'Язык',
      languageDescription: 'Выберите язык интерфейса админ-панели',
    }
  }
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('admin-locale') || 'ru',
    fallbackLng: 'ka',
    interpolation: {
      escapeValue: false
    }
  });

type Locale = 'ka' | 'ru';

interface LocaleContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(
    (localStorage.getItem('admin-locale') as Locale) || 'ru'
  );

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('admin-locale', newLocale);
    i18n.changeLanguage(newLocale);
  };

  useEffect(() => {
    i18n.changeLanguage(locale);
  }, [locale]);

  const t = (key: string) => i18n.t(key);

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
}
