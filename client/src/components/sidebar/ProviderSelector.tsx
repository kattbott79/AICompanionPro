import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Server, 
  Heart, 
  Brain, 
  Zap,
  Check,
  Wifi,
  WifiOff,
  Shield,
  Clock,
  Star
} from "lucide-react";
import { AiProvider } from "@/types/chat";
import { aiService } from "@/lib/aiService";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProviderSelectorProps {
  selectedProvider: string;
  onProviderChange: (provider: string) => void;
  className?: string;
}

export function ProviderSelector({ 
  selectedProvider, 
  onProviderChange,
  className 
}: ProviderSelectorProps) {
  const { toast } = useToast();
  const [providers, setProviders] = useState<AiProvider[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProviders = async () => {
      try {
        const data = await aiService.getProviders();
        setProviders(data);
      } catch (error) {
        console.error("Failed to load providers:", error);
        toast({
          title: "Loading Error",
          description: "Failed to load AI providers",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProviders();
  }, [toast]);

  const getProviderIcon = (type: string) => {
    switch (type) {
      case "ollama":
        return <Server className="w-5 h-5" />;
      case "hume":
        return <Heart className="w-5 h-5" />;
      case "openai":
        return <Brain className="w-5 h-5" />;
      default:
        return <Zap className="w-5 h-5" />;
    }
  };

  const getProviderColor = (type: string) => {
    switch (type) {
      case "ollama":
        return "blue";
      case "hume":
        return "green";
      case "openai":
        return "purple";
      default:
        return "gray";
    }
  };

  const getColorClasses = (color: string, isSelected: boolean) => {
    const colorMap: Record<string, { base: string; selected: string; hover: string }> = {
      blue: {
        base: "text-blue-400 bg-blue-500/10 border-blue-500/20",
        selected: "text-blue-300 bg-blue-500/20 border-blue-400/40",
        hover: "hover:bg-blue-500/15"
      },
      green: {
        base: "text-green-400 bg-green-500/10 border-green-500/20",
        selected: "text-green-300 bg-green-500/20 border-green-400/40",
        hover: "hover:bg-green-500/15"
      },
      purple: {
        base: "text-purple-400 bg-purple-500/10 border-purple-500/20",
        selected: "text-purple-300 bg-purple-500/20 border-purple-400/40",
        hover: "hover:bg-purple-500/15"
      },
      gray: {
        base: "text-gray-400 bg-gray-500/10 border-gray-500/20",
        selected: "text-gray-300 bg-gray-500/20 border-gray-400/40",
        hover: "hover:bg-gray-500/15"
      }
    };

    const colors = colorMap[color] || colorMap.gray;
    return cn(colors.base, colors.hover, isSelected && colors.selected);
  };

  const handleProviderSelect = (provider: AiProvider) => {
    onProviderChange(provider.type);
    toast({
      title: "AI Provider Updated",
      description: `Now using ${provider.name} for responses`,
    });
  };

  if (loading) {
    return (
      <Card className={cn("bg-gray-800/50 border-gray-700/50", className)}>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-3">
            <div className="h-4 bg-gray-700 rounded w-3/4"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
            <div className="h-12 bg-gray-700 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("bg-gray-800/50 border-gray-700/50", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold text-gray-200 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-400" />
          AI Provider
        </CardTitle>
        <p className="text-sm text-gray-400">
          Choose your preferred AI assistant
        </p>
      </CardHeader>

      <CardContent className="space-y-3">
        {providers.map((provider) => {
          const isSelected = provider.type === selectedProvider;
          const color = getProviderColor(provider.type);
          
          return (
            <div
              key={provider.id}
              className={cn(
                "p-4 rounded-lg border cursor-pointer transition-all duration-200",
                getColorClasses(color, isSelected),
                isSelected && "ring-2 ring-offset-2 ring-offset-gray-900",
                color === "blue" && isSelected && "ring-blue-500/50",
                color === "green" && isSelected && "ring-green-500/50",
                color === "purple" && isSelected && "ring-purple-500/50"
              )}
              onClick={() => handleProviderSelect(provider)}
            >
              <div className="flex items-start space-x-3">
                {/* Provider Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getProviderIcon(provider.type)}
                </div>

                {/* Provider Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-medium">{provider.name}</h4>
                    {isSelected && (
                      <Check className="w-4 h-4 text-green-400" />
                    )}
                  </div>
                  
                  <p className="text-xs text-gray-400 mb-2">
                    {provider.description}
                  </p>

                  {/* Provider Features */}
                  <div className="flex flex-wrap gap-1 mb-2">
                    {provider.isLocal && (
                      <Badge variant="outline" className="text-xs py-0 px-1">
                        <Shield className="w-2 h-2 mr-1" />
                        Local
                      </Badge>
                    )}
                    {!provider.requiresApiKey && (
                      <Badge variant="outline" className="text-xs py-0 px-1">
                        Free
                      </Badge>
                    )}
                    {provider.capabilities.includes("emotion_analysis") && (
                      <Badge variant="outline" className="text-xs py-0 px-1">
                        <Heart className="w-2 h-2 mr-1" />
                        Emotional
                      </Badge>
                    )}
                    {provider.capabilities.includes("voice_analysis") && (
                      <Badge variant="outline" className="text-xs py-0 px-1">
                        Voice
                      </Badge>
                    )}
                  </div>

                  {/* Connection Status */}
                  <div className="flex items-center space-x-2 text-xs">
                    {provider.type === "ollama" ? (
                      <div className="flex items-center space-x-1 text-blue-400">
                        <WifiOff className="w-3 h-3" />
                        <span>Local Connection</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-green-400">
                        <Wifi className="w-3 h-3" />
                        <span>Cloud Service</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Selection indicator */}
              {isSelected && (
                <div className="mt-3 pt-3 border-t border-gray-700/50">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-gray-300 font-medium">Currently Active</span>
                    <div className="flex items-center space-x-1 text-green-400">
                      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span>Connected</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        <Separator className="my-4" />

        {/* Provider Comparison */}
        <div className="space-y-2">
          <h5 className="text-sm font-medium text-gray-300">Quick Comparison</h5>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <Shield className="w-4 h-4 mx-auto mb-1 text-blue-400" />
              <div className="text-blue-400">Privacy</div>
              <div className="text-gray-400">Ollama</div>
            </div>
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <Heart className="w-4 h-4 mx-auto mb-1 text-green-400" />
              <div className="text-green-400">Emotion</div>
              <div className="text-gray-400">Hume AI</div>
            </div>
            <div className="text-center p-2 bg-gray-800/50 rounded">
              <Brain className="w-4 h-4 mx-auto mb-1 text-purple-400" />
              <div className="text-purple-400">Power</div>
              <div className="text-gray-400">OpenAI</div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-3 border-t border-gray-700/50">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <Clock className="w-3 h-3" />
            <span>You can change providers anytime during the conversation</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
