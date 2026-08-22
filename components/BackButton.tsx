import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../App';
import { Language } from '../types';

interface BackButtonProps {
  to?: string;
  onClick?: () => void;
  label?: string;
  className?: string;
}

const backTranslations: Record<Language, string> = {
  zh: '返回主页',
  en: 'Return to Home',
  ja: 'ホームに戻る',
  ko: '홈으로 이동',
  es: 'Volver al Inicio',
  fr: "Retour à l'accueil",
  de: 'Zurück zur Startseite',
  el: 'Επιστροφή στην Αρχική',
};

export const BackButton: React.FC<BackButtonProps> = ({
  to = '/',
  onClick,
  label,
  className = '',
}) => {
  const { themeMode, language } = useTheme();
  const isDark = themeMode === 'dark';

  const buttonText = label || backTranslations[language] || '返回主页';

  const baseClasses = `group inline-flex items-center space-x-2 text-sm font-semibold transition-all duration-200 px-4 py-2 rounded-full border shadow-sm ${
    isDark
      ? 'border-white/15 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/30 active:scale-95 backdrop-blur-md'
      : 'border-gray-200 bg-white/70 text-gray-700 hover:text-black hover:bg-white hover:border-gray-300 hover:shadow active:scale-95 backdrop-blur-md'
  } ${className}`;

  if (onClick) {
    return (
      <button onClick={onClick} className={baseClasses} type="button">
        <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>{buttonText}</span>
      </button>
    );
  }

  return (
    <Link to={to} className={baseClasses}>
      <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-0.5" />
      <span>{buttonText}</span>
    </Link>
  );
};
