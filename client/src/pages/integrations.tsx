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
    // Communication Platforms
    {
      id: 1,
      name: "Slack",
      category: "communication",
      description: "Send emotionally-aware messages and detect team mood patterns",
      provider: "slack",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-500 to-cyan-500",
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
      name: "Microsoft Teams",
      category: "communication",
      description: "Enhance team collaboration with emotional context awareness",
      provider: "teams",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["collaboration", "focus", "urgency", "celebration"],
        activeCount: 0
      },
      popularity: 92,
      rating: 4.7
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
      popularity: 94,
      rating: 4.7
    },
    {
      id: 4,
      name: "Outlook",
      category: "communication",
      description: "Professional email management with emotional intelligence insights",
      provider: "outlook",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["professionalism", "urgency", "gratitude", "empathy"],
        activeCount: 0
      },
      popularity: 88,
      rating: 4.5
    },
    {
      id: 5,
      name: "Discord",
      category: "communication",
      description: "Community engagement with real-time emotion detection",
      provider: "discord",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-indigo-500 to-purple-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["excitement", "gaming", "community", "support"],
        activeCount: 0
      },
      popularity: 85,
      rating: 4.6
    },

    // Social Media Platforms
    {
      id: 6,
      name: "Instagram",
      category: "social",
      description: "Create posts that resonate with your emotional brand voice",
      provider: "instagram",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-teal-500 to-blue-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["joy", "inspiration", "creativity", "confidence"],
        activeCount: 0
      },
      popularity: 96,
      rating: 4.8
    },
    {
      id: 7,
      name: "Twitter/X",
      category: "social",
      description: "Post content based on emotional states and audience sentiment",
      provider: "twitter",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-gray-800 to-gray-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["joy", "confidence", "inspiration", "empathy"],
        activeCount: 0
      },
      popularity: 89,
      rating: 4.6
    },
    {
      id: 8,
      name: "Facebook",
      category: "social",
      description: "Share emotionally engaging content with friends and family",
      provider: "facebook",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["happiness", "nostalgia", "connection", "celebration"],
        activeCount: 2
      },
      popularity: 93,
      rating: 4.4
    },
    {
      id: 9,
      name: "LinkedIn",
      category: "social",
      description: "Professional networking with emotional intelligence for career growth",
      provider: "linkedin",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-700 to-blue-800",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["achievement", "networking", "professionalism", "inspiration"],
        activeCount: 3
      },
      popularity: 91,
      rating: 4.7
    },
    {
      id: 10,
      name: "TikTok",
      category: "social",
      description: "Create viral content that resonates emotionally with audiences",
      provider: "tiktok",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-cyan-400 to-blue-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["entertainment", "creativity", "viral", "trending"],
        activeCount: 0
      },
      popularity: 94,
      rating: 4.5
    },
    {
      id: 11,
      name: "YouTube",
      category: "social",
      description: "Optimize video content based on emotional engagement metrics",
      provider: "youtube",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-red-600 to-red-400",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["excitement", "curiosity", "entertainment", "education"],
        activeCount: 4
      },
      popularity: 97,
      rating: 4.9
    },
    {
      id: 12,
      name: "Snapchat",
      category: "social",
      description: "Share moments with emotional filters and AR experiences",
      provider: "snapchat",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-yellow-400 to-yellow-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["fun", "spontaneous", "friendship", "creativity"],
        activeCount: 0
      },
      popularity: 82,
      rating: 4.3
    },

    // Healthcare EHR Systems
    {
      id: 13,
      name: "SimplePractice",
      category: "healthcare",
      description: "Mental health practice management with emotional insights integration",
      provider: "simplepractice",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-teal-500 to-blue-500",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["empathy", "healing", "progress", "support"],
        activeCount: 5
      },
      popularity: 89,
      rating: 4.8
    },
    {
      id: 14,
      name: "Epic",
      category: "healthcare",
      description: "Enterprise EHR system with AI-powered emotional patient insights",
      provider: "epic",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-purple-600 to-indigo-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["care", "precision", "efficiency", "empathy"],
        activeCount: 0
      },
      popularity: 95,
      rating: 4.7
    },
    {
      id: 15,
      name: "Cerner",
      category: "healthcare",
      description: "Healthcare technology with emotional wellness tracking capabilities",
      provider: "cerner",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-red-500 to-pink-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["wellness", "recovery", "compassion", "trust"],
        activeCount: 0
      },
      popularity: 87,
      rating: 4.5
    },
    {
      id: 16,
      name: "Athenahealth",
      category: "healthcare",
      description: "Cloud-based EHR with patient emotional state monitoring",
      provider: "athenahealth",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-green-500 to-teal-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["health", "progress", "hope", "care"],
        activeCount: 0
      },
      popularity: 84,
      rating: 4.4
    },
    {
      id: 17,
      name: "Allscripts",
      category: "healthcare",
      description: "Comprehensive healthcare solutions with emotional analytics",
      provider: "allscripts",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-600 to-cyan-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["healing", "support", "trust", "improvement"],
        activeCount: 0
      },
      popularity: 81,
      rating: 4.3
    },

    // Sports Betting & Gaming
    {
      id: 18,
      name: "DraftKings",
      category: "betting",
      description: "Sports betting with emotional control and responsible gaming insights",
      provider: "draftkings",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-green-600 to-emerald-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["excitement", "caution", "confidence", "restraint"],
        activeCount: 0
      },
      popularity: 92,
      rating: 4.6
    },
    {
      id: 19,
      name: "FanDuel",
      category: "betting",
      description: "Fantasy sports and betting with emotional wellness monitoring",
      provider: "fanduel",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-600 to-purple-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["thrill", "discipline", "strategy", "mindfulness"],
        activeCount: 0
      },
      popularity: 90,
      rating: 4.5
    },
    {
      id: 20,
      name: "BetMGM",
      category: "betting",
      description: "Casino and sports betting with AI-powered emotional insights",
      provider: "betmgm",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-yellow-500 to-orange-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["entertainment", "control", "awareness", "balance"],
        activeCount: 0
      },
      popularity: 88,
      rating: 4.4
    },
    {
      id: 21,
      name: "Caesars Sportsbook",
      category: "betting",
      description: "Premium betting experience with emotional health safeguards",
      provider: "caesars",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-purple-700 to-pink-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["luxury", "responsibility", "excitement", "wisdom"],
        activeCount: 0
      },
      popularity: 85,
      rating: 4.3
    },
    {
      id: 22,
      name: "WynnBET",
      category: "betting",
      description: "High-end sports betting with personalized emotional insights",
      provider: "wynnbet",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-red-600 to-yellow-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["sophistication", "restraint", "enjoyment", "awareness"],
        activeCount: 0
      },
      popularity: 78,
      rating: 4.2
    },

    // Real Estate Platforms
    {
      id: 23,
      name: "MLS",
      category: "realestate",
      description: "Multiple Listing Service integration with buyer emotion insights",
      provider: "mls",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-indigo-600 to-blue-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["excitement", "anxiety", "hope", "determination"],
        activeCount: 0
      },
      popularity: 96,
      rating: 4.8
    },
    {
      id: 24,
      name: "Zillow",
      category: "realestate",
      description: "Home search and valuation with emotional home-buying insights",
      provider: "zillow",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-500 to-teal-500",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["dreaming", "aspiration", "security", "investment"],
        activeCount: 3
      },
      popularity: 94,
      rating: 4.6
    },
    {
      id: 25,
      name: "Realtor.com",
      category: "realestate",
      description: "Premier real estate platform with emotional buyer journey tracking",
      provider: "realtor",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-red-500 to-orange-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["home", "family", "achievement", "stability"],
        activeCount: 0
      },
      popularity: 92,
      rating: 4.7
    },
    {
      id: 26,
      name: "Redfin",
      category: "realestate",
      description: "Tech-powered real estate with AI-driven emotional market insights",
      provider: "redfin",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-red-600 to-pink-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["innovation", "transparency", "confidence", "empowerment"],
        activeCount: 0
      },
      popularity: 89,
      rating: 4.5
    },
    {
      id: 27,
      name: "Compass",
      category: "realestate",
      description: "Modern real estate platform with emotional client relationship tools",
      provider: "compass",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-gray-700 to-gray-900",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["luxury", "sophistication", "trust", "excellence"],
        activeCount: 0
      },
      popularity: 86,
      rating: 4.4
    },

    // AI & Productivity Tools
    {
      id: 28,
      name: "ChatGPT",
      category: "ai",
      description: "Advanced AI assistant with emotional context understanding",
      provider: "openai",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-green-500 to-teal-500",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["curiosity", "learning", "productivity", "creativity"],
        activeCount: 4
      },
      popularity: 98,
      rating: 4.9
    },
    {
      id: 29,
      name: "Notion",
      category: "productivity",
      description: "All-in-one workspace with emotional state tracking for teams",
      provider: "notion",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-gray-800 to-gray-600",
      isConnected: true,
      emotionalTriggers: {
        supportedEmotions: ["organization", "collaboration", "progress", "clarity"],
        activeCount: 2
      },
      popularity: 91,
      rating: 4.7
    },
    {
      id: 30,
      name: "Trello",
      category: "productivity",
      description: "Project management with team emotional wellness monitoring",
      provider: "trello",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-blue-500 to-indigo-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["accomplishment", "teamwork", "efficiency", "satisfaction"],
        activeCount: 0
      },
      popularity: 87,
      rating: 4.5
    },

    // Trading & Finance
    {
      id: 31,
      name: "Robinhood",
      category: "finance",
      description: "Commission-free trading with emotional decision-making insights",
      provider: "robinhood",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-green-500 to-emerald-500",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["confidence", "fear", "greed", "patience"],
        activeCount: 0
      },
      popularity: 89,
      rating: 4.3
    },
    {
      id: 32,
      name: "TD Ameritrade",
      category: "finance",
      description: "Professional trading platform with emotional market analysis",
      provider: "tdameritrade",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-green-600 to-blue-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["strategy", "discipline", "analysis", "growth"],
        activeCount: 0
      },
      popularity: 92,
      rating: 4.6
    },
    {
      id: 33,
      name: "E*TRADE",
      category: "finance",
      description: "Online trading with AI-powered emotional trading psychology",
      provider: "etrade",
      iconUrl: "/api/placeholder/40/40",
      color: "bg-gradient-to-r from-purple-600 to-blue-600",
      isConnected: false,
      emotionalTriggers: {
        supportedEmotions: ["intelligence", "precision", "opportunity", "control"],
        activeCount: 0
      },
      popularity: 88,
      rating: 4.4
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
    { id: "social", name: "Social Media", icon: Share2 },
    { id: "healthcare", name: "Healthcare", icon: Stethoscope },
    { id: "betting", name: "Sports Betting", icon: Target },
    { id: "realestate", name: "Real Estate", icon: Home },
    { id: "ai", name: "AI Tools", icon: Brain },
    { id: "productivity", name: "Productivity", icon: Briefcase },
    { id: "finance", name: "Finance", icon: DollarSign }
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
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-teal-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent mb-4">
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
            <TabsList className="h-10 items-center justify-center rounded-md p-1 text-muted-foreground grid w-full grid-cols-3 lg:grid-cols-9 bg-white/70 shadow-lg border-0 text-center">
              {categories.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="flex items-center gap-1 text-xs lg:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-cyan-600 data-[state=active]:to-blue-600 data-[state=active]:text-white"
                >
                  <category.icon className="w-3 h-3 lg:w-4 lg:h-4" />
                  <span className="hidden md:inline">{category.name}</span>
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