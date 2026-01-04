"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Progress } from "@/presentation/components/ui/progress";
import { Button } from "@/presentation/components/ui/button";
import {
  Download,
  Share2,
  AlertCircle,
  CheckCircle2,
  AlertTriangle,
  User,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { PredictionResult, RiskLevel } from "@/domain/models/types";
import { predictionService } from "@/domain/services/prediction-service";
import { voiceRecordingService } from "@/domain/services/voice-recording-service";
import { usePredictionStore, useRecordingStore } from "@/presentation/stores";
import { getRiskColor } from "@/lib/utils";

interface ResultsDisplayProps {
  recordingId: string;
}

export function ResultsDisplay({ recordingId }: ResultsDisplayProps) {
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Get data from stores
  const currentResult = usePredictionStore((state) => state.currentResult);
  const currentRecording = useRecordingStore((state) => state.currentRecording);

  const loadResult = useCallback(async () => {
    setIsLoading(true);
    try {
      console.log("Loading result for recordingId:", recordingId);
      console.log("Current result from store:", currentResult);
      console.log("Current recording from store:", currentRecording);

      // First try to use the current result from store
      if (currentResult) {
        console.log("Using current result from store:", currentResult);
        setResult(currentResult);
        setIsLoading(false);
        return;
      }

      // If current recording has a result, use that
      if (currentRecording && currentRecording.result) {
        console.log(
          "Using result from current recording:",
          currentRecording.result
        );
        setResult(currentRecording.result);
        setIsLoading(false);
        return;
      }

      // Mock loading delay for fallback
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Fallback: try to get recording from service (this might not work with external API)
      try {
        const recording = await voiceRecordingService.getRecording(recordingId);
        if (recording && recording.result) {
          console.log("Recording loaded from service:", recording);
          setResult(recording.result);
        } else {
          console.warn("No result found in recording from service");
          // Last fallback to prediction service
          const mockResult = await predictionService.getResult(recordingId);
          setResult(mockResult);
        }
      } catch (serviceError) {
        console.error("Service call failed:", serviceError);
        // Last fallback to prediction service
        const mockResult = await predictionService.getResult(recordingId);
        setResult(mockResult);
      }
    } catch (error) {
      console.error("Failed to load result:", error);
      setResult(null);
    }
    setIsLoading(false);
  }, [recordingId, currentResult, currentRecording]);

  useEffect(() => {
    loadResult();
  }, [loadResult]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!result) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <AlertCircle className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">No results found</p>
        </CardContent>
      </Card>
    );
  }

  // Get UPDRS severity information
  const updrsScore = result.updrsScore || result.score;
  const severityInfo = voiceRecordingService.getSeverityInfo(updrsScore);

  const getRiskIcon = (level: RiskLevel) => {
    switch (level) {
      case RiskLevel.LOW:
        return <CheckCircle2 className="w-8 h-8 text-green-500" />;
      case RiskLevel.MODERATE:
        return <AlertTriangle className="w-8 h-8 text-yellow-500" />;
      case RiskLevel.HIGH:
        return <AlertCircle className="w-8 h-8 text-red-500" />;
    }
  };

  const getSeverityColor = (color: string) => {
    switch (color) {
      case "green":
        return "text-green-600";
      case "yellow":
        return "text-yellow-600";
      case "orange":
        return "text-orange-600";
      case "red":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const featureData = [
    { feature: "Jitter", value: result.features.jitter * 100, fullMark: 1 },
    { feature: "Shimmer", value: result.features.shimmer * 100, fullMark: 10 },
    { feature: "HNR", value: (result.features.hnr / 30) * 100, fullMark: 100 },
    {
      feature: "Pitch",
      value: (result.features.pitch / 200) * 100,
      fullMark: 100,
    },
  ];

  const comparisonData = [
    { name: "Your UPDRS Score", value: updrsScore, color: severityInfo.color },
    { name: "Mild Threshold", value: 20, color: "green" },
    { name: "Moderate Threshold", value: 40, color: "yellow" },
    { name: "Advanced Threshold", value: 60, color: "orange" },
  ];

  return (
    <div className="space-y-6">
      {/* Result Summary Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 border-l-4 border-l-primary">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-primary">
                  Analysis Complete
                </h2>
                <div className="flex flex-col space-y-1">
                  {result.patientName && (
                    <div className="flex items-center gap-2 text-lg">
                      <User className="w-5 h-5 text-muted-foreground" />
                      <span className="font-semibold">Patient:</span>
                      <span className="text-primary font-bold">
                        {result.patientName}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-lg">
                    {/* enter the name and recieved updrs score */}
                    <span className="font-semibold">UPDRS Prediction:</span>
                    <span
                      className={`font-bold text-2xl ${getSeverityColor(
                        severityInfo.color
                      )}`}
                    >
                      {updrsScore.toFixed(1)}
                    </span>
                    <span className="text-muted-foreground">/ 108</span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-sm font-medium ${
                        severityInfo.color === "green"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : severityInfo.color === "yellow"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                          : severityInfo.color === "orange"
                          ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                          : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                      }`}
                    >
                      {severityInfo.level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-muted-foreground">
                  Analysis Date
                </div>
                <div className="font-medium">
                  {result.createdAt.toLocaleDateString()}
                </div>
                <div className="text-sm text-muted-foreground">
                  {result.createdAt.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Score Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl">
                  UPDRS Analysis Result
                </CardTitle>
                <CardDescription className="text-lg mt-2">
                  Based on voice pattern analysis
                </CardDescription>
                {/* Patient Information Display */}
                {result.patientName && (
                  <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      <span className="font-semibold text-blue-800 dark:text-blue-200">
                        Patient: {result.patientName}
                      </span>
                    </div>
                    <div className="mt-1 text-sm text-blue-600 dark:text-blue-300">
                      UPDRS Prediction:{" "}
                      <span className="font-mono font-bold">
                        {updrsScore.toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
              {getRiskIcon(result.riskLevel)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {/* UPDRS Score Display */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring" }}
                className="text-center"
              >
                <div className="mb-3">
                  <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    UPDRS Prediction Score
                  </div>
                  {result.patientName && (
                    <div className="text-sm text-muted-foreground">
                      for {result.patientName}
                    </div>
                  )}
                </div>
                <div className="text-7xl font-bold mb-2">
                  <span className={getSeverityColor(severityInfo.color)}>
                    {updrsScore.toFixed(1)}
                  </span>
                  <span className="text-3xl text-muted-foreground">/108</span>
                </div>
                <div className="text-xl font-semibold uppercase tracking-wide">
                  {severityInfo.label}
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {severityInfo.interpretation}
                </div>
              </motion.div>

              {/* Severity Level Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Mild (0-20)</span>
                  <span>Moderate (21-40)</span>
                  <span>Advanced (41-60)</span>
                  <span>Severe (61+)</span>
                </div>
                <Progress
                  value={Math.min((updrsScore / 108) * 100, 100)}
                  className="h-4"
                />
              </div>

              {/* Severity Information */}
              <div className="p-4 bg-white/50 dark:bg-black/20 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium">Severity Level:</span>
                    <div
                      className={`text-lg font-bold ${getSeverityColor(
                        severityInfo.color
                      )}`}
                    >
                      {severityInfo.level}
                    </div>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* UPDRS Scale Explanation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <CardTitle>Understanding Your UPDRS Score</CardTitle>
            <CardDescription>
              Unified Parkinson&apos;s Disease Rating Scale (UPDRS)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-lg">What is UPDRS?</h4>
                <p className="text-sm text-muted-foreground">
                  The UPDRS is a comprehensive rating scale used to evaluate the
                  severity of Parkinson&apos;s disease symptoms. Our voice
                  analysis estimates your motor symptoms based on speech
                  patterns.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>0-20:</strong> Mild/Early - Very light or early
                      signs
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>21-40:</strong> Moderate - Some tremor, speech
                      changes possible
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>41-60:</strong> Advanced - Noticeable
                      speech/movement difficulties
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                    <span className="text-sm">
                      <strong>61+:</strong> Severe - Significant motor
                      impairment
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-lg">Your Result</h4>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="text-center space-y-2">
                    <div
                      className={`text-3xl font-bold ${getSeverityColor(
                        severityInfo.color
                      )}`}
                    >
                      {updrsScore.toFixed(1)}
                    </div>
                    <div className="text-lg font-semibold">
                      {severityInfo.label}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {severityInfo.interpretation}
                    </div>
                  </div>
                </div>

                <div className="text-xs text-muted-foreground space-y-1">
                  <p>
                    <strong>Important:</strong> This is a screening tool based
                    on voice analysis only.
                  </p>
                  <p>
                    Please consult a healthcare professional for proper
                    diagnosis and treatment.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Recommendations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>Based on your analysis results</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {result.recommendations.map((recommendation, index) => (
                <motion.li
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="flex items-start gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <span>{recommendation}</span>
                </motion.li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
