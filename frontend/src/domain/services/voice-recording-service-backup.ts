// This file was removed as it's not being used in the system
// If you need voice recording service functionality, please use voice-recording-service.ts instead

export {};
//           throw new Error("Name must be between 1 and 100 characters");
//         }
//         if (!age || age <= 10 || age >= 120) {
//           throw new Error("Age must be between 11 and 119");
//         }
//         if (sex !== "male" && sex !== "female") {
//           throw new Error("Sex must be either 'male' or 'female'");
//         }
//         if (!test_time || test_time <= 0) {
//           throw new Error("Test time must be greater than 0");
//         }

//         formData.append("name", name);
//         formData.append("age", age.toString());
//         formData.append("sex", sex);
//         formData.append("test_time", test_time.toString());

//         console.log("Patient info added:", { name, age, sex, test_time });
//       } else {
//         throw new Error("Patient information is required");
//       }

//       // Log all form data entries for debugging
//       console.log("FormData entries:");
//       for (const [key, value] of formData.entries()) {
//         if (value instanceof File) {
//           console.log(`${key}: File(${value.name}, ${value.type}, ${value.size} bytes)`);
//         } else {
//           console.log(`${key}: ${value}`);
//         }
//       }

//       // Send to external API for analysis
//       console.log("Sending request to:", "http://localhost:8000/analyze/voice");
//       const response = await fetch("http://localhost:8000/analyze/voice", {
//         method: "POST",
//         body: formData,
//       });

//       console.log("Response status:", response.status);
//       console.log("Response headers:", Object.fromEntries(response.headers.entries()));

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("API Error Response:", errorText);

//         let errorData;
//         try {
//           errorData = JSON.parse(errorText);
//         } catch {
//           errorData = { detail: errorText };
//         }

//         throw new Error(
//           errorData.detail ||
//           errorData.message ||
//           `API request failed with status ${response.status}: ${errorText}`
//         );
//       }
//         throw new Error(
//           errorData.detail ||
//           errorData.message ||
//           `API request failed with status ${response.status}: ${errorText}`
//         );
//       }

//       const result = await response.json();
//       console.log("API Response:", result);

//       // Generate a unique ID for the recording and result
//       const recordingId = `rec_${Date.now()}_${Math.random()
//         .toString(36)
//         .substring(7)}`;
//       const resultId = `res_${Date.now()}_${Math.random()
//         .toString(36)
//         .substring(7)}`;

//       // Transform API response to match our internal structure
//       const voiceRecording: VoiceRecording = {
//         id: recordingId,
//         userId: "default-user", // Replace with actual user ID from auth
//         fileName: data.audioFile?.name || `recording-${Date.now()}.webm`,
//         fileUrl: "", // File is processed by external API, no local URL
//         duration: data.patientInfo?.testTime || 30,
//         createdAt: new Date(),
//         status: RecordingStatus.COMPLETED,
//         result: {
//           id: resultId,
//           recordingId: recordingId,
//           score: result.prediction || 0, // UPDRS score directly from API
//           confidence: 0.85, // Default confidence for UPDRS analysis
//           riskLevel: this.determineRiskLevelFromUPDRS(result.prediction || 0),
//           features: {
//             jitter: 0,
//             shimmer: 0,
//             hnr: 0,
//             pitch: 0,
//             formants: [],
//           },
//           recommendations: this.generateRecommendationsFromUPDRS(
//             result.prediction || 0
//           ),
//           createdAt: new Date(),
//           patientName: result.patient || data.patientInfo?.fullName || "",
//           updrsScore: result.prediction || 0,
//         },
//       };

//       return voiceRecording;
//     } catch (error) {
//       console.error("Upload recording error:", error);
//       throw error;
//     }
//   }

//   async getRecording(id: string): Promise<VoiceRecording> {
//     try {
//       const response = await fetch(`/api/recordings/${id}`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch recording");
//       }

//       const data = await response.json();

//       return {
//         id: data.id,
//         userId: data.userId,
//         fileName: data.fileName,
//         fileUrl: data.fileUrl,
//         duration: data.duration,
//         createdAt: new Date(data.createdAt),
//         status: data.status || RecordingStatus.COMPLETED,
//         result: data.result,
//       };
//     } catch (error) {
//       console.error("Get recording error:", error);
//       throw error;
//     }
//   }

//   async getRecordings(userId: string): Promise<VoiceRecording[]> {
//     try {
//       const response = await fetch(`/api/recordings?userId=${userId}`);

//       if (!response.ok) {
//         throw new Error("Failed to fetch recordings");
//       }

//       const data = await response.json();

//       return data.map((recording: any) => ({
//         id: recording.id,
//         userId: recording.userId,
//         fileName: recording.fileName,
//         fileUrl: recording.fileUrl,
//         duration: recording.duration,
//         createdAt: new Date(recording.createdAt),
//         status: recording.status || RecordingStatus.COMPLETED,
//         result: recording.result,
//       }));
//     } catch (error) {
//       console.error("Get recordings error:", error);
//       throw error;
//     }
//   }

