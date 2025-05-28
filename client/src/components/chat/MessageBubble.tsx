import { cn } from "@/lib/utils";
import { Message } from "@/types/chat";
import { Bot, User, Heart, Zap, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ReactMarkdown from "react-markdown";

interface MessageBubbleProps {
  message: Message;
  className?: string;
}

export function MessageBubble({ message, className }: MessageBubbleProps) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  const getEmotionalIcon = (emotion?: string) => {
    switch (emotion) {
      case "excited":
        return <Sparkles className="w-3 h-3 text-yellow-400" />;
      case "supportive":
        return <Heart className="w-3 h-3 text-pink-400" />;
      case "energetic":
        return <Zap className="w-3 h-3 text-blue-400" />;
      default:
        return null;
    }
  };

  const formatTimestamp = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (isSystem) {
    return (
      <div className={cn("flex justify-center my-4", className)}>
        <div className="px-3 py-1 bg-white/70 rounded-full text-xs text-gray-900">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex items-start space-x-3 group animate-in fade-in slide-in-from-bottom-2 duration-300",
      isUser ? "flex-row-reverse space-x-reverse" : "",
      className
    )}>
      {/* Avatar */}
      <div className={cn(
        "flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center",
        isUser 
          ? "bg-blue-500" 
          : "bg-gradient-to-br from-blue-500 to-purple-600"
      )}>
        {isUser ? (
          <User className="w-4 h-4 text-white" />
        ) : (
          <Bot className="w-4 h-4 text-white" />
        )}
      </div>

      {/* Message content */}
      <div className={cn(
        "flex flex-col space-y-1 max-w-lg lg:max-w-xl",
        isUser ? "items-end" : "items-start"
      )}>
        {/* Message bubble */}
        <div className={cn(
          "rounded-2xl px-4 py-3 shadow-sm backdrop-blur-sm border",
          isUser 
            ? "bg-blue-500 text-white rounded-tr-sm border-blue-400/20" 
            : "bg-white/70 text-gray-900  rounded-tl-sm border-gray-200/50"
        )}>
          <div className="prose prose-sm max-w-none">
            <ReactMarkdown
              components={{
                p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                ul: ({ children }) => <ul className="list-disc list-inside space-y-1 mt-2">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 mt-2">{children}</ol>,
                li: ({ children }) => <li className="text-sm">{children}</li>,
                br: () => <br />,
              }}
            >
              {message.content}
            </ReactMarkdown>
          </div>
        </div>

        {/* Message metadata */}
        <div className={cn(
          "flex items-center space-x-2 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity",
          isUser ? "flex-row-reverse space-x-reverse" : ""
        )}>
          <span>{formatTimestamp(message.timestamp)}</span>
          
          {/* Emotional context indicator */}
          {message.emotionalContext?.responseEmotion && (
            <div className="flex items-center space-x-1">
              {getEmotionalIcon(message.emotionalContext.responseEmotion)}
              <Badge variant="outline" className="text-xs py-0 px-1">
                {message.emotionalContext.responseEmotion}
              </Badge>
            </div>
          )}

          {/* Voice analysis indicator */}
          {message.voiceAnalysis && (
            <Badge variant="outline" className="text-xs py-0 px-1">
              Voice: {Math.round(message.voiceAnalysis.confidence * 100)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
}
