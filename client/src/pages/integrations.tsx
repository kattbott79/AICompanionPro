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
  Youtube, TrendingUp, DollarSign, Calendar, 
  Settings, CheckCircle, AlertCircle, Play, Pause
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

  // Sample integrations with emotional intelligence features
  const integrations: Integration[] = [
    {
      id: 1,
      name: "Slack",
      category: "communication",
      description: "Send emotionally-aware messages and detect team mood patterns",
      provider: "slack",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["joy", "stress", "excitement", "frustration"],
        activeCount: 3
      },
      popularity: 95,
      rating: 4.8
    },
    {
      id: 2,
      name: "Twitter/X",
      category: "social",
      description: "Post content based on emotional states and audience sentiment",
      provider: "twitter",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["joy", "confidence", "inspiration", "empathy"],
        activeCount: 0
      },
      popularity: 89,
      rating: 4.6
    },
    {
      id: 3,
      name: "Gmail",
      category: "communication",
      description: "Compose emotionally intelligent emails with tone adaptation",
      provider: "gmail",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-red-500 to-orange-500",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["empathy", "urgency", "gratitude", "concern"],
        activeCount: 2
      },
      popularity: 92,
      rating: 4.7
    },
    {
      id: 4,
      name: "Instagram",
      category: "social",
      description: "Create posts that resonate with your emotional brand voice",
      provider: "instagram",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-pink-500 to-purple-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["joy", "inspiration", "creativity", "confidence"],
        activeCount: 0
      },
      popularity: 87,
      rating: 4.5
    },
    {
      id: 5,
      name: "YouTube",
      category: "content",
      description: "Optimize video content based on emotional engagement metrics",
      provider: "youtube",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-red-600 to-red-400",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["excitement", "curiosity", "entertainment", "education"],
        activeCount: 4
      },
      popularity: 91,
      rating: 4.9
    },
    {
      id: 6,
      name: "Trading Bot",
      category: "finance",
      description: "Make trading decisions influenced by market sentiment and personal emotion",
      provider: "trading",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["confidence", "fear", "greed", "patience"],
        activeCount: 0
      },
      popularity: 78,
      rating: 4.3
    }
  ];

  // Sample emotional triggers for the selected integration
  const emotionalTriggers: EmotionalTrigger[] = [
    {
      emotion: "joy",
      threshold: 75,
      action: "Share positive update with team",
      isActive: true,
      icon: "😊",
      color: "bg-yellow-100 text-yellow-800"
    },
    {
      emotion: "stress",
      threshold: 60,
      action: "Send calming message to #wellness channel",
      isActive: true,
      icon: "😰",
      color: "bg-red-100 text-red-800"
    },
    {
      emotion: "excitement",
      threshold: 80,
      action: "Announce achievement to #general",
      isActive: false,
      icon: "🎉",
      color: "bg-purple-100 text-purple-800"
    },
    {
      emotion: "frustration",
      threshold: 65,
      action: "Request help in #support",
      isActive: true,
      icon: "😤",
      color: "bg-orange-100 text-orange-800"
    }
  ];

  const categories = [
    { id: "all", name: "All", icon: Sparkles },
    { id: "communication", name: "Communication", icon: MessageSquare },
    { id: "social", name: "Social Media", icon: Heart },
    { id: "content", name: "Content", icon: Youtube },
    { id: "finance", name: "Finance", icon: DollarSign },
    { id: "productivity", name: "Productivity", icon: Calendar }
  ];

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || integration.category === selectedCategory;
    return matchesSearch && matchesCategory;
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
              variant="ghost"
              onClick={() => setSelectedIntegration(null)}
              className="flex items-center gap-2"
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
                  <div className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-xl ${selectedIntegration.color} flex items-center justify-center`}>
                      <MessageSquare className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{selectedIntegration.name}</CardTitle>
                      <CardDescription className="text-lg">
                        {selectedIntegration.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-6">
                    <Badge variant={selectedIntegration.isConnected ? "default" : "secondary"}>
                      {selectedIntegration.isConnected ? "Connected" : "Not Connected"}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">
                        ⭐ {selectedIntegration.rating}/5
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        {selectedIntegration.popularity}% popularity
                      </span>
                    </div>
                  </div>

                  {!selectedIntegration.isConnected && (
                    <Button 
                      onClick={() => handleConnect(selectedIntegration)}
                      className="w-full mb-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Connect {selectedIntegration.name}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Emotional Triggers */}
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Emotional Triggers
                  </CardTitle>
                  <CardDescription>
                    Configure actions based on detected emotions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {emotionalTriggers.map((trigger, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-lg border bg-card">
                        <div className="flex items-center gap-4">
                          <span className="text-2xl">{trigger.icon}</span>
                          <div>
                            <div className="font-medium capitalize">{trigger.emotion}</div>
                            <div className="text-sm text-muted-foreground">{trigger.action}</div>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">Threshold:</span>
                              <Progress value={trigger.threshold} className="w-20 h-2" />
                              <span className="text-xs text-muted-foreground">{trigger.threshold}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <Badge className={trigger.color}>
                            {trigger.emotion}
                          </Badge>
                          <Switch
                            checked={trigger.isActive}
                            onCheckedChange={() => handleTriggerToggle(index)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Connection Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      {selectedIntegration.isConnected ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                      )}
                      <span className="text-sm">
                        {selectedIntegration.isConnected ? "Active Connection" : "Setup Required"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Brain className="w-5 h-5 text-purple-500" />
                      <span className="text-sm">
                        {selectedIntegration.emotionalTriggers.activeCount} active triggers
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-5 h-5 text-yellow-500" />
                      <span className="text-sm">
                        {selectedIntegration.emotionalTriggers.supportedEmotions.length} emotions supported
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-lg">Supported Emotions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {selectedIntegration.emotionalTriggers.supportedEmotions.map((emotion, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {emotion}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-yellow-50 dark:from-gray-900 dark:via-purple-900 dark:to-pink-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-4">
            Integration Marketplace
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your favorite apps with emotional intelligence. 
            Automate responses based on your feelings and create more meaningful interactions.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search integrations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/70 border-0 shadow-lg"
            />
          </div>

          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-6 bg-white/70 shadow-lg border-0">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-pink-600 data-[state=active]:text-white"
                >
                  <category.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Integration Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIntegrations.map((integration) => (
            <Card
              key={integration.id}
              className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm hover:shadow-xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedIntegration(integration)}
            >
              <CardHeader>
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${integration.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <MessageSquare className="w-6 h-6 text-white" />
                  </div>
                  <Badge variant={integration.isConnected ? "default" : "secondary"}>
                    {integration.isConnected ? "Connected" : "Available"}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{integration.name}</CardTitle>
                <CardDescription className="text-sm">
                  {integration.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Emotional Triggers</span>
                    <div className="flex items-center gap-1">
                      <Brain className="w-4 h-4 text-purple-500" />
                      <span className="font-medium">{integration.emotionalTriggers.activeCount}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Popularity</span>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="w-4 h-4 text-green-500" />
                      <span className="font-medium">{integration.popularity}%</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Rating</span>
                    <span className="font-medium">⭐ {integration.rating}/5</span>
                  </div>

                  <div className="pt-2">
                    <Button 
                      variant={integration.isConnected ? "secondary" : "default"}
                      className="w-full"
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
        </div>

        {filteredIntegrations.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">No integrations found</p>
              <p className="text-sm">Try adjusting your search or category filter</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}