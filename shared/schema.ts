import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const conversations = pgTable("conversations", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  userId: text("user_id"),
  currentStep: text("current_step").notNull().default("initial"),
  selectedTemplate: text("selected_template"),
  selectedProvider: text("selected_provider").default("hume"),
  emotionalState: text("emotional_state").default("neutral"),
  configuration: jsonb("configuration").$type<Record<string, any>>().default({}),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  conversationId: integer("conversation_id").references(() => conversations.id).notNull(),
  content: text("content").notNull(),
  role: text("role").notNull(), // "user" | "assistant" | "system"
  emotionalContext: jsonb("emotional_context").$type<Record<string, any>>(),
  voiceAnalysis: jsonb("voice_analysis").$type<Record<string, any>>(),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const templates = pgTable("templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  category: text("category").notNull(), // "business" | "personal"
  subcategory: text("subcategory").notNull(),
  description: text("description").notNull(),
  icon: text("icon").notNull(),
  color: text("color").notNull(),
  timesSaved: text("times_saved").notNull(),
  rating: integer("rating").notNull().default(5),
  userCount: integer("user_count").notNull().default(0),
  configuration: jsonb("configuration").$type<Record<string, any>>().notNull(),
  isActive: boolean("is_active").notNull().default(true),
});

export const aiProviders = pgTable("ai_providers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(), // "ollama" | "hume" | "openai" | "anthropic"
  description: text("description").notNull(),
  capabilities: jsonb("capabilities").$type<string[]>().notNull(),
  isLocal: boolean("is_local").notNull().default(false),
  requiresApiKey: boolean("requires_api_key").notNull().default(true),
  isActive: boolean("is_active").notNull().default(true),
});

export const insertConversationSchema = createInsertSchema(conversations).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  timestamp: true,
});

export const insertTemplateSchema = createInsertSchema(templates).omit({
  id: true,
});

export const insertAiProviderSchema = createInsertSchema(aiProviders).omit({
  id: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertAiProvider = z.infer<typeof insertAiProviderSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type AiProvider = typeof aiProviders.$inferSelect;
