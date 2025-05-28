import { conversations, messages, templates, aiProviders, type Conversation, type Message, type Template, type AiProvider, type InsertConversation, type InsertMessage, type InsertTemplate, type InsertAiProvider } from "@shared/schema";

export interface IStorage {
  // Conversation methods
  getConversation(sessionId: string): Promise<Conversation | undefined>;
  createConversation(conversation: InsertConversation): Promise<Conversation>;
  updateConversation(sessionId: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined>;
  
  // Message methods
  getMessages(conversationId: number): Promise<Message[]>;
  addMessage(message: InsertMessage): Promise<Message>;
  
  // Template methods
  getTemplates(): Promise<Template[]>;
  getTemplatesByCategory(category: string): Promise<Template[]>;
  getTemplate(id: number): Promise<Template | undefined>;
  createTemplate(template: InsertTemplate): Promise<Template>;
  
  // AI Provider methods
  getAiProviders(): Promise<AiProvider[]>;
  getActiveAiProviders(): Promise<AiProvider[]>;
  getAiProvider(type: string): Promise<AiProvider | undefined>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, Conversation>;
  private messages: Map<number, Message[]>;
  private templates: Map<number, Template>;
  private aiProviders: Map<string, AiProvider>;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentTemplateId: number;
  private currentProviderId: number;

  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.templates = new Map();
    this.aiProviders = new Map();
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentTemplateId = 1;
    this.currentProviderId = 1;
    
    this.initializeData();
  }

  private initializeData() {
    // Initialize default templates
    const defaultTemplates: Template[] = [
      // Business Templates
      {
        id: 1,
        name: "E-commerce Automation",
        category: "business",
        subcategory: "ecommerce",
        description: "Order processing, inventory alerts, customer follow-ups",
        icon: "fas fa-shopping-cart",
        color: "blue",
        timesSaved: "15+ hours/week",
        rating: 5,
        userCount: 1200,
        configuration: {
          workflows: ["order_processing", "inventory_management", "customer_support"],
          integrations: ["shopify", "woocommerce", "stripe"]
        },
        isActive: true
      },
      {
        id: 2,
        name: "Service Business",
        category: "business",
        subcategory: "service",
        description: "Appointment scheduling, client follow-ups, invoicing",
        icon: "fas fa-handshake",
        color: "green",
        timesSaved: "12+ hours/week",
        rating: 5,
        userCount: 890,
        configuration: {
          workflows: ["appointment_scheduling", "client_management", "invoicing"],
          integrations: ["calendly", "quickbooks", "mailchimp"]
        },
        isActive: true
      },
      {
        id: 3,
        name: "Restaurant/Retail",
        category: "business",
        subcategory: "restaurant",
        description: "Orders, reviews, staff scheduling, inventory",
        icon: "fas fa-utensils",
        color: "purple",
        timesSaved: "20+ hours/week",
        rating: 5,
        userCount: 540,
        configuration: {
          workflows: ["order_management", "review_monitoring", "staff_scheduling"],
          integrations: ["square", "toast", "yelp"]
        },
        isActive: true
      },
      {
        id: 4,
        name: "Content Creator",
        category: "business",
        subcategory: "content",
        description: "Social media automation, engagement tracking",
        icon: "fas fa-video",
        color: "indigo",
        timesSaved: "10+ hours/week",
        rating: 5,
        userCount: 650,
        configuration: {
          workflows: ["content_scheduling", "engagement_tracking", "analytics"],
          integrations: ["hootsuite", "buffer", "analytics"]
        },
        isActive: true
      },
      // Personal Templates
      {
        id: 5,
        name: "Daily Productivity",
        category: "personal",
        subcategory: "productivity",
        description: "Task management, routine optimization, reminders",
        icon: "fas fa-tasks",
        color: "blue",
        timesSaved: "2+ hours daily",
        rating: 5,
        userCount: 2100,
        configuration: {
          workflows: ["task_management", "routine_optimization", "time_tracking"],
          integrations: ["todoist", "notion", "google_calendar"]
        },
        isActive: true
      },
      {
        id: 6,
        name: "Health & Wellness",
        category: "personal",
        subcategory: "health",
        description: "Fitness tracking, meal planning, wellness reminders",
        icon: "fas fa-heartbeat",
        color: "green",
        timesSaved: "Better health habits",
        rating: 5,
        userCount: 1800,
        configuration: {
          workflows: ["fitness_tracking", "meal_planning", "wellness_reminders"],
          integrations: ["myfitnesspal", "fitbit", "apple_health"]
        },
        isActive: true
      },
      {
        id: 7,
        name: "Financial Management",
        category: "personal",
        subcategory: "finance",
        description: "Budget tracking, bill reminders, investment alerts",
        icon: "fas fa-chart-line",
        color: "purple",
        timesSaved: "Better money control",
        rating: 5,
        userCount: 960,
        configuration: {
          workflows: ["budget_tracking", "bill_reminders", "investment_monitoring"],
          integrations: ["mint", "ynab", "personal_capital"]
        },
        isActive: true
      },
      {
        id: 8,
        name: "Home Management",
        category: "personal",
        subcategory: "home",
        description: "Chores, maintenance reminders, smart home control",
        icon: "fas fa-home",
        color: "indigo",
        timesSaved: "Organized living",
        rating: 5,
        userCount: 1450,
        configuration: {
          workflows: ["chore_scheduling", "maintenance_reminders", "smart_home_control"],
          integrations: ["alexa", "google_home", "smartthings"]
        },
        isActive: true
      }
    ];

    // Initialize AI providers
    const defaultProviders: AiProvider[] = [
      {
        id: 1,
        name: "Hume AI",
        type: "hume",
        description: "Emotionally intelligent AI that understands your feelings",
        capabilities: ["emotion_analysis", "voice_analysis", "empathetic_responses"],
        isLocal: false,
        requiresApiKey: true,
        isActive: true
      },
      {
        id: 2,
        name: "Ollama (Local)",
        type: "ollama",
        description: "Runs on your computer - completely private, fast, and free",
        capabilities: ["local_processing", "privacy", "custom_models"],
        isLocal: true,
        requiresApiKey: false,
        isActive: true
      },
      {
        id: 3,
        name: "OpenAI",
        type: "openai",
        description: "Advanced reasoning and broad knowledge base",
        capabilities: ["advanced_reasoning", "multimodal", "function_calling"],
        isLocal: false,
        requiresApiKey: true,
        isActive: true
      }
    ];

    // Populate data
    defaultTemplates.forEach(template => {
      this.templates.set(template.id, template);
      this.currentTemplateId = Math.max(this.currentTemplateId, template.id + 1);
    });

    defaultProviders.forEach(provider => {
      this.aiProviders.set(provider.type, provider);
      this.currentProviderId = Math.max(this.currentProviderId, provider.id + 1);
    });
  }

