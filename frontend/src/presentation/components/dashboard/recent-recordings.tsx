"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { FileAudio, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

const recordings = [
  { id: "1", name: "Recording 1", date: "2 days ago", score: 45.5 },
  { id: "2", name: "Recording 2", date: "5 days ago", score: 52.3 },
  { id: "3", name: "Recording 3", date: "1 week ago", score: 38.7 },
];

export function RecentRecordings() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Recordings</CardTitle>
        <CardDescription>Your latest voice analyses</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center gap-3">
                <FileAudio className="w-5 h-5 text-muted-foreground" />
                <div>
                  <p className="font-medium">{recording.name}</p>
                  <p className="text-sm text-muted-foreground">{recording.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">{recording.score}</span>
                <Link href={`/results/${recording.id}`}>
                  <Button size="sm" variant="ghost">
                    <Eye className="w-4 h-4" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
