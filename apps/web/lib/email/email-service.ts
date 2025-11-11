/**
 * Email Service - Abstract layer for sending emails
 * Supports multiple providers (Resend, SendGrid, Console for dev)
 */

export interface EmailOptions {
  to: string | string[];
  from?: string;
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

export interface EmailProvider {
  send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }>;
}

// Console provider for development (logs emails instead of sending)
class ConsoleEmailProvider implements EmailProvider {
  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string }> {
    console.log('📧 [EMAIL - DEV MODE]');
    console.log('To:', options.to);
    console.log('From:', options.from);
    console.log('Subject:', options.subject);
    console.log('ReplyTo:', options.replyTo);
    console.log('---');
    console.log(options.html);
    console.log('---\n');

    return {
      success: true,
      messageId: `dev-${Date.now()}`,
    };
  }
}

// Resend provider (when configured)
class ResendEmailProvider implements EmailProvider {
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async send(options: EmailOptions): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          from: options.from || 'FindMyTherapy <noreply@findmytherapy.com>',
          to: Array.isArray(options.to) ? options.to : [options.to],
          subject: options.subject,
          html: options.html,
          text: options.text,
          reply_to: options.replyTo,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'Failed to send email',
        };
      }

      return {
        success: true,
        messageId: data.id,
      };
    } catch (error) {
      console.error('Resend email error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}

// Factory to get the configured email provider
export function getEmailProvider(): EmailProvider {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (resendApiKey) {
    return new ResendEmailProvider(resendApiKey);
  }

  // Fallback to console provider for development
  return new ConsoleEmailProvider();
}

// Main email sending function
export async function sendEmail(options: EmailOptions): Promise<{ success: boolean; error?: string }> {
  const provider = getEmailProvider();
  const result = await provider.send(options);

  if (!result.success) {
    console.error('Failed to send email:', result.error);
  }

  return result;
}
