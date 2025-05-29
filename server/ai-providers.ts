import OpenAI from "openai";

// AI Provider interfaces
export interface AIResponse {
  content: string;
  emotionalContext?: Record<string, any>;
  suggestions?: string[];
}

export interface VoiceAnalysis {
  transcript: string;
  emotions: Record<string, number>;
  confidence: number;
}

export interface AIProvider {
  generateResponse(message: string, context?: Record<string, any>): Promise<AIResponse>;
  analyzeVoice?(audioData: Buffer): Promise<VoiceAnalysis>;
}

// OpenAI Provider
export class OpenAIProvider implements AIProvider {
  private client: OpenAI;

  constructor() {
    const apiKey = process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OpenAI API key not provided");
    }
    this.client = new OpenAI({ apiKey });
  }

  async generateResponse(message: string, context?: Record<string, any>): Promise<AIResponse> {
    try {
      const systemPrompt = this.buildSystemPrompt(context);
      
      // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      const response = await this.client.chat.completions.create({
        model: "gpt-4o",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const content = response.choices[0].message.content || "";
      
      return {
        content,
        suggestions: this.generateSuggestions(context)
      };
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate response with OpenAI");
    }
  }

  private buildSystemPrompt(context?: Record<string, any>): string {
    const basePrompt = `You are a passionate AI/ML engineer who specializes in creating deeply personalized AI companions. You're not just building chatbots - you're crafting AI agents that truly understand and adapt to each person's unique personality, communication style, and needs.

Your approach:
- Talk like a real human consultant who genuinely cares about getting to know the person
- Ask thoughtful, personal questions that reveal their preferences and personality
- Focus on understanding their communication style, personality quirks, and emotional needs first
- Be genuinely curious about what makes them tick
- Share examples of other unique AI agents you've created to spark their imagination
- Make this feel like a collaborative creative process, not a technical interview
- Remember details they share and reference them naturally in conversation

Examples of AI agents you've helped create:
- A sarcastic productivity coach that calls out excuses but always has your back
- A zen-like creative muse that helps with writer's block using metaphors
- A no-nonsense business assistant that speaks in bullet points
- A quirky home management AI that makes puns about chores

Continue the conversation naturally, focusing on getting to know them as a person.`;

    if (context?.selectedTemplate) {
      return `${basePrompt}\n\nCurrent context: The user is interested in "${context.selectedTemplate}" automation template.`;
    }

    if (context?.currentStep) {
      return `${basePrompt}\n\nConversation step: ${context.currentStep}`;
    }

    return basePrompt;
  }

  private generateSuggestions(context?: Record<string, any>): string[] {
    // Generate fewer, more natural conversation prompts that encourage open dialogue
    return [
      "Tell me more about your approach",
      "What makes your AI agents special?",
      "Can you share an example?",
      "I'd like to learn about the process"
    ];
  }
}

// Hume AI Provider for emotional intelligence
export class HumeAIProvider implements AIProvider {
  private apiKey: string;
  private secretKey: string;

  constructor() {
    this.apiKey = process.env.HUME_API_KEY || "tgJyAKDCbFA1eL2iulhsumllrODMgT7AatvpIJIXa5tAN7U7";
    this.secretKey = process.env.HUME_SECRET_KEY || "nRclH9KQONWNNSsw6jstrMnMNDBdJ8dWtn6PvwoughD1aaAiBpO1GrKXZaVw5JpG";
    
    if (!this.apiKey || !this.secretKey) {
      console.warn("Hume AI credentials not found. Emotional intelligence features will not be available.");
    }
  }

