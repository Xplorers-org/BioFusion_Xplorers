"use client";

import { VoiceRecordingForm } from "@/presentation/components/voice-recording/voice-recording-form";
import { motion } from "framer-motion";

export default function VoiceRecordingPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Voice Analysis</h1>
        <p className="text-muted-foreground">
          Record or upload your voice sample for Parkinson&apos;s disease prediction analysis.
        </p>
      </motion.div>

      <VoiceRecordingForm />
    </div>
  );
}
