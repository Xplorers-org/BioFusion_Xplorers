"use client";

import { ResultsDisplay } from "@/presentation/components/results/results-display";
import { motion } from "framer-motion";
import { useParams } from "next/navigation";

export default function ResultsPage() {
  const params = useParams();
  const id = params.id as string;

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Analysis Results</h1>
        <p className="text-muted-foreground">
          Detailed results of your voice analysis for Parkinson&apos;s disease prediction.
        </p>
      </motion.div>

      <ResultsDisplay recordingId={id} />
    </div>
  );
}
