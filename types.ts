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
  imageUrl: string;
  href: string;
  tag?: string;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'wide';
  isExternal?: boolean;
  onToast?: () => void;
}