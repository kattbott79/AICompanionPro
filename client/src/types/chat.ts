export interface Message {
  id: number;
  content: string;
  role: "user" | "assistant" | "system";
  timestamp: Date;
  emotionalContext?: Record<string, any>;
  voiceAnalysis?: Record<string, any>;
}

export interface Conversation {
  id: number;
  sessionId: string;
  currentStep: string;
  selectedTemplate?: string;
  selectedProvider: string;
  emotionalState: string;
  configuration: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface Template {
  id: number;
  name: string;
  category: "business" | "personal";
  subcategory: string;
  description: string;
  icon: string;
  color: string;
  timesSaved: string;
  rating: number;
  userCount: number;
  configuration: Record<string, any>;
  isActive: boolean;
}

export interface AiProvider {
  id: number;
  name: string;
  type: string;
  description: string;
  capabilities: string[];
  isLocal: boolean;
  requiresApiKey: boolean;
  isActive: boolean;
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  currentStep: string;
  selectedTemplate?: string;
  selectedProvider: string;
  emotionalState: string;
  isVoiceActive: boolean;
  suggestions: string[];
}

export interface VoiceAnalysis {
  transcript: string;
  emotions: Record<string, number>;
  confidence: number;
}

export interface AIResponse {
  response: string;
  suggestions: string[];
  emotionalContext?: Record<string, any>;
  conversationState: {
    currentStep: string;
    selectedTemplate?: string;
  };
}
