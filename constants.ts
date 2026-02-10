import { WalletAddress, LingoDefinition, ShortcutTag } from "./types";

export const WALLETS: WalletAddress[] = [
  { label: "DEV // ZAHRA", address: "zahrah.nft", icon: "code" },
  { label: "Base/ETH", address: "arewa.base.eth", icon: "eth" },
  { label: "NEAR", address: "zahrah.near", icon: "near" },
  { label: "TON", address: "realworldasset.ton", icon: "ton" },
];

export const INITIAL_STATS = {
  streak: 0,
  lastSignalDate: null,
  totalSignals: 0,
  modeHistory: [],
};

export const WEB3_QUOTES = [
  "Execute your plans, don't procrastinate.",
  "Bear markets are for building, bull markets are for changing your life.",
  "Conviction pays off when the chart looks ugly.",
  "Your network is your net worth. Engage daily.",
  "Don't trust, verify. Then ship it.",
  "Consistency is the only alpha you need.",
  "WAGMI isn't a promise, it's a mindset.",
  "The best time to buy was yesterday. The second best time is now.",
  "Stay based, stay building.",
  "Code is law, but community is culture.",
  "Liquidity flows to where attention goes.",
  "Don't just watch the charts, make the moves."
];

export const SHORTCUTS: ShortcutTag[] = [
  // Market Sentiment
  { id: 'bull', label: 'Bull Market', category: 'mood' },
  { id: 'bear', label: 'Bear Market', category: 'mood' },
  
  // Lifestyle & Actions
  { id: 'building', label: 'Building', category: 'lifestyle' },
  { id: 'ai', label: 'AI / Agents', category: 'lifestyle' },
  { id: 'shilling', label: 'Shilling', category: 'lifestyle' },
  { id: 'branding', label: 'Personal Brand', category: 'lifestyle' },
  
  // Community
  { id: 'connect', label: 'Looking to Connect', category: 'lifestyle' },
  { id: 'community', label: 'Community', category: 'lifestyle' },

  // Classics
  { id: 'gym', label: 'Gym', category: 'lifestyle' },
  { id: 'coffee', label: 'Caffeine', category: 'lifestyle' },
  { id: 'charts', label: 'Charts', category: 'lifestyle' },
  { id: 'focused', label: 'Locked In', category: 'mood' },
  { id: 'tired', label: 'Touch Grass', category: 'mood' },
];

// Alphabetically sorted dictionary with more terms
export const LINGO_DICTIONARY: LingoDefinition[] = [
  { word: "Alpha", definition: "Insider information or high-value insight that gives you an edge.", category: "trading" },
  { word: "Apul", definition: "Aggressively buying into a token instantly.", category: "trading" },
  { word: "ATH", definition: "All Time High. The highest price a token has ever reached.", category: "trading" },
  { word: "Bagholder", definition: "Someone holding a coin that has dropped significantly in value with no hope of recovery.", category: "trading" },
  { word: "Based", definition: "Being yourself and not caring what others think. Often synonymous with 'cool' or 'legit' in crypto.", category: "mindset" },
  { word: "Bear Market", definition: "A prolonged period of price declines. Time to build.", category: "trading" },
  { word: "Bull Market", definition: "Prices go up. Everyone is a genius. Pure euphoria.", category: "trading" },
  { word: "Cope", definition: "Making excuses for a bad trade or a bag that's down 90%.", category: "slang" },
  { word: "Degen", definition: "Degenerate. A gambler who apes into risky projects without due diligence.", category: "slang" },
  { word: "Diamond Hands", definition: "Holding onto bags despite extreme volatility. Not selling.", category: "mindset" },
  { word: "DYOR", definition: "Do Your Own Research. A disclaimer used to avoid liability.", category: "mindset" },
  { word: "Exit Liquidity", definition: "You, when you buy a coin that everyone else is dumping.", category: "trading" },
  { word: "FGM", definition: "F***ing Good Morning. High energy GM.", category: "slang" },
  { word: "FOMO", definition: "Fear Of Missing Out. Panic buying because numbers are going up.", category: "trading" },
  { word: "FUD", definition: "Fear, Uncertainty, Doubt. Negative news spread to lower prices.", category: "trading" },
  { word: "HODL", definition: "Hold On for Dear Life. Refusing to sell.", category: "mindset" },
  { word: "LFG", definition: "Let's F***ing Go. Hype signal.", category: "slang" },
  { word: "Liquidity", definition: "How easy it is to buy or sell a token without affecting the price.", category: "trading" },
  { word: "NFA", definition: "Not Financial Advice. The standard lawyer-avoidance phrase.", category: "mindset" },
  { word: "NGMI", definition: "Not Gonna Make It. Used when someone sells the bottom or buys the top.", category: "slang" },
  { word: "Paper Hands", definition: "Someone who sells at the first sign of a dip. Weak conviction.", category: "trading" },
  { word: "Probable Cause", definition: "Usually refers to reasons to enter a trade based on chart patterns.", category: "trading" },
  { word: "Rekt", definition: "Wrecked. Losing all your money.", category: "slang" },
  { word: "Rug", definition: "Rug Pull. When devs drain the liquidity and disappear.", category: "trading" },
  { word: "Ser", definition: "Sir. Used ironically or respectfully.", category: "slang" },
  { word: "Sniper", definition: "Someone (or a bot) who buys a token the second it launches.", category: "trading" },
  { word: "WAGMI", definition: "We All Gonna Make It. Pure hopium for the community.", category: "mindset" },
  { word: "Whale", definition: "Someone with a massive amount of capital or tokens.", category: "trading" },
];
