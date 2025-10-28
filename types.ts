
import type { Chat } from "@google/genai";

export interface MeditationSession {
  script: string;
  imageUrl: string;
  audioData: string; // base64 encoded
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
}

export type View = 'generator' | 'player' | 'chat';

export interface UseAudioPlayerReturn {
  isPlaying: boolean;
  togglePlayPause: () => void;
  isLoading: boolean;
}