//   async deleteRecording(id: string): Promise<void> {
//     try {
//       const response = await fetch(`/api/recordings/${id}`, {
//         method: "DELETE",
//       });

//       if (!response.ok) {
//         throw new Error("Failed to delete recording");
//       }
//     } catch (error) {
//       console.error("Delete recording error:", error);
//       throw error;
//     }
//   }

//   private determineRiskLevel(prediction: number): RiskLevel {
//     if (prediction < 0.3) {
//       return RiskLevel.LOW;
//     } else if (prediction < 0.7) {
//       return RiskLevel.MODERATE;
//     } else {
//       return RiskLevel.HIGH;
//     }
//   }

//   private determineRiskLevelFromUPDRS(updrsScore: number): RiskLevel {
//     if (updrsScore <= 20) {
//       return RiskLevel.LOW;
//     } else if (updrsScore <= 40) {
//       return RiskLevel.MODERATE;
//     } else {
//       return RiskLevel.HIGH;
//     }
//   }

//   private generateRecommendations(prediction: number): string[] {
//     const recommendations: string[] = [];

//     if (prediction >= 0.7) {
//       recommendations.push(
//         "Consider consulting with a neurologist for further evaluation"
//       );
//       recommendations.push("Regular monitoring of symptoms is recommended");
//       recommendations.push(
//         "Maintain a healthy lifestyle with regular exercise"
//       );
//     } else if (prediction >= 0.3) {
//       recommendations.push("Monitor symptoms and consider follow-up testing");
//       recommendations.push("Maintain regular exercise and healthy diet");
//       recommendations.push("Consider stress management techniques");
//     } else {
//       recommendations.push(
//         "Low risk detected - continue regular health monitoring"
//       );
//       recommendations.push("Maintain healthy lifestyle habits");
//     }

//     return recommendations;
//   }

//   private generateRecommendationsFromUPDRS(updrsScore: number): string[] {
//     const recommendations: string[] = [];

//     if (updrsScore >= 61) {
//       // Severe stage
//       recommendations.push(
//         "Immediate consultation with a movement disorder specialist is strongly recommended"
//       );
//       recommendations.push("Consider comprehensive neurological evaluation");
//       recommendations.push(
//         "Discuss advanced treatment options with your doctor"
//       );
//       recommendations.push(
//         "Physical therapy and speech therapy may be beneficial"
//       );
//       recommendations.push(
//         "Regular monitoring and medication adjustments may be needed"
//       );
//     } else if (updrsScore >= 41) {
//       // Advanced stage
//       recommendations.push("Schedule an appointment with a neurologist soon");
//       recommendations.push(
//         "Consider speech therapy to address communication difficulties"
//       );
//       recommendations.push(
//         "Physical therapy may help with movement challenges"
//       );
//       recommendations.push("Regular exercise within your comfort level");
//       recommendations.push(
//         "Monitor symptoms and report changes to your doctor"
//       );
//     } else if (updrsScore >= 21) {
//       // Moderate stage
//       recommendations.push("Consult with a neurologist for proper evaluation");
//       recommendations.push(
//         "Regular exercise and physical activity are important"
//       );
//       recommendations.push(
//         "Consider speech exercises if speech changes are noted"
//       );
//       recommendations.push("Maintain a healthy diet and lifestyle");
//       recommendations.push("Keep a symptom diary for medical appointments");
//     } else {
//       // Mild/Early stage
//       recommendations.push("Continue regular health monitoring");
//       recommendations.push(
//         "Maintain an active lifestyle with regular exercise"
//       );
//       recommendations.push(
//         "Consider baseline neurological evaluation if concerned"
//       );
//       recommendations.push("Practice good vocal hygiene and speech exercises");
//       recommendations.push("Stay informed about early signs and symptoms");
//     }

//     return recommendations;
//   }

//   // Helper method to get severity information for UI display
//   getSeverityInfo(updrsScore: number) {
//     if (updrsScore >= 61) {
//       return {
//         level: "Severe",
//         label: "Severe stage",
//         interpretation: "Significant motor impairment.",
//         color: "red",
//         urgency: "high",
//       };
//     } else if (updrsScore >= 41) {
//       return {
//         level: "Advanced",
//         label: "Advanced stage",
//         interpretation: "Noticeable speech/movement difficulties.",
//         color: "orange",
//         urgency: "medium-high",
//       };
//     } else if (updrsScore >= 21) {
//       return {
//         level: "Moderate",
//         label: "Moderate severity",
//         interpretation:
//           "Some tremor, speech changes, or slower movement possible.",
//         color: "yellow",
//         urgency: "medium",
//       };
//     } else {
//       return {
//         level: "Mild/Early",
//         label: "Mild motor symptoms",
//         interpretation: "Voice pattern suggests very light or early signs.",
//         color: "green",
//         urgency: "low",
//       };
//     }
//   }
// }

// export const voiceRecordingService = new VoiceRecordingService();
