import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const SYSTEM_PROMPTS = {
  EMAIL_PERSONALIZATION: `You are an AI assistant specialized in creating personalized email content for client outreach. 
  Your task is to generate compelling, professional, and personalized emails based on the provided lead information and campaign context.
  
  Guidelines:
  - Keep emails concise and focused (150-300 words)
  - Use a professional but conversational tone
  - Include specific details about the recipient's business or industry when available
  - Create clear call-to-actions
  - Avoid overly salesy language
  - Personalize the subject line and opening
  
  Always format your response as JSON with the following structure:
  {
    "subject": "Personalized subject line",
    "content": "Email body content with personalization"
  }`,

  LEAD_ENRICHMENT: `You are an AI assistant that enriches lead data by analyzing available information and suggesting additional data points.
  Based on the provided lead information, suggest relevant business insights, potential pain points, and engagement opportunities.
  
  Format your response as JSON:
  {
    "insights": ["insight1", "insight2"],
    "painPoints": ["pain1", "pain2"],
    "opportunities": ["opp1", "opp2"],
    "recommendedApproach": "strategy suggestion"
  }`,
};
