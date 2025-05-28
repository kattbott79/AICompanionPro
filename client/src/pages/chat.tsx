import { useState, useEffect } from "react";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { TemplateGrid } from "@/components/templates/TemplateGrid";
import { ProgressIndicator } from "@/components/sidebar/ProgressIndicator";
import { ProviderSelector } from "@/components/sidebar/ProviderSelector";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  Sparkles,
  Settings,
  HelpCircle,
  ExternalLink,
  Bot
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { Template } from "@/types/chat";
import adoptABotLogo from "@assets/favicon.wordpress.png";
import { useChat } from "@/hooks/useChat";
import { cn } from "@/lib/utils";

export default function Chat() {
  const [sessionId] = useState(() => `session-${Date.now()}-${Math.random().toString(36).substring(7)}`);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const {
    currentStep,
    selectedTemplate,
    selectedProvider,
    changeProvider,
    selectTemplate
  } = useChat(sessionId);

  // Generate session ID once on mount
  useEffect(() => {
    document.title = "AI Automation Consultant | Build Your Custom AI Companion";
  }, []);

  const handleTemplateSelect = (template: Template) => {
    selectTemplate(template.name);
    setShowTemplates(false);
    setSidebarOpen(false);
  };

  const handleProviderChange = (provider: string) => {
    changeProvider(provider);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-teal-50 dark:from-gray-900 dark:via-blue-900 dark:to-teal-900">
      {/* Main Layout */}
      <div className="flex h-screen">
        {/* Desktop Sidebar */}
        <div className="hidden lg:flex w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-r border-gray-200/50 dark:border-gray-700/50 flex-col shadow-lg">
          <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img 
                  src={adoptABotLogo} 
                  alt="adopt.a.bot logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">adopt.a.bot</h2>
                <p className="text-xs text-gray-600 dark:text-gray-400">Powered by Hume AI</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Button
                variant={showTemplates ? "default" : "ghost"}
                size="sm"
                onClick={() => setShowTemplates(!showTemplates)}
                className="w-full justify-start"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Browse Templates
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <HelpCircle className="w-4 h-4 mr-2" />
                Help & Guide
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>

          <ScrollArea className="flex-1 p-6 space-y-6">
            {/* Progress Indicator */}
            <ProgressIndicator
              currentStep={currentStep}
              selectedTemplate={selectedTemplate}
            />

            {/* AI Provider Selector */}
            <ProviderSelector
              selectedProvider={selectedProvider}
              onProviderChange={handleProviderChange}
            />

            {/* Popular Templates Preview */}
            {!showTemplates && (
              <Card className="border-0 shadow-lg bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm">
                <CardContent className="p-4">
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">Popular Templates</h3>
                  <div className="space-y-3">
                    {/* E-commerce Template Preview */}
                    <div className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 cursor-pointer hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors">
                      <img 
                        src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=120" 
                        alt="E-commerce automation" 
                        className="w-full h-16 object-cover rounded mb-2" 
                      />
                      <h4 className="font-medium text-cyan-600 dark:text-blue-400 text-sm mb-1">E-commerce Automation</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Order processing, inventory alerts, customer follow-ups</p>
                      <div className="flex items-center mt-2 text-xs text-cyan-500 dark:text-cyan-400">
                        <span>★ 4.8</span>
                        <span className="mx-2">•</span>
                        <span>1.2k users</span>
                      </div>
                    </div>

                    {/* Service Business Template Preview */}
                    <div className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 cursor-pointer hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors">
                      <img 
                        src="https://images.unsplash.com/photo-1521737711867-e3b97375f902?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=120" 
                        alt="Service business automation" 
                        className="w-full h-16 object-cover rounded mb-2" 
                      />
                      <h4 className="font-medium text-green-600 dark:text-green-400 text-sm mb-1">Service Business</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Appointment scheduling, client follow-ups, invoicing</p>
                      <div className="flex items-center mt-2 text-xs text-cyan-500 dark:text-cyan-400">
                        <span>★ 4.9</span>
                        <span className="mx-2">•</span>
                        <span>890 users</span>
                      </div>
                    </div>

                    {/* Personal Assistant Template Preview */}
                    <div className="p-3 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-gray-700/50 cursor-pointer hover:bg-white/80 dark:hover:bg-gray-700/80 transition-colors">
                      <img 
                        src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&auto=format&fit=crop&w=300&h=120" 
                        alt="Personal productivity automation" 
                        className="w-full h-16 object-cover rounded mb-2" 
                      />
                      <h4 className="font-medium text-indigo-600 dark:text-indigo-400 text-sm mb-1">Personal Assistant</h4>
                      <p className="text-xs text-blue-600 dark:text-blue-400">Daily routines, health tracking, home management</p>
                      <div className="flex items-center mt-2 text-xs text-cyan-500 dark:text-cyan-400">
                        <span>★ 4.8</span>
                        <span className="mx-2">•</span>
                        <span>2.1k users</span>
                      </div>
                    </div>
                  </div>

                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-4"
                    onClick={() => setShowTemplates(true)}
                  >
                    <ExternalLink className="w-3 h-3 mr-2" />
                    View All Templates
                  </Button>
                </CardContent>
              </Card>
            )}
          </ScrollArea>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col">
          {/* Mobile Header */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200/50 dark:border-gray-700/50 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full overflow-hidden">
                <img 
                  src={adoptABotLogo} 
                  alt="adopt.a.bot logo" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-800 dark:text-white">adopt.a.bot</h1>
                <p className="text-xs text-slate-600 dark:text-slate-200">Powered by Hume AI</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-80 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-gray-200/50 dark:border-gray-700/50">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">Options</h2>
                    <Button variant="ghost" size="sm" onClick={() => setSidebarOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <ScrollArea className="h-full space-y-6">
                    <ProgressIndicator
                      currentStep={currentStep}
                      selectedTemplate={selectedTemplate}
                    />

                    <ProviderSelector
                      selectedProvider={selectedProvider}
                      onProviderChange={handleProviderChange}
                    />
                  </ScrollArea>
                </SheetContent>
              </Sheet>
            </div>
          </div>

          {/* Chat Interface or Template Grid */}
          {showTemplates ? (
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-100">Choose Your Template</h1>
                    <p className="text-gray-400">Select an automation template to get started</p>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowTemplates(false)}
                    className="hidden lg:flex"
                  >
                    Back to Chat
                  </Button>
                </div>

                <TemplateGrid
                  onTemplateSelect={handleTemplateSelect}
                  selectedCategory="all"
                  variant="grid"
                  showFilters={true}
                />
              </div>
            </div>
          ) : (
            <div className="flex-1 max-w-4xl mx-auto w-full">
              <ChatInterface
                sessionId={sessionId}
                onTemplateSelect={handleTemplateSelect}
                onProviderChange={handleProviderChange}
                className="h-full"
              />
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile Templates */}
      {!showTemplates && (
        <div className="lg:hidden fixed bottom-6 right-6">
          <Button
            size="lg"
            onClick={() => setShowTemplates(true)}
            className="rounded-full w-14 h-14 shadow-lg bg-gradient-to-br from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700"
          >
            <Sparkles className="w-6 h-6" />
          </Button>
        </div>
      )}
    </div>
  );
}
