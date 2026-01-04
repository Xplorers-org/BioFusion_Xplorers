"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import {
  Mic,
  History,
  FileAudio,
  TrendingUp,
  Stethoscope,
  Brain,
  Heart,
  Users,
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Lightbulb,
  Shield,
  Activity,
  MessageCircle,
  Timer,
} from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const earlySymptoms = [
    "Tremor at rest (especially in hands)",
    "Bradykinesia (slowness of movement)",
    "Muscle rigidity and stiffness",
    "Postural instability and balance issues",
    "Changes in speech patterns and voice quality",
    "Micrographia (small handwriting)",
    "Masked facial expression",
    "Shuffling gait or reduced arm swing",
  ];

  const assessmentGuidelines = [
    {
      category: "Clinical Observation",
      points: [
        "Observe patient during natural conversation",
        "Note speech rhythm, volume, and clarity",
        "Assess facial expressions and gestures",
        "Document gait and posture changes",
      ],
    },
    {
      category: "Voice Analysis",
      points: [
        "Listen for monotone speech patterns",
        "Check for reduced vocal loudness",
        "Assess articulation clarity",
        "Note any voice tremor or hoarseness",
      ],
    },
    {
      category: "Motor Assessment",
      points: [
        "Test finger tapping speed and rhythm",
        "Evaluate handwriting samples",
        "Assess balance and coordination",
        "Check for bradykinesia in movements",
      ],
    },
  ];

  const communicationTips = [
    "Maintain eye contact and speak clearly",
    "Give patients time to respond",
    "Use simple, direct questions",
    "Be patient with speech difficulties",
    "Encourage use of assistive devices if needed",
    "Speak at normal volume unless hearing is impaired",
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Medical Dashboard</h1>
        <p className="text-muted-foreground">
          Comprehensive Parkinson&apos;s Disease Assessment and Management Guide
          for Healthcare Professionals
        </p>
      </div>

      {/* Clinical Knowledge Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Early Symptoms Recognition */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Brain className="h-5 w-5 text-purple-600" />
                Early Symptoms
              </CardTitle>
              <CardDescription>
                Key indicators to watch for in early PD
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {earlySymptoms.map((symptom, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span>{symptom}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>

        {/* Assessment Guidelines */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Stethoscope className="h-5 w-5 text-green-600" />
                Assessment Guidelines
              </CardTitle>
              <CardDescription>
                Clinical evaluation best practices
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {assessmentGuidelines.map((guideline, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-sm text-primary">
                    {guideline.category}
                  </h4>
                  <ul className="space-y-1 ml-2">
                    {guideline.points.map((point, pointIndex) => (
                      <li
                        key={pointIndex}
                        className="flex items-start gap-2 text-xs"
                      >
                        <div className="h-1.5 w-1.5 bg-primary rounded-full mt-1.5 flex-shrink-0" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </motion.div>

        {/* Communication Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageCircle className="h-5 w-5 text-blue-600" />
                Patient Communication
              </CardTitle>
              <CardDescription>
                Effective interaction strategies
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {communicationTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Clinical Alerts and Best Practices */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* UPDRS Scale Information */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-red-600" />
                UPDRS Scale Reference
              </CardTitle>
              <CardDescription>
                Unified Parkinson&apos;s Disease Rating Scale interpretation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-200">
                    0-20: Mild/Early
                  </h4>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    Minimal motor symptoms
                  </p>
                  <p className="text-xs text-green-500 dark:text-green-500 mt-1">
                    Consider early intervention
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 dark:bg-yellow-950 rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <h4 className="font-semibold text-yellow-800 dark:text-yellow-200">
                    21-40: Moderate
                  </h4>
                  <p className="text-sm text-yellow-600 dark:text-yellow-400">
                    Noticeable symptoms
                  </p>
                  <p className="text-xs text-yellow-500 dark:text-yellow-500 mt-1">
                    Regular monitoring needed
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-950 rounded-lg border border-orange-200 dark:border-orange-800">
                  <h4 className="font-semibold text-orange-800 dark:text-orange-200">
                    41-60: Advanced
                  </h4>
                  <p className="text-sm text-orange-600 dark:text-orange-400">
                    Significant impairment
                  </p>
                  <p className="text-xs text-orange-500 dark:text-orange-500 mt-1">
                    Specialist referral
                  </p>
                </div>
                <div className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                  <h4 className="font-semibold text-red-800 dark:text-red-200">
                    61+: Severe
                  </h4>
                  <p className="text-sm text-red-600 dark:text-red-400">
                    Severe motor disability
                  </p>
                  <p className="text-xs text-red-500 dark:text-red-500 mt-1">
                    Immediate intervention
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Clinical Alerts */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-orange-600" />
                Clinical Considerations
              </CardTitle>
              <CardDescription>
                Important factors for PD management
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-lg border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-amber-800 dark:text-amber-200">
                      Differential Diagnosis
                    </h4>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Consider essential tremor, drug-induced parkinsonism, and
                      atypical parkinsonian syndromes
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-3">
                  <Timer className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">
                      Medication Timing
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                      Assess patients during &quot;ON&quot; time for accurate
                      symptom evaluation
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-950 rounded-lg border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-purple-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-purple-800 dark:text-purple-200">
                      Multidisciplinary Care
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      Coordinate with neurologists, physical therapists, and
                      speech pathologists
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
