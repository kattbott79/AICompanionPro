import { useState, useCallback, useRef, useEffect } from "react";
import { ChatState, Message, AIResponse } from "@/types/chat";
import { aiService } from "@/lib/aiService";
import { useToast } from "@/hooks/use-toast";

export function useChat(sessionId: string) {
  const { toast } = useToast();
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    currentStep: "initial",
    selectedTemplate: undefined,
    selectedProvider: "hume",
    emotionalState: "neutral",
    isVoiceActive: false,
    suggestions: [
      "🏢 Business Automation",
      "🏠 Personal Life Helper", 
      "🎨 Let me explore options",
      "⚡ I have something specific in mind"
    ],
  });

  const abortControllerRef = useRef<AbortController | null>(null);

  // Load conversation history on mount
  useEffect(() => {
    const loadConversation = async () => {
      try {
        const conversation = await aiService.getConversation(sessionId);
        if (conversation && conversation.messages) {
          setState(prev => ({
            ...prev,
            currentStep: conversation.conversation.currentStep,
            selectedTemplate: conversation.conversation.selectedTemplate,
            selectedProvider: conversation.conversation.selectedProvider,
            emotionalState: conversation.conversation.emotionalState,
            messages: conversation.messages.map((msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
            })),
          }));
        } else {
          // New conversation - add welcome message
          const welcomeMessage: Message = {
            id: 0,
            content: `Hey there! I'm genuinely excited to meet you. I'm your AI/ML engineer, and I specialize in creating custom AI agents that feel like real companions - not just chatbots.

I've helped people build everything from sarcastic productivity coaches to zen-like creative muses. Each AI I create is as unique as the person it's made for.

Before we dive into the technical stuff, I'd love to get to know you a bit. What's your name? And what's bringing you here today - are you looking to automate something specific, or do you just want an AI companion that really "gets" you?

Don't worry about being perfect with your answer - the more you sound like yourself, the better I can help you build something amazing.`,
            role: "assistant",
            timestamp: new Date(),
          };
          
          setState(prev => ({
            ...prev,
            messages: [welcomeMessage],
          }));
        }
      } catch (error) {
        console.error("Failed to load conversation:", error);
        toast({
          title: "Connection Error",
          description: "Failed to load conversation history",
          variant: "destructive",
        });
      }
    };

    loadConversation();
    
    // Cleanup abort controller on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [sessionId, toast]);

  const sendMessage = useCallback(async (content: string) => {
    if (!content.trim() || state.isLoading) return;

    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();

    // Add user message immediately
    const userMessage: Message = {
      id: Date.now(),
      content: content.trim(),
      role: "user",
      timestamp: new Date(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
    }));

    try {
      const response: AIResponse = await aiService.sendMessage(
        sessionId, 
        content, 
        state.selectedProvider
      );

      const assistantMessage: Message = {
        id: Date.now() + 1,
        content: response.response,
        role: "assistant",
        timestamp: new Date(),
        emotionalContext: response.emotionalContext,
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, assistantMessage],
        isLoading: false,
        // Don't override suggestions if we just set them locally
        suggestions: prev.currentStep === 'category_selected' ? prev.suggestions : (response.suggestions || []),
        currentStep: response.conversationState.currentStep,
        selectedTemplate: response.conversationState.selectedTemplate,
        emotionalState: response.emotionalContext?.detectedEmotion || prev.emotionalState,
      }));

    } catch (error: any) {
      if (error.name === 'AbortError') {
        return; // Request was cancelled
      }

      console.error("Failed to send message:", error);
      
      const errorMessage: Message = {
        id: Date.now() + 1,
        content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment. 🔄",
        role: "assistant",
        timestamp: new Date(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
      }));

      toast({
        title: "Message Failed",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    }
  }, [sessionId, state.selectedProvider, state.isLoading, toast]);

  const selectOption = useCallback((option: string, onTemplateExplore?: () => void) => {
    // Check if this is a template exploration request
    if (option.toLowerCase().includes('explore') || option.toLowerCase().includes('template') || option.toLowerCase().includes('options')) {
      if (onTemplateExplore) {
        onTemplateExplore();
        return;
      }
    }
    
    // Handle category selections without sending to AI
    if (option.includes('Business Automation')) {
      setState(prev => ({
        ...prev,
        suggestions: [
          "📧 Email & Marketing Automation",
          "📋 Customer Management (CRM)",
          "💰 Invoice & Billing Automation", 
          "📅 Appointment Scheduling",
          "📊 Data & Reports Automation"
        ],
        currentStep: 'category_selected'
      }));
      return;
    } 
    
    if (option.includes('Personal Life Helper')) {
      setState(prev => ({
        ...prev,
        suggestions: [
          "🏠 Home Management & Reminders",
          "💰 Personal Finance Tracking",
          "🎯 Goal & Habit Tracking",
          "📱 Social Media Management",
          "📚 Learning & Skill Development"
        ],
        currentStep: 'category_selected'
      }));
      return;
    }
    
    if (option.includes('specific in mind')) {
      setState(prev => ({
        ...prev,
        suggestions: [
          "🔍 Browse All Templates",
          "💬 Describe Your Needs",
          "🎯 Custom Solution Builder"
        ],
        currentStep: 'category_selected'
      }));
      return;
    }
    
    // For other options, send to AI
    sendMessage(`Selected: ${option}`);
  }, [sendMessage]);

  const selectTemplate = useCallback((templateName: string) => {
    sendMessage(`I'm interested in: ${templateName}`);
  }, [sendMessage]);

  const changeProvider = useCallback(async (provider: string) => {
    try {
      await aiService.updateProvider(sessionId, provider);
      setState(prev => ({
        ...prev,
        selectedProvider: provider,
      }));

      toast({
        title: "AI Provider Updated",
        description: `Now using ${provider} for responses`,
      });
    } catch (error) {
      console.error("Failed to update provider:", error);
      toast({
        title: "Update Failed",
        description: "Failed to update AI provider",
        variant: "destructive",
      });
    }
  }, [sessionId, toast]);

  const setVoiceActive = useCallback((active: boolean) => {
    setState(prev => ({
      ...prev,
      isVoiceActive: active,
    }));
  }, []);

  const clearChat = useCallback(() => {
    setState(prev => ({
      ...prev,
      messages: [],
      currentStep: "initial",
      selectedTemplate: undefined,
      suggestions: [
        "🏢 Business Automation",
        "🏠 Personal Life Helper",
        "🎨 Let me explore options", 
        "⚡ I have something specific in mind"
      ],
    }));
  }, []);

  return {
    ...state,
    sendMessage,
    selectOption,
    selectTemplate,
    changeProvider,
    setVoiceActive,
    clearChat,
  };
}
