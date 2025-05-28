import { useState, useCallback, useRef } from "react";
import { audioService } from "@/lib/audioService";
import { VoiceAnalysis } from "@/types/chat";
import { useToast } from "@/hooks/use-toast";

export function useVoice() {
  const { toast } = useToast();
  const [isRecording, setIsRecording] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState<boolean | null>(null);
  const recordingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const checkPermission = useCallback(async () => {
    try {
      const hasPermission = await audioService.checkMicrophonePermission();
      setPermissionGranted(hasPermission);
      return hasPermission;
    } catch (error) {
      console.error("Permission check failed:", error);
      setPermissionGranted(false);
      return false;
    }
  }, []);

  const startRecording = useCallback(async () => {
    try {
      const hasPermission = await checkPermission();
      if (!hasPermission) {
        toast({
          title: "Microphone Permission Required",
          description: "Please allow microphone access to use voice features",
          variant: "destructive",
        });
        return false;
      }

      await audioService.startRecording();
      setIsRecording(true);

      // Auto-stop recording after 30 seconds
      recordingTimeoutRef.current = setTimeout(() => {
        stopRecording();
        toast({
          title: "Recording Stopped",
          description: "Maximum recording time reached (30 seconds)",
        });
      }, 30000);

      return true;
    } catch (error) {
      console.error("Failed to start recording:", error);
      toast({
        title: "Recording Failed",
        description: "Failed to start voice recording. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  }, [checkPermission, toast]);

  const stopRecording = useCallback(async (): Promise<Blob | null> => {
    if (!isRecording) return null;

    try {
      // Clear timeout
      if (recordingTimeoutRef.current) {
        clearTimeout(recordingTimeoutRef.current);
        recordingTimeoutRef.current = null;
      }

      const audioBlob = await audioService.stopRecording();
      setIsRecording(false);
      return audioBlob;
    } catch (error) {
      console.error("Failed to stop recording:", error);
      setIsRecording(false);
      toast({
        title: "Recording Error",
        description: "Failed to stop recording properly",
        variant: "destructive",
      });
      return null;
    }
  }, [isRecording, toast]);

  const transcribeAudio = useCallback(async (audioBlob: Blob): Promise<string | null> => {
    try {
      setIsAnalyzing(true);
      const transcript = await audioService.transcribeAudio(audioBlob);
      return transcript;
    } catch (error) {
      console.error("Transcription failed:", error);
      toast({
        title: "Transcription Failed",
        description: "Failed to convert speech to text. Please try typing instead.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const analyzeVoice = useCallback(async (
    audioBlob: Blob, 
    provider: string = "hume"
  ): Promise<VoiceAnalysis | null> => {
    try {
      setIsAnalyzing(true);
      const analysis = await audioService.analyzeVoice(audioBlob, provider);
      return analysis;
    } catch (error) {
      console.error("Voice analysis failed:", error);
      toast({
        title: "Voice Analysis Failed",
        description: "Failed to analyze emotional context from voice",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  }, [toast]);

  const recordAndTranscribe = useCallback(async (): Promise<string | null> => {
    const started = await startRecording();
    if (!started) return null;

    // Wait for user to stop recording manually or timeout
    return new Promise((resolve) => {
      const checkRecording = () => {
        if (!audioService.isRecording()) {
          // Recording stopped, get the audio and transcribe
          stopRecording().then(async (audioBlob) => {
            if (audioBlob) {
              const transcript = await transcribeAudio(audioBlob);
              resolve(transcript);
            } else {
              resolve(null);
            }
          });
        } else {
          setTimeout(checkRecording, 100);
        }
      };
      checkRecording();
    });
  }, [startRecording, stopRecording, transcribeAudio]);

  const toggleRecording = useCallback(async (): Promise<string | null> => {
    if (isRecording) {
      const audioBlob = await stopRecording();
      if (audioBlob) {
        return await transcribeAudio(audioBlob);
      }
      return null;
    } else {
      await startRecording();
      return null;
    }
  }, [isRecording, startRecording, stopRecording, transcribeAudio]);

  return {
    isRecording,
    isAnalyzing,
    permissionGranted,
    startRecording,
    stopRecording,
    transcribeAudio,
    analyzeVoice,
    recordAndTranscribe,
    toggleRecording,
    checkPermission,
  };
}