  async getConversation(sessionId: string): Promise<Conversation | undefined> {
    return this.conversations.get(sessionId);
  }

  async createConversation(conversation: InsertConversation): Promise<Conversation> {
    const id = this.currentConversationId++;
    const newConversation: Conversation = {
      ...conversation,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.conversations.set(conversation.sessionId, newConversation);
    this.messages.set(id, []);
    return newConversation;
  }

  async updateConversation(sessionId: string, updates: Partial<InsertConversation>): Promise<Conversation | undefined> {
    const conversation = this.conversations.get(sessionId);
    if (!conversation) return undefined;

    const updatedConversation: Conversation = {
      ...conversation,
      ...updates,
      updatedAt: new Date(),
    };
    this.conversations.set(sessionId, updatedConversation);
    return updatedConversation;
  }

  async getMessages(conversationId: number): Promise<Message[]> {
    return this.messages.get(conversationId) || [];
  }

  async addMessage(message: InsertMessage): Promise<Message> {
    const id = this.currentMessageId++;
    const newMessage: Message = {
      ...message,
      id,
      timestamp: new Date(),
    };

    const conversationMessages = this.messages.get(message.conversationId) || [];
    conversationMessages.push(newMessage);
    this.messages.set(message.conversationId, conversationMessages);

    return newMessage;
  }

  async getTemplates(): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.isActive);
  }

  async getTemplatesByCategory(category: string): Promise<Template[]> {
    return Array.from(this.templates.values()).filter(t => t.category === category && t.isActive);
  }

  async getTemplate(id: number): Promise<Template | undefined> {
    return this.templates.get(id);
  }

  async createTemplate(template: InsertTemplate): Promise<Template> {
    const id = this.currentTemplateId++;
    const newTemplate: Template = { ...template, id };
    this.templates.set(id, newTemplate);
    return newTemplate;
  }

  async getAiProviders(): Promise<AiProvider[]> {
    return Array.from(this.aiProviders.values());
  }

  async getActiveAiProviders(): Promise<AiProvider[]> {
    return Array.from(this.aiProviders.values()).filter(p => p.isActive);
  }

  async getAiProvider(type: string): Promise<AiProvider | undefined> {
    return this.aiProviders.get(type);
  }
}

export const storage = new MemStorage();
