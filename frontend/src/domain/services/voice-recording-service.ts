// Implementation of Voice Recording Service

import { IVoiceRecordingService } from "./interfaces";
import {
  VoiceRecording,
  RecordingFormData,
  RecordingStatus,
  RiskLevel,
} from "../models/types";

// Use environment variable or default to localhost for browser-side requests
// In Next.js, NEXT_PUBLIC_ env vars are replaced at build time
// Browser can only access localhost, not Docker service names
const API_URL = typeof window !== "undefined"
  ? "http://localhost:8000" // Browser side - always use localhost
  : "http://backend:8000";   // Server side - use backend service name for Docker

// Type for the external API response
interface AnalyzeVoiceResponse {
  prediction: number; // UPDRS score
  patient: string; // Patient name
}

export class VoiceRecordingService implements IVoiceRecordingService {
  async uploadRecording(data: RecordingFormData): Promise<VoiceRecording> {
    try {
      const formData = new FormData();

      // Add audio file or blob
      if (data.audioFile) {
        formData.append("audio_file", data.audioFile);
        console.log(
          "Audio file added:",
          data.audioFile.name,
          data.audioFile.type,
          data.audioFile.size
        );
      } else if (data.recordingBlob) {
        const audioFile = new File(
          [data.recordingBlob],
          `recording-${Date.now()}.webm`,
          { type: data.recordingBlob.type || "audio/webm" }
        );
        formData.append("audio_file", audioFile);
        console.log(
          "Audio blob added as file:",
          audioFile.name,
          audioFile.type,
          audioFile.size
        );
      } else {
        throw new Error("No audio file or recording provided");
      }

      // Add patient info as required by the external API
      if (!data.patientInfo) {
        throw new Error("Patient information is required");
      }

      const { fullName, age, gender, testTime } = data.patientInfo;
      const name = fullName.trim();
      const sex = gender;
      const test_time = testTime;

      // Validate data before sending
      if (!name || name.length < 1 || name.length > 100) {
        throw new Error("Name must be between 1 and 100 characters");
      }
      if (!age || age <= 10 || age >= 120) {
        throw new Error("Age must be between 11 and 119");
      }
      if (sex !== "male" && sex !== "female") {
        throw new Error("Sex must be either 'male' or 'female'");
      }
      if (!test_time || test_time <= 0) {
        throw new Error("Test time must be greater than 0");
      }

      formData.append("name", name);
      formData.append("age", age.toString());
      formData.append("sex", sex);
      formData.append("test_time", test_time.toString());

      console.log("Patient info added:", { name, age, sex, test_time });

      // Log all form data entries for debugging
      console.log("FormData entries:");
      for (const [key, value] of formData.entries()) {
        if (value instanceof File) {
          console.log(
            `${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`
          );
        } else {
          console.log(`${key}: ${value}`);
        }
      }

      // Send to external API for analysis
      const apiEndpoint = `${API_URL}/analyze/voice`;
      console.log("Sending request to:", apiEndpoint);
      const response = await fetch(apiEndpoint, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      console.log(
        "Response headers:",
        Object.fromEntries(response.headers.entries())
      );

      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error Response:", errorText);

        let errorData: { detail?: string; message?: string };
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { detail: errorText };
        }

        const errorMessage =
          errorData.detail ||
          errorData.message ||
          `API request failed with status ${response.status}`;

        throw new Error(errorMessage);
      }

      const result: AnalyzeVoiceResponse = await response.json();
      console.log("API Response:", result);
      console.log("Prediction value:", result.prediction);
      console.log("Patient name:", result.patient);

      // Validate the expected response structure
      if (typeof result.prediction === "undefined") {
        console.error("Missing 'prediction' field in API response:", result);
        throw new Error("Invalid API response: missing prediction field");
      }

      if (typeof result.patient === "undefined") {
        console.warn("Missing 'patient' field in API response:", result);
      }

      // Generate a unique ID for the recording and result
      const recordingId = `rec_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;
      const resultId = `res_${Date.now()}_${Math.random()
        .toString(36)
        .substring(7)}`;

      // Transform API response to match our internal structure
      const updrsScore = result.prediction || 0;
      const patientName = result.patient || data.patientInfo?.fullName || "";

      console.log("Transforming API response:");
      console.log("- UPDRS Score:", updrsScore);
      console.log("- Patient Name:", patientName);
      console.log(
        "- Risk Level:",
        this.determineRiskLevelFromUPDRS(updrsScore)
      );

      const predictionResult = {
        id: resultId,
        recordingId: recordingId,
        score: updrsScore, // UPDRS score directly from API
        confidence: 0.85, // Default confidence for UPDRS analysis
        riskLevel: this.determineRiskLevelFromUPDRS(updrsScore),
        features: {
          jitter: 0,
          shimmer: 0,
          hnr: 0,
          pitch: 0,
          formants: [],
        },
        recommendations: this.generateRecommendationsFromUPDRS(updrsScore),
        createdAt: new Date(),
        patientName: patientName,
        updrsScore: updrsScore,
      };

      console.log("Created prediction result:", predictionResult);

      const voiceRecording: VoiceRecording = {
        id: recordingId,
        userId: "default-user", // Replace with actual user ID from auth
        fileName: data.audioFile?.name || `recording-${Date.now()}.webm`,
        fileUrl: "", // File is processed by external API, no local URL
        duration: data.patientInfo?.testTime || 30,
        createdAt: new Date(),
        status: RecordingStatus.COMPLETED,
        result: predictionResult,
      };

      console.log("Created voice recording:", voiceRecording);

      return voiceRecording;
    } catch (error) {
      console.error("Upload recording error:", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to upload and analyze recording");
    }
  }

  async getRecording(id: string): Promise<VoiceRecording> {
    try {
      const response = await fetch(`/api/recordings/${id}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch recording: ${response.statusText}`);
      }

      const data = await response.json();

      return {
        id: data.id,
        userId: data.userId,
        fileName: data.fileName,
        fileUrl: data.fileUrl,
        duration: data.duration,
        createdAt: new Date(data.createdAt),
        status: data.status || RecordingStatus.COMPLETED,
        result: data.result,
      };
    } catch (error) {
      console.error("Get recording error:", error);
      throw error;
    }
  }

  async getRecordings(userId: string): Promise<VoiceRecording[]> {
    try {
      const response = await fetch(`/api/recordings?userId=${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch recordings: ${response.statusText}`);
      }

      const data = await response.json();

      return data.map((recording: any) => ({
        id: recording.id,
        userId: recording.userId,
        fileName: recording.fileName,
        fileUrl: recording.fileUrl,
        duration: recording.duration,
        createdAt: new Date(recording.createdAt),
        status: recording.status || RecordingStatus.COMPLETED,
        result: recording.result,
      }));
    } catch (error) {
      console.error("Get recordings error:", error);
      throw error;
    }
  }

  async deleteRecording(id: string): Promise<void> {
    try {
      const response = await fetch(`/api/recordings/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`Failed to delete recording: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Delete recording error:", error);
      throw error;
    }
  }

  private determineRiskLevelFromUPDRS(updrsScore: number): RiskLevel {
    if (updrsScore <= 20) {
      return RiskLevel.LOW;
    } else if (updrsScore <= 40) {
      return RiskLevel.MODERATE;
    } else {
      return RiskLevel.HIGH;
    }
  }

  private generateRecommendationsFromUPDRS(updrsScore: number): string[] {
    const recommendations: string[] = [];

    if (updrsScore >= 61) {
      // Severe stage
      recommendations.push(
        "Immediate consultation with a movement disorder specialist is strongly recommended"
      );
      recommendations.push("Consider comprehensive neurological evaluation");
      recommendations.push(
        "Discuss advanced treatment options with your doctor"
      );
      recommendations.push(
        "Physical therapy and speech therapy may be beneficial"
      );
      recommendations.push(
        "Regular monitoring and medication adjustments may be needed"
      );
    } else if (updrsScore >= 41) {
      // Advanced stage
      recommendations.push("Schedule an appointment with a neurologist soon");
      recommendations.push(
        "Consider speech therapy to address communication difficulties"
      );
      recommendations.push(
        "Physical therapy may help with movement challenges"
      );
      recommendations.push("Regular exercise within your comfort level");
      recommendations.push(
        "Monitor symptoms and report changes to your doctor"
      );
    } else if (updrsScore >= 21) {
      // Moderate stage
      recommendations.push("Consult with a neurologist for proper evaluation");
      recommendations.push(
        "Regular exercise and physical activity are important"
      );
      recommendations.push(
        "Consider speech exercises if speech changes are noted"
      );
      recommendations.push("Maintain a healthy diet and lifestyle");
      recommendations.push("Keep a symptom diary for medical appointments");
    } else {
      // Mild/Early stage
      recommendations.push("Continue regular health monitoring");
      recommendations.push(
        "Maintain an active lifestyle with regular exercise"
      );
      recommendations.push(
        "Consider baseline neurological evaluation if concerned"
      );
      recommendations.push("Practice good vocal hygiene and speech exercises");
      recommendations.push("Stay informed about early signs and symptoms");
    }

    return recommendations;
  }

  // Helper method to get severity information for UI display
  getSeverityInfo(updrsScore: number) {
    if (updrsScore >= 61) {
      return {
        level: "Severe",
        label: "Severe stage",
        interpretation: "Significant motor impairment.",
        color: "red",
        urgency: "high",
      };
    } else if (updrsScore >= 41) {
      return {
        level: "Advanced",
        label: "Advanced stage",
        interpretation: "Noticeable speech/movement difficulties.",
        color: "orange",
        urgency: "medium-high",
      };
    } else if (updrsScore >= 21) {
      return {
        level: "Moderate",
        label: "Moderate severity",
        interpretation:
          "Some tremor, speech changes, or slower movement possible.",
        color: "yellow",
        urgency: "medium",
      };
    } else {
      return {
        level: "Mild/Early",
        label: "Mild motor symptoms",
        interpretation: "Voice pattern suggests very light or early signs.",
        color: "green",
        urgency: "low",
      };
    }
  }
}

export const voiceRecordingService = new VoiceRecordingService();