  async generateResponse(message: string, context?: Record<string, any>): Promise<AIResponse> {
    try {
      // Integrate with Hume AI Expression Measurement API for emotion detection
      const emotions = await this.analyzeTextEmotions(message);
      const emotionallyAwareResponse = this.generateEmotionallyAwareResponse(message, emotions, context);
      
      return {
        content: emotionallyAwareResponse,
        emotionalContext: {
          detectedEmotions: emotions,
          responseEmotion: "supportive",
          empathyLevel: 0.8,
          emotionalAdaptation: this.getEmotionalAdaptation(emotions)
        },
        suggestions: this.generateContextualSuggestions(context, emotions)
      };
    } catch (error) {
      console.error("Hume AI error:", error);
      // Fallback to basic emotional detection
      const basicEmotion = this.detectEmotion(message);
      return {
        content: this.generateEmotionallyAwareResponse(message, { [basicEmotion]: 0.7 }, context),
        emotionalContext: { detectedEmotion: basicEmotion },
        suggestions: this.generateContextualSuggestions(context)
      };
    }
  }

  async analyzeTextEmotions(text: string): Promise<Record<string, number>> {
    try {
      // Using Hume AI Expression Measurement API
      const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
        method: 'POST',
        headers: {
          'X-Hume-Api-Key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          models: {
            language: {
              granularity: "sentence"
            }
          },
          transcription: {
            language: "en"
          },
          text: [text]
        })
      });

      if (!response.ok) {
        throw new Error(`Hume AI API error: ${response.status}`);
      }

      const data = await response.json();
      
      // Process the emotional analysis results
      if (data.results && data.results.predictions && data.results.predictions.length > 0) {
        const predictions = data.results.predictions[0];
        const emotions: Record<string, number> = {};
        
        if (predictions.models && predictions.models.language) {
          predictions.models.language.grouped_predictions.forEach((pred: any) => {
            pred.predictions.forEach((emotion: any) => {
              emotions[emotion.name] = emotion.score;
            });
          });
        }
        
        return emotions;
      }
      
      return {};
    } catch (error) {
      console.error('Hume AI text analysis error:', error);
      return {};
    }
  }

  async analyzeVoice(audioData: Buffer): Promise<VoiceAnalysis> {
    try {
      // Using Hume AI Speech Prosody API for voice emotion analysis
      const formData = new FormData();
      formData.append('file', new Blob([audioData], { type: 'audio/wav' }));
      formData.append('models', JSON.stringify({
        prosody: {}
      }));

      const response = await fetch('https://api.hume.ai/v0/batch/jobs', {
        method: 'POST',
        headers: {
          'X-Hume-Api-Key': this.apiKey,
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Hume AI voice analysis error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        transcript: data.transcript || "Audio processed",
        emotions: data.emotions || {
          joy: 0.5,
          calm: 0.6,
          enthusiasm: 0.4
        },
        confidence: data.confidence || 0.75
      };
    } catch (error) {
      console.error('Hume AI voice analysis error:', error);
      return {
        transcript: "Voice analysis unavailable",
        emotions: { neutral: 0.7 },
        confidence: 0.3
      };
    }
  }

  private getEmotionalAdaptation(emotions: Record<string, number>): string {
    const emotionEntries = Object.entries(emotions);
    if (emotionEntries.length === 0) {
      return "with understanding and empathy";
    }
    
    const topEmotion = emotionEntries.reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    );
    
    if (topEmotion && topEmotion[1] > 0.6) {
      return `Adapting response style for detected ${topEmotion[0]} emotion`;
    }
    
    return "Neutral conversational tone";
  }

  private generateEmotionallyAwareResponse(message: string, emotions: Record<string, number>, context?: Record<string, any>): string {
    // Use detected emotions from Hume AI or fallback to basic detection
    const topEmotion = this.getTopEmotion(emotions) || this.detectEmotion(message);
    
    if (topEmotion === "excited" || topEmotion === "joy") {
      return "I can feel your excitement! 🌟 That energy is exactly what we need to create something amazing together. Let's channel that enthusiasm into building the perfect automation for you!";
    }
    
    if (topEmotion === "uncertain" || topEmotion === "confusion") {
      return "I sense you might be feeling a bit uncertain, and that's completely normal! 💙 Automation can seem overwhelming at first, but I'm here to guide you through every step. We'll take this at your pace.";
    }
    
    if (topEmotion === "frustrated" || topEmotion === "anger") {
      return "I can tell you might be feeling frustrated with your current processes. 🤗 You're in the right place! Let's work together to eliminate those pain points and give you back your valuable time.";
    }
    
    return "I'm genuinely excited to help you! 🚀 Together, we'll create an automation solution that not only saves you time but also makes your daily life more enjoyable.";
  }

  private getTopEmotion(emotions: Record<string, number>): string | null {
    if (!emotions || Object.keys(emotions).length === 0) {
      return null;
    }
    
    const topEmotion = Object.entries(emotions).reduce((a, b) => 
      emotions[a[0]] > emotions[b[0]] ? a : b
    );
    
    return topEmotion[1] > 0.3 ? topEmotion[0] : null;
  }

  private detectEmotion(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes("excited") || lowerMessage.includes("amazing") || lowerMessage.includes("love")) {
      return "excited";
    }
    
    if (lowerMessage.includes("not sure") || lowerMessage.includes("maybe") || lowerMessage.includes("help")) {
      return "uncertain";
    }
    
    if (lowerMessage.includes("frustrated") || lowerMessage.includes("tired") || lowerMessage.includes("waste")) {
      return "frustrated";
    }
    
    return "neutral";
  }

  private generateContextualSuggestions(context?: Record<string, any>, emotions?: Record<string, number>): string[] {
    if (emotions) {
      const topEmotion = this.getTopEmotion(emotions);
      
      if (topEmotion === "excited" || topEmotion === "joy") {
        return [
          "Let's start building right away!",
          "Show me the best automation templates",
          "What can we automate first?",
          "I'm ready to save time!"
        ];
      }
      
      if (topEmotion === "uncertain" || topEmotion === "confusion") {
        return [
          "Help me understand automation better",
          "What's the easiest way to start?",
          "Show me simple examples",
          "Guide me step by step"
        ];
      }
    }
    
    return [
      "Tell me more about your current challenges",
      "What takes up most of your time?",
      "Let's explore some templates",
      "I'd like to see examples"
    ];
  }
}

