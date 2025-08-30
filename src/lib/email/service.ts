interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

interface EmailProvider {
  send(
    data: EmailData
  ): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Mock email provider for development
class MockEmailProvider implements EmailProvider {
  async send(data: EmailData) {
    console.log("📧 Mock Email Send:", {
      to: data.to,
      subject: data.subject,
      from: data.from || "noreply@autoreachpro.com",
      htmlLength: data.html.length,
    });

    // Simulate email sending delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate success with some failure rate
    const success = Math.random() > 0.1; // 90% success rate

    if (success) {
      return {
        success: true,
        messageId: `mock-${Date.now()}-${Math.random()
          .toString(36)
          .substr(2, 9)}`,
      };
    } else {
      return {
        success: false,
        error: "Mock email sending failed",
      };
    }
  }
}

// Resend provider (requires API key)
class ResendProvider implements EmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(data: EmailData) {
    try {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: data.from || "AutoReachPro <noreply@autoreachpro.com>",
          to: [data.to],
          subject: data.subject,
          html: data.html,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: result.message || "Failed to send email",
        };
      }

      return {
        success: true,
        messageId: result.id,
      };
    } catch (error) {
      console.error("Resend error:", error);
      return {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }
}

// Email service class
export class EmailService {
  private provider: EmailProvider;

  constructor(apiKey?: string) {
    // Use Resend if API key is provided, otherwise use mock provider
    if (apiKey && apiKey.startsWith("re_")) {
      this.provider = new ResendProvider(apiKey);
    } else {
      this.provider = new MockEmailProvider();
    }
  }

  async sendEmail(data: EmailData) {
    return await this.provider.send(data);
  }

  // Send campaign emails
  async sendCampaignEmails(
    leads: Array<{
      id: string;
      email: string;
      first_name?: string;
      last_name?: string;
      company?: string;
    }>,
    template: {
      subject: string;
      content: string;
    },
    personalizedContent?: Record<string, string>
  ) {
    const results = [];

    for (const lead of leads) {
      let personalizedSubject = template.subject;
      let personalizedBody = template.content;

      // Apply personalization if available
      if (personalizedContent && personalizedContent[lead.id]) {
        personalizedBody = personalizedContent[lead.id];
      } else {
        // Basic variable replacement
        const replacements = {
          first_name: lead.first_name || "there",
          last_name: lead.last_name || "",
          company: lead.company || "your company",
          full_name:
            `${lead.first_name || ""} ${lead.last_name || ""}`.trim() ||
            "there",
        };

        Object.entries(replacements).forEach(([key, value]) => {
          const regex = new RegExp(`\\{\\{${key}\\}\\}`, "g");
          personalizedSubject = personalizedSubject.replace(regex, value);
          personalizedBody = personalizedBody.replace(regex, value);
        });
      }

      // Convert content to HTML (basic markdown-like conversion)
      const htmlContent = personalizedBody
        .replace(/\n\n/g, "</p><p>")
        .replace(/\n/g, "<br>")
        .replace(/^/, "<p>")
        .replace(/$/, "</p>");

      try {
        const result = await this.sendEmail({
          to: lead.email,
          subject: personalizedSubject,
          html: htmlContent,
        });

        results.push({
          leadId: lead.id,
          email: lead.email,
          success: result.success,
          messageId: result.messageId,
          error: result.error,
        });

        // Add delay between emails to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      } catch (error) {
        results.push({
          leadId: lead.id,
          email: lead.email,
          success: false,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return results;
  }
}

// Singleton instance
let emailServiceInstance: EmailService | null = null;

export function getEmailService(apiKey?: string): EmailService {
  if (!emailServiceInstance) {
    emailServiceInstance = new EmailService(apiKey);
  }
  return emailServiceInstance;
}
