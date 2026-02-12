
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Copy, 
  CheckCircle, 
  Zap, 
  Cpu,
  Upload,
  User,
  BookOpen,
  X,
  Twitter,
  Search,
  LogIn,
  LogOut,
  RefreshCw,
  Sun,
  Moon,
  Gem,
  Coins,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Palette,
  Bookmark,
  Share2,
  Link as LinkIcon,
  Clock,
  Filter,
  ArrowUpDown
} from "lucide-react";
import { NeonButton } from "./components/NeonButton";
import { ScanEffect } from "./components/ScanEffect";
import { analyzeImageAndGenerateCaptions, generateCryptoImage } from "./services/geminiService";
import { SignalMode, GeneratedCaption, UserProfile, LingoDefinition, ImageStyle, SavedTemplate, HistoryItem } from "./types";
import { WALLETS, SHORTCUTS, LINGO_DICTIONARY, WEB3_QUOTES } from "./constants";

// --- CUSTOM ICONS ---
const FarcasterIcon = ({ size = 16, className = "" }: {size?: number, className?: string}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.24.24H5.76A5.76 5.76 0 0 0 0 6v12a5.76 5.76 0 0 0 5.76 5.76h12.48A5.76 5.76 0 0 0 24 18V6A5.76 5.76 0 0 0 18.24.24m.816 17.166v.504a.49.49 0 0 1 .543.48v.568h-5.143v-.569a.49.49 0 0 1 .543-.48v-.504c0-1.637-1.092-2.337-2.138-2.337-.718 0-1.789.258-2.336 1.152-.304.53-.26 1.04-.26 1.696v.493h-5.153v-.493c0-2.822 1.956-4.346 4.61-4.346 1.42 0 2.536.65 3.328 1.41.77-.76 1.905-1.41 3.328-1.41 2.654 0 4.61 1.524 4.61 4.346m-12.28-4.636c-1.353 0-2.45-1.127-2.45-2.518 0-1.39 1.097-2.517 2.45-2.517s2.45 1.127 2.45 2.517c0 1.391-1.097 2.518-2.45 2.518m8.672 0c-1.353 0-2.45-1.127-2.45-2.518 0-1.39 1.097-2.517 2.45-2.517s2.45 1.127 2.45 2.517c0 1.391-1.097 2.518-2.45 2.518" />
  </svg>
);

const ZoraIcon = ({ size = 16, className = "" }: {size?: number, className?: string}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
     <path d="M12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24Z" fillOpacity="0.2"/>
     <path fillRule="evenodd" clipRule="evenodd" d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20ZM12 16.5C14.4853 16.5 16.5 14.4853 16.5 12C16.5 9.51472 14.4853 7.5 12 7.5C9.51472 7.5 7.5 9.51472 7.5 12C7.5 14.4853 9.51472 16.5 12 16.5Z" />
  </svg>
);

const OpusIntro = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  // Floating symbols configuration
  const symbols = [
    { char: "Ξ", top: "20%", left: "25%", delay: 0 },
    { char: "₿", top: "70%", left: "15%", delay: 0.5 },
    { char: "◎", top: "15%", left: "75%", delay: 1 },
    { char: <Zap size={32} />, top: "80%", left: "80%", delay: 1.5 },
    { char: <Cpu size={24} />, top: "40%", left: "10%", delay: 0.8 },
    { char: <Gem size={28} />, top: "60%", left: "90%", delay: 1.2 },
    { char: <Coins size={30} />, top: "10%", left: "50%", delay: 0.3 },
    { char: "⚪", top: "85%", left: "40%", delay: 0.7 }, // Base
  ];

  return (
    <motion.div
      className="fixed inset-0 z-[100] bg-neo-darker flex flex-col items-center justify-center overflow-hidden"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,255,65,0.08)_0%,transparent_70%)]" />
      {symbols.map((s, i) => (
        <motion.div
          key={i}
          className="absolute text-neo-green/40 font-bold text-3xl md:text-5xl blur-[1px] select-none flex items-center justify-center"
          style={{ top: s.top, left: s.left }}
          initial={{ opacity: 0, scale: 0.5, y: 50 }}
          animate={{ 
            opacity: [0, 0.8, 0.4, 0], 
            y: [50, -50],
            scale: [0.8, 1.2, 0.9],
            rotate: [0, 10, -10, 0]
          }}
          transition={{ 
            duration: 4.5, 
            times: [0, 0.2, 0.8, 1],
            ease: "easeInOut",
            delay: s.delay 
          }}
        >
          {s.char}
        </motion.div>
      ))}
      <div className="relative z-10 text-center flex flex-col items-center">
        <motion.h1 
          initial={{ scale: 0.8, opacity: 0, filter: "blur(15px)", letterSpacing: "-0.1em" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)", letterSpacing: "0em" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="text-8xl md:text-9xl font-black italic tracking-tighter text-transparent bg-clip-text bg-gradient-to-b from-white to-neo-green drop-shadow-[0_0_35px_rgba(0,255,65,0.6)] select-none"
        >
          Gm/n
        </motion.h1>
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: "120%", opacity: 1 }}
          transition={{ delay: 0.8, duration: 1, ease: "easeOut" }}
          className="h-[2px] bg-gradient-to-r from-transparent via-neo-green to-transparent mt-2 mb-6"
        />
        <motion.p
          initial={{ opacity: 0, y: 20, letterSpacing: "0em" }}
          animate={{ opacity: 1, y: 0, letterSpacing: "0.4em" }}
          transition={{ delay: 1.1, duration: 1 }}
          className="text-neo-green font-mono font-bold text-xs md:text-sm uppercase tracking-widest flex items-center gap-3 select-none"
        >
          <span className="w-1.5 h-1.5 bg-neo-green rounded-full animate-pulse shadow-neon" />
          GREETINGS_GENERATOR
          <span className="w-1.5 h-1.5 bg-neo-green rounded-full animate-pulse shadow-neon" />
        </motion.p>
      </div>
    </motion.div>
  );
};

