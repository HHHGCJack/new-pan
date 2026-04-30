
export interface NavItem {
  label: string;
  href?: string;
  children?: NavChild[];
}

export interface NavChild {
  title: string;
  desc: string;
  href: string;
  tag?: string;
}

export interface ProductCardProps {
  title: string;
  description: string;
  imageUrl?: string;
  gradient?: string;
  href: string;
  tag?: string;
  size?: 'normal' | 'wide';
  isExternal?: boolean;
  onToast?: () => void;
  uiTheme: 'light' | 'dark';
  i18nVisit: string;
  i18nComingSoon: string;
}

export type Theme = 'light' | 'dark';
export type Language = 'zh' | 'en';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  showToast: (message: string) => void;
  handleCardToast: () => void;
  pansouEnabled: boolean;
  setPansouEnabled: (enabled: boolean) => void;
}