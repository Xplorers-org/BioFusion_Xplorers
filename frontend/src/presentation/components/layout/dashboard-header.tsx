"use client";

import { Menu, Bell, User, Moon, Sun } from "lucide-react";
import { Button } from "@/presentation/components/ui/button";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

interface DashboardHeaderProps {
  onMenuClick: () => void;
}

export function DashboardHeader({ onMenuClick }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden hover:bg-white/60 dark:hover:bg-white/10"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <div className="flex-1" />

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300"
          >
            {theme === "dark" ? (
              <Sun className="w-5 h-5" />
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </Button>

          {/* <Button variant="ghost" size="icon" className="hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300">
            <Bell className="w-5 h-5" />
          </Button>

          <Button variant="ghost" size="icon" className="hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300">
            <User className="w-5 h-5" />
          </Button> */}
        </div>
      </div>
    </motion.header>
  );
}
