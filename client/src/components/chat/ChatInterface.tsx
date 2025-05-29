import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Send, 
  Loader2, 
  Settings, 
  Heart, 
  Sparkles,
  HelpCircle,
  Lightbulb,
  Shield
} from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { VoiceInput } from "./VoiceInput";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

interface ChatInterfaceProps {
  sessionId: string;
  onTemplateSelect?: (templateId: number) => void;
  onProviderChange?: (provider: string) => void;
  onTemplateExplore?: () => void;
  className?: string;
}

export function ChatInterface({ 
  sessionId, 
  onTemplateSelect,
  onProviderChange,
  onTemplateExplore,
  className 
}: ChatInterfaceProps) {
  const {
    messages,
    isLoading,
    currentStep,
    selectedProvider,
    emotionalState,
    suggestions,
    sendMessage,
    selectOption,
    setVoiceActive,
  } = useChat(sessionId);

  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSendMessage = () => {
    if (!inputValue.trim() || isLoading) return;
    
    sendMessage(inputValue);
    setInputValue("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    if (transcript.trim()) {
      sendMessage(transcript);
    }
  };

  const getEmotionalStateColor = (emotion: string) => {
    switch (emotion) {
      case "positive":
      case "excited":
        return "bg-green-500";
      case "engaged":
        return "bg-blue-500";
      case "supportive":
        return "bg-purple-500";
      case "calm":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const getEmotionalStateText = (emotion: string) => {
    switch (emotion) {
      case "positive":
        return "Positive & Helpful";
      case "excited":
        return "Excited & Energetic";
      case "engaged":
        return "Engaged & Focused";
      case "supportive":
        return "Supportive & Caring";
      case "calm":
        return "Calm & Patient";
      default:
        return "Ready to Help";
    }
  };

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Chat Header */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-b border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div className={cn(
                "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-gray-800",
                getEmotionalStateColor(emotionalState)
              )} />
            </div>
            <div>
              <h1 className="text-xl lg:text-2xl font-bold text-gray-100">
                AI Automation Consultant
              </h1>
              <p className="text-sm text-gray-400">
                Powered by {selectedProvider} • Emotionally Intelligent
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Emotional State Indicator */}
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1 bg-gray-800/50 rounded-full border border-gray-700/50">
              <div className={cn("w-2 h-2 rounded-full", getEmotionalStateColor(emotionalState))} />
              <span className="text-xs text-gray-300">
                {getEmotionalStateText(emotionalState)}
              </span>
            </div>
            
            <Button 
              variant="ghost" 
              size="sm"
              className="w-10 h-10 rounded-full"
              onClick={() => {/* Handle settings */}}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4 lg:p-6">
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageBubble 
              key={message.id} 
              message={message} 
            />
          ))}
          
          {/* Typing indicator */}
          {isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <Card className="p-4 bg-gray-800/80 border-gray-700/50">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-gray-400" />
                  <span className="text-sm text-gray-400">
                    Thinking and crafting a helpful response...
                  </span>
                </div>
              </Card>
            </div>
          )}

          {/* Interactive suggestions */}
          {suggestions.length > 0 && !isLoading && (
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8" />
              <div className="flex flex-wrap gap-2 max-w-lg">
                {suggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => selectOption(suggestion, onTemplateExplore)}
                    className="text-sm bg-gray-800/50 border-gray-700/50 hover:bg-gray-700/50 hover:scale-105 transition-all duration-200"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="flex-shrink-0 p-4 lg:p-6 border-t border-gray-700/50 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center space-x-4 mb-3">
          {/* Voice Input */}
          <VoiceInput
            onTranscript={handleVoiceTranscript}
            provider={selectedProvider}
            disabled={isLoading}
          />

          {/* Text Input */}
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message or use voice input..."
              disabled={isLoading}
              className="pr-12 bg-gray-900/50 border-gray-700/50 focus:border-blue-500/50 transition-colors"
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="absolute right-1 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>

          {/* AI Provider Indicator */}
          <div className="hidden lg:flex items-center space-x-2 px-3 py-2 bg-gray-800/50 rounded-full border border-gray-700/50">
            <div className="w-2 h-2 rounded-full bg-green-400" />
            <span className="text-xs text-gray-300">{selectedProvider}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <div className="flex space-x-2">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-gray-400 hover:text-blue-400"
            >
              <Lightbulb className="w-3 h-3 mr-1" />
              Examples
            </Button>
            <Button 
              variant="ghost" 
              size="sm"
              className="text-xs text-gray-400 hover:text-green-400"
            >
              <HelpCircle className="w-3 h-3 mr-1" />
              Help
            </Button>
          </div>
          
          <div className="flex items-center space-x-2 text-xs text-gray-500">
            <Shield className="w-3 h-3" />
            <span>Private & Secure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
