import React, { useState } from 'react';
import { X, Github, Mail } from 'lucide-react';
import { useTheme } from '../App';

type ModalType = 'privacy' | 'terms' | 'contact' | null;

export const Footer: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const { themeMode, language } = useTheme();

  const isDark = themeMode === 'dark';

  const translations = {
    zh: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: '隐私政策',
      terms: '服务条款',
      contact: '联系我',
      contactDesc: '随时欢迎交流与反馈',
      privacyContent: [
        '我们非常重视您的隐私。本网站（G胖儿GongPan）目前不收集任何个人身份信息。所有的资源链接均为直接跳转。',
        '1. 数据收集: 我们不使用 Cookies 跟踪您的个人行为，也不存储您的 IP 地址。',
        '2. 第三方链接: 本网站包含指向第三方网站的链接。我们对这些网站的内容或隐私惯例不承担任何责任。',
        '3. 变更: 我们可能会不时更新本隐私政策。'
      ],
      termsContent: [
        '欢迎访问 G胖儿GongPan。',
        '1. 免责声明: 本站提供的所有资源仅供学习与交流，严禁用于商业用途。资源版权归原作者所有。',
        '2. 使用规则: 您同意仅出于合法目的使用本网站，不得利用本网站进行任何违法活动。',
        '3. 内容所有权: 本站设计的 UI 风格归 Pan Studio 所有。'
      ]
    },
    en: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: 'Privacy',
      terms: 'Terms',
      contact: 'Contact',
      contactDesc: 'Feedback and communication always welcome',
      privacyContent: [
        'We value your privacy. This website currently does not collect any personal identity information.',
        '1. Data Collection: We do not use Cookies to track personal behavior, nor do we store your IP.',
        '2. Third-Party Links: This website contains links to third-party websites. We are not responsible for their content.',
        '3. Changes: We may update this privacy policy from time to time.'
      ],
      termsContent: [
        'Welcome to GongPan.',
        '1. Disclaimer: Resources are for learning and exchange only, strictly not for commercial use.',
        '2. Usage Rules: You agree to use this site only for lawful purposes.',
        '3. Ownership: The UI style designed here belongs to Pan Studio.'
      ]
    },
    ja: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: 'プライバシー',
      terms: '利用規約',
      contact: 'コンタクト',
      contactDesc: 'フィードバックとコミュニケーションはいつでも歓迎します',
      privacyContent: [
        '当社はあなたのプライバシーを重視しています。このウェブサイトは現在、個人を特定できる情報を収集していません。',
        '1. データ収集: 個人の行動を追跡するためのCookieは使用しておらず、IPも保存していません。',
        '2. 第三者リンク: このウェブサイトには第三者のウェブサイトへのリンクが含まれています。その内容について当社は責任を負いません。',
        '3. 変更: このプライバシーポリシーを随時更新することがあります。'
      ],
      termsContent: [
        'GongPanへようこそ。',
        '1. 免責事項: リソースは学習と交流のみを目的としており、商業利用は厳禁です。',
        '2. 利用規則: 本サイトは合法的な目的でのみ使用することに同意するものとします。',
        '3. 所有権: ここでデザインされたUIスタイルはPan Studioに帰属します。'
      ]
    },
    ko: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: '개인정보 보호',
      terms: '서비스 약관',
      contact: '연락처',
      contactDesc: '의견 및 문의는 언제나 환영합니다',
      privacyContent: [
        '당사는 귀하의 개인정보를 소중하게 생각합니다. 본 웹사이트는 현재 개인 식별 정보를 수집하지 않습니다.',
        '1. 데이터 수집: 개인 행동을 추적하기 위해 쿠키를 사용하지 않으며 IP를 저장하지 않습니다.',
        '2. 타사 링크: 본 웹사이트에는 타사 웹사이트에 대한 링크가 포함되어 있습니다. 당사는 해당 콘텐츠에 대해 책임지지 않습니다.',
        '3. 변경 사항: 본 개인정보 보호 정책은 수시로 업데이트될 수 있습니다.'
      ],
      termsContent: [
        'GongPan에 오신 것을 환영합니다.',
        '1. 면책 조항: 자료는 학습 및 교류만을 위한 것이며 상업적 이용은 엄격히 금지됩니다.',
        '2. 이용 규칙: 귀하는 합법적인 목적으로만 이 사이트를 이용하는 것에 동의합니다.',
        '3. 소유권: 본 사이트에 디자인된 UI 스타일의 소유권은 Pan Studio에 있습니다.'
      ]
    },
    es: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: 'Privacidad',
      terms: 'Términos',
      contact: 'Contacto',
      contactDesc: 'Los comentarios y la comunicación siempre son bienvenidos',
      privacyContent: [
        'Valoramos su privacidad. Actualmente, este sitio web no recopila información de identidad personal.',
        '1. Recopilación de datos: No usamos Cookies para rastrear el comportamiento personal, ni almacenamos su IP.',
        '2. Enlaces de terceros: Este sitio web contiene enlaces a sitios de terceros. No somos responsables de su contenido.',
        '3. Cambios: Podemos actualizar esta política de privacidad ocasionalmente.'
      ],
      termsContent: [
        'Bienvenido a GongPan.',
        '1. Descargo de responsabilidad: Los recursos son solo para aprendizaje e intercambio, estrictamente prohibido el uso comercial.',
        '2. Reglas de uso: Usted acepta usar este sitio solo para fines legales.',
        '3. Propiedad: El estilo de UI diseñado aquí pertenece a Pan Studio.'
      ]
    },
    fr: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: 'Confidentialité',
      terms: 'Termes',
      contact: 'Contact',
      contactDesc: 'Les commentaires et la communication sont toujours les bienvenus',
      privacyContent: [
        'Nous attachons de l\'importance à votre vie privée. Ce site web ne collecte actuellement aucune information d\'identité personnelle.',
        '1. Collecte de données: Nous n\'utilisons pas de Cookies pour suivre le comportement personnel, et nous ne stockons pas votre IP.',
        '2. Liens tiers: Ce site web contient des liens vers des sites tiers. Nous ne sommes pas responsables de leur contenu.',
        '3. Modifications: Nous pouvons mettre à jour cette politique de confidentialité de temps en temps.'
      ],
      termsContent: [
        'Bienvenue sur GongPan.',
        '1. Clause de non-responsabilité: Les ressources sont uniquement à des fins d\'apprentissage et d\'échange, strictement interdites à un usage commercial.',
        '2. Règles d\'utilisation: Vous acceptez d\'utiliser ce site uniquement à des fins légales.',
        '3. Propriété: Le style d\'interface utilisateur conçu ici appartient à Pan Studio.'
      ]
    },
    de: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: 'Datenschutz',
      terms: 'Bedingungen',
      contact: 'Kontakt',
      contactDesc: 'Feedback und Kommunikation sind immer willkommen',
      privacyContent: [
        'Wir legen großen Wert auf Ihre Privatsphäre. Diese Website sammelt derzeit keine personenbezogenen Daten.',
        '1. Datenerhebung: Wir verwenden keine Cookies, um das persönliche Verhalten zu verfolgen, und wir speichern nicht Ihre IP.',
        '2. Links von Dritten: Diese Website enthält Links zu Websites von Dritten. Wir sind nicht für deren Inhalt verantwortlich.',
        '3. Änderungen: Wir können diese Datenschutzrichtlinie von Zeit zu Zeit aktualisieren.'
      ],
      termsContent: [
        'Willkommen bei GongPan.',
        '1. Haftungsausschluss: Ressourcen dienen nur dem Lernen und dem Austausch, kommerzielle Nutzung ist strengstens untersagt.',
        '2. Nutzungsregeln: Sie erklären sich damit einverstanden, diese Seite nur für legale Zwecke zu nutzen.',
        '3. Eigentum: Der hier entworfene UI-Stil gehört Pan Studio.'
      ]
    },
    el: {
      copyright: '© 2026 Designed for Simplicity.',
      privacy: 'Απόρρητο',
      terms: 'Όροι',
      contact: 'Επικοινωνία',
      contactDesc: 'Τα σχόλια και η επικοινωνία είναι πάντα ευπρόσδεκτα',
      privacyContent: [
        'Εκτιμούμε το απόρρητό σας. Αυτός ο ιστότοπος δεν συλλέγει προσωπικές πληροφορίες.',
        '1. Συλλογή Δεδομένων: Δεν χρησιμοποιούμε Cookies για παρακολούθηση, ούτε αποθηκεύουμε την IP σας.',
        '2. Σύνδεσμοι τρίτων: Αυτός ο ιστότοπος περιέχει συνδέσμους. Δεν φέρουμε ευθύνη για το περιεχόμενό τους.',
        '3. Αλλαγές: Ενδέχεται να ενημερώνουμε αυτήν την πολιτική κατά καιρούς.'
      ],
      termsContent: [
        'Καλώς ήρθατε στο GongPan.',
        '1. Αποποίηση: Οι πόροι προορίζονται μόνο για μάθηση, απαγορεύεται η εμπορική χρήση.',
        '2. Κανόνες χρήσης: Συμφωνείτε να χρησιμοποιείτε αυτόν τον ιστότοπο μόνο για νόμιμους σκοπούς.',
        '3. Ιδιοκτησία: Το στυλ UI ανήκει στο Pan Studio.'
      ]
    }
  };

  const t = (translations as any)[language] || translations.en;
  const closeModal = () => setActiveModal(null);

  const modalStyle = isDark
    ? 'bg-black/40 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.5),_inset_0_1px_1px_rgba(255,255,255,0.1),_inset_0_-1px_1px_rgba(0,0,0,0.5)] border border-white/10 text-white'
    : 'bg-white/10 backdrop-blur-[30px] backdrop-saturate-[220%] shadow-[0_50px_100px_rgba(0,0,0,0.2),_inset_0_1px_1px_rgba(255,255,255,0.8),_inset_0_-1px_1px_rgba(255,255,255,0.1)] border border-white/30 text-gray-900';

  return (
    <>
      <footer className={`w-full py-12 px-6 backdrop-blur-sm ${isDark ? 'bg-black/20 border-t border-white/10' : 'bg-white/50 border-t border-gray-200/50'}`}>
        <div className="max-w-7xl mx-auto flex flex-col items-center justify-center space-y-4">
          <div className={`text-xl font-bold tracking-tight ${isDark ? 'text-white' : 'text-gray-900'}`}>Pan Studio</div>
          <p className={`text-[10px] tracking-[0.2em] uppercase ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
            {t.copyright}
          </p>
          <div className="flex space-x-8 mt-2">
            <button onClick={() => setActiveModal('privacy')} className={`text-xs font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>{t.privacy}</button>
            <button onClick={() => setActiveModal('terms')} className={`text-xs font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>{t.terms}</button>
            <button onClick={() => setActiveModal('contact')} className={`text-xs font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>{t.contact}</button>
            <a href="/admin" className={`text-xs font-medium transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-black'}`}>Admin</a>
          </div>
        </div>
      </footer>

      {/* Shared Modal Overlay */}
      <div 
        className={`fixed inset-0 z-[110] flex items-center justify-center px-6 transition-all duration-300 ${
          activeModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'
        }`}
      >
        <div className="absolute inset-0 bg-transparent" onClick={closeModal} />
        
        <div 
          className={`relative w-full max-w-md rounded-[2.5rem] p-8 md:p-10 transform transition-[transform,opacity] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] ${modalStyle} ${
            activeModal ? 'scale-100 translate-y-0 opacity-100' : 'scale-95 translate-y-4 opacity-0'
          }`}
        >
          <button 
            onClick={closeModal} 
            className={`absolute top-6 right-6 p-2 rounded-full transition-colors ${isDark ? 'bg-white/10 hover:bg-white/20' : 'bg-black/5 hover:bg-black/10'}`}
          >
            <X size={20} />
          </button>

          {activeModal === 'contact' && (
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-2">{t.contact}</h3>
              <p className={`text-sm mb-8 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{t.contactDesc}</p>
              
              <div className="space-y-4">
                <a href="mailto:3387287031@qq.com" className={`flex items-center p-4 rounded-2xl transition-colors border shadow-sm group ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-white/50 hover:bg-white/80 border-white/40'}`}>
                  <div className={`p-3 rounded-full mr-4 group-hover:scale-110 transition-transform ${isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-50 text-blue-600'}`}>
                    <Mail size={20} />
                  </div>
                  <div className="text-left overflow-hidden">
                    <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>Email</div>
                    <div className="font-medium truncate">3387287031@qq.com</div>
                  </div>
                </a>

                <a href="https://github.com/gongpan" target="_blank" rel="noopener noreferrer" className={`flex items-center p-4 rounded-2xl transition-colors border shadow-sm group ${isDark ? 'bg-white/5 hover:bg-white/10 border-white/10' : 'bg-white/50 hover:bg-white/80 border-white/40'}`}>
                   <div className={`p-3 rounded-full mr-4 group-hover:scale-110 transition-transform ${isDark ? 'bg-white/10 text-white' : 'bg-gray-100 text-gray-900'}`}>
                    <Github size={20} />
                  </div>
                  <div className="text-left">
                    <div className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>GitHub</div>
                    <div className="font-medium">@gongpan</div>
                  </div>
                </a>
              </div>
            </div>
          )}

          {activeModal === 'privacy' && (
            <div>
              <h3 className="text-2xl font-bold mb-6">{t.privacy}</h3>
              <div className={`text-sm space-y-4 leading-relaxed h-[300px] overflow-y-auto pr-2 scrollbar-hide flex flex-col ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.privacyContent.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            </div>
          )}

          {activeModal === 'terms' && (
             <div>
             <h3 className="text-2xl font-bold mb-6">{t.terms}</h3>
             <div className={`text-sm space-y-4 leading-relaxed h-[300px] overflow-y-auto pr-2 scrollbar-hide flex flex-col ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                {t.termsContent.map((p, i) => <p key={i}>{p}</p>)}
             </div>
           </div>
          )}
        </div>
      </div>
    </>
  );
};