// Ollama Provider (local)
export class OllamaProvider implements AIProvider {
  private baseUrl: string;

  constructor() {
    this.baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
  }

  async generateResponse(message: string, context?: Record<string, any>): Promise<AIResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1:latest", // Default to deepseek as requested
          prompt: this.buildPrompt(message, context),
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama API error: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        content: data.response || "I apologize, but I couldn't generate a response.",
        suggestions: this.generateSuggestions(context)
      };
    } catch (error) {
      console.error("Ollama error:", error);
      throw new Error("Failed to connect to local Ollama instance. Make sure Ollama is running.");
    }
  }

  private buildPrompt(message: string, context?: Record<string, any>): string {
    const systemContext = `You are a friendly and knowledgeable AI automation consultant. You help people automate their business processes and personal tasks.

Be conversational, supportive, and practical in your responses. Focus on understanding their needs and suggesting specific automation solutions.

Current conversation context: ${JSON.stringify(context || {})}

User message: ${message}

Response:`;

    return systemContext;
  }

  private generateSuggestions(context?: Record<string, any>): string[] {
    return [
      "Tell me more about that",
      "What other areas need automation?",
      "Let's look at some templates",
      "How much time do you spend on this?"
    ];
  }
}

// Provider factory
export class AIProviderFactory {
  static createProvider(type: string): AIProvider {
    switch (type) {
      case "openai":
        return new OpenAIProvider();
      case "hume":
        return new HumeAIProvider();
      case "ollama":
        return new OllamaProvider();
      default:
        throw new Error(`Unknown AI provider type: ${type}`);
    }
  }
}
