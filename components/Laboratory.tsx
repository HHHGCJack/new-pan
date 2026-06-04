import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from '../App';
import { Search, Copy, Check, Code, Terminal, BookOpen, AlertCircle, ArrowLeft, Layers } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Problem {
  id: string;
  title: string;
  code: string;
}

const PROBLEMS: Problem[] = [
  {
    id: "5114",
    title: "倒序输出一个四位整数",
    code: "s=input().strip()\nprint(int(s[::-1]))"
  },
  {
    id: "5111",
    title: "分糖果",
    code: `a,b,c,d,e=map(int,input().split())
t=a//3
a=t
b+=t
e+=t
t=b//3
b=t
a+=t
c+=t
t=c//3
c=t
b+=t
d+=t
t=d//3
d=t
c+=t
e+=t
t=e//3
e=t
d+=t
a+=t
print(a,b,c,d,e)`
  },
  {
    id: "5101",
    title: "魔方",
    code: `n=int(input())
print(8)
print(12*(n-2))
print(6*(n-2)*(n-2))`
  },
  {
    id: "5129",
    title: "判断成绩等级",
    code: `s=int(input())
if s>=86:
    print("VERY GOOD")
elif s>=60:
    print("GOOD")
else:
    print("BAD")`
  },
  {
    id: "5136",
    title: "判断某年某月的天数",
    code: `y,m=map(int,input().split())
if m in [1,3,5,7,8,10,12]:
    print(31)
elif m in [4,6,9,11]:
    print(30)
else:
    if y%400==0 or y%4==0 and y%100!=0:
        print(29)
    else:
        print(28)`
  },
  {
    id: "5226",
    title: "数数小木块",
    code: `n=int(input())
print(n*(n+1)*(n+2)//6)`
  },
  {
    id: "5222",
    title: "寻找雷劈数",
    code: `for n in range(1000,10000):
    a=n//100
    b=n%100
    if (a+b)**2==n:
        print(n)`
  },
  {
    id: "5249",
    title: "判断素数",
    code: `import math
n=int(input())
if n<2:
    print('F')
else:
    f=1
    for i in range(2,int(math.isqrt(n))+1):
        if n%i==0:
            f=0
            break
    print('T'if f else 'F')`
  },
  {
    id: "5322",
    title: "角谷猜想",
    code: `n,c=int(input()),0
while n>1:n=n//2if n%2==0else n*3+1;c+=1
print(c)`
  },
  {
    id: "5216",
    title: "打折优惠",
    code: `n=int(input())
s=sum(map(int,input().split()))
if s>100:s=100+(s-100)*0.9
print("{0:.2f}".format(s))`
  },
  {
    id: "5258",
    title: "列表元素的移动",
    code: `n=int(input())
a=list(map(int,input().split()))
x=int(input())
t=a.pop(x-1)
a.append(t)
print(' '.join(map(str,a)))`
  },
  {
    id: "5296",
    title: "校门外的树",
    code: `L,M=map(int,input().split())
tree=[1]*(L+1)
for _ in range(M):
    s,e=map(int,input().split())
    for i in range(s,e+1):
        tree[i]=0
print(sum(tree))`
  },
  {
    id: "5281",
    title: "数字环",
    code: `n=int(input())
a=list(map(int,input().split()))
arr=a+a
maxs=-1
pos=0
for i in range(n):
    s=sum(arr[i:i+4])
    if s>maxs:
        maxs=s
        pos=i+1
print(maxs,pos)`
  },
  {
    id: "5507",
    title: "大小写转换",
    code: `s=input()
print(s.swapcase())`
  },
  {
    id: "5525",
    title: "判断是否构成回文",
    code: `s=input().strip()
t=s[:-1]
print("TRUE"if t==t[::-1]else"FALSE")`
  },
  {
    id: "9717",
    title: "统计气球",
    code: `from collections import Counter
n=int(input())
lst=[input().strip()for _ in range(n)]
cnt=Counter(lst)
res=sorted(cnt.items(),key=lambda x:(-x[1],x[0]))
print(res[0][0])`
  },
  {
    id: "5805",
    title: "哥德巴赫猜想",
    code: `import math
def is_prime(x):
    if x<2:
        return False
    for i in range(2,int(math.isqrt(x))+1):
        if x%i==0:
            return False
    return True
for n in range(6,101,2):
    for a in range(2,n):
        b=n-a
        if is_prime(a) and is_prime(b):
            print(f"{n}={a}+{b}")
            break`
  },
  {
    id: "5804",
    title: "回文三位素数",
    code: `import math
def isprime(x):
    if x<2:return False
    for i in range(2,int(math.isqrt(x))+1):
        if x%i==0:return False
    return True
for n in range(100,1000):
    s=str(n)
    if s==s[::-1] and isprime(n):
        print(n)`
  },
  {
    id: "40016",
    title: "成绩排序",
    code: `s=[]
for _ in range(10):
    n,sc=input().split()
    s.append([n,int(sc)])
s.sort(key=lambda x:-x[1])
for i in s:
    print(i[0],i[1])`
  },
  {
    id: "1047",
    title: "计算并集",
    code: `while True:
    try:
        input()
        a = set(map(int, input().split()))
        b = set(map(int, input().split()))
        print(' '.join(map(str, sorted(a | b))))
    except EOFError:
        break`
  }
];

