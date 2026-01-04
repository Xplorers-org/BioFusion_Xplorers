"use client";

import { motion } from "framer-motion";
import { Button } from "@/presentation/components/ui/button";
import { Activity, Brain, Mic, ArrowRight, ChevronRight, CheckCircle2, Target, Zap, Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Navbar } from "@/presentation/components/layout/navbar";
import { useEffect, useState } from "react";

export default function LandingPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-900 dark:to-slate-900">
      <Navbar />
      
      <main className="relative overflow-hidden">
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-12 pt-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/30 dark:bg-blue-600/20 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-400/30 dark:bg-indigo-600/20 rounded-full blur-3xl"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium"
              >
                <Activity className="w-4 h-4" />
                AI-Powered Prediction
              </motion.div>

              <motion.h1 
                className="text-5xl md:text-6xl font-bold leading-tight bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                Parkinson&apos;s Disease{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Voice Analysis
                </span>
              </motion.h1>
              
              <motion.p 
                className="text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-2xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                Advanced machine learning technology to predict Parkinson&apos;s disease 
                through voice pattern analysis.
              </motion.p>

              <motion.div 
                className="flex flex-wrap gap-8 pt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-500/10 dark:bg-blue-500/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">95% Accuracy</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">AI Model</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">2 Minutes</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Quick Results</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-purple-500/10 dark:bg-purple-500/20 rounded-xl backdrop-blur-sm">
                    <CheckCircle2 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-slate-900 dark:text-white">Non-Invasive</div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Voice Only</div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="flex flex-wrap gap-4 pt-4"
              >
                <Link href="/voice-recording">
                  <Button 
                    size="lg" 
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group"
                  >
                    Check UPDRS Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                {/* <Link href="/login">
                  <Button 
                    size="lg" 
                    variant="outline"
                    className="px-8 py-6 text-lg rounded-xl border-2 border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Sign In
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link> */}
              </motion.div>
            </motion.div>

            {/* Right side - Illustration */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:block"
            >
              <div className="relative w-[600px] h-[530px] rounded-[30px] overflow-hidden shadow-2xl bg-gradient-to-br from-blue-600 to-indigo-700 dark:from-blue-700 dark:to-indigo-800 p-8">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
                <div className="relative h-full flex flex-col items-center justify-center text-white space-y-8 ">
                  <motion.div
                    animate={{ 
                      scale: [1, 1.1, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                    className="p-6 bg-white/10 backdrop-blur-xl rounded-3xl"
                  >
                    <Brain className="w-32 h-32" />
                  </motion.div>
                  <div className="text-center space-y-4">
                    <h3 className="text-4xl font-bold">AI-Powered Analysis</h3>
                    <p className="text-blue-100 text-lg max-w-md">
                      Unified Parkinson&apos;s Disease Rating Scale (UPDRS)
                    </p>
                  </div>
                  <div className="flex gap-4">
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full">
                      <Mic className="w-6 h-6" />
                    </div>
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full">
                      <Activity className="w-6 h-6" />
                    </div>
                    <div className="px-6 py-3 bg-white/20 backdrop-blur-md rounded-full">
                      <Brain className="w-6 h-6" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-white dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                How It Works
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Three simple steps to get your voice analysis
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  // step: "01",
                  title: "Record or Upload",
                  description: "Record your voice directly in the browser or upload an existing audio file. Our system supports multiple audio formats.",
                  icon: Mic,
                  color: "blue",
                },
                {
                  // step: "02",
                  title: "AI Analysis",
                  description: "Our advanced machine learning model analyzes voice patterns, pitch, rhythm, and other acoustic features in seconds.",
                  icon: Brain,
                  color: "indigo",
                },
                {
                  // step: "03",
                  title: "Get Results",
                  description: "Receive detailed prediction results with confidence scores, visualizations, and actionable recommendations.",
                  icon: Activity,
                  color: "purple",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative p-8 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 border border-slate-200 dark:border-slate-700 shadow-lg hover:shadow-xl transition-all group"
                >
                  <div className={`inline-flex p-4 rounded-2xl bg-${item.color}-500/10 dark:bg-${item.color}-500/20 mb-6`}>
                    <item.icon className={`w-8 h-8 text-${item.color}-600 dark:text-${item.color}-400`} />
                  </div>
                  <h3 className="text-2xl font-semibold mb-3 text-slate-900 dark:text-white">
                    {item.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-white">
                Why Choose Our Platform
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">
                Cutting-edge technology for early disease detection
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "High Accuracy",
                  description: "95%+ accuracy rate powered by state-of-the-art AI models",
                  icon: Target,
                  iconBg: "bg-pink-100 dark:bg-pink-900/30",
                  iconColor: "text-pink-600 dark:text-pink-400",
                },
                {
                  title: "Fast Results",
                  description: "Get your analysis results in under 2 minutes",
                  icon: Zap,
                  iconBg: "bg-orange-100 dark:bg-orange-900/30",
                  iconColor: "text-orange-600 dark:text-orange-400",
                },
                {
                  title: "Privacy First",
                  description: "Your data is encrypted and never shared with third parties",
                  icon: Lock,
                  iconBg: "bg-amber-100 dark:bg-amber-900/30",
                  iconColor: "text-amber-600 dark:text-amber-400",
                },
                {
                  title: "Easy to Use",
                  description: "No technical knowledge required, simple 3-step process",
                  icon: Sparkles,
                  iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
                  iconColor: "text-yellow-600 dark:text-yellow-400",
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all group"
                >
                  <div className={`inline-flex p-3 rounded-xl ${feature.iconBg} mb-4 group-hover:scale-110 transition-transform`}>
                    <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-900 dark:text-white">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-sm">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                Ready to Get Started?
              </h2>
              <p className="text-xl text-blue-100">
                Join thousands of users who trust our AI-powered analysis for early detection
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link href="/signup">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all group"
                  >
                    Start Free Analysis
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
              <p className="text-blue-100 text-sm">
                No credit card required • Results in 2 minutes • HIPAA compliant
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  );
}
