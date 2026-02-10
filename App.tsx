import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Share2, 
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
  ArrowRight,
  RefreshCw
} from "lucide-react";
import { NeonButton } from "./components/NeonButton";
import { ScanEffect } from "./components/ScanEffect";
import { analyzeImageAndGenerateCaptions, generateTextCaptions } from "./services/geminiService";
import { SignalMode, GeneratedCaption, UserProfile, LingoDefinition } from "./types";
import { WALLETS, SHORTCUTS, LINGO_DICTIONARY, WEB3_QUOTES } from "./constants";

const BootSequence = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const steps = ["INITIALIZING...", "LOADING_ZAHRA_PROTOCOL...", "ACCESS_GRANTED"];

  useEffect(() => {
    if (step < steps.length) {
      const timeout = setTimeout(() => setStep(s => s + 1), 500);
      return () => clearTimeout(timeout);
    } else {
      setTimeout(onComplete, 300);
    }
  }, [step]);

  return (
    <div className="fixed inset-0 bg-black z-[100] flex flex-col items-center justify-center font-mono text-neo-green p-8">
      <div className="w-full max-w-md space-y-2">
        {steps.slice(0, step + 1).map((s, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-sm"
          >
             <span className="text-neo-green/50">_</span>
             <span className={i === steps.length - 1 ? "text-white font-bold" : "text-neo-green"}>{s}</span>
          </motion.div>
        ))}
        {step < steps.length && (
          <motion.div 
            className="h-1 bg-neo-green mt-4"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 1.5, ease: "linear" }}
          />
        )}
      </div>
    </div>
  );
};

