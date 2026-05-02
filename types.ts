
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
  theme?: 'light' | 'dark';
  size?: 'normal' | 'wide';
  isExternal?: boolean;
  onToast?: () => void;
}

export type ThemeMode = 'light' | 'dark';
export type Language = 'zh' | 'en' | 'ja' | 'ko' | 'es' | 'fr' | 'de' | 'el';

export interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  showToast: (message: string) => void;
  handleCardToast: () => void;
  pansouEnabled: boolean;
  setPansouEnabled: (enabled: boolean) => void;
}