const UserProfileModal = ({ 
  isOpen, 
  onClose, 
  user, 
  onLogin, 
  onLogout, 
  isLoggingIn,
  history 
}: { 
  isOpen: boolean, 
  onClose: () => void, 
  user: UserProfile | null, 
  onLogin: (provider: 'google' | 'twitter') => void,
  onLogout: () => void,
  isLoggingIn: boolean,
  history: HistoryItem[]
}) => {
  const [activeTab, setActiveTab] = useState<'IDENTITY' | 'HISTORY'>('IDENTITY');
  const [filterMode, setFilterMode] = useState<'ALL' | 'GM' | 'GN'>('ALL');
  const [sortOrder, setSortOrder] = useState<'NEWEST' | 'OLDEST'>('NEWEST');

  if (!isOpen) return null;

  const filteredHistory = history
    .filter(item => filterMode === 'ALL' || item.mode === filterMode)
    .sort((a, b) => sortOrder === 'NEWEST' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neo-black border border-neo-green/30 max-w-2xl w-full h-[80vh] flex flex-col hud-panel relative shadow-neon">
        <button onClick={onClose} className="absolute top-4 right-4 text-neo-green/50 hover:text-neo-green z-10"><X size={20} /></button>
        
        <div className="flex border-b border-neo-green/20 p-6 pb-0 gap-6">
          <button 
            onClick={() => setActiveTab('IDENTITY')}
            className={`pb-4 font-bold tracking-widest text-sm transition-colors ${activeTab === 'IDENTITY' ? 'text-neo-green border-b-2 border-neo-green' : 'text-neo-green/40 hover:text-neo-green'}`}
          >
            IDENTITY_PROTOCOL
          </button>
          <button 
            onClick={() => setActiveTab('HISTORY')}
            className={`pb-4 font-bold tracking-widest text-sm transition-colors ${activeTab === 'HISTORY' ? 'text-neo-green border-b-2 border-neo-green' : 'text-neo-green/40 hover:text-neo-green'}`}
          >
            SIGNAL_HISTORY ({history.length})
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {activeTab === 'IDENTITY' && (
            !user ? (
              <div className="flex flex-col items-center justify-center h-full space-y-6">
                <User size={48} className="text-neo-green" />
                <h2 className="text-xl font-bold tracking-widest text-neo-green">AUTHENTICATE</h2>
                <p className="text-sm text-neo-green/60 max-w-xs text-center">Connect to sync your signal history and preferences across devices.</p>
                <div className="space-y-3 w-full max-w-xs">
                  <button 
                    onClick={() => onLogin('google')}
                    disabled={isLoggingIn}
                    type="button"
                    className="w-full bg-white text-black font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-200 disabled:opacity-50 transition-colors"
                  >
                    {isLoggingIn ? <RefreshCw className="animate-spin" size={16}/> : <div className="w-4 h-4 rounded-full bg-blue-500" />} 
                    {isLoggingIn ? "CONNECTING..." : "Continue with Google"}
                  </button>
                  <button 
                    onClick={() => onLogin('twitter')}
                    disabled={isLoggingIn}
                    type="button"
                    className="w-full bg-black border border-neo-green/50 text-neo-green font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-neo-green/10 disabled:opacity-50 transition-colors"
                  >
                    {isLoggingIn ? <RefreshCw className="animate-spin" size={16}/> : <Twitter size={16} />} 
                    {isLoggingIn ? "CONNECTING..." : "Continue with 𝕏"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-6 pt-10">
                <img src={user.avatar} alt="Avatar" className="w-32 h-32 rounded-full border-4 border-neo-green shadow-[0_0_20px_#00FF41]" />
                <div className="text-center">
                  <h2 className="text-3xl font-black text-neo-green mb-1">{user.name}</h2>
                  <p className="text-neo-green/60 font-mono">@{user.handle}</p>
                </div>
                
                <div className="grid grid-cols-3 gap-4 w-full max-w-md mt-6">
                   <div className="bg-neo-green/5 border border-neo-green/20 p-3 text-center">
                     <div className="text-2xl font-bold text-neo-green">{history.length}</div>
                     <div className="text-[10px] uppercase text-neo-green/50">Signals</div>
                   </div>
                   <div className="bg-neo-green/5 border border-neo-green/20 p-3 text-center">
                     <div className="text-2xl font-bold text-neo-green">
                       {history.filter(h => h.mode === 'GM').length}
                     </div>
                     <div className="text-[10px] uppercase text-neo-green/50">GM Count</div>
                   </div>
                   <div className="bg-neo-green/5 border border-neo-green/20 p-3 text-center">
                     <div className="text-2xl font-bold text-neo-green">
                       {history.filter(h => h.mode === 'GN').length}
                     </div>
                     <div className="text-[10px] uppercase text-neo-green/50">GN Count</div>
                   </div>
                </div>

                <div className="w-full max-w-md pt-8">
                  <button 
                    onClick={onLogout}
                    type="button"
                    className="w-full border border-red-500/50 text-red-500 font-bold py-3 px-4 hover:bg-red-500/10 transition-colors uppercase text-xs tracking-widest flex items-center justify-center gap-2"
                  >
                    <LogOut size={14} /> Disconnect
                  </button>
                </div>
              </div>
            )
          )}

          {activeTab === 'HISTORY' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex gap-2">
                  {(['ALL', 'GM', 'GN'] as const).map(m => (
                    <button
                      key={m}
                      onClick={() => setFilterMode(m)}
                      className={`text-[10px] px-2 py-1 border ${filterMode === m ? 'bg-neo-green text-neo-black border-neo-green' : 'text-neo-green/50 border-neo-green/20'}`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <button 
                  onClick={() => setSortOrder(prev => prev === 'NEWEST' ? 'OLDEST' : 'NEWEST')}
                  className="flex items-center gap-1 text-[10px] text-neo-green/50 hover:text-neo-green"
                >
                  <ArrowUpDown size={12} /> {sortOrder}
                </button>
              </div>

              {filteredHistory.length === 0 ? (
                <div className="text-center py-20 text-neo-green/30 italic">NO DATA FOUND</div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {filteredHistory.map((item) => (
                    <div key={item.id} className="bg-neo-green/5 border border-neo-green/10 p-4 flex gap-4">
                      {item.imageData ? (
                         <img src={item.imageData} className="w-20 h-20 object-cover border border-neo-green/20" />
                      ) : (
                        <div className="w-20 h-20 bg-neo-black border border-neo-green/10 flex items-center justify-center text-neo-green/20">
                          <Clock size={20} />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                         <div className="flex justify-between items-start mb-1">
                           <span className="text-xs font-bold text-neo-green">{item.mode} // {new Date(item.timestamp).toLocaleDateString()}</span>
                           <span className="text-[10px] text-neo-green/40">{new Date(item.timestamp).toLocaleTimeString()}</span>
                         </div>
                         <p className="text-xs text-neo-green/70 line-clamp-2 italic">"{item.context}"</p>
                         <div className="mt-2 flex gap-1 overflow-x-auto scrollbar-hide">
                           {item.captions.slice(0, 3).map((c, i) => (
                             <span key={i} className="text-[9px] border border-neo-green/20 px-1 py-0.5 text-neo-green/50 whitespace-nowrap">{c.mood}</span>
                           ))}
                         </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const LingoCard: React.FC<{ item: LingoDefinition }> = ({ item }) => (
  <div className="bg-neo-black border border-neo-green/20 p-5 hover:border-neo-green/50 transition-all hover:bg-neo-green/5 hud-panel group">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-bold text-neo-green group-hover:text-neo-green/80 transition-colors">{item.word}</h3>
      <span className="text-[10px] uppercase border border-neo-green/30 px-2 py-0.5 text-neo-green/60">{item.category}</span>
    </div>
    <p className="text-sm text-neo-green/80 leading-relaxed">{item.definition}</p>
  </div>
);

const LingoDictionary = ({ onClose }: { onClose: () => void }) => {
  const [search, setSearch] = useState("");
  const sortedDictionary = [...LINGO_DICTIONARY].sort((a, b) => a.word.localeCompare(b.word));
  const letters = Array.from(new Set(sortedDictionary.map(i => i.word[0].toUpperCase())));

  const filtered = sortedDictionary.filter(l => 
    l.word.toLowerCase().includes(search.toLowerCase()) || 
    l.definition.toLowerCase().includes(search.toLowerCase())
  );

  const scrollToLetter = (letter: string) => {
    const el = document.getElementById(`lingo-section-${letter}`);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 bg-neo-black/95 backdrop-blur-md z-[60] flex flex-col animate-in fade-in slide-in-from-bottom-10 duration-300">
      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col h-full">
        <div className="p-4 md:p-8 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-widest flex items-center gap-2">
              <BookOpen className="text-neo-green" /> LIMBO_ARCHIVES
            </h2>
            <button onClick={onClose} className="p-2 border border-neo-green/20 hover:bg-neo-green/10 rounded-sm text-neo-green"><X /></button>
          </div>
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-neo-green/50" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH_DEGEN_LINGO..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-neo-green/5 border border-neo-green/20 p-4 pl-12 text-neo-green focus:outline-none focus:border-neo-green focus:shadow-neon"
            />
          </div>
        </div>
        <div className="flex flex-1 overflow-hidden px-4 md:px-8 pb-8 gap-4 md:gap-8">
           <div className="hidden md:flex flex-col gap-1 overflow-y-auto pr-2 w-10 shrink-0 text-center text-xs font-bold text-neo-green/50 scrollbar-hide">
             {letters.map(letter => (
               <button 
                 key={letter} 
                 onClick={() => scrollToLetter(letter)}
                 className="hover:text-neo-green hover:scale-125 transition-all py-0.5"
               >
                 {letter}
               </button>
             ))}
           </div>
           <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-20">
             {search ? (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {filtered.map((item, idx) => (
                   <LingoCard key={idx} item={item} />
                 ))}
                 {filtered.length === 0 && <div className="p-8 text-center opacity-50 w-full col-span-full">NO DATA FOUND</div>}
               </div>
             ) : (
               letters.map(letter => {
                 const sectionItems = sortedDictionary.filter(i => i.word.startsWith(letter));
                 return (
                   <div key={letter} id={`lingo-section-${letter}`} className="mb-8">
                     <h3 className="text-xl font-bold text-neo-green mb-4 border-b border-neo-green/20 pb-2 flex items-center gap-2">
                       <span className="text-neo-green/30">#</span> {letter}
                     </h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                       {sectionItems.map((item, idx) => (
                         <LingoCard key={idx} item={item} />
                       ))}
                     </div>
                   </div>
                 )
               })
             )}
           </div>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [booted, setBooted] = useState(false);
  const [mode, setMode] = useState<SignalMode>("GM");
  const [image, setImage] = useState<string | null>(null);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [captions, setCaptions] = useState<GeneratedCaption[]>([]);
  const [detectedContext, setDetectedContext] = useState<string>("");
  const [copiedWallet, setCopiedWallet] = useState<string | null>(null);
  
  // Per-caption image generation & Broadcast menu UI state
  const [activeImageGenId, setActiveImageGenId] = useState<string | null>(null);

  const [savedTemplates, setSavedTemplates] = useState<SavedTemplate[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [activeTab, setActiveTab] = useState<'GENERATED' | 'SAVED'>('GENERATED');
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [randomQuote, setRandomQuote] = useState(WEB3_QUOTES[0]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const random = WEB3_QUOTES[Math.floor(Math.random() * WEB3_QUOTES.length)];
    setRandomQuote(random);
  }, []); 

  useEffect(() => {
    const savedUser = localStorage.getItem('gm_user');
    const savedTmpls = localStorage.getItem('gm_templates');
    const savedHistory = localStorage.getItem('gm_history');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) { console.error(e); }
    }
    if (savedTmpls) {
      try { setSavedTemplates(JSON.parse(savedTmpls)); } catch (e) { console.error(e); }
    }
    if (savedHistory) {
      try { setHistory(JSON.parse(savedHistory)); } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') html.classList.add('light-mode');
    else html.classList.remove('light-mode');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setSelectedTags([]); 
        setCaptions([]);
        setDetectedContext("");
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
  };

  const handleLogin = async (provider: 'google' | 'twitter') => {
    setIsLoggingIn(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const newUser: UserProfile = {
      name: provider === 'google' ? "Operator_01" : "Based_User",
      handle: provider === 'google' ? "operator" : "degen_king",
      avatar: provider === 'google' 
        ? "https://api.dicebear.com/7.x/bottts/svg?seed=Operator" 
        : "https://api.dicebear.com/7.x/bottts/svg?seed=Degen",
      isLoggedIn: true,
      provider
    };
    setUser(newUser);
    localStorage.setItem('gm_user', JSON.stringify(newUser));
    setIsLoggingIn(false);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('gm_user');
  };

  const generateSignal = async () => {
    // Only block if NEITHER image nor tags are present
    if (!image && selectedTags.length === 0) return;
    
    setIsScanning(true);
    setCaptions([]);
    setActiveTab('GENERATED');

    try {
      const tagLabels = selectedTags.map(id => SHORTCUTS.find(s => s.id === id)?.label || "");
      
      const analysisPromise = analyzeImageAndGenerateCaptions(image, mode, tagLabels);
      const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 60000));
      
      const result = await Promise.race([analysisPromise, timeoutPromise]) as any;
      
      const enrichedCaptions: GeneratedCaption[] = result.captions.map((c: any) => ({
        ...c,
        likeCount: Math.floor(Math.random() * 100) + 5,
        dislikeCount: Math.floor(Math.random() * 10),
      }));

      setDetectedContext(result.context);
      setCaptions(enrichedCaptions);

      // Add to history
      const newHistoryItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        mode,
        context: result.context,
        captions: enrichedCaptions,
        // Only save image if it exists and is less than ~500kb
        imageData: (image && image.length < 500000) ? image : undefined
      };
      const updatedHistory = [newHistoryItem, ...history].slice(0, 20); // Keep last 20
      setHistory(updatedHistory);
      localStorage.setItem('gm_history', JSON.stringify(updatedHistory));

    } catch (error) {
      console.error("Signal Generation Failed:", error);
      setDetectedContext("System Error - Try Again");
    } finally {
      setIsScanning(false);
    }
  };

  const handleGenerateCaptionImage = async (captionId: string, style: ImageStyle) => {
    const caption = captions.find(c => c.id === captionId);
    if (!caption) return;

    setCaptions(prev => prev.map(c => c.id === captionId ? { ...c, isGeneratingImage: true } : c));
    setActiveImageGenId(null);

    try {
      const tagLabels = selectedTags.map(id => SHORTCUTS.find(s => s.id === id)?.label || "");
      const generatedUrl = await generateCryptoImage(caption.text, tagLabels, mode, style);
      if (generatedUrl) {
        setCaptions(prev => prev.map(c => c.id === captionId ? { ...c, isGeneratingImage: false, imageUrl: generatedUrl } : c));
      } else {
        setCaptions(prev => prev.map(c => c.id === captionId ? { ...c, isGeneratingImage: false } : c));
      }
    } catch (e) {
      console.error("Image Gen Error", e);
      setCaptions(prev => prev.map(c => c.id === captionId ? { ...c, isGeneratingImage: false } : c));
    }
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(label);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const handleShare = async (platform: 'twitter' | 'farcaster', text: string, imageUrl?: string) => {
     if (platform === 'twitter') {
        const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
        window.open(url, "_blank");
     }

     if (platform === 'farcaster') {
       let url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}`;
       window.open(url, "_blank");
     }
  };

  const handleLike = (id: string) => {
    setCaptions(prev => prev.map(c => c.id === id ? { 
      ...c, 
      liked: !c.liked, 
      disliked: false,
      likeCount: !c.liked ? c.likeCount + 1 : c.likeCount - 1
    } : c));
  };
  const handleDislike = (id: string) => {
    setCaptions(prev => prev.map(c => c.id === id ? { 
      ...c, 
      disliked: !c.disliked, 
      liked: false,
      dislikeCount: !c.disliked ? c.dislikeCount + 1 : c.dislikeCount - 1
    } : c));
  };
  const saveTemplate = (text: string) => {
    const newTemplate: SavedTemplate = { id: Date.now().toString(), text, timestamp: Date.now() };
    const updated = [newTemplate, ...savedTemplates];
    setSavedTemplates(updated);
    localStorage.setItem('gm_templates', JSON.stringify(updated));
    setCopiedWallet('saved');
    setTimeout(() => setCopiedWallet(null), 2000);
  };
  const deleteTemplate = (id: string) => {
    const updated = savedTemplates.filter(t => t.id !== id);
    setSavedTemplates(updated);
    localStorage.setItem('gm_templates', JSON.stringify(updated));
  };
  
  // Determine if generation is possible (Image OR Tags)
  const canGenerate = !!image || selectedTags.length > 0;

  return (
    <div className="min-h-screen bg-neo-darker text-neo-green font-mono selection:bg-neo-green selection:text-black relative overflow-hidden flex flex-col transition-colors duration-300">
      
      <AnimatePresence>
        {!booted && <OpusIntro onComplete={() => setBooted(true)} />}
      </AnimatePresence>

      <div className="fixed inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-10 animate-grid-move pointer-events-none z-0" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neo-green/10 via-transparent to-transparent opacity-60 pointer-events-none z-0" />
      <div className="fixed inset-0 scanlines-layer z-10" />

      <header className="sticky top-0 z-50 bg-neo-black/90 backdrop-blur-md border-b border-neo-green/20 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold tracking-widest text-2xl italic select-none">Gm/n</h1>
          <div className="flex items-center gap-4">
            <button 
              type="button"
              onClick={() => setShowDictionary(true)}
              className="flex items-center gap-2 text-xs md:text-sm hover:text-neo-green/70 transition-colors"
            >
              <BookOpen size={16} /> <span className="hidden md:inline">LINGO</span>
            </button>
            <button 
              type="button"
              onClick={toggleTheme}
              className="flex items-center gap-2 text-xs md:text-sm hover:text-neo-green/70 transition-colors p-2"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <button 
              type="button"
              onClick={() => setShowProfile(true)}
              className="bg-neo-green/10 border border-neo-green/30 p-2 rounded-sm hover:bg-neo-green hover:text-neo-black transition-all"
            >
              {user ? <img src={user.avatar} className="w-5 h-5 rounded-full" /> : <LogIn size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Raised z-index to 20 to sit above scanlines (z-10) */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-20 relative">
        <div className="lg:col-span-5 space-y-6">
          <div className="mb-4">
             <h2 className="text-xl md:text-2xl font-bold text-neo-black dark:text-white tracking-wide uppercase italic">
                {user ? `What's popping, ${user.name}?` : "What's on your mind today?"}
             </h2>
             <p className="text-neo-green/60 text-sm mt-2 border-l-2 border-neo-green pl-3 py-1 italic leading-relaxed">
               "{randomQuote}"
             </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {(["GM", "GN"] as SignalMode[]).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`py-6 text-xl font-bold tracking-widest transition-all duration-200 border clip-path-polygon ${
                  mode === m 
                    ? "bg-neo-green text-neo-black border-neo-green shadow-neon" 
                    : "bg-neo-black text-neo-green border-neo-green/30 hover:border-neo-green hover:bg-neo-green/5"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="space-y-4">
             <div className="flex flex-wrap gap-2">
               {SHORTCUTS.map(tag => (
                 <button
                   key={tag.id}
                   type="button"
                   onClick={() => toggleTag(tag.id)}
                   className={`px-3 py-1.5 text-xs font-bold border transition-all ${
                     selectedTags.includes(tag.id)
                       ? "bg-neo-green text-neo-black border-neo-green"
                       : "bg-transparent text-neo-green/60 border-neo-green/20 hover:border-neo-green/50"
                   }`}
                 >
                   {tag.label}
                 </button>
               ))}
             </div>

             {!image ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="block border-2 border-dashed border-neo-green/20 hover:border-neo-green/50 bg-neo-black/40 p-6 text-center cursor-pointer transition-colors relative z-30"
                >
                  <input ref={fileInputRef} type="file" onChange={handleFileSelect} accept="image/*" className="hidden" />
                  <div className="flex flex-col items-center justify-center gap-2 text-neo-green/50">
                    <Upload size={24} />
                    <span className="text-xs">UPLOAD IMAGE (OPTIONAL)</span>
                  </div>
                </div>
             ) : (
               <div className="relative aspect-video bg-neo-black border border-neo-green/30 overflow-hidden select-none z-30">
                 <img src={image} draggable="false" className="w-full h-full object-contain opacity-80" />
                 <button 
                    type="button"
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/80 text-red-500 p-1 rounded-sm z-30 cursor-pointer hover:bg-black"
                  >
                    <X size={14} />
                  </button>
                  {isScanning && <ScanEffect />}
               </div>
             )}
             
             <div className="relative z-50 pt-2">
                <NeonButton 
                  onClick={generateSignal} 
                  disabled={isScanning || !canGenerate}
                  flashing={isScanning}
                  className={`w-full flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 ${!canGenerate ? 'opacity-70' : 'opacity-100 shadow-[0_0_15px_rgba(0,255,65,0.4)]'}`}
                >
                  {isScanning ? <Cpu className="animate-spin" /> : <Zap className={image ? "fill-current" : ""} />}
                  {isScanning 
                    ? "PROCESSING SIGNAL..." 
                    : !canGenerate 
                      ? "UPLOAD IMAGE OR SELECT TAGS" 
                      : "GENERATE GREETINGS"
                  }
                </NeonButton>
             </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <div className="flex gap-4 mb-6 border-b border-neo-green/20">
             <button 
               type="button"
               onClick={() => setActiveTab('GENERATED')}
               className={`pb-2 px-2 text-sm font-bold tracking-widest transition-colors ${activeTab === 'GENERATED' ? 'text-neo-green border-b-2 border-neo-green' : 'text-neo-green/40 hover:text-neo-green'}`}
             >
               GENERATED_SIGNALS
             </button>
             <button 
               type="button"
               onClick={() => setActiveTab('SAVED')}
               className={`pb-2 px-2 text-sm font-bold tracking-widest transition-colors ${activeTab === 'SAVED' ? 'text-neo-green border-b-2 border-neo-green' : 'text-neo-green/40 hover:text-neo-green'}`}
             >
               SAVED_TEMPLATES ({savedTemplates.length})
             </button>
          </div>

          <div className="space-y-6 pb-24">
            {activeTab === 'GENERATED' && (
              <>
                <AnimatePresence>
                  {captions.map((cap, idx) => (
                    <motion.div
                      key={cap.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-neo-black border border-neo-green/30 p-6 relative group hover:border-neo-green transition-colors hud-panel"
                    >
                      <div className="mb-4 flex justify-between items-start">
                        <span className="text-xs bg-neo-green/20 text-neo-green px-2 py-0.5 font-bold uppercase border border-neo-green/20 select-none">
                          {cap.mood}
                        </span>
                        <div className="flex gap-4 items-center">
                          <div className="flex gap-1 items-center">
                            <button type="button" onClick={() => handleLike(cap.id)} className={`p-1.5 hover:bg-neo-green/10 transition-colors ${cap.liked ? 'text-neo-green' : 'text-neo-green/30'}`}>
                              <ThumbsUp size={14} />
                            </button>
                            <span className="text-[10px] text-neo-green/50">{cap.likeCount}</span>
                          </div>
                          
                          <div className="flex gap-1 items-center">
                            <button type="button" onClick={() => handleDislike(cap.id)} className={`p-1.5 hover:bg-neo-green/10 transition-colors ${cap.disliked ? 'text-red-500' : 'text-neo-green/30'}`}>
                              <ThumbsDown size={14} />
                            </button>
                            <span className="text-[10px] text-neo-green/50">{cap.dislikeCount}</span>
                          </div>

                          <button type="button" onClick={() => saveTemplate(cap.text)} className="p-1.5 hover:bg-neo-green/10 text-neo-green/30 hover:text-neo-green transition-colors" title="Save Template">
                            <Bookmark size={14} />
                          </button>
                        </div>
                      </div>

                      <p className="text-xl mb-6 font-light leading-relaxed text-neo-green">
                        {cap.text}
                      </p>

                      {cap.imageUrl && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          className="relative w-full aspect-video bg-neo-black border border-neo-green/30 overflow-hidden mb-6 group rounded-sm select-none"
                        >
                          <img src={cap.imageUrl} draggable="false" alt="Generated Art" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-end p-4">
                            <a href={cap.imageUrl} download={`opus-${cap.id}.png`} className="bg-neo-green text-neo-black px-4 py-2 text-xs font-bold flex items-center gap-2 hover:bg-white">
                              <Upload size={14} className="rotate-180" /> SAVE ART
                            </a>
                          </div>
                        </motion.div>
                      )}

                      <div className="flex flex-col gap-3">
                        {/* Upper Controls: Image Gen, Copy */}
                        <div className="flex gap-3 h-10">
                          {/* Image Generator Button */}
                          <div className="relative h-full">
                            {!cap.imageUrl && !cap.isGeneratingImage && (
                              <button
                                 type="button"
                                 onClick={() => setActiveImageGenId(activeImageGenId === cap.id ? null : cap.id)}
                                 className={`h-full px-3 border border-neo-green/30 hover:bg-neo-green/10 text-neo-green/70 hover:text-neo-green transition-colors flex items-center justify-center ${activeImageGenId === cap.id ? 'bg-neo-green/10 text-neo-green' : ''}`}
                                 title="Generate Art"
                              >
                                 <Palette size={18} />
                              </button>
                            )}
                            
                            {cap.isGeneratingImage && (
                               <div className="h-full px-3 flex items-center justify-center text-neo-green animate-pulse">
                                 <RefreshCw size={18} className="animate-spin" />
                               </div>
                            )}

                            <AnimatePresence>
                              {activeImageGenId === cap.id && !cap.imageUrl && (
                                  <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute bottom-full left-0 mb-2 w-32 bg-neo-black border border-neo-green shadow-neon z-20 flex flex-col p-1 gap-1"
                                  >
                                     {(['MEME', 'BEEPLE'] as ImageStyle[]).map(style => (
                                       <button
                                         key={style}
                                         type="button"
                                         onClick={() => handleGenerateCaptionImage(cap.id, style)}
                                         className="text-[10px] py-2 px-2 hover:bg-neo-green hover:text-neo-black text-neo-green text-left font-bold transition-colors uppercase"
                                       >
                                         {style}
                                       </button>
                                     ))}
                                  </motion.div>
                              )}
                            </AnimatePresence>
                          </div>

                          {/* Copy Button */}
                          <button 
                            type="button"
                            onClick={() => copyToClipboard(cap.text, `cap-${idx}`)}
                            className="flex-1 border border-neo-green/30 hover:bg-neo-green hover:text-neo-black text-sm transition-colors flex items-center justify-center gap-2 text-neo-green"
                          >
                            {copiedWallet === `cap-${idx}` ? <CheckCircle size={14} /> : <Copy size={14} />} COPY
                          </button>
                        </div>

                        {/* Direct Share Buttons */}
                        <div className="grid grid-cols-2 gap-3 h-10">
                          <button 
                             type="button"
                             onClick={() => handleShare('twitter', cap.text, cap.imageUrl)}
                             className="flex items-center justify-center gap-2 bg-black border border-neo-green/30 hover:bg-neo-green hover:text-neo-black text-neo-green transition-colors text-xs font-bold uppercase"
                          >
                             <Twitter size={14} /> Share on 𝕏
                          </button>
                          <button 
                             type="button"
                             onClick={() => handleShare('farcaster', cap.text, cap.imageUrl)}
                             className="flex items-center justify-center gap-2 bg-purple-900/20 border border-purple-500/30 hover:bg-purple-500 hover:text-white text-purple-400 transition-colors text-xs font-bold uppercase"
                          >
                             <FarcasterIcon size={14} /> Cast
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {captions.length > 0 && !isScanning && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center pt-8 border-t border-neo-green/10"
                  >
                    <NeonButton 
                      onClick={generateSignal} 
                      variant="secondary"
                      className="w-full md:w-auto px-8 flex items-center justify-center gap-2 group"
                    >
                      <RefreshCw className="group-hover:rotate-180 transition-transform duration-500" size={16} /> 
                      REROLL SIGNAL // LOAD MORE
                    </NeonButton>
                  </motion.div>
                )}
              </>
            )}

            {activeTab === 'SAVED' && (
              <div className="space-y-4">
                {savedTemplates.length === 0 ? (
                   <div className="text-center py-10 text-neo-green/40 italic">
                     NO_TEMPLATES_ARCHIVED
                   </div>
                ) : (
                  savedTemplates.map((tmpl) => (
                    <motion.div
                      key={tmpl.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="bg-neo-black border border-neo-green/20 p-4 relative group hover:border-neo-green/50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                         <span className="text-[10px] text-neo-green/40 font-mono">
                           {new Date(tmpl.timestamp).toLocaleDateString()}
                         </span>
                         <button type="button" onClick={() => deleteTemplate(tmpl.id)} className="text-neo-green/30 hover:text-red-500 transition-colors">
                           <Trash2 size={14} />
                         </button>
                      </div>
                      <p className="text-lg text-neo-green mb-4">{tmpl.text}</p>
                      <button 
                          type="button"
                          onClick={() => copyToClipboard(tmpl.text, `tmpl-${tmpl.id}`)}
                          className="w-full border border-neo-green/10 hover:bg-neo-green/10 py-1.5 text-xs transition-colors flex items-center justify-center gap-2 text-neo-green/70"
                        >
                          {copiedWallet === `tmpl-${tmpl.id}` ? <CheckCircle size={12} /> : <Copy size={12} />} COPY
                      </button>
                    </motion.div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="fixed bottom-0 left-0 right-0 bg-neo-black border-t border-neo-green/30 z-30 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          <div className="bg-neo-green text-neo-black px-6 py-3 font-bold text-[10px] md:text-xs tracking-widest flex items-center gap-2 md:w-auto shrink-0 uppercase select-none">
             Say thanks to the dev and buy her coffee☕
          </div>
          <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center p-2 gap-2 bg-neo-black/90 backdrop-blur transition-colors">
             {WALLETS.map((wallet, idx) => (
                <button
                  type="button"
                  key={wallet.label}
                  onClick={() => copyToClipboard(wallet.address, wallet.label)}
                  className={`
                    flex items-center gap-3 px-3 py-1.5 border transition-all min-w-max group
                    ${idx === 0 
                      ? "bg-neo-green/10 border-neo-green shadow-[0_0_10px_rgba(0,255,65,0.1)] hover:bg-neo-green/20" 
                      : "bg-transparent border-neo-green/20 hover:border-neo-green/50 hover:bg-neo-green/5"
                    }
                  `}
                >
                  <div className="text-left">
                    <div className={`text-[9px] uppercase tracking-wider ${idx === 0 ? "text-neo-green font-bold" : "text-neo-green/60"}`}>
                      {wallet.label}
                    </div>
                    <div className="font-mono text-xs font-bold flex items-center gap-2 text-neo-green">
                      {wallet.address}
                      {copiedWallet === wallet.label && <CheckCircle size={10} className="text-neo-green" />}
                    </div>
                  </div>
                </button>
             ))}
          </div>
        </div>
      </footer>

      <UserProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        user={user}
        onLogin={handleLogin}
        onLogout={handleLogout}
        isLoggingIn={isLoggingIn}
        history={history}
      />
      {showDictionary && <LingoDictionary onClose={() => setShowDictionary(false)} />}

      <AnimatePresence>
        {copiedWallet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 bg-neo-green text-neo-black px-4 py-2 font-bold shadow-neon z-50 flex items-center gap-2 text-sm"
          >
            {copiedWallet === 'saved' ? <Bookmark size={16} /> : 
             copiedWallet === 'link_copied' ? <LinkIcon size={16} /> : <CheckCircle size={16} />} 
            
            {copiedWallet === 'saved' ? 'SAVED TO TEMPLATES' : 
             copiedWallet === 'image_copied' ? 'IMAGE COPIED! PASTE ON 𝕏' : 
             copiedWallet === 'link_copied' ? 'MINT LINK COPIED' : 'COPIED!'}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
