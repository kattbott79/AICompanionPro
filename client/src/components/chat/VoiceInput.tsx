import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Loader2 } from "lucide-react";
import { useVoice } from "@/hooks/useVoice";
import { cn } from "@/lib/utils";

interface VoiceInputProps {
  onTranscript: (transcript: string) => void;
  provider?: string;
  disabled?: boolean;
  className?: string;
}

export function VoiceInput({ 
  onTranscript, 
  provider = "hume", 
  disabled = false,
  className 
}: VoiceInputProps) {
  const {
    isRecording,
    isAnalyzing,
    permissionGranted,
    toggleRecording,
    checkPermission,
  } = useVoice();

  const [isVoiceSupported, setIsVoiceSupported] = useState(true);

  useEffect(() => {
    // Check if voice features are supported
    const checkSupport = () => {
      const hasMediaDevices = !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
      const hasSpeechRecognition = !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
      setIsVoiceSupported(hasMediaDevices && hasSpeechRecognition);
    };

    checkSupport();
    checkPermission();
  }, [checkPermission]);

  const handleVoiceToggle = async () => {
    if (disabled || !isVoiceSupported) return;

    const transcript = await toggleRecording();
    if (transcript && transcript.trim()) {
      onTranscript(transcript.trim());
    }
  };

  if (!isVoiceSupported) {
    return (
      <div className="text-xs text-gray-400 flex items-center">
        <MicOff className="w-3 h-3 mr-1" />
        Voice not supported
      </div>
    );
  }

  const getButtonVariant = () => {
    if (isRecording) return "destructive";
    if (permissionGranted === false) return "outline";
    return "secondary";
  };

  const getButtonText = () => {
    if (isAnalyzing) return "Processing...";
    if (isRecording) return "Stop Recording";
    if (permissionGranted === false) return "Enable Microphone";
    return "Start Voice Input";
  };

  const getIcon = () => {
    if (isAnalyzing) return <Loader2 className="w-4 h-4 animate-spin" />;
    if (isRecording) return <MicOff className="w-4 h-4" />;
    return <Mic className="w-4 h-4" />;
  };

  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Button
        variant={getButtonVariant()}
        size="sm"
        onClick={handleVoiceToggle}
        disabled={disabled || isAnalyzing}
        className={cn(
          "transition-all duration-200",
          isRecording && "animate-pulse shadow-lg shadow-red-500/25",
          "hover:scale-105"
        )}
      >
        {getIcon()}
        <span className="hidden sm:inline ml-2">{getButtonText()}</span>
      </Button>

      {/* Voice status indicator */}
      <div className="flex items-center space-x-1 text-xs text-gray-400">
        {isRecording && (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span>Listening...</span>
          </>
        )}
        
        {isAnalyzing && (
          <>
            <Loader2 className="w-3 h-3 animate-spin" />
            <span>Processing...</span>
          </>
        )}
        
        {!isRecording && !isAnalyzing && permissionGranted && (
          <>
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span>Ready</span>
          </>
        )}

        {permissionGranted === false && (
          <>
            <div className="w-2 h-2 bg-yellow-500 rounded-full" />
            <span>Permission needed</span>
          </>
        )}
      </div>
    </div>
  );
}
