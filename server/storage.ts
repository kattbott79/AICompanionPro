import { 
  conversations, messages, templates, aiProviders, integrations, userIntegrations, emotionalTriggerLogs,
  type Conversation, type Message, type Template, type AiProvider, type Integration, type UserIntegration, type EmotionalTriggerLog,
  type InsertConversation, type InsertMessage, type InsertTemplate, type InsertAiProvider, type InsertIntegration, type InsertUserIntegration, type InsertEmotionalTriggerLog
} from "@shared/schema";

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
  
  // Integration methods
  getIntegrations(): Promise<Integration[]>;
  getIntegrationsByCategory(category: string): Promise<Integration[]>;
  getIntegration(id: number): Promise<Integration | undefined>;
  createIntegration(integration: InsertIntegration): Promise<Integration>;
  
  // User Integration methods
  getUserIntegrations(userId: string): Promise<UserIntegration[]>;
  createUserIntegration(userIntegration: InsertUserIntegration): Promise<UserIntegration>;
  updateUserIntegration(id: number, updates: Partial<InsertUserIntegration>): Promise<UserIntegration | undefined>;
  
  // Emotional Trigger methods
  logEmotionalTrigger(log: InsertEmotionalTriggerLog): Promise<EmotionalTriggerLog>;
  getEmotionalTriggerLogs(userIntegrationId: number): Promise<EmotionalTriggerLog[]>;
}

export class MemStorage implements IStorage {
  private conversations: Map<string, Conversation>;
  private messages: Map<number, Message[]>;
  private templates: Map<number, Template>;
  private aiProviders: Map<string, AiProvider>;
  private integrations: Map<number, Integration>;
  private userIntegrations: Map<string, UserIntegration[]>;
  private emotionalTriggerLogs: Map<number, EmotionalTriggerLog[]>;
  private currentConversationId: number;
  private currentMessageId: number;
  private currentTemplateId: number;
  private currentProviderId: number;
  private currentIntegrationId: number;
  private currentUserIntegrationId: number;
  private currentTriggerLogId: number;

