export type SignalMode = 'GM' | 'GN';

export interface UserStats {
  streak: number;
  lastSignalDate: string | null; // ISO Date string
  totalSignals: number;
  modeHistory: SignalMode[];
}

export interface UserProfile {
  name: string;
  handle: string;
  avatar: string;
  isLoggedIn: boolean;
  provider?: 'google' | 'twitter';
}

export interface GeneratedCaption {
  text: string;
  mood: string;
}

export interface WalletAddress {
  label: string;
  address: string;
  icon: string;
}

export interface AnalysisResult {
  context: string;
  captions: GeneratedCaption[];
}

export interface LingoDefinition {
  word: string;
  definition: string;
  category: 'trading' | 'slang' | 'mindset';
}

export interface ShortcutTag {
  id: string;
  label: string;
  category: 'chain' | 'mood' | 'lifestyle';
}