export const Laboratory: React.FC = () => {
  const { themeMode, language, showToast } = useTheme();
  const [activeTab, setActiveTab] = useState<'exam' | 'info'>('exam');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProblem, setSelectedProblem] = useState<Problem>(PROBLEMS[0]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const t = {
    zh: {
      labTitle: "创新实验室",
      labSub: "极客专属的实验性功能与期末考参考资料汇编。",
      tabs: {
        exam: "信息期末考试",
        explore: "实验工具箱"
      },
      searchPlace: "搜索题目编号或名称...",
      copyCode: "复制代码",
      copied: "复制成功！",
      langBadge: "Python 代码",
      noResults: "未找到相关题目",
      problemList: "题目列表",
      codePreview: "代码预览及精读",
      comingSoon: "敬请期待更多实验工具..."
    },
    en: {
      labTitle: "Inno Laboratory",
      labSub: "Experimental toolbox and final exam database for tech geeks.",
      tabs: {
        exam: "IT General Exam",
        explore: "Lab Toolbox"
      },
      searchPlace: "Search ID or title...",
      copyCode: "Copy Code",
      copied: "Copied!",
      langBadge: "Python Code",
      noResults: "No problems found",
      problemList: "Problems Index",
      codePreview: "Code Analysis & Preview",
      comingSoon: "More experimental tools coming soon..."
    },
    ja: {
      labTitle: "革新ラボ",
      labSub: "テックマニア向けの実験的ツールと期末試験データベース。",
      tabs: {
        exam: "情報期末試験",
        explore: "ラボツール"
      },
      searchPlace: "IDやタイトルで検索...",
      copyCode: "コピーする",
      copied: "コピーしました！",
      langBadge: "Python コード",
      noResults: "該当する問題が見つかりません",
      problemList: "問題インデックス",
      codePreview: "コードプレビュー",
      comingSoon: "さらに多くの実験機能が近日追加予定..."
    },
    ko: {
      labTitle: "이노 실험실",
      labSub: "실험적 도구 및 정보 기말고사 데이터베이스.",
      tabs: {
        exam: "정보 기말고사",
        explore: "실험실 박스"
      },
      searchPlace: "ID 또는 제목 검색...",
      copyCode: "코드 복사",
      copied: "복사됨!",
      langBadge: "Python 코드",
      noResults: "일치하는 문제가 없습니다",
      problemList: "문제 색인",
      codePreview: "코드 미리보기",
      comingSoon: "더 많은 실험적 도구가 곧 추가됩니다..."
    },
    es: {
      labTitle: "Laboratorio",
      labSub: "Caja de herramientas y base de datos para geeks de la tecnología.",
      tabs: {
        exam: "Examen de Informática",
        explore: "Herramientas"
      },
      searchPlace: "Buscar ID o título...",
      copyCode: "Copiar Código",
      copied: "¡Copiado!",
      langBadge: "Código Python",
      noResults: "No se encontraron problemas",
      problemList: "Lista de Problemas",
      codePreview: "Vista de Código",
      comingSoon: "Más herramientas de laboratorio próximamente..."
    },
    fr: {
      labTitle: "Laboratoire",
      labSub: "Base de données d'examen et boîte à outils pour les geeks du web.",
      tabs: {
        exam: "Examen Informatique",
        explore: "Boîte à Outils"
      },
      searchPlace: "Rechercher un ID ou titre...",
      copyCode: "Copier le code",
      copied: "Copié !",
      langBadge: "Code Python",
      noResults: "Aucun problème trouvé",
      problemList: "Index des problèmes",
      codePreview: "Visualisation du code",
      comingSoon: "Bientôt plus d'outils disponibles..."
    },
    de: {
      labTitle: "Laboratorium",
      labSub: "Experimentelle Tools und Prüfungsdatenbank für Tech-Geeks.",
      tabs: {
        exam: "Informatik-Prüfung",
        explore: "Werkzeuge"
      },
      searchPlace: "Suche ID oder Titel...",
      copyCode: "Code kopieren",
      copied: "Kopiert!",
      langBadge: "Python Code",
      noResults: "Keine Aufgaben gefunden",
      problemList: "Aufgabenverzeichnis",
      codePreview: "Code-Ansicht",
      comingSoon: "Weitere Labor-Tools in Kürze..."
    },
    el: {
      labTitle: "Εργαστήριο",
      labSub: "Πειραματική εργαλειοθήκη και βάση δεδομένων πληροφορικής.",
      tabs: {
        exam: "Εξετάσεις Πληροφορικής",
        explore: "Εργαλεία"
      },
      searchPlace: "Αναζήτηση ID ή τίτλου...",
      copyCode: "Αντιγραφή Κώδικα",
      copied: "Αντιγράφηκε!",
      langBadge: "Κώδικας Python",
      noResults: "Δεν βρέθηκαν ασκήσεις",
      problemList: "Ευρετήριο Ασκήσεων",
      codePreview: "Προεπισκόπηση Κώδικα",
      comingSoon: "Περισσότερα εργαλεία σύντομα..."
    }
  }[language] || {
    labTitle: "创新实验室",
    labSub: "极客专属的实验性功能与期末考参考资料汇编。",
    tabs: { exam: "信息期末考试", explore: "实验工具箱" },
    searchPlace: "搜索题目编号或名称...",
    copyCode: "复制代码",
    copied: "复制成功！",
    langBadge: "Python 代码",
    noResults: "未找到相关题目",
    problemList: "题目列表",
    codePreview: "代码预览及精读",
    comingSoon: "敬请期待更多实验工具..."
  };

  const filteredProblems = PROBLEMS.filter(p => 
    p.id.includes(searchTerm) || p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCopy = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedId(id);
    showToast(t.copied);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simplistic Highlight syntax logic
  const highlightPython = (code: string) => {
    const lines = code.split('\n');
    return lines.map((line, idx) => {
      // Very basic keyword coloring
      const tokens = line.split(/(\s+|=|\(|\)|\[|\]|,|\+|-|\*|\/\/|:|\.|\{|\})/);
      const elements = tokens.map((token, tIdx) => {
        const pythonKeywords = [
          'import', 'from', 'def', 'return', 'if', 'elif', 'else', 
          'for', 'in', 'while', 'print', 'input', 'strip', 'split', 
          'int', 'map', 'list', 'append', 'pop', 'sum', 'sorted', 'str', 
          'join', 'set', 'try', 'except', 'EOFError', 'break', 'False', 'True'
        ];
        
        if (pythonKeywords.includes(token)) {
          // Purple/Orange colors depending on keyword types
          if (['if', 'elif', 'else', 'for', 'in', 'while', 'try', 'except', 'break', 'return', 'def'].includes(token)) {
            return <span key={tIdx} className="text-[#c792ea] font-semibold">{token}</span>;
          }
          if (['print', 'input', 'strip', 'split', 'map', 'list', 'append', 'pop', 'sum', 'sorted', 'str', 'join', 'set', 'int'].includes(token)) {
            return <span key={tIdx} className="text-[#82aaff] font-medium">{token}</span>;
          }
          return <span key={tIdx} className="text-[#f78c6c]">{token}</span>;
        }
        
        // Match numbers
        if (/^\d+$/.test(token)) {
          return <span key={tIdx} className="text-[#f78c6c]">{token}</span>;
        }

        // Match string literals
        if (token.startsWith('"') || token.startsWith("'")) {
          return <span key={tIdx} className="text-[#c3e88d]">{token}</span>;
        }

        return <span key={tIdx}>{token}</span>;
      });

      return (
        <div key={idx} className="flex hover:bg-white/5 px-4 py-0.5 rounded transition-colors font-mono text-sm leading-6">
          <span className="w-8 select-none text-gray-600 border-r border-gray-800 mr-4 text-right pr-2">{idx + 1}</span>
          <span className="flex-1 whitespace-pre">{elements}</span>
        </div>
      );
    });
  };

  const isDark = themeMode === 'dark';

  const liquidGlassClass = isDark
    ? 'bg-black/20 backdrop-blur-[20px] backdrop-saturate-[180%] border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),_0_20px_50px_rgba(0,0,0,0.4)]'
    : 'bg-white/40 backdrop-blur-[20px] backdrop-saturate-[180%] border-white/40 shadow-[inset_0_1px_2px_rgba(255,255,255,0.8),_0_20px_50px_rgba(0,0,0,0.05)]';

  const sidebarItemClass = (active: boolean) => {
    if (active) {
      return isDark 
        ? 'bg-white/10 border-white/20 text-white shadow-[0_4px_12px_rgba(0,0,0,0.3)]'
        : 'bg-white/80 border-white/70 text-black shadow-[0_4px_12px_rgba(0,0,0,0.05)]';
    }
    return isDark
      ? 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
      : 'border-transparent text-gray-600 hover:text-black hover:bg-white/20';
  };

  return (
    <div className="flex-grow pt-24 md:pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto w-full">
      {/* Back Button */}
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

      {/* Hero Header */}
      <div className="mb-12 text-center md:text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">
          <Terminal size={14} />
          <span>GongPan Laboratory</span>
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          {t.labTitle}
        </h1>
        <p className={`text-base md:text-lg max-w-2xl ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
          {t.labSub}
        </p>
      </div>

      {/* Main Container Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar Col */}
        <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 p-1.5 rounded-3xl border border-white/20 backdrop-blur-md bg-white/5 overflow-x-auto lg:overflow-visible shrink-0">
          <button
            onClick={() => setActiveTab('exam')}
            className={`flex items-center justify-center lg:justify-start space-x-3 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all flex-1 lg:flex-initial whitespace-nowrap ${sidebarItemClass(activeTab === 'exam')}`}
          >
            <BookOpen size={18} />
            <span>{t.tabs.exam}</span>
          </button>
          <button
            onClick={() => setActiveTab('info')}
            className={`flex items-center justify-center lg:justify-start space-x-3 px-5 py-3.5 rounded-2xl border text-sm font-bold transition-all flex-1 lg:flex-initial whitespace-nowrap ${sidebarItemClass(activeTab === 'info')}`}
          >
            <Layers size={18} />
            <span>{t.tabs.explore}</span>
          </button>
        </div>

        {/* Content Box Area */}
        <div className="lg:col-span-9 w-full">
          <AnimatePresence mode="wait">
            {activeTab === 'exam' ? (
              <motion.div
                key="exam"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className={`rounded-[2.5rem] p-6 md:p-8 border ${liquidGlassClass} flex flex-col`}
              >
                {/* Exam Board Layout: Inside Exam we have Side Filter Index and Main Highlight Code Area */}
                <div className="flex flex-col md:flex-row gap-6 h-full min-h-[600px]">
                  {/* Left Side: Search + Filter List */}
                  <div className="w-full md:w-[320px] flex flex-col border-b md:border-b-0 md:border-r border-white/10 md:pr-6 pb-6 md:pb-0 h-full">
                    <h3 className="text-lg font-bold mb-4 flex items-center space-x-2">
                      <Code size={18} className="text-blue-500" />
                      <span>{t.problemList}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-500 border border-blue-500/20 px-2.0 py-0.5 rounded-full font-bold ml-auto select-none">{filteredProblems.length}</span>
                    </h3>

                    <div className="relative mb-4">
                      <Search size={16} className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-500" />
                      <input
                        type="text"
                        placeholder={t.searchPlace}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={`w-full pl-10 pr-4 py-3 rounded-2xl text-sm border focus:outline-none transition-all ${
                          isDark 
                            ? 'bg-black/30 border-white/10 text-white placeholder-gray-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500' 
                            : 'bg-white/85 border-gray-200 text-black placeholder-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner'
                        }`}
                      />
                    </div>

                    {/* Overflowing Index list */}
                    <div className="overflow-y-auto max-h-[450px] pr-1 space-y-2 flex-grow scrollbar-thin scrollbar-thumb-white/10">
                      {filteredProblems.length > 0 ? (
                        filteredProblems.map((prob) => (
                          <button
                            key={prob.id}
                            onClick={() => setSelectedProblem(prob)}
                            className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between group ${
                              selectedProblem.id === prob.id
                                ? (isDark ? 'bg-blue-500/20 border-blue-500/50 text-blue-400' : 'bg-blue-500/10 border-blue-500/40 text-blue-600 font-semibold')
                                : (isDark ? 'border-transparent text-gray-300 hover:bg-white/5' : 'border-transparent text-gray-700 hover:bg-black/5')
                            }`}
                          >
                            <div className="flex flex-col">
                              <span className="text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">{prob.id}</span>
                              <span className="text-sm font-medium mt-0.5 group-hover:translate-x-1 transition-transform truncate max-w-[210px]">{prob.title}</span>
                            </div>
                            <div className={`w-2 h-2 rounded-full transition-transform scale-0 group-hover:scale-100 ${
                              selectedProblem.id === prob.id ? 'scale-100 bg-blue-500' : 'bg-gray-400'
                            }`} />
                          </button>
                        ))
                      ) : (
                        <div className="flex flex-col items-center justify-center py-10 text-gray-500 text-center">
                          <AlertCircle size={32} className="mb-2 opacity-40" />
                          <p className="text-sm">{t.noResults}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Side: Detailed Code Block Display */}
                  <div className="flex-1 flex flex-col h-full pl-0 md:pl-2">
                    <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                      <div className="flex items-center space-x-3">
                        <span className="text-xl md:text-2xl font-black font-mono bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-indigo-500">{selectedProblem.id}</span>
                        <h2 className="text-lg md:text-xl font-bold tracking-tight">{selectedProblem.title}</h2>
                      </div>
                      <span className="px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-[#1e1e24] text-amber-500 border border-amber-500/20 shadow-md">
                        Python 3
                      </span>
                    </div>

                    {/* Beautified Code Panel */}
                    <div className="rounded-[1.5rem] bg-[#0d0d11] text-gray-300 border border-white/10 shadow-2xl overflow-hidden flex flex-col flex-grow relative group/code">
                      {/* Code Header Bar */}
                      <div className="flex items-center justify-between px-6 py-3 border-b border-white/5 bg-[#14141a]">
                        <div className="flex space-x-1.5">
                          <span className="w-3" />
                          <span className="w-3 h-3 rounded-full bg-red-500/80" />
                          <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
                          <span className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <button
                          onClick={() => handleCopy(selectedProblem.code, selectedProblem.id)}
                          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/5 hover:bg-white/10 active:scale-95 text-gray-300 hover:text-white transition-all border border-white/5"
                        >
                          {copiedId === selectedProblem.id ? (
                            <>
                              <Check size={13} className="text-green-500 animate-pulse" />
                              <span className="text-green-500">{t.copied}</span>
                            </>
                          ) : (
                            <>
                              <Copy size={13} />
                              <span>{t.copyCode}</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Display Editor lines */}
                      <div className="py-6 overflow-x-auto min-h-[300px] select-all scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                        <code className="block w-full min-w-max">
                          {highlightPython(selectedProblem.code)}
                        </code>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="info"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className={`rounded-[2.5rem] p-12 border ${liquidGlassClass} flex flex-col items-center justify-center min-h-[500px] text-center`}
              >
                <div className="w-20 h-20 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 mb-6 shadow-[inset_0_0_20px_rgba(59,130,246,0.15)]">
                  <Terminal size={40} className="animate-pulse" />
                </div>
                <h3 className="text-2xl font-bold mb-2">{t.tabs.explore}</h3>
                <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-500'} max-w-sm`}>
                  {t.comingSoon}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
