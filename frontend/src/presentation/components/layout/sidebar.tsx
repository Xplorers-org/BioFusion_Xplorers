"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Mic,
  History,
  Settings,
  BarChart3,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/presentation/components/ui/button";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Voice Analysis", href: "/voice-recording", icon: Mic },
  // { name: "History", href: "/history", icon: History },
  // { name: "Analytics", href: "/analytics", icon: BarChart3 },
  // { name: "Settings", href: "/settings", icon: Settings },
];

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          width: isOpen ? 256 : 80,
        }}
        transition={{ duration: 0.18, ease: "easeOut" }}
        className={cn(
          "fixed left-0 top-0 z-50 h-screen",
          "bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl",
          "border-r border-slate-200/50 dark:border-slate-700/50",
          "shadow-xl",
          "transition-all duration-300",
          !isOpen && "lg:w-20",
          isOpen && "lg:w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="h-16 flex items-center gap-2 px-5 border-b border-border">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            {isOpen && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.12 }}
                className="font-bold px-2 text-lg flex-shrink-0"
              >
                Parkinson AI
              </motion.span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="hidden lg:flex flex-shrink-1"
            >
              {isOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item, index) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.01, duration: 0.01 }}
                    whileHover={{ scale: 1.02, x: 3 }}
                    className={cn(
                      
                      "flex items-center w-full rounded-xl transition-all duration-300",
                      // when sidebar is open keep gaps and padding, otherwise center the icon
                      isOpen ? "gap-5 px-3 py-3.5" : "justify-center px-0 py-3",
                      "hover:bg-white/60 dark:hover:bg-white/10 hover:shadow-lg",
                      isActive && "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50"
                    )}
                  >
                    {/* make svg a block to avoid baseline alignment shifts */}
                    <item.icon className="w-5 h-5 block" />
                    {isOpen && (
                      <span className="font-medium">{item.name}</span>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          {/* Logout Button */}
          {/* <div className="p-4 border-t border-border">
            <Link href="/">
              <Button
                variant="ghost"
                className={cn(
                  "w-full gap-3 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors",
                  isOpen ? "justify-start px-3 py-2" : "justify-center p-3 aspect-square"
                )}
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {isOpen && <span className="font-medium">Logout</span>}
              </Button>
            </Link>
          </div> */}
        </div>
      </motion.aside>
    </>
  );
}
