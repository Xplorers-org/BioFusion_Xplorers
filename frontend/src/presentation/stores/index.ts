// Presentation Layer - Stores (State Management using Zustand)

import { create } from 'zustand';
import { User, VoiceRecording, PredictionResult } from '@/domain/models/types';

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));

interface RecordingStore {
  recordings: VoiceRecording[];
  currentRecording: VoiceRecording | null;
  isLoading: boolean;
  setRecordings: (recordings: VoiceRecording[]) => void;
  setCurrentRecording: (recording: VoiceRecording | null) => void;
  addRecording: (recording: VoiceRecording) => void;
  setLoading: (isLoading: boolean) => void;
}

export const useRecordingStore = create<RecordingStore>((set) => ({
  recordings: [],
  currentRecording: null,
  isLoading: false,
  setRecordings: (recordings) => set({ recordings }),
  setCurrentRecording: (currentRecording) => set({ currentRecording }),
  addRecording: (recording) =>
    set((state) => ({ recordings: [recording, ...state.recordings] })),
  setLoading: (isLoading) => set({ isLoading }),
}));

interface PredictionStore {
  currentResult: PredictionResult | null;
  isAnalyzing: boolean;
  setCurrentResult: (result: PredictionResult | null) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
}

export const usePredictionStore = create<PredictionStore>((set) => ({
  currentResult: null,
  isAnalyzing: false,
  setCurrentResult: (currentResult) => set({ currentResult }),
  setAnalyzing: (isAnalyzing) => set({ isAnalyzing }),
}));
