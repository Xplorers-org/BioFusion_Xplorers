"use client";

import { HistoryList } from "@/presentation/components/history/history-list";
import { motion } from "framer-motion";

export default function HistoryPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Recording History</h1>
        <p className="text-muted-foreground">
          View and manage all your previous voice recordings and analysis results.
        </p>
      </motion.div>

      <HistoryList />
    </div>
  );
}
