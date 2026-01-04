// Domain Models

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
}

export interface VoiceRecording {
  id: string;
  userId: string;
  fileName: string;
  fileUrl: string;
  duration: number;
  createdAt: Date;
  status: RecordingStatus;
  result?: PredictionResult;
}

export enum RecordingStatus {
  UPLOADING = "uploading",
  PROCESSING = "processing",
  COMPLETED = "completed",
  FAILED = "failed",
}

export interface PredictionResult {
  id: string;
  recordingId: string;
  score: number; // UPDRS score (0-132 typically)
  confidence: number; // 0-1
  riskLevel: RiskLevel;
  features: VoiceFeatures;
  recommendations: string[];
  createdAt: Date;
  patientName?: string; // Patient name from API response
  updrsScore?: number; // Explicit UPDRS score field
}

export enum RiskLevel {
  LOW = "low",
  MODERATE = "moderate",
  HIGH = "high",
}

export interface VoiceFeatures {
  jitter: number;
  shimmer: number;
  hnr: number; // Harmonics-to-Noise Ratio
  pitch: number;
  formants: number[];
}

export interface PatientInfo {
  fullName: string;
  age: number;
  gender: "male" | "female";
  testTime: number;
}

export interface RecordingFormData {
  audioFile?: File;
  recordingBlob?: Blob;
  notes?: string;
  patientInfo?: PatientInfo;
}
