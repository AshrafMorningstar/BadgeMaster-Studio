export enum ModelMode {
  FAST = 'fast',
  SEARCH = 'search',
  THINKING = 'thinking',
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
  sources?: { uri: string; title: string }[];
}

export enum ImageSize {
  SIZE_1K = '1K',
  SIZE_2K = '2K',
  SIZE_4K = '4K',
}

export interface ImageGenerationResult {
  url: string;
  prompt: string;
}

export interface BadgeTier {
  name: string; // e.g., "Bronze", "x2"
  criteria: string;
}

export interface Badge {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: 'Earnable' | 'Historical' | 'Special';
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  howToEarn: string;
  tiers: BadgeTier[];
  owned: boolean;
  strategy?: string;
  dateRelease?: string;
}
