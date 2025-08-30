import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface PersonalizationData {
  firstName: string;
  lastName: string;
  company?: string;
  position?: string;
  industry?: string;
  website?: string;
  linkedinUrl?: string;
  notes?: string;
}

export interface EmailTemplate {
  subject: string;
  content: string;
}

export async function personalizeEmail(
  template: EmailTemplate,
  leadData: PersonalizationData,
  senderName: string = "AutoReachPro Team"
): Promise<{ subject: string; content: string }> {
  try {
    const prompt = `
You are an expert email copywriter specializing in personalized B2B outreach. 

LEAD INFORMATION:
- Name: ${leadData.firstName} ${leadData.lastName}
- Company: ${leadData.company || "Unknown"}
- Position: ${leadData.position || "Unknown"}
- Industry: ${leadData.industry || "Unknown"}
- Website: ${leadData.website || "Not provided"}
- LinkedIn: ${leadData.linkedinUrl || "Not provided"}
- Notes: ${leadData.notes || "None"}

EMAIL TEMPLATE:
Subject: ${template.subject}
Content: ${template.content}

INSTRUCTIONS:
1. Personalize the email subject and content using the lead information
2. Replace placeholder variables like {{first_name}}, {{company}}, etc. with actual data
3. Add 1-2 specific, relevant details about their company/industry that show genuine research
4. Keep the tone professional but warm and conversational
5. Maintain the original structure and call-to-action
6. If information is missing, gracefully work around it without mentioning the gaps
7. Add a personalized reason for reaching out that feels natural and specific
8. Keep the email concise (under 150 words) and action-oriented

Return ONLY a JSON object with "subject" and "content" keys. No other text.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You are an expert email personalization assistant. Return only valid JSON with subject and content keys.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0]?.message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    try {
      const parsed = JSON.parse(response);

      if (!parsed.subject || !parsed.content) {
        throw new Error("Invalid response format from AI");
      }

      return {
        subject: parsed.subject,
        content: parsed.content,
      };
    } catch (parseError) {
      console.error("Failed to parse AI response:", response);

      // Fallback to manual replacement
      return fallbackPersonalization(template, leadData, senderName);
    }
  } catch (error) {
    console.error("AI personalization failed:", error);

    // Fallback to manual replacement
    return fallbackPersonalization(template, leadData, senderName);
  }
}

function fallbackPersonalization(
  template: EmailTemplate,
  leadData: PersonalizationData,
  senderName: string
): { subject: string; content: string } {
  const replacements = {
    "{{first_name}}": leadData.firstName,
    "{{last_name}}": leadData.lastName,
    "{{company}}": leadData.company || "your company",
    "{{position}}": leadData.position || "your role",
    "{{industry}}": leadData.industry || "your industry",
    "{{sender_name}}": senderName,
    "{{personalized_reason}}": leadData.company
      ? `I noticed your role as ${leadData.position || "a professional"} at ${
          leadData.company
        }`
      : `I came across your profile and was impressed by your background`,
    "{{value_proposition}}":
      "our AI-powered outreach automation platform has helped similar companies increase response rates by 300%",
  };

  let personalizedSubject = template.subject;
  let personalizedContent = template.content;

  Object.entries(replacements).forEach(([placeholder, value]) => {
    const regex = new RegExp(placeholder.replace(/[{}]/g, "\\$&"), "g");
    personalizedSubject = personalizedSubject.replace(regex, value);
    personalizedContent = personalizedContent.replace(regex, value);
  });

  return {
    subject: personalizedSubject,
    content: personalizedContent,
  };
}

export async function generateEmailVariations(
  baseTemplate: EmailTemplate,
  leadData: PersonalizationData,
  count: number = 3
): Promise<Array<{ subject: string; content: string; variant: number }>> {
  const variations = [];

  for (let i = 0; i < count; i++) {
    try {
      const personalized = await personalizeEmail(baseTemplate, leadData);
      variations.push({
        ...personalized,
        variant: i + 1,
      });

      // Small delay to avoid rate limiting
      await new Promise((resolve) => setTimeout(resolve, 100));
    } catch (error) {
      console.error(`Failed to generate variation ${i + 1}:`, error);
    }
  }

  return variations;
}
