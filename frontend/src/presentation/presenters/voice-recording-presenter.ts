// Voice Recording Presenter

import { voiceRecordingService } from "@/domain/services/voice-recording-service";
import { predictionService } from "@/domain/services/prediction-service";
import { useRecordingStore, usePredictionStore } from "@/presentation/stores";
import { RecordingFormData } from "@/domain/models/types";

export class VoiceRecordingPresenter {
  async uploadAndAnalyze(data: RecordingFormData) {
    try {
      useRecordingStore.getState().setLoading(true);
      usePredictionStore.getState().setAnalyzing(true);

      // Upload and analyze recording (now done in one step by external API)
      console.log("Starting upload and analysis...");
      const recording = await voiceRecordingService.uploadRecording(data);
      console.log("Recording received from service:", recording);

      useRecordingStore.getState().setCurrentRecording(recording);
      useRecordingStore.getState().addRecording(recording);
      console.log("Recording stored in store");

      // Set the result from the recording if available
      if (recording.result) {
        console.log("Setting result in prediction store:", recording.result);
        usePredictionStore.getState().setCurrentResult(recording.result);
      } else {
        console.warn("No result found in recording");
      }

      console.log("Upload and analysis completed successfully");
      return { success: true, recording, result: recording.result };
    } catch (error) {
      console.error("Upload and analysis error:", error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Upload and analysis failed",
      };
    } finally {
      useRecordingStore.getState().setLoading(false);
      usePredictionStore.getState().setAnalyzing(false);
    }
  }

  async loadRecordings(userId: string) {
    try {
      useRecordingStore.getState().setLoading(true);
      const recordings = await voiceRecordingService.getRecordings(userId);
      useRecordingStore.getState().setRecordings(recordings);
      return { success: true, recordings };
    } catch (error) {
      return { success: false, error: "Failed to load recordings" };
    } finally {
      useRecordingStore.getState().setLoading(false);
    }
  }

  async deleteRecording(id: string) {
    try {
      await voiceRecordingService.deleteRecording(id);
      return { success: true };
    } catch (error) {
      return { success: false, error: "Failed to delete recording" };
    }
  }
}

export const voiceRecordingPresenter = new VoiceRecordingPresenter();
