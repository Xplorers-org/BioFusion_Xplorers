"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/presentation/components/ui/card";
import { Button } from "@/presentation/components/ui/button";
import { Trash2, Eye, Download, Play, Pause } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { formatDate } from "@/lib/utils";
import { useEffect, useState, useCallback, useRef } from "react";
import { voiceRecordingService } from "@/domain/services/voice-recording-service";
import { VoiceRecording } from "@/domain/models/types";
import { useToast } from "@/presentation/hooks/use-toast";

export function HistoryList() {
  const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { toast } = useToast();

  const fetchRecordings = useCallback(async () => {
    try {
      setLoading(true);
      const data = await voiceRecordingService.getRecordings('default-user'); // Replace with actual user ID from auth
      setRecordings(data);
    } catch (error) {
      console.error('Failed to fetch recordings:', error);
      toast({
        title: "Error",
        description: "Failed to load recordings",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchRecordings();
  }, [fetchRecordings]);

  const handleDelete = async (id: string, fileName: string) => {
    if (!confirm(`Are you sure you want to delete "${fileName}"?`)) {
      return;
    }

    try {
      await voiceRecordingService.deleteRecording(id);
      toast({
        title: "Success",
        description: "Recording deleted successfully",
      });
      // Refresh the list
      fetchRecordings();
    } catch (error) {
      console.error('Failed to delete recording:', error);
      toast({
        title: "Error",
        description: "Failed to delete recording",
        variant: "destructive",
      });
    }
  };

  const handlePlay = (fileUrl: string, id: string) => {
    // If already playing this audio, do nothing
    if (playingId === id && audioRef.current) {
      return;
    }

    // Stop any currently playing audio
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }

    // Create and play new audio
    setPlayingId(id);
    const audio = new Audio(fileUrl);
    audioRef.current = audio;
    
    audio.play();
    audio.onended = () => {
      setPlayingId(null);
      audioRef.current = null;
    };
    audio.onerror = () => {
      setPlayingId(null);
      audioRef.current = null;
      toast({
        title: "Error",
        description: "Failed to play audio",
        variant: "destructive",
      });
    };
  };

  const handlePause = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
      setPlayingId(null);
    }
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Loading recordings...
          </div>
        </CardContent>
      </Card>
    );
  }

  if (recordings.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>All Recordings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            No recordings found. Start by creating a new voice recording.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>All Recordings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {recordings.map((recording, index) => (
            <motion.div
              key={recording.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex-1">
                <h3 className="font-semibold">{recording.fileName}</h3>
                <p className="text-sm text-muted-foreground">
                  {formatDate(recording.createdAt)} • {Math.round(recording.duration)}s
                </p>
              </div>
              <div className="flex items-center gap-4">
                {recording.result && (
                  <div className="text-right">
                    <p className="font-semibold">{recording.result.score}</p>
                    <p className="text-xs text-muted-foreground capitalize">{recording.result.riskLevel}</p>
                  </div>
                )}
                <div className="flex gap-2">
                  {playingId === recording.id ? (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={handlePause}
                      className="relative"
                    >
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 rounded-md bg-green-500/20"
                      />
                      <Pause className="w-4 h-4 relative z-10 text-green-600 dark:text-green-400" />
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handlePlay(recording.fileUrl, recording.id)}
                    >
                      <Play className="w-4 h-4" />
                    </Button>
                  )}
                  {recording.result && (
                    <Link href={`/results/${recording.id}`}>
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </Link>
                  )}
                  <a href={recording.fileUrl} download={recording.fileName}>
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4" />
                    </Button>
                  </a>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDelete(recording.id, recording.fileName)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
