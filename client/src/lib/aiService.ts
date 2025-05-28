import { AIResponse } from "@/types/chat";

class AIService {
  private baseUrl = "/api";

  async sendMessage(sessionId: string, message: string, provider: string = "hume"): Promise<AIResponse> {
    const response = await fetch(`${this.baseUrl}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sessionId,
        message,
        provider,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to send message: ${response.status}`);
    }

    return response.json();
  }

  async getConversation(sessionId: string) {
    const response = await fetch(`${this.baseUrl}/conversations/${sessionId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // Conversation doesn't exist yet
      }
      throw new Error(`Failed to get conversation: ${response.status}`);
    }

    return response.json();
  }

  async updateProvider(sessionId: string, provider: string) {
    const response = await fetch(`${this.baseUrl}/conversations/${sessionId}/provider`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ provider }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update provider: ${response.status}`);
    }

    return response.json();
  }

  async getTemplates(category?: string) {
    const url = category 
      ? `${this.baseUrl}/templates?category=${category}`
      : `${this.baseUrl}/templates`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Failed to get templates: ${response.status}`);
    }

    return response.json();
  }

  async getTemplate(id: number) {
    const response = await fetch(`${this.baseUrl}/templates/${id}`);
    
    if (!response.ok) {
      throw new Error(`Failed to get template: ${response.status}`);
    }

    return response.json();
  }

  async getProviders() {
    const response = await fetch(`${this.baseUrl}/providers`);
    
    if (!response.ok) {
      throw new Error(`Failed to get providers: ${response.status}`);
    }

    return response.json();
  }
}

export const aiService = new AIService();
