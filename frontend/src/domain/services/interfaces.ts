// Domain Service Interfaces

import {
  User,
  VoiceRecording,
  PredictionResult,
  RecordingFormData,
} from "../models/types";

export interface IAuthService {
  login(email: string, password: string): Promise<User>;
  signup(email: string, password: string, name: string): Promise<User>;
  logout(): Promise<void>;
  getCurrentUser(): Promise<User | null>;
}

export interface IVoiceRecordingService {
  uploadRecording(data: RecordingFormData): Promise<VoiceRecording>;
  getRecording(id: string): Promise<VoiceRecording>;
  getRecordings(userId: string): Promise<VoiceRecording[]>;
  deleteRecording(id: string): Promise<void>;
  getSeverityInfo(updrsScore: number): any;
}

export interface IPredictionService {
  predictParkinson(recordingId: string): Promise<PredictionResult>;
  getResult(resultId: string): Promise<PredictionResult>;
}

export interface IStorageService {
  uploadFile(file: File): Promise<string>;
  deleteFile(url: string): Promise<void>;
}
