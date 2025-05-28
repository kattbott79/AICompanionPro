import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { AIProviderFactory } from "./ai-providers";
import { insertConversationSchema, insertMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Chat endpoint
  app.post("/api/chat", async (req, res) => {
    try {
      const { sessionId, message, provider = "hume" } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({ error: "Session ID and message are required" });
      }

      // Get or create conversation
      let conversation = await storage.getConversation(sessionId);
      if (!conversation) {
        const newConversation = insertConversationSchema.parse({
          sessionId,
          currentStep: "initial",
          selectedProvider: provider,
          emotionalState: "neutral",
          configuration: {}
        });
        conversation = await storage.createConversation(newConversation);
      }

      // Add user message
      const userMessage = insertMessageSchema.parse({
        conversationId: conversation.id,
        content: message,
        role: "user"
      });
      await storage.addMessage(userMessage);

      // Generate AI response
      const aiProvider = AIProviderFactory.createProvider(conversation.selectedProvider);
      const context = {
        currentStep: conversation.currentStep,
        selectedTemplate: conversation.selectedTemplate,
        emotionalState: conversation.emotionalState,
        ...conversation.configuration
      };

      const aiResponse = await aiProvider.generateResponse(message, context);

      // Add AI response message
      const assistantMessage = insertMessageSchema.parse({
        conversationId: conversation.id,
        content: aiResponse.content,
        role: "assistant",
        emotionalContext: aiResponse.emotionalContext
      });
      await storage.addMessage(assistantMessage);

      // Update conversation state based on message
      const updatedState = await updateConversationState(conversation, message, aiResponse);
      if (updatedState) {
        await storage.updateConversation(sessionId, updatedState);
      }

      res.json({
        response: aiResponse.content,
        suggestions: aiResponse.suggestions || [],
        emotionalContext: aiResponse.emotionalContext,
        conversationState: {
          currentStep: updatedState?.currentStep || conversation.currentStep,
          selectedTemplate: updatedState?.selectedTemplate || conversation.selectedTemplate
        }
      });

    } catch (error) {
      console.error("Chat error:", error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  // Get conversation history
  app.get("/api/conversations/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const conversation = await storage.getConversation(sessionId);
      
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      const messages = await storage.getMessages(conversation.id);
      
      res.json({
        conversation,
        messages
      });
    } catch (error) {
      console.error("Get conversation error:", error);
      res.status(500).json({ error: "Failed to retrieve conversation" });
    }
  });

  // Voice analysis endpoint
  app.post("/api/voice/analyze", async (req, res) => {
    try {
      const { audioData, provider = "hume" } = req.body;

      if (!audioData) {
        return res.status(400).json({ error: "Audio data is required" });
      }

      const aiProvider = AIProviderFactory.createProvider(provider);
      
      if (!aiProvider.analyzeVoice) {
        return res.status(400).json({ error: "Voice analysis not supported by this provider" });
      }

      const audioBuffer = Buffer.from(audioData, 'base64');
      const analysis = await aiProvider.analyzeVoice(audioBuffer);

      res.json(analysis);
    } catch (error) {
      console.error("Voice analysis error:", error);
      res.status(500).json({ error: "Failed to analyze voice" });
    }
  });

  // Get templates
  app.get("/api/templates", async (req, res) => {
    try {
      const { category } = req.query;
      
      let templates;
      if (category && typeof category === "string") {
        templates = await storage.getTemplatesByCategory(category);
      } else {
        templates = await storage.getTemplates();
      }

      res.json(templates);
    } catch (error) {
      console.error("Get templates error:", error);
      res.status(500).json({ error: "Failed to retrieve templates" });
    }
  });

  // Get specific template
  app.get("/api/templates/:id", async (req, res) => {
    try {
      const templateId = parseInt(req.params.id);
      if (isNaN(templateId)) {
        return res.status(400).json({ error: "Invalid template ID" });
      }

      const template = await storage.getTemplate(templateId);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }

      res.json(template);
    } catch (error) {
      console.error("Get template error:", error);
      res.status(500).json({ error: "Failed to retrieve template" });
    }
  });

  // Get AI providers
  app.get("/api/providers", async (req, res) => {
    try {
      const providers = await storage.getActiveAiProviders();
      res.json(providers);
    } catch (error) {
      console.error("Get providers error:", error);
      res.status(500).json({ error: "Failed to retrieve AI providers" });
    }
  });

  // Update conversation provider
  app.patch("/api/conversations/:sessionId/provider", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { provider } = req.body;

      if (!provider) {
        return res.status(400).json({ error: "Provider is required" });
      }

      const conversation = await storage.updateConversation(sessionId, {
        selectedProvider: provider
      });

      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }

      res.json(conversation);
    } catch (error) {
      console.error("Update provider error:", error);
      res.status(500).json({ error: "Failed to update provider" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Helper function to update conversation state based on user interactions
async function updateConversationState(conversation: any, message: string, aiResponse: any): Promise<any> {
  const updates: any = {};

  // Check for option selections
  if (message.includes("Business Automation")) {
    updates.currentStep = "business_selection";
  } else if (message.includes("Personal Life Helper")) {
    updates.currentStep = "personal_selection";
  } else if (message.includes("explore options")) {
    updates.currentStep = "exploration";
  } else if (message.includes("specific in mind")) {
    updates.currentStep = "custom_requirements";
  }

  // Check for template selections
  const templateKeywords = {
    "E-commerce": "ecommerce",
    "Service Business": "service",
    "Restaurant": "restaurant",
    "Content Creator": "content",
    "Daily Productivity": "productivity",
    "Health & Wellness": "health",
    "Financial Management": "finance",
    "Home Management": "home"
  };

  for (const [keyword, templateType] of Object.entries(templateKeywords)) {
    if (message.includes(keyword)) {
      updates.selectedTemplate = templateType;
      updates.currentStep = "template_configuration";
      break;
    }
  }

  // Update emotional state based on AI response
  if (aiResponse.emotionalContext?.detectedEmotion) {
    updates.emotionalState = aiResponse.emotionalContext.detectedEmotion;
  }

  return Object.keys(updates).length > 0 ? updates : null;
}
