"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Mic,
  Play,
  Pause,
  Check,
  Loader2,
  ArrowRight,
  ArrowLeft,
  User,
} from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Input } from "@/presentation/components/ui/input";
import { Label } from "@/presentation/components/ui/label";
import { Progress } from "@/presentation/components/ui/progress";
import { useToast } from "@/presentation/hooks/use-toast";
import { voiceRecordingPresenter } from "@/presentation/presenters/voice-recording-presenter";
import { useRouter } from "next/navigation";

interface PatientInfo {
  fullName: string;
  age: number;
  gender: "male" | "female";
  testTime: number;
}

const steps = [
  { id: 1, title: "Information", description: "Patient basic details" },
  { id: 2, title: "Upload/Record", description: "Voice sample" },
  { id: 3, title: "Preview", description: "Review your recording" },
  { id: 4, title: "Submit", description: "Confirm and analyze" },
];

export function VoiceRecordingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    fullName: "",
    age: 0,
    gender: "male",
    testTime: 0,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof PatientInfo, string>>
  >({});
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(
    null
  );
  const [audioUrl, setAudioUrl] = useState<string>("");
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  // Create and cleanup audio URL when audio file/blob changes
  useEffect(() => {
    let url = "";
    if (audioFile) {
      url = URL.createObjectURL(audioFile);
      setAudioUrl(url);
    } else if (audioBlob) {
      url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);
    } else {
      setAudioUrl("");
    }

    // Cleanup function to revoke the object URL
    return () => {
      if (url) {
        URL.revokeObjectURL(url);
      }
    };
  }, [audioFile, audioBlob]);

  // Cleanup intervals on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }
    };
  }, []);

  // Audio recording logic
  const startRecording = async () => {
    try {
      // Clear any uploaded file when starting to record
      setAudioFile(null);

      // Reset recording time to 0 before starting
      setRecordingTime(0);

      // Clear any existing intervals
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => chunks.push(e.data);
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());

        // Clear interval when recording stops
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);

      // Timer - store in ref
      timerIntervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);

      // Stop after 30 seconds - store in ref
      recordingTimeoutRef.current = setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          setIsRecording(false);
          if (timerIntervalRef.current) {
            clearInterval(timerIntervalRef.current);
            timerIntervalRef.current = null;
          }
        }
      }, 30000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not access microphone",
        variant: "destructive",
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop();
      setIsRecording(false);

      // Clear interval when manually stopping
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
        timerIntervalRef.current = null;
      }

      // Clear timeout
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAudioFile(file);
      setAudioBlob(null); // Clear any recorded audio
      setRecordingTime(0); // Reset recording time
      toast({
        title: "File uploaded",
        description: file.name,
      });
    }
  };

  const removeAudioFile = () => {
    setAudioFile(null);
    // Reset the file input
    const fileInput = document.getElementById(
      "audio-upload"
    ) as HTMLInputElement;
    if (fileInput) {
      fileInput.value = "";
    }
    toast({
      title: "Removed",
      description: "Audio file removed",
    });
  };

  const removeRecording = () => {
    setAudioBlob(null);
    setRecordingTime(0);
    toast({
      title: "Removed",
      description: "Recording removed",
    });
  };

  const handleSubmit = async () => {
    if (!audioFile && !audioBlob) {
      toast({
        title: "Error",
        description: "Please upload or record an audio file",
        variant: "destructive",
      });
      return;
    }

    // Final validation of patient info
    if (!validatePatientInfo()) {
      toast({
        title: "Error",
        description:
          "Please ensure all patient information is filled correctly",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await voiceRecordingPresenter.uploadAndAnalyze({
        audioFile: audioFile || undefined,
        recordingBlob: audioBlob || undefined,
        patientInfo: patientInfo,
      });

      if (result.success && result.result) {
        toast({
          title: "Success",
          description: "Analysis completed successfully",
        });

        // Navigate to results page with the recording ID
        router.push(`/results/${result.recording?.id || "latest"}`);
      } else {
        toast({
          title: "Analysis Failed",
          description:
            result.error || "Failed to analyze recording. Please try again.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validatePatientInfo = (): boolean => {
    const newErrors: Partial<Record<keyof PatientInfo, string>> = {};

    if (!patientInfo.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!patientInfo.age || patientInfo.age < 1 || patientInfo.age > 120) {
      newErrors.age = "Please enter a valid age (1-120)";
    }

    if (!patientInfo.gender) {
      newErrors.gender = "Gender is required";
    }

    if (!patientInfo.testTime || patientInfo.testTime < 1) {
      newErrors.testTime = "Test time is required (minimum 1 second)";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Validation function that doesn't update state (for use in render functions)
  const isPatientInfoValid = (): boolean => {
    return (
      patientInfo.fullName.trim() !== "" &&
      patientInfo.age > 0 &&
      patientInfo.age <= 120 &&
      (patientInfo.gender === "male" || patientInfo.gender === "female") &&
      patientInfo.testTime > 0
    );
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!validatePatientInfo()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly",
          variant: "destructive",
        });
        return;
      }
    }

    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (stepId: number) => {
    // Validate required steps before allowing navigation
    // Step 1 is always accessible
    // Step 2+ requires valid patient info (step 1)
    // Step 3+ requires audio (step 2)
    // Step 4 requires both

    if (stepId >= 2) {
      // Check if step 1 is completed
      if (!isPatientInfoValid()) {
        toast({
          title: "Validation Error",
          description: "Please complete patient information first (Step 1)",
          variant: "destructive",
        });
        return;
      }
    }

    if (stepId >= 3) {
      // Check if step 2 is completed (audio uploaded or recorded)
      if (!audioFile && !audioBlob) {
        toast({
          title: "No Audio",
          description: "Please upload or record audio first (Step 2)",
          variant: "destructive",
        });
        return;
      }
    }

    // All validations passed, navigate to the step
    if (stepId >= 1 && stepId <= steps.length) {
      setCurrentStep(stepId);
    }
  };

  const canProceed = () => {
    if (currentStep === 1) {
      return isPatientInfoValid();
    }
    if (currentStep === 2) {
      return audioFile !== null || audioBlob !== null;
    }
    if (currentStep === 3) {
      return (audioFile !== null || audioBlob !== null) && isPatientInfoValid();
    }
    return true;
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <div className="flex items-center justify-between relative">
        {steps.map((step, index) => (
          <motion.div
            key={step.id}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex flex-col items-center relative z-10 cursor-pointer"
            onClick={() => goToStep(step.id)}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
                currentStep >= step.id
                  ? "bg-primary text-primary-foreground hover:bg-primary/90"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {currentStep > step.id ? <Check className="w-6 h-6" /> : step.id}
            </motion.div>
            <div className="mt-2 text-center">
              <div className="text-sm font-medium">{step.title}</div>
              <div className="text-xs text-muted-foreground">
                {step.description}
              </div>
            </div>
          </motion.div>
        ))}
        <div className="absolute top-6 left-0 right-0 h-1 bg-muted -z-0">
          <motion.div
            className="h-full bg-primary"
            initial={{ width: "0%" }}
            animate={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{steps[currentStep - 1].title}</CardTitle>
              <CardDescription>
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Patient Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                      <User className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold">
                        Patient Information
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Please provide basic details for the analysis
                      </p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Full Name */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="fullName">
                        Full Name <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="fullName"
                        placeholder="John Doe"
                        value={patientInfo.fullName}
                        onChange={(e) => {
                          setPatientInfo({
                            ...patientInfo,
                            fullName: e.target.value,
                          });
                          setErrors({ ...errors, fullName: "" });
                        }}
                        className={errors.fullName ? "border-red-500" : ""}
                      />
                      {errors.fullName && (
                        <p className="text-sm text-red-500">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    {/* Age */}
                    <div className="space-y-2">
                      <Label htmlFor="age">
                        Age <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="age"
                        type="number"
                        placeholder="45"
                        min="1"
                        max="120"
                        value={patientInfo.age || ""}
                        onChange={(e) => {
                          setPatientInfo({
                            ...patientInfo,
                            age: parseInt(e.target.value) || 0,
                          });
                          setErrors({ ...errors, age: "" });
                        }}
                        className={errors.age ? "border-red-500" : ""}
                      />
                      {errors.age && (
                        <p className="text-sm text-red-500">{errors.age}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div className="space-y-2">
                      <Label htmlFor="gender">
                        Gender <span className="text-red-500">*</span>
                      </Label>
                      <select
                        id="gender"
                        value={patientInfo.gender}
                        onChange={(e) => {
                          setPatientInfo({
                            ...patientInfo,
                            gender: e.target.value as "male" | "female",
                          });
                          setErrors({ ...errors, gender: "" });
                        }}
                        className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                          errors.gender ? "border-red-500" : ""
                        }`}
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      {errors.gender && (
                        <p className="text-sm text-red-500">{errors.gender}</p>
                      )}
                    </div>

                    {/* Test Time */}
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="testTime">
                        Test Time (days)<span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="testTime"
                        type="number"
                        step="0.01"
                        placeholder="ex: 1.5 = 1 and half days"
                        min="0.01"
                        value={patientInfo.testTime || ""}
                        onChange={(e) => {
                          setPatientInfo({
                            ...patientInfo,
                            testTime: parseFloat(e.target.value) || 0,
                          });
                          setErrors({ ...errors, testTime: "" });
                        }}
                        className={errors.testTime ? "border-red-500" : ""}
                      />
                      {errors.testTime && (
                        <p className="text-sm text-red-500">
                          {errors.testTime}
                        </p>
                      )}
                      {/* <p className="text-sm text-muted-foreground">
                        Expected duration of the voice test in seconds
                      </p> */}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                    <p className="text-sm">
                      <strong>Privacy Notice:</strong> Your information and
                      voice sample will be securely transmitted to our analysis
                      servers
                    </p>
                  </div>
                </div>
              )}

              {/* Step 2: Upload/Record */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Upload Section */}
                    <motion.div
                      whileHover={{ scale: audioBlob ? 1 : 1.02 }}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        audioBlob
                          ? "border-muted bg-muted/50 opacity-50 cursor-not-allowed"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Upload Audio File</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Support: MP3, WAV, OGG, WebM
                      </p>
                      {!audioFile && !audioBlob && (
                        <>
                          <input
                            type="file"
                            accept="audio/*"
                            onChange={handleFileUpload}
                            className="hidden"
                            id="audio-upload"
                          />
                          <label htmlFor="audio-upload">
                            <Button asChild>
                              <span>Choose File</span>
                            </Button>
                          </label>
                        </>
                      )}
                      {audioFile && (
                        <div className="space-y-3">
                          <p className="text-sm text-green-600 font-medium">
                            ✓ {audioFile.name}
                          </p>
                          <Button
                            onClick={removeAudioFile}
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            Remove
                          </Button>
                        </div>
                      )}
                      {audioBlob && (
                        <p className="text-sm text-muted-foreground italic">
                          Recording in use. Remove recording to upload file.
                        </p>
                      )}
                    </motion.div>

                    {/* Record Section */}
                    <motion.div
                      whileHover={{ scale: audioFile ? 1 : 1.02 }}
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
                        audioFile
                          ? "border-muted bg-muted/50 opacity-50 cursor-not-allowed"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      <Mic className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold mb-2">Record Audio</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        Record up to 30 seconds
                      </p>
                      {!isRecording && !audioBlob && !audioFile && (
                        <Button onClick={startRecording}>
                          <Mic className="w-4 h-4 mr-2" />
                          Start Recording
                        </Button>
                      )}
                      {isRecording && (
                        <div className="space-y-4">
                          <motion.div
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-16 h-16 bg-red-500 rounded-full mx-auto"
                          />
                          <p className="text-lg font-mono">
                            {Math.floor(recordingTime / 60)}:
                            {(recordingTime % 60).toString().padStart(2, "0")}
                          </p>
                          <Button onClick={stopRecording} variant="destructive">
                            <Pause className="w-4 h-4 mr-2" />
                            Stop Recording
                          </Button>
                        </div>
                      )}
                      {audioBlob && !isRecording && (
                        <div className="space-y-3">
                          <p className="text-sm text-green-600 font-medium">
                            ✓ Recording completed ({recordingTime}s)
                          </p>
                          <div className="flex gap-2 justify-center">
                            <Button
                              onClick={removeRecording}
                              variant="outline"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      )}
                      {audioFile && (
                        <p className="text-sm text-muted-foreground italic">
                          File uploaded. Remove file to record audio.
                        </p>
                      )}
                    </motion.div>
                  </div>

                  <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                    <p className="text-sm">
                      <strong>Note:</strong> You can either upload an audio file
                      OR record audio, not both. Choose the option that works
                      best for you.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 3: Preview */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="p-6 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-4">Recording Preview</h3>
                    {(audioFile || audioBlob) && audioUrl && (
                      <div className="space-y-4">
                        <audio
                          key={audioUrl}
                          controls
                          className="w-full"
                          preload="auto"
                          src={audioUrl}
                        >
                          Your browser does not support the audio element.
                        </audio>
                        <div className="text-sm space-y-2">
                          <p>
                            <strong>File:</strong>{" "}
                            {audioFile?.name || "Recorded Audio"}
                          </p>
                          <p>
                            <strong>Type:</strong>{" "}
                            {audioFile?.type || "audio/webm"}
                          </p>
                          <p>
                            <strong>Size:</strong>{" "}
                            {audioFile
                              ? (audioFile.size / 1024).toFixed(2)
                              : audioBlob
                              ? (audioBlob.size / 1024).toFixed(2)
                              : 0}{" "}
                            KB
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 4: Submit */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  {!isSubmitting ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-6"
                    >
                      <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                        <Check className="w-10 h-10 text-primary" />
                      </div>
                      <h3 className="text-2xl font-bold">
                        Ready for UPDRS Analysis
                      </h3>
                      <p className="text-muted-foreground">
                        Your voice sample will be analyzed using our AI model to
                        estimate UPDRS motor symptoms related to
                        Parkinson&apos;s disease
                      </p>

                      {/* Summary of submitted data */}
                      <div className="bg-muted p-4 rounded-lg text-left max-w-md mx-auto">
                        <h4 className="font-semibold mb-3">
                          Submission Summary
                        </h4>
                        <div className="space-y-2 text-sm">
                          <p>
                            <strong>Patient:</strong> {patientInfo.fullName}
                          </p>
                          <p>
                            <strong>Age:</strong> {patientInfo.age} years
                          </p>
                          <p>
                            <strong>Gender:</strong> {patientInfo.gender}
                          </p>
                          <p>
                            <strong>Test Duration:</strong>{" "}
                            {patientInfo.testTime}s
                          </p>
                          <p>
                            <strong>Audio:</strong>{" "}
                            {audioFile
                              ? audioFile.name
                              : `Recording (${recordingTime}s)`}
                          </p>
                        </div>
                      </div>

                      {/* UPDRS Information */}
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg text-left max-w-md mx-auto">
                        <h4 className="font-semibold mb-2 text-blue-700 dark:text-blue-300">
                          About UPDRS Analysis
                        </h4>
                        <div className="text-sm text-blue-600 dark:text-blue-400 space-y-1">
                          <p>• UPDRS scores range from 0-108</p>
                          <p>• Lower scores indicate milder symptoms</p>
                          <p>• Analysis based on voice patterns</p>
                          <p>• Results are for screening purposes only</p>
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center space-y-6"
                    >
                      <Loader2 className="w-16 h-16 animate-spin text-primary mx-auto" />
                      <div>
                        <h3 className="text-xl font-semibold mb-2">
                          Analyzing Voice for UPDRS Score...
                        </h3>
                        <p className="text-muted-foreground">
                          Processing voice patterns to estimate motor symptoms
                          severity
                        </p>
                        <p className="text-sm text-muted-foreground mt-2">
                          Analyzing speech features • Calculating UPDRS score •
                          Generating recommendations
                        </p>
                      </div>
                      <Progress
                        value={66}
                        className="w-full max-w-md mx-auto"
                      />
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          onClick={prevStep}
          disabled={currentStep === 1 || isSubmitting}
          variant="outline"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        {currentStep < steps.length ? (
          <Button onClick={nextStep} disabled={!canProceed()}>
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                Submit & Analyze
                <Check className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
