"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Activity, FileAudio, TrendingUp, Clock } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  {
    title: "Total Recordings",
    value: "12",
    icon: FileAudio,
    change: "+2 this week",
  },
  {
    title: "Average Score",
    value: "45.2",
    icon: Activity,
    change: "Moderate risk",
  },
  {
    title: "Trend",
    value: "-5.3%",
    icon: TrendingUp,
    change: "Improving",
  },
  {
    title: "Last Recording",
    value: "2 days ago",
    icon: Clock,
    change: "Updated",
  },
];

export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02, y: -4 }}
        >
          <Card className="glass-card glass-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className="p-2 rounded-lg bg-primary/10 dark:bg-primary/20">
                <stat.icon className="h-4 w-4 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.change}
              </p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