  constructor() {
    this.conversations = new Map();
    this.messages = new Map();
    this.templates = new Map();
    this.aiProviders = new Map();
    this.integrations = new Map();
    this.userIntegrations = new Map();
    this.emotionalTriggerLogs = new Map();
    this.currentConversationId = 1;
    this.currentMessageId = 1;
    this.currentTemplateId = 1;
    this.currentProviderId = 1;
    this.currentIntegrationId = 1;
    this.currentUserIntegrationId = 1;
    this.currentTriggerLogId = 1;
    
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

    // Add Mental Health Templates
    defaultTemplates.push(
      {
        id: 10,
        name: "Universal EMR Therapy Notes Assistant",
        category: "healthcare",
        subcategory: "mental-health",
        description: "AI-powered SOAP note generation, session analysis, and progress tracking for any EMR system",
        icon: "fas fa-brain",
        color: "green",
        timesSaved: "8 hours/week",
        rating: 5,
        userCount: 342,
        configuration: {
          integrations: ["SimplePractice", "TherapyNotes", "TheraNest", "Epic", "Any EMR via API"],
          features: ["SOAP Format Conversion", "Session Analysis", "Risk Assessment", "Progress Tracking"]
        },
        isActive: true
      },
      {
        id: 11,
        name: "Insurance Claims Automation",
        category: "healthcare", 
        subcategory: "billing",
        description: "Automated CMS-1500 generation, claim validation, and rejection analysis with AI-powered solutions",
        icon: "fas fa-file-medical",
        color: "purple",
        timesSaved: "12 hours/week",
        rating: 5,
        userCount: 89,
        configuration: {
          integrations: ["Any Clearinghouse", "Payer Portals", "EMR Billing Modules"],
          features: ["CMS-1500 Generation", "Claim Validation", "Rejection Analysis", "Resubmission Automation"]
        },
        isActive: true
      },
      {
        id: 12,
        name: "Mental Health Practice Dashboard",
        category: "healthcare",
        subcategory: "practice-management", 
        description: "Comprehensive automation for scheduling, documentation, billing, and client communication",
        icon: "fas fa-hospital",
        color: "yellow",
        timesSaved: "20 hours/week",
        rating: 5,
        userCount: 156,
        configuration: {
          integrations: ["Any EMR", "Scheduling Systems", "Payment Processors", "Communication Tools"],
          features: ["Automated Scheduling", "Documentation Assistance", "Billing Automation", "Client Portal Integration"]
        },
        isActive: true
      },
      {
        id: 13,
        name: "Group Therapy Session Manager",
        category: "healthcare",
        subcategory: "group-therapy",
        description: "Automated attendance tracking, group dynamics analysis, and individual progress notes for group sessions",
        icon: "fas fa-users",
        color: "blue",
        timesSaved: "6 hours/week",
        rating: 5,
        userCount: 78,
        configuration: {
          integrations: ["Any EMR", "Video Conferencing", "Attendance Systems"],
          features: ["Group Attendance", "Individual Tracking", "Dynamics Analysis", "Outcome Measurement"]
        },
        isActive: true
      },
      {
        id: 14,
        name: "Crisis Intervention Workflow",
        category: "healthcare",
        subcategory: "crisis-management",
        description: "Automated risk assessment, safety planning, and emergency contact protocols with real-time documentation",
        icon: "fas fa-exclamation-triangle",
        color: "red",
        timesSaved: "Critical time savings",
        rating: 5,
        userCount: 45,
        configuration: {
          integrations: ["Emergency Systems", "Contact Management", "EMR", "Mobile Apps"],
          features: ["Risk Assessment", "Safety Planning", "Emergency Contacts", "Documentation"]
        },
        isActive: true
      },
      {
        id: 15,
        name: "Telehealth Session Automation",
        category: "healthcare",
        subcategory: "telehealth",
        description: "Complete telehealth workflow with automated scheduling, session recording transcription, and HIPAA-compliant note generation",
        icon: "fas fa-video",
        color: "teal",
        timesSaved: "10 hours/week",
        rating: 5,
        userCount: 234,
        configuration: {
          integrations: ["Zoom", "Teams", "Doxy.me", "Any Video Platform"],
          features: ["Auto Scheduling", "Transcription", "SOAP Notes", "Session Analytics"]
        },
        isActive: true
      },
      {
        id: 16,
        name: "Treatment Plan Generator",
        category: "healthcare",
        subcategory: "treatment-planning",
        description: "AI-powered treatment plan creation based on assessments, with goal tracking and outcome measurement",
        icon: "fas fa-clipboard-list",
        color: "orange",
        timesSaved: "5 hours/week",
        rating: 5,
        userCount: 167,
        configuration: {
          integrations: ["Assessment Tools", "EMR", "Outcome Measures"],
          features: ["Plan Generation", "Goal Tracking", "Progress Monitoring", "Outcome Analysis"]
        },
        isActive: true
      },
      {
        id: 17,
        name: "Insurance Authorization Assistant",
        category: "healthcare",
        subcategory: "insurance",
        description: "Automated prior authorization requests, benefit verification, and appeals management with AI-powered documentation",
        icon: "fas fa-shield-alt",
        color: "cyan",
        timesSaved: "15 hours/week",
        rating: 5,
        userCount: 112,
        configuration: {
          integrations: ["Payer Portals", "Clearinghouses", "EMR"],
          features: ["Prior Auth", "Benefit Verification", "Appeals", "Documentation"]
        },
        isActive: true
      },
      {
        id: 18,
        name: "Patient Communication Hub",
        category: "healthcare",
        subcategory: "patient-engagement",
        description: "Automated appointment reminders, treatment progress updates, and personalized mental health resources",
        icon: "fas fa-comments",
        color: "pink",
        timesSaved: "8 hours/week",
        rating: 5,
        userCount: 298,
        configuration: {
          integrations: ["SMS", "Email", "Patient Portals", "Apps"],
          features: ["Reminders", "Progress Updates", "Resources", "Check-ins"]
        },
        isActive: true
      },
      {
        id: 19,
        name: "Outcome Measurement Tracker",
        category: "healthcare",
        subcategory: "outcomes",
        description: "Automated administration and analysis of standardized assessments like PHQ-9, GAD-7, and custom measures",
        icon: "fas fa-chart-line",
        color: "emerald",
        timesSaved: "4 hours/week",
        rating: 5,
        userCount: 89,
        configuration: {
          integrations: ["Assessment Platforms", "EMR", "Analytics Tools"],
          features: ["Assessment Admin", "Score Tracking", "Trend Analysis", "Reports"]
        },
        isActive: true
      },
      {
        id: 20,
        name: "Multi-Provider Practice Coordinator",
        category: "healthcare",
        subcategory: "practice-management",
        description: "Coordinate care across multiple providers, manage referrals, and track collaborative treatment plans",
        icon: "fas fa-network-wired",
        color: "violet",
        timesSaved: "12 hours/week",
        rating: 5,
        userCount: 67,
        configuration: {
          integrations: ["Multiple EMRs", "Communication Systems", "Referral Networks"],
          features: ["Care Coordination", "Referral Management", "Provider Communication", "Unified Documentation"]
        },
        isActive: true
      }
    );

    // High-Demand Specialized Templates
    defaultTemplates.push(
      {
        id: 21,
        name: "Sports Betting Intelligence Assistant",
        category: "entertainment",
        subcategory: "sports-analytics",
        description: "Real-time sports data analysis, player stats tracking, and smart betting recommendations with risk management",
        icon: "fas fa-football-ball",
        color: "amber",
        timesSaved: "10+ hours/week research",
        rating: 5,
        userCount: 2340,
        configuration: {
          integrations: ["ESPN API", "Sports Data APIs", "Betting Platforms", "News Feeds"],
          features: ["Live Stats", "Player Analysis", "Betting Odds", "Risk Calculator", "Trend Analysis"]
        },
        isActive: true
      },
      {
        id: 22,
        name: "Real Estate Investment Analyzer",
        category: "business",
        subcategory: "real-estate",
        description: "Automated property analysis, market trends, rental yield calculations, and investment opportunity alerts",
        icon: "fas fa-home",
        color: "green",
        timesSaved: "15 hours/week",
        rating: 5,
        userCount: 1560,
        configuration: {
          integrations: ["MLS", "Zillow API", "Market Data", "Property Records"],
          features: ["Property Analysis", "Market Trends", "ROI Calculator", "Deal Alerts"]
        },
        isActive: true
      },
      {
        id: 23,
        name: "Social Media Influencer Manager",
        category: "business",
        subcategory: "content-creation",
        description: "Content scheduling, engagement analysis, brand partnership tracking, and audience growth automation",
        icon: "fas fa-users",
        color: "purple",
        timesSaved: "20 hours/week",
        rating: 5,
        userCount: 3450,
        configuration: {
          integrations: ["Instagram", "TikTok", "YouTube", "Twitter", "Analytics Tools"],
          features: ["Content Scheduling", "Engagement Tracking", "Brand Deals", "Growth Analytics"]
        },
        isActive: true
      },
      {
        id: 24,
        name: "Cryptocurrency Trading Bot",
        category: "finance",
        subcategory: "crypto-trading",
        description: "Automated crypto trading with technical analysis, portfolio rebalancing, and risk management protocols",
        icon: "fas fa-coins",
        color: "yellow",
        timesSaved: "24/7 monitoring",
        rating: 5,
        userCount: 890,
        configuration: {
          integrations: ["Binance", "Coinbase", "Trading APIs", "Market Data"],
          features: ["Auto Trading", "Technical Analysis", "Risk Management", "Portfolio Tracking"]
        },
        isActive: true
      },
      {
        id: 25,
        name: "Dropshipping Business Automator",
        category: "business",
        subcategory: "e-commerce",
        description: "Product research, supplier management, order processing, and customer service automation for dropshipping",
        icon: "fas fa-shipping-fast",
        color: "blue",
        timesSaved: "25 hours/week",
        rating: 5,
        userCount: 2100,
        configuration: {
          integrations: ["AliExpress", "Shopify", "Amazon", "Supplier APIs"],
          features: ["Product Research", "Order Automation", "Supplier Management", "Customer Service"]
        },
        isActive: true
      },
      {
        id: 26,
        name: "Legal Document Assistant",
        category: "business",
        subcategory: "legal",
        description: "Automated contract generation, legal research, case management, and compliance tracking for legal professionals",
        icon: "fas fa-gavel",
        color: "indigo",
        timesSaved: "12 hours/week",
        rating: 5,
        userCount: 670,
        configuration: {
          integrations: ["Legal Databases", "Document Templates", "Case Management"],
          features: ["Contract Generation", "Legal Research", "Case Tracking", "Compliance Alerts"]
        },
        isActive: true
      },
      {
        id: 27,
        name: "YouTube Channel Growth Engine",
        category: "business",
        subcategory: "content-creation",
        description: "Video SEO optimization, thumbnail testing, audience analytics, and monetization strategy automation",
        icon: "fab fa-youtube",
        color: "red",
        timesSaved: "18 hours/week",
        rating: 5,
        userCount: 1890,
        configuration: {
          integrations: ["YouTube API", "Analytics Tools", "Thumbnail Generators", "SEO Tools"],
          features: ["SEO Optimization", "Thumbnail Testing", "Analytics", "Monetization Tracking"]
        },
        isActive: true
      },
      {
        id: 28,
        name: "Restaurant Operations Manager",
        category: "business",
        subcategory: "hospitality",
        description: "Inventory management, staff scheduling, customer feedback analysis, and delivery optimization",
        icon: "fas fa-utensils",
        color: "orange",
        timesSaved: "22 hours/week",
        rating: 5,
        userCount: 540,
        configuration: {
          integrations: ["POS Systems", "Delivery Apps", "Inventory Software", "Scheduling Tools"],
          features: ["Inventory Tracking", "Staff Scheduling", "Feedback Analysis", "Delivery Optimization"]
        },
        isActive: true
      },
      {
        id: 29,
        name: "Dating Profile Optimizer",
        category: "personal",
        subcategory: "relationships",
        description: "AI-powered dating profile optimization, conversation starters, and match analysis for dating apps",
        icon: "fas fa-heart",
        color: "pink",
        timesSaved: "5 hours/week",
        rating: 5,
        userCount: 4230,
        configuration: {
          integrations: ["Tinder", "Bumble", "Hinge", "Photo Analysis Tools"],
          features: ["Profile Optimization", "Photo Selection", "Conversation Starters", "Match Analysis"]
        },
        isActive: true
      },
      {
        id: 30,
        name: "Freelancer Business Manager",
        category: "business",
        subcategory: "freelancing",
        description: "Client management, project tracking, invoice automation, and skill development recommendations",
        icon: "fas fa-laptop",
        color: "teal",
        timesSaved: "16 hours/week",
        rating: 5,
        userCount: 2890,
        configuration: {
          integrations: ["Upwork", "Fiverr", "PayPal", "Project Management Tools"],
          features: ["Client Management", "Project Tracking", "Invoice Automation", "Skill Development"]
        },
        isActive: true
      }
    );

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

  // Integration methods
  async getIntegrations(): Promise<Integration[]> {
    return Array.from(this.integrations.values());
  }

  async getIntegrationsByCategory(category: string): Promise<Integration[]> {
    return Array.from(this.integrations.values()).filter(i => i.category === category);
  }

  async getIntegration(id: number): Promise<Integration | undefined> {
    return this.integrations.get(id);
  }

  async createIntegration(integration: InsertIntegration): Promise<Integration> {
    const id = ++this.currentIntegrationId;
    const newIntegration: Integration = { ...integration, id };
    this.integrations.set(id, newIntegration);
    return newIntegration;
  }

  // User Integration methods
  async getUserIntegrations(userId: string): Promise<UserIntegration[]> {
    return this.userIntegrations.get(userId) || [];
  }

  async createUserIntegration(userIntegration: InsertUserIntegration): Promise<UserIntegration> {
    const id = ++this.currentUserIntegrationId;
    const newUserIntegration: UserIntegration = { 
      ...userIntegration, 
      id,
      createdAt: new Date(),
      lastUsed: null
    };
    
    const userIntegrations = this.userIntegrations.get(userIntegration.userId) || [];
    userIntegrations.push(newUserIntegration);
    this.userIntegrations.set(userIntegration.userId, userIntegrations);
    
    return newUserIntegration;
  }

  async updateUserIntegration(id: number, updates: Partial<InsertUserIntegration>): Promise<UserIntegration | undefined> {
    for (const [userId, integrations] of this.userIntegrations.entries()) {
      const index = integrations.findIndex(ui => ui.id === id);
      if (index !== -1) {
        const updated = { ...integrations[index], ...updates };
        integrations[index] = updated;
        return updated;
      }
    }
    return undefined;
  }

  // Emotional Trigger methods
  async logEmotionalTrigger(log: InsertEmotionalTriggerLog): Promise<EmotionalTriggerLog> {
    const id = ++this.currentTriggerLogId;
    const newLog: EmotionalTriggerLog = { 
      ...log, 
      id,
      timestamp: new Date()
    };
    
    const logs = this.emotionalTriggerLogs.get(log.userIntegrationId) || [];
    logs.push(newLog);
    this.emotionalTriggerLogs.set(log.userIntegrationId, logs);
    
    return newLog;
  }

  async getEmotionalTriggerLogs(userIntegrationId: number): Promise<EmotionalTriggerLog[]> {
    return this.emotionalTriggerLogs.get(userIntegrationId) || [];
  }
}

export const storage = new MemStorage();