const UserProfileModal = ({ isOpen, onClose, user, onLogin }: { isOpen: boolean, onClose: () => void, user: UserProfile | null, onLogin: (provider: 'google' | 'twitter') => void }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neo-black border border-neo-green/30 p-8 max-w-md w-full hud-panel relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-neo-green/50 hover:text-neo-green"><X size={20} /></button>
        
        {!user ? (
          <div className="text-center space-y-6">
            <User size={48} className="mx-auto text-neo-green" />
            <h2 className="text-xl font-bold tracking-widest">AUTHENTICATE</h2>
            <p className="text-sm text-neo-green/60">Connect to sync your signal history and preferences.</p>
            <div className="space-y-3">
              <button 
                onClick={() => onLogin('google')}
                className="w-full bg-white text-black font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-gray-200"
              >
                <div className="w-4 h-4 rounded-full bg-blue-500" /> Continue with Google
              </button>
              <button 
                onClick={() => onLogin('twitter')}
                className="w-full bg-black border border-neo-green/50 text-neo-green font-bold py-3 px-4 flex items-center justify-center gap-2 hover:bg-neo-green/10"
              >
                <Twitter size={16} /> Continue with 𝕏
              </button>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-6">
            <img src={user.avatar} alt="Avatar" className="w-20 h-20 rounded-full mx-auto border-2 border-neo-green" />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-neo-green/60 text-sm">@{user.handle}</p>
            </div>
            <div className="bg-neo-green/5 p-4 border border-neo-green/20 text-left">
              <div className="text-xs uppercase opacity-50 mb-2">Operator Status</div>
              <div className="flex items-center gap-2 text-sm font-bold">
                 <div className="w-2 h-2 bg-neo-green rounded-full animate-pulse" />
                 ACTIVE
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const LingoCard: React.FC<{ item: LingoDefinition }> = ({ item }) => (
  <div className="bg-neo-black border border-neo-green/20 p-5 hover:border-neo-green/50 transition-all hover:bg-neo-green/5 hud-panel group">
    <div className="flex justify-between items-start mb-2">
      <h3 className="text-lg font-bold text-white group-hover:text-neo-green transition-colors">{item.word}</h3>
      <span className="text-[10px] uppercase border border-neo-green/30 px-2 py-0.5 text-neo-green/60">{item.category}</span>
    </div>
    <p className="text-sm text-neo-green/80 leading-relaxed">{item.definition}</p>
  </div>
);

const LingoDictionary = ({ onClose }: { onClose: () => void }) => {
  const [search, setSearch] = useState("");
  
  // Sort alphabetical
  const sortedDictionary = [...LINGO_DICTIONARY].sort((a, b) => a.word.localeCompare(b.word));
  
  // Extract unique starting letters for navigation
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
        
        {/* Header (Fixed) */}
        <div className="p-4 md:p-8 pb-0 shrink-0">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold tracking-widest flex items-center gap-2">
              <BookOpen className="text-neo-green" /> LIMBO_ARCHIVES
            </h2>
            <button onClick={onClose} className="p-2 border border-neo-green/20 hover:bg-neo-green/10 rounded-sm"><X /></button>
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

        {/* Content Area with Side Nav */}
        <div className="flex flex-1 overflow-hidden px-4 md:px-8 pb-8 gap-4 md:gap-8">
           
           {/* Navigation Key Sidebar */}
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

           {/* Scrollable Dictionary */}
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
  
  // New UI States
  const [user, setUser] = useState<UserProfile | null>(null);
  const [showProfile, setShowProfile] = useState(false);
  const [showDictionary, setShowDictionary] = useState(false);
  const [randomQuote, setRandomQuote] = useState(WEB3_QUOTES[0]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const random = WEB3_QUOTES[Math.floor(Math.random() * WEB3_QUOTES.length)];
    setRandomQuote(random);
  }, []); // Run once on mount

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setImage(ev.target?.result as string);
        setSelectedTags([]); // Clear tags if image uploaded
        setCaptions([]);
        setDetectedContext("");
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleTag = (tagId: string) => {
    if (image) setImage(null); // Clear image if tags selected
    setSelectedTags(prev => 
      prev.includes(tagId) ? prev.filter(t => t !== tagId) : [...prev, tagId]
    );
    setCaptions([]);
  };

  const handleLogin = (provider: 'google' | 'twitter') => {
    // Mock Login
    setUser({
      name: provider === 'google' ? "Operator_01" : "Based_User",
      handle: provider === 'google' ? "operator" : "degen_king",
      avatar: "https://api.dicebear.com/7.x/bottts/svg?seed=Felix",
      isLoggedIn: true,
      provider
    });
    setShowProfile(false);
  };

  const generateSignal = async () => {
    if (!image && selectedTags.length === 0) return;
    
    setIsScanning(true);
    setCaptions([]);

    const minTime = new Promise(resolve => setTimeout(resolve, 2000));
    
    let resultPromise;
    if (image) {
      resultPromise = analyzeImageAndGenerateCaptions(image, mode);
    } else {
      resultPromise = generateTextCaptions(selectedTags.map(id => SHORTCUTS.find(s => s.id === id)?.label || ""), mode)
        .then(caps => ({ context: "TEXT_BASED_SIGNAL", captions: caps }));
    }

    const [_, result] = await Promise.all([minTime, resultPromise]);

    setDetectedContext(result.context);
    setCaptions(result.captions);
    setIsScanning(false);
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedWallet(label);
    setTimeout(() => setCopiedWallet(null), 2000);
  };

  const openTwitterIntent = (text: string) => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");
  };

  if (!booted) return <BootSequence onComplete={() => setBooted(true)} />;

  return (
    <div className="min-h-screen bg-neo-darker text-neo-green font-mono selection:bg-neo-green selection:text-black scanlines relative overflow-hidden flex flex-col">
      
      {/* Background */}
      <div className="fixed inset-0 bg-grid-pattern bg-[length:40px_40px] opacity-10 animate-grid-move pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neo-green/10 via-transparent to-transparent opacity-60 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 bg-neo-black/90 backdrop-blur-md border-b border-neo-green/20">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold tracking-widest text-2xl italic">Gm/n</h1>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowDictionary(true)}
              className="flex items-center gap-2 text-xs md:text-sm hover:text-white transition-colors"
            >
              <BookOpen size={16} /> <span className="hidden md:inline">LINGO</span>
            </button>
            <button 
              onClick={() => setShowProfile(true)}
              className="bg-neo-green/10 border border-neo-green/30 p-2 rounded-sm hover:bg-neo-green hover:text-black transition-all"
            >
              {user ? <img src={user.avatar} className="w-5 h-5 rounded-full" /> : <LogIn size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 z-10">
        
        {/* LEFT: Controls */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Motivation / Greeting Section */}
          <div className="mb-4">
             <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide uppercase italic">
                {user ? `What's popping, ${user.name}?` : "What's on your mind today?"}
             </h2>
             <p className="text-neo-green/60 text-sm mt-2 border-l-2 border-neo-green pl-3 py-1 italic leading-relaxed">
               "{randomQuote}"
             </p>
          </div>

          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-4">
            {(["GM", "GN"] as SignalMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`py-6 text-xl font-bold tracking-widest transition-all duration-200 border clip-path-polygon ${
                  mode === m 
                    ? "bg-neo-green text-black border-neo-green shadow-neon" 
                    : "bg-black text-neo-green border-neo-green/30 hover:border-neo-green hover:bg-neo-green/5"
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Input Area (Hybrid) */}
          <div className="space-y-4">
             {/* Tags */}
             <div className="flex flex-wrap gap-2">
               {SHORTCUTS.map(tag => (
                 <button
                   key={tag.id}
                   onClick={() => toggleTag(tag.id)}
                   className={`px-3 py-1.5 text-xs font-bold border transition-all ${
                     selectedTags.includes(tag.id)
                       ? "bg-neo-green text-black border-neo-green"
                       : "bg-transparent text-neo-green/60 border-neo-green/20 hover:border-neo-green/50"
                   }`}
                 >
                   {tag.label}
                 </button>
               ))}
             </div>

             {/* Image Upload / Preview */}
             {!image ? (
                <div 
                  className="border-2 border-dashed border-neo-green/20 hover:border-neo-green/50 bg-black/40 p-6 text-center cursor-pointer transition-colors"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*" className="hidden" />
                  <div className="flex flex-col items-center justify-center gap-2 text-neo-green/50">
                    <Upload size={24} />
                    <span className="text-xs">UPLOAD IMAGE (OPTIONAL)</span>
                  </div>
                </div>
             ) : (
               <div className="relative aspect-video bg-black border border-neo-green/30 overflow-hidden">
                 <img src={image} className="w-full h-full object-contain opacity-80" />
                 <button 
                    onClick={() => setImage(null)}
                    className="absolute top-2 right-2 bg-black/80 text-red-500 p-1 rounded-sm"
                  >
                    <X size={14} />
                  </button>
                  {isScanning && <ScanEffect />}
               </div>
             )}
             
             {/* Generate Button */}
             <NeonButton 
               onClick={generateSignal} 
               disabled={isScanning || (!image && selectedTags.length === 0)}
               className="w-full flex items-center justify-center gap-2"
             >
               {isScanning ? <Cpu className="animate-spin" /> : <Zap />}
               {isScanning ? "PROCESSING..." : "GENERATE SIGNAL"}
             </NeonButton>
          </div>
        </div>

        {/* RIGHT: Output */}
        <div className="lg:col-span-7">
          <div className="space-y-6 pb-24">
            <AnimatePresence>
              {captions.map((cap, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-neo-black border border-neo-green/30 p-6 relative group hover:border-neo-green transition-colors hud-panel"
                >
                  <div className="absolute top-0 right-0 p-2 opacity-30 text-[10px] uppercase">
                    {detectedContext || "TEXT_GEN"}
                  </div>

                  <div className="mb-4">
                    <span className="text-xs bg-neo-green/20 text-neo-green px-2 py-0.5 font-bold uppercase border border-neo-green/20">
                      {cap.mood}
                    </span>
                  </div>

                  <p className="text-xl mb-6 font-light leading-relaxed text-white">
                    {cap.text}
                  </p>

                  <div className="flex gap-3">
                    <button 
                      onClick={() => copyToClipboard(cap.text, `cap-${idx}`)}
                      className="flex-1 border border-neo-green/30 hover:bg-neo-green hover:text-black py-2 text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      {copiedWallet === `cap-${idx}` ? <CheckCircle size={14} /> : <Copy size={14} />} COPY
                    </button>
                    <button 
                      onClick={() => openTwitterIntent(cap.text)}
                      className="flex-1 bg-neo-green text-black font-bold py-2 text-sm hover:bg-white transition-colors flex items-center justify-center gap-2"
                    >
                      <Twitter size={14} /> POST
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Retry Button */}
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
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-neo-black border-t border-neo-green/30 z-30">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          <div className="bg-neo-green text-black px-6 py-3 font-bold text-[10px] md:text-xs tracking-widest flex items-center gap-2 md:w-auto shrink-0 uppercase">
             Say thanks to the dev and buy her coffee☕
          </div>
          
          <div className="flex-1 overflow-x-auto scrollbar-hide flex items-center p-2 gap-2 bg-neo-black/90 backdrop-blur">
             {WALLETS.map((wallet, idx) => (
                <button
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
                    <div className="font-mono text-xs font-bold flex items-center gap-2">
                      {wallet.address}
                      {copiedWallet === wallet.label && <CheckCircle size={10} className="text-neo-green" />}
                    </div>
                  </div>
                </button>
             ))}
          </div>
        </div>
      </footer>

      {/* Modals */}
      <UserProfileModal 
        isOpen={showProfile} 
        onClose={() => setShowProfile(false)} 
        user={user}
        onLogin={handleLogin}
      />
      {showDictionary && <LingoDictionary onClose={() => setShowDictionary(false)} />}

      {/* Toast */}
      <AnimatePresence>
        {copiedWallet && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-4 bg-neo-green text-black px-4 py-2 font-bold shadow-neon z-50 flex items-center gap-2 text-sm"
          >
            <CheckCircle size={16} /> COPIED!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
