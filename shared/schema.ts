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
  category: text("category").notNull(), // "business" | "personal" | "healthcare"
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

// Universal Mental Health Automation Schema
export const mentalHealthSessions = pgTable("mental_health_sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  clientIdentifier: text("client_identifier").notNull(), // flexible - can be any EMR's client ID
  providerIdentifier: text("provider_identifier").notNull(),
  sessionDate: timestamp("session_date").notNull(),
  sessionType: text("session_type").notNull(), // individual, group, family, etc.
  sessionDuration: integer("session_duration"), // minutes
  rawNotes: text("raw_notes").notNull(),
  aiProcessedNotes: jsonb("ai_processed_notes").$type<{
    soapFormat: {
      subjective: string;
      objective: string;
      assessment: string;
      plan: string;
    };
    keyInsights: string[];
    riskFactors: string[];
    progressNotes: string;
    nextSessionGoals: string[];
  }>(),
  diagnoses: text("diagnoses").array(),
  interventions: text("interventions").array(),
  emrIntegration: jsonb("emr_integration").$type<{
    emrSystem: string; // "SimplePractice", "TherapyNotes", "TheraNest", "Epic", etc.
    emrSessionId?: string;
    syncStatus: "pending" | "synced" | "failed";
    lastSyncAt?: string;
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insuranceClaimsAutomation = pgTable("insurance_claims_automation", {
  id: serial("id").primaryKey(),
  claimId: text("claim_id").notNull().unique(),
  sessionId: text("session_id").references(() => mentalHealthSessions.sessionId).notNull(),
  clientIdentifier: text("client_identifier").notNull(),
  providerIdentifier: text("provider_identifier").notNull(),
  serviceDate: timestamp("service_date").notNull(),
  cptCode: text("cpt_code").notNull(), // procedure code
  icdCode: text("icd_code").notNull(), // diagnosis code
  chargeAmount: text("charge_amount").notNull(), // decimal as text for precision
  payerInfo: jsonb("payer_info").$type<{
    payerId: string;
    payerName: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberId: string;
  }>(),
  cms1500Data: jsonb("cms1500_data").$type<Record<string, any>>(),
  claimStatus: text("claim_status").notNull().default("draft"), // draft, submitted, processing, paid, denied, resubmitted
  submissionData: jsonb("submission_data").$type<{
    submittedAt?: string;
    submissionMethod: "electronic" | "paper" | "clearinghouse";
    batchId?: string;
    confirmationNumber?: string;
  }>(),
  rejectionInfo: jsonb("rejection_info").$type<{
    rejectionCode: string;
    rejectionReason: string;
    rejectionDate: string;
    aiSuggestedFix: string;
    resubmissionPlan: string[];
  }>(),
  paymentInfo: jsonb("payment_info").$type<{
    paidAmount?: string;
    paidDate?: string;
    eobReceived?: boolean;
    adjustments?: Array<{
      code: string;
      description: string;
      amount: string;
    }>;
  }>(),
  aiInsights: jsonb("ai_insights").$type<{
    riskScore: number; // 0-100, likelihood of denial
    recommendations: string[];
    optimizations: string[];
  }>(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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

export const insertMentalHealthSessionSchema = createInsertSchema(mentalHealthSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertInsuranceClaimSchema = createInsertSchema(insuranceClaimsAutomation).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertConversation = z.infer<typeof insertConversationSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type InsertTemplate = z.infer<typeof insertTemplateSchema>;
export type InsertAiProvider = z.infer<typeof insertAiProviderSchema>;
export type InsertMentalHealthSession = z.infer<typeof insertMentalHealthSessionSchema>;
export type InsertInsuranceClaim = z.infer<typeof insertInsuranceClaimSchema>;

export type Conversation = typeof conversations.$inferSelect;
export type Message = typeof messages.$inferSelect;
export type Template = typeof templates.$inferSelect;
export type AiProvider = typeof aiProviders.$inferSelect;
export type MentalHealthSession = typeof mentalHealthSessions.$inferSelect;
export type InsuranceClaim = typeof insuranceClaimsAutomation.$inferSelect;
