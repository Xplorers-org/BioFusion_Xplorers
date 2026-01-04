"use client";

import { SettingsForm } from "@/presentation/components/settings/settings-form";
import { motion } from "framer-motion";

export default function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </motion.div>

      <SettingsForm />
    </div>
  );
}
