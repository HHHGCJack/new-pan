import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../App';
import { Copy, Check, Code, Terminal, ArrowLeft, Layers, FileText, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Laboratory: React.FC = () => {
  const { themeMode, language, showToast } = useTheme();
  
  // UI Tab Active State
  const [activeTab, setActiveTab] = useState<'glass' | 'json' | 'codec' | 'token'>('glass');
  const isDark = themeMode === 'dark';

  // State: Common copied indicator
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // States: Glassmorphism designer
  const [glassBlur, setGlassBlur] = useState<number>(16);
  const [glassOpacity, setGlassOpacity] = useState<number>(25);
  const [glassSaturation, setGlassSaturation] = useState<number>(140);
  const [glassBorderOpacity, setGlassBorderOpacity] = useState<number>(15);

  // States: JSON validation & formatter
  const [jsonInput, setJsonInput] = useState<string>('');
  const [jsonOutput, setJsonOutput] = useState<string>('');
  const [jsonIndent, setJsonIndent] = useState<number>(2);
  const [jsonIsValid, setJsonIsValid] = useState<boolean | null>(null);
  const [jsonError, setJsonError] = useState<string>('');

  // States: Codec (Base64 & URL)
  const [codecInput, setCodecInput] = useState<string>('');
  const [codecOutput, setCodecOutput] = useState<string>('');
  const [codecError, setCodecError] = useState<string>('');

  // States: Strong key generator
  const [tokenLength, setTokenLength] = useState<number>(16);
  const [tokenUpper, setTokenUpper] = useState<boolean>(true);
  const [tokenLower, setTokenLower] = useState<boolean>(true);
  const [tokenNumbers, setTokenNumbers] = useState<boolean>(true);
  const [tokenSymbols, setTokenSymbols] = useState<boolean>(true);
  const [generatedToken, setGeneratedToken] = useState<string>('');
  const [tokenStrength, setTokenStrength] = useState<'weak' | 'medium' | 'strong'>('strong');

  // Trigger copy tool
  const triggerCopy = (text: string, label: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    showToast(language === 'zh' ? '复制成功！' : 'Copied successfully!');
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Trigger base64 / URL encoding-decoding
  const runCodec = (action: 'b64-encode' | 'b64-decode' | 'url-encode' | 'url-decode') => {
    setCodecError('');
    if (!codecInput) {
      setCodecOutput('');
      return;
    }
    try {
      if (action === 'b64-encode') {
        // Safe standard unicode Base64 encoding
        const encoder = new TextEncoder();
        const data = encoder.encode(codecInput);
        let binString = "";
        data.forEach((byte) => {
          binString += String.fromCharCode(byte);
        });
        setCodecOutput(btoa(binString));
      } else if (action === 'b64-decode') {
        try {
          const binString = atob(codecInput);
          const uint8Array = Uint8Array.from(binString, (m) => m.codePointAt(0) || 0);
          const decoder = new TextDecoder();
          setCodecOutput(decoder.decode(uint8Array));
        } catch {
          throw new Error(language === 'zh' ? '无效的 Base64 编码格式' : 'Invalid Base64 format');
        }
      } else if (action === 'url-encode') {
        setCodecOutput(encodeURIComponent(codecInput));
      } else if (action === 'url-decode') {
        try {
          setCodecOutput(decodeURIComponent(codecInput));
        } catch {
          throw new Error(language === 'zh' ? '无效的 URL 编码格式' : 'Invalid URL encoded format');
        }
      }
    } catch (err: any) {
      setCodecError(err.message || 'Error occurred');
      setCodecOutput('');
    }
  };

  // Format or format minified JSON
  const processJson = (mode: 'beautify' | 'minify') => {
    setJsonError('');
    setJsonIsValid(null);
    if (!jsonInput.trim()) {
      setJsonOutput('');
      return;
    }
    try {
      const parsed = JSON.parse(jsonInput);
      setJsonIsValid(true);
      if (mode === 'beautify') {
        setJsonOutput(JSON.stringify(parsed, null, jsonIndent));
      } else {
        setJsonOutput(JSON.stringify(parsed));
      }
    } catch (err: any) {
      setJsonIsValid(false);
      setJsonError(err.message || 'JSON parsing error');
      setJsonOutput('');
    }
  };

  // Generate ultra high entropy keys
  const generateTokenNow = () => {
    const uppers = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const lowers = 'abcdefghijklmnopqrstuvwxyz';
    const nums = '0123456789';
    const syms = '!@#$%^&*()_+-=[]{}|;:,.<>?';

    let allowedChars = '';
    if (tokenUpper) allowedChars += uppers;
    if (tokenLower) allowedChars += lowers;
    if (tokenNumbers) allowedChars += nums;
    if (tokenSymbols) allowedChars += syms;

    if (!allowedChars) {
      setGeneratedToken('');
      return;
    }

    let result = '';
    const length = tokenLength;
    const randomArray = new Uint32Array(length);
    window.crypto.getRandomValues(randomArray);

    for (let i = 0; i < length; i++) {
      result += allowedChars[randomArray[i] % allowedChars.length];
    }

    setGeneratedToken(result);

    // Dynamic strength scoring
    let checkedCount = 0;
    if (tokenUpper) checkedCount++;
    if (tokenLower) checkedCount++;
    if (tokenNumbers) checkedCount++;
    if (tokenSymbols) checkedCount++;

    if (length < 8 || checkedCount <= 1) {
      setTokenStrength('weak');
    } else if (length < 12 || checkedCount <= 2) {
      setTokenStrength('medium');
    } else {
      setTokenStrength('strong');
    }
  };

  // Generate password on mount and option toggles
  useEffect(() => {
    generateTokenNow();
  }, [tokenLength, tokenUpper, tokenLower, tokenNumbers, tokenSymbols]);

  // Multilanguage Translations setup
  const translations = {
    zh: {
      labTitle: "创新实验室",
      labSub: "极客专属的前沿实验性交互工具箱与在线沙盒。所有数据就地即时运算，确保纯粹的隐私与安全。",
      tabs: {
        glass: "磨砂玻璃卡片生成器",
        json: "JSON 格式化校验",
        codec: "Base64 & URL 编解码",
        token: "安全随机密钥生成器"
      },
      glass: {
        title: "Liquid Glassmorphism 磨砂玻璃预设面板",
        subtitle: "交互式调整高斯模糊与色彩深度，实时复制 Tailwind 或纯 CSS 类名。",
        blur: "高斯模糊度",
        opacity: "背景透明度",
        saturation: "色彩饱和度",
        border: "边缘线条不透明",
        preview: "玻璃效果实时演示",
        cardTitle: "探索未知边界",
        cardDesc: "GongPan Laboratory 引领极简流动的透明高精视觉美感。",
        copyCss: "复制 CSS 纯样式",
        copyTw: "复制 Tailwind 类名",
      },
      json: {
        title: "JSON 深度格式化与合规校验",
        subtitle: "粘贴或键入任意 JSON 内容，支持一键进行压缩或标准化美化缩进。",
        inputLabel: "原始 JSON 输入",
        outputLabel: "格式化输出结果",
        btnBeautify: "美化排版",
        btnMinify: "紧凑压缩",
        indent2: "2 空格缩进",
        indent4: "4 空格缩进",
        valid: "合规 JSON 数据格式！",
        invalid: "语法错误:"
      },
      codec: {
        title: "Base64 与 URL 安全高效安全编解码",
        subtitle: "秒级将文本与代码在标准 Base64 或 URL 格式之间流畅转换。",
        inputLabel: "待处理文本",
        outputLabel: "编解码结果",
        btnB64Enc: "Base64 编码",
        btnB64Dec: "Base64 解码",
        btnUrlEnc: "URL 编码",
        btnUrlDec: "URL 解码",
        error: "格式解析失败:"
      },
      token: {
        title: "工业级高熵密钥 / 强密码安全生成器",
        subtitle: "采用浏览器底层安全随机数（webcrypto），保障生成的口令具备极高不可破解度。",
        length: "密钥生成长度",
        opts: "字符组成规则",
        upper: "大写字母 (A-Z)",
        lower: "小写字母 (a-z)",
        num: "独立数字 (0-9)",
        sym: "特殊字符 (!@#...)",
        strength: "密钥破译安全级",
        weak: "【偏弱】建议延长位数或勾选多元字符",
        medium: "【中等安全】适用于一般网站账户",
        strong: "【极高安全】不可破解，支持现代高防护口令",
        btnRefresh: "新生成一组",
        copyBtn: "复制安全密钥"
      }
    },
    en: {
      labTitle: "Inno Laboratory",
      labSub: "An interactive utility toolbox & playground built specifically for web geeks and developers. Run locally instantly.",
      tabs: {
        glass: "Glassmorphism Designer",
        json: "JSON Validator & Beautifier",
        codec: "Base64 & URL Codec",
        token: "High-Entropy Password Generator"
      },
      glass: {
        title: "Liquid Glassmorphism Interface Designer",
        subtitle: "Adjust backdrop filters, blur, and opacity settings interactively to copy CSS or Tailwind recipes.",
        blur: "Backdrop Blur Radius",
        opacity: "Backdrop Opacity",
        saturation: "Color Saturation",
        border: "Border Line Opacity",
        preview: "Live Sandbox Preview",
        cardTitle: "Explore the Unknown",
        cardDesc: "Leading highly minimalistic fluid visuals and modern aesthetics by GongPan.",
        copyCss: "Copy CSS Rules",
        copyTw: "Copy Tailwind Classes",
      },
      json: {
        title: "Strict JSON Validation & Code Styler",
        subtitle: "Paste messy JSON payload to beautify with dynamic spacing, validate schemas, or compress syntax.",
        inputLabel: "Source JSON Payload",
        outputLabel: "Beautified / Minified Results",
        btnBeautify: "Format JSON",
        btnMinify: "Minify Raw",
        indent2: "2 Spaces Tab",
        indent4: "4 Spaces Tab",
        valid: "Valid JSON schema recognized!",
        invalid: "Parsing error:"
      },
      codec: {
        title: "Symmetric Base64 & Safe URL Encoder / Decoder",
        subtitle: "Fast unicode string processing system to swap between standard base64 and web URI encodings.",
        inputLabel: "Source String Content",
        outputLabel: "Processed Codec Results",
        btnB64Enc: "B64 Encode",
        btnB64Dec: "B64 Decode",
        btnUrlEnc: "URL Encode",
        btnUrlDec: "URL Decode",
        error: "Codec error:"
      },
      token: {
        title: "High-Entropy Secure Password Generator",
        subtitle: "Powered by cryptographic secure random numbers (Web Crypto API) for robust password strength.",
        length: "Password Length",
        opts: "String Content Filters",
        upper: "Uppercase A-Z",
        lower: "Lowercase a-z",
        num: "Numerical 0-9",
        sym: "Special characters (!@#...)",
        strength: "Security Rating",
        weak: "Weak - Increase length or include extra flags",
        medium: "Medium - Good for normal website registry requirements",
        strong: "Strong - Industrial protection against brute force attacks",
        btnRefresh: "Regenerate Key",
        copyBtn: "Copy Password"
      }
    }
  }[language === 'zh' ? 'zh' : 'en'];

  // Reactive classes for glass effects
  const liquidGlassClass = isDark
    ? 'bg-black/20 backdrop-blur-[20px] backdrop-saturate-[180%] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.4)]'
    : 'bg-white/40 backdrop-blur-[20px] backdrop-saturate-[180%] border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_20px_50px_rgba(0,0,0,0.05)]';

  const tabItemClass = (tab: typeof activeTab) => {
    const isSelected = activeTab === tab;
    if (isSelected) {
      return isDark
        ? 'bg-white/15 border-white/20 text-blue-400 shadow-[0_4px_16px_rgba(59,130,246,0.15)] font-black'
        : 'bg-white/90 border-blue-500/30 text-blue-600 shadow-[0_4px_16px_rgba(0,0,0,0.05)] font-black';
    }
    return isDark
      ? 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
      : 'border-transparent text-gray-600 hover:text-black hover:bg-black/5';
  };

  // Glassmorphism dynamic custom styles
  const previewCardStyle = {
    backdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation}%)`,
    WebkitBackdropFilter: `blur(${glassBlur}px) saturate(${glassSaturation}%)`,
    backgroundColor: isDark ? `rgba(0, 0, 0, ${glassOpacity / 100})` : `rgba(255, 255, 255, ${glassOpacity / 100})`,
    borderColor: isDark ? `rgba(255, 255, 255, ${glassBorderOpacity / 100})` : `rgba(0, 0, 0, ${glassBorderOpacity / 100})`,
  };

  const getGlassStyleString = () => {
    return `backdrop-filter: blur(${glassBlur}px) saturate(${glassSaturation}%);\nbackground-color: ${
      isDark ? `rgba(0, 0, 0, ${glassOpacity / 100})` : `rgba(255, 255, 255, ${glassOpacity / 100})`
    };\nborder: 1px solid ${
      isDark ? `rgba(255, 255, 255, ${glassBorderOpacity / 100})` : `rgba(0, 0, 0, ${glassBorderOpacity / 100})`
    };`;
  };

  const getGlassTailwindString = () => {
    const bgOpacityStr = Math.round(glassOpacity);
    const borderOpacityStr = Math.round(glassBorderOpacity);
    return `bg-${isDark ? 'black' : 'white'}/${bgOpacityStr} backdrop-blur-[${glassBlur}px] backdrop-saturate-[${glassSaturation}%] border border-${
      isDark ? 'white' : 'black'
    }/${borderOpacityStr}`;
  };

  return (
    <div className="flex-grow pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Return home link */}
      <div className="flex items-center mb-6">
        <Link 
          to="/" 
          className={`flex items-center space-x-2 text-sm font-semibold transition-all px-4 py-2 rounded-full border ${
            isDark 
              ? 'border-white/10 bg-white/5 text-gray-300 hover:text-white hover:bg-white/10' 
              : 'border-gray-200 bg-white/50 text-gray-600 hover:text-black hover:bg-white'
          }`}
        >
          <ArrowLeft size={16} />
          <span>{language === 'zh' ? '返回主页' : 'Return Home'}</span>
        </Link>
      </div>

      {/* Hero Header Area */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Terminal size={14} />
          <span>GongPan Laboratory</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          {translations.labTitle}
        </h1>
        <p className={`text-base md:text-lg max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'} leading-relaxed`}>
          {translations.labSub}
        </p>
      </div>

      {/* Laboratory main Grid container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation selection rail */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 p-1.5 rounded-3xl border border-white/20 backdrop-blur-md bg-white/5 overflow-x-auto lg:overflow-visible shrink-0 scrollbar-none">
          <button
            onClick={() => setActiveTab('glass')}
            className={`flex items-center justify-center lg:justify-start space-x-3 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all flex-1 lg:flex-initial whitespace-nowrap ${tabItemClass('glass')}`}
          >
            <Layers size={18} />
            <span>{translations.tabs.glass}</span>
          </button>
          <button
            onClick={() => setActiveTab('json')}
            className={`flex items-center justify-center lg:justify-start space-x-3 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all flex-1 lg:flex-initial whitespace-nowrap ${tabItemClass('json')}`}
          >
            <Code size={18} />
            <span>{translations.tabs.json}</span>
          </button>
          <button
            onClick={() => setActiveTab('codec')}
            className={`flex items-center justify-center lg:justify-start space-x-3 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all flex-1 lg:flex-initial whitespace-nowrap ${tabItemClass('codec')}`}
          >
            <FileText size={18} />
            <span>{translations.tabs.codec}</span>
          </button>
          <button
            onClick={() => setActiveTab('token')}
            className={`flex items-center justify-center lg:justify-start space-x-3 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all flex-1 lg:flex-initial whitespace-nowrap ${tabItemClass('token')}`}
          >
            <Terminal size={18} />
            <span>{translations.tabs.token}</span>
          </button>
        </div>

        {/* Dynamic Display Area */}
        <div className="lg:col-span-9 w-full">
          <AnimatePresence mode="wait">
            
            {/* TAB: GLASSMORPHISM */}
            {activeTab === 'glass' && (
              <motion.div
                key="glass-designer"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className={`rounded-[2.5rem] p-6 md:p-8 border ${liquidGlassClass}`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold tracking-tight mb-1">{translations.glass.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{translations.glass.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-stretch pt-2">
                  {/* Slider controls block */}
                  <div className="space-y-6 flex flex-col justify-center">
                    {/* Gaussian Blur slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{translations.glass.blur}</span>
                        <span className="font-mono text-blue-500">{glassBlur}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="40"
                        value={glassBlur}
                        onChange={(e) => setGlassBlur(Number(e.target.value))}
                        className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Opacity slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{translations.glass.opacity}</span>
                        <span className="font-mono text-blue-500">{glassOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={glassOpacity}
                        onChange={(e) => setGlassOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Saturation slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{translations.glass.saturation}</span>
                        <span className="font-mono text-blue-500">{glassSaturation}%</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="200"
                        value={glassSaturation}
                        onChange={(e) => setGlassSaturation(Number(e.target.value))}
                        className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Border Opacity slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{translations.glass.border}</span>
                        <span className="font-mono text-blue-500">{glassBorderOpacity}%</span>
                      </div>
                      <input
                        type="range"
                        min="5"
                        max="80"
                        value={glassBorderOpacity}
                        onChange={(e) => setGlassBorderOpacity(Number(e.target.value))}
                        className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>
                  </div>

                  {/* Sandbox preview column */}
                  <div className="flex flex-col justify-between rounded-[2rem] p-6 bg-gradient-to-tr from-indigo-500/15 via-purple-500/10 to-blue-500/15 border border-white/5 shadow-inner overflow-hidden relative min-h-[300px]">
                    <span className="text-xs font-mono font-bold tracking-widest text-[#82aaff] uppercase mb-4 z-10">{translations.glass.preview}</span>
                    
                    {/* Animated color globes underneath mockup card */}
                    <div className="absolute -left-12 -top-12 w-40 h-40 bg-gradient-to-tr from-pink-500 to-red-500 rounded-full blur-[40px] opacity-40 animate-pulse pointer-events-none" />
                    <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-gradient-to-tr from-blue-500 to-emerald-500 rounded-full blur-[40px] opacity-40 animate-pulse delay-700 pointer-events-none" />

                    {/* Glass card object container */}
                    <div className="flex-grow flex items-center justify-center py-6 z-10">
                      <div style={previewCardStyle} className="rounded-3xl p-6 border max-w-[320px] shadow-2xl transition-all duration-150">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 border border-blue-500/30">
                            <Layers size={18} />
                          </div>
                          <div>
                            <h4 className="text-sm font-black truncate">{translations.glass.cardTitle}</h4>
                            <p className="text-[10px] font-mono tracking-wider opacity-60">ID: GP-LAB-BOX</p>
                          </div>
                        </div>
                        <p className="text-xs leading-relaxed opacity-80">{translations.glass.cardDesc}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Formatted Code copy cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/5">
                  <div className="p-4 rounded-2xl bg-black/25 border border-white/5 relative group">
                    <span className="text-xs font-mono font-bold text-gray-500 block mb-2">{translations.glass.cssCode}</span>
                    <pre className="font-mono text-xs text-[#82aaff] overflow-x-auto whitespace-pre-wrap select-all leading-relaxed">
                      {getGlassStyleString()}
                    </pre>
                    <button
                      onClick={() => triggerCopy(getGlassStyleString(), 'css')}
                      className="absolute right-3 top-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-gray-400 hover:text-white transition-all border border-white/5"
                    >
                      {copiedText === 'css' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="p-4 rounded-2xl bg-black/25 border border-white/5 relative group">
                    <span className="text-xs font-mono font-bold text-gray-500 block mb-2">{translations.glass.twCode}</span>
                    <pre className="font-mono text-xs text-amber-500 overflow-x-auto whitespace-pre-wrap select-all leading-relaxed">
                      {getGlassTailwindString()}
                    </pre>
                    <button
                      onClick={() => triggerCopy(getGlassTailwindString(), 'tw')}
                      className="absolute right-3 top-3 p-2 rounded-lg bg-white/5 hover:bg-white/10 active:scale-95 text-gray-400 hover:text-white transition-all border border-white/5"
                    >
                      {copiedText === 'tw' ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: JSON STYLER */}
            {activeTab === 'json' && (
              <motion.div
                key="json-styler"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className={`rounded-[2.5rem] p-6 md:p-8 border ${liquidGlassClass}`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold tracking-tight mb-1">{translations.json.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{translations.json.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left input */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{translations.json.inputLabel}</label>
                    <textarea
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      placeholder={translations.json.placeholder}
                      className="w-full h-80 p-4 font-mono text-xs rounded-2xl border focus:outline-none transition-all resize-none bg-black/35 border-white/5 text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Right formatted output */}
                  <div className="flex flex-col space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{translations.json.outputLabel}</label>
                      {jsonOutput && (
                        <button
                          onClick={() => triggerCopy(jsonOutput, 'json-out')}
                          className="flex items-center space-x-1 px-2.0 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 border border-white/5"
                        >
                          {copiedText === 'json-out' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          <span>{copiedText === 'json-out' ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <pre className="w-full h-80 p-4 font-mono text-xs rounded-2xl border bg-[#0d0d11] border-white/10 text-emerald-400 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                      {jsonOutput || '{...}'}
                    </pre>
                  </div>
                </div>

                {/* Validation Status message */}
                {jsonIsValid !== null && (
                  <div className={`mt-4 p-4 rounded-xl flex items-center space-x-3 text-sm font-bold border ${
                    jsonIsValid 
                      ? 'bg-green-500/10 border-green-500/25 text-green-500' 
                      : 'bg-red-500/10 border-red-500/25 text-red-500'
                  }`}>
                    <AlertCircle size={18} />
                    <span>{jsonIsValid ? translations.json.valid : `${translations.json.invalid} ${jsonError}`}</span>
                  </div>
                )}

                {/* Toolbar actions bar */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-4 items-center justify-between">
                  {/* Indentation configuration selectors */}
                  <div className="flex bg-black/20 rounded-xl p-1 border border-white/5">
                    <button
                      onClick={() => setJsonIndent(2)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${jsonIndent === 2 ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                    >
                      {translations.json.indent2}
                    </button>
                    <button
                      onClick={() => setJsonIndent(4)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${jsonIndent === 4 ? 'bg-white/10 text-white' : 'text-gray-400'}`}
                    >
                      {translations.json.indent4}
                    </button>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={() => processJson('beauty')}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs"
                    >
                      {translations.json.btnBeautify}
                    </button>
                    <button
                      onClick={() => processJson('minify')}
                      className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 font-bold text-xs"
                    >
                      {translations.json.btnMinify}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* TAB: CODEC (Base64) */}
            {activeTab === 'codec' && (
              <motion.div
                key="codec-coder"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className={`rounded-[2.5rem] p-6 md:p-8 border ${liquidGlassClass}`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold tracking-tight mb-1">{translations.codec.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{translations.codec.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left String input */}
                  <div className="flex flex-col space-y-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{translations.codec.inputLabel}</label>
                    <textarea
                      value={codecInput}
                      onChange={(e) => setCodecInput(e.target.value)}
                      placeholder={translations.codec.placeholder}
                      className="w-full h-80 p-4 font-mono text-xs rounded-2xl border focus:outline-none transition-all resize-none bg-black/35 border-white/5 text-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>

                  {/* Right codec output */}
                  <div className="flex flex-col space-y-2 relative">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{translations.codec.outputLabel}</label>
                      {codecOutput && (
                        <button
                          onClick={() => triggerCopy(codecOutput, 'codec-out')}
                          className="flex items-center space-x-1 px-2.0 py-1 rounded bg-white/5 hover:bg-white/10 text-xs font-mono text-gray-300 border border-white/5"
                        >
                          {copiedText === 'codec-out' ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                          <span>{copiedText === 'codec-out' ? 'Copied' : 'Copy'}</span>
                        </button>
                      )}
                    </div>
                    <pre className="w-full h-80 p-4 font-mono text-xs rounded-2xl border bg-[#0d0d11] border-white/10 text-amber-500 overflow-y-auto whitespace-pre-wrap leading-relaxed select-all">
                      {codecOutput || '...'}
                    </pre>
                  </div>
                </div>

                {/* Parsing decode standard errors */}
                {codecError && (
                  <div className="mt-4 p-4 rounded-xl flex items-center space-x-3 text-sm font-bold border bg-red-500/10 border-red-500/25 text-red-500">
                    <AlertCircle size={18} />
                    <span>{translations.codec.error} {codecError}</span>
                  </div>
                )}

                {/* Multi-Trigger button bar */}
                <div className="mt-6 pt-4 border-t border-white/5 flex flex-wrap gap-3 justify-end">
                  <button
                    onClick={() => runCodec('b64-encode')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs"
                  >
                    {translations.codec.btnB64Enc}
                  </button>
                  <button
                    onClick={() => runCodec('b64-decode')}
                    className="px-4 py-2.5 rounded-xl bg-black/35 hover:bg-black/50 border border-white/10 text-gray-200 font-bold text-xs"
                  >
                    {translations.codec.btnB64Dec}
                  </button>
                  <button
                    onClick={() => runCodec('url-encode')}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs"
                  >
                    {translations.codec.btnUrlEnc}
                  </button>
                  <button
                    onClick={() => runCodec('url-decode')}
                    className="px-4 py-2.5 rounded-xl bg-black/35 hover:bg-black/50 border border-white/10 text-gray-200 font-bold text-xs"
                  >
                    {translations.codec.btnUrlDec}
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB: SECURE KEY GENERATOR */}
            {activeTab === 'token' && (
              <motion.div
                key="secure-keygen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.25 }}
                className={`rounded-[2.5rem] p-6 md:p-8 border ${liquidGlassClass}`}
              >
                <div className="mb-6">
                  <h3 className="text-xl font-bold tracking-tight mb-1">{translations.token.title}</h3>
                  <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>{translations.token.subtitle}</p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 pt-2">
                  {/* Slider and Filter Options Column */}
                  <div className="xl:col-span-7 space-y-6">
                    {/* Size Selector slider */}
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm font-bold">
                        <span>{translations.token.length}</span>
                        <span className="font-mono text-blue-500">{tokenLength} chars</span>
                      </div>
                      <input
                        type="range"
                        min="6"
                        max="64"
                        value={tokenLength}
                        onChange={(e) => setTokenLength(Number(e.target.value))}
                        className="w-full h-2 bg-black/10 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-blue-500"
                      />
                    </div>

                    {/* Filter flag check blocks */}
                    <div className="space-y-3">
                      <span className="text-xs font-bold uppercase tracking-wider text-gray-500 block mb-1">{translations.token.opts}</span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <label className="flex items-center space-x-3 p-3 rounded-xl border border-white/5 bg-black/10 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={tokenUpper}
                            onChange={(e) => setTokenUpper(e.target.checked)}
                            className="rounded text-blue-500 focus:ring-0 w-4 h-4 bg-transparent border-white/20"
                          />
                          <span className="text-sm font-medium">{translations.token.upper}</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 rounded-xl border border-white/5 bg-black/10 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={tokenLower}
                            onChange={(e) => setTokenLower(e.target.checked)}
                            className="rounded text-blue-500 focus:ring-0 w-4 h-4 bg-transparent border-white/20"
                          />
                          <span className="text-sm font-medium">{translations.token.lower}</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 rounded-xl border border-white/5 bg-black/10 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={tokenNumbers}
                            onChange={(e) => setTokenNumbers(e.target.checked)}
                            className="rounded text-blue-500 focus:ring-0 w-4 h-4 bg-transparent border-white/20"
                          />
                          <span className="text-sm font-medium">{translations.token.num}</span>
                        </label>
                        <label className="flex items-center space-x-3 p-3 rounded-xl border border-white/5 bg-black/10 cursor-pointer select-none">
                          <input
                            type="checkbox"
                            checked={tokenSymbols}
                            onChange={(e) => setTokenSymbols(e.target.checked)}
                            className="rounded text-blue-500 focus:ring-0 w-4 h-4 bg-transparent border-white/20"
                          />
                          <span className="text-sm font-medium">{translations.token.sym}</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Output Generated String and rating Column */}
                  <div className="xl:col-span-5 flex flex-col justify-between p-6 rounded-3xl bg-black/25 border border-white/5">
                    {/* Live styled Output viewer block */}
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-[#0d0d11] border border-white/10 select-all font-mono text-sm break-all text-center text-teal-400 font-bold min-h-[72px] flex items-center justify-center">
                        {generatedToken || 'Select options...'}
                      </div>

                      {/* Score Indicator details block */}
                      {generatedToken && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold">
                            <span>{translations.token.strength}</span>
                            <span className={
                              tokenStrength === 'strong' ? 'text-green-500' : tokenStrength === 'medium' ? 'text-[#f78c6c]' : 'text-red-500'
                            }>
                              {tokenStrength.toUpperCase()}
                            </span>
                          </div>
                          
                          {/* Colored dynamic progress indicators */}
                          <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden flex">
                            <div className={`h-full transition-all duration-300 ${
                              tokenStrength === 'strong' 
                                ? 'bg-green-500 w-full' 
                                : tokenStrength === 'medium' 
                                  ? 'bg-[#f78c6c] w-2/3' 
                                  : 'bg-red-500 w-1/3'
                            }`} />
                          </div>
                          
                          <p className="text-[10px] text-gray-500 leading-normal">
                            {translations.token[tokenStrength]}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Trigger Generate & Copy blocks */}
                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button
                        onClick={generateTokenNow}
                        className="px-4 py-3 rounded-xl border border-white/10 hover:bg-white/5 font-bold text-xs"
                      >
                        {translations.token.btnRefresh}
                      </button>
                      <button
                        onClick={() => triggerCopy(generatedToken, 'pass-copy')}
                        className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-blue-500/10"
                      >
                        {translations.token.copyBtn}
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
