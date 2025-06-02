import { useState } from "react";
import { Link } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Progress } from "@/components/ui/progress";
import { 
  Search, ArrowLeft, Zap, Heart, Brain, Sparkles, 
  MessageSquare, Twitter, Mail, Slack, Instagram, 
  Youtube, TrendingUp, DollarSign, Calendar, Home,
  Settings, CheckCircle, AlertCircle, Play, Pause,
  Share2, Stethoscope, Target, Briefcase
} from "lucide-react";

interface Integration {
  id: number;
  name: string;
  category: string;
  description: string;
  provider: string;
  iconUrl: string;
  color: string;
  isConnected: boolean;
  emotionalTriggers: {
    supportedEmotions: string[];
    activeCount: number;
  };
  popularity: number;
  rating: number;
}

interface EmotionalTrigger {
  emotion: string;
  threshold: number;
  action: string;
  isActive: boolean;
  icon: string;
  color: string;
}

export default function Integrations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);

  // Comprehensive integrations with emotional intelligence features
  const integrations: Integration[] = [
    // ... (integration data omitted for brevity)
  ];

  // Sample emotional triggers for the selected integration
  const emotionalTriggers: EmotionalTrigger[] = [
    // ... (emotional trigger data omitted for brevity)
  ];

  const categories = [
    // ... (category data omitted for brevity)
  ];

  const filteredIntegrations = integrations.filter(integration => {
    // ... (filtering logic omitted for brevity)
  });

  const handleConnect = (integration: Integration) => {
    // TODO: Implement connection logic
    console.log("Connecting to", integration.name);
  };

  const handleTriggerToggle = (triggerIndex: number) => {
    // TODO: Implement trigger toggle logic
    console.log("Toggling trigger", triggerIndex);
  };

  if (selectedIntegration) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-8">
            <Button
              onClick={() => setSelectedIntegration(null)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Marketplace
            </Button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Integration Details */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  {/* ... (existing code) */}
                </CardHeader>
                <CardContent>
                  {/* ... (existing code) */}
                  {!selectedIntegration.isConnected && (
                    <Button 
                      onClick={() => handleConnect(selectedIntegration)}
                      className="w-full mb-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    >
                        <Zap className="w-4 h-4 mr-2" />
                      Connect {selectedIntegration.name}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Emotional Triggers */}
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
        {/* ... (existing code) */}
              </Card>
      </div>
            {/* Sidebar */}
            <div className="space-y-6">
              {/* ... (existing code) */}
    </div>
          </div>
        </div>
      </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-teal-900">
      <div className="container mx-auto px-4 py-8">
        {/* ... (existing code) */}
        {filteredIntegrations.map((integration) => (
          <Card
            key={integration.id}
            className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
            onClick={() => setSelectedIntegration(integration)}
          >
            <CardHeader>
              {/* ... (existing code) */}
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* ... (existing code) */}
                <div className="pt-2">
                  <Button 
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!integration.isConnected) {
                        handleConnect(integration);
                      }
                    }}
                  >
                    {integration.isConnected ? (
                      <>
                        <Settings className="w-4 h-4 mr-2" />
                        Configure
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Connect
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {/* ... (existing code) */}
      </div>
    </div>
  );
}
