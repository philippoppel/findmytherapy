import { sendClientWelcomeEmail, sendTherapistWelcomeEmail } from './email';

type NotificationPayload = Record<string, unknown>;

export async function queueNotification(topic: string, payload: NotificationPayload) {
  if (process.env.NODE_ENV !== 'production') {
    console.info('[notifications:queue]', topic, payload);
  }

  // Handle immediate email notifications
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
    const loginUrl = `${baseUrl}/login`;

    switch (topic) {
      case 'client-registration': {
        const { email, firstName } = payload as {
          email: string;
          firstName?: string;
          userId: string;
          marketingOptIn?: boolean;
        };
        if (email && firstName) {
          await sendClientWelcomeEmail({
            email,
            firstName,
            loginUrl,
          });
        }
        break;
      }
      case 'therapist-registration': {
        const { email, firstName, city } = payload as {
          email: string;
          firstName?: string;
          city?: string;
          userId: string;
        };
        if (email && firstName && city) {
          await sendTherapistWelcomeEmail({
            email,
            firstName,
            city,
            loginUrl,
          });
        }
        break;
      }
      default:
        console.info(`[notifications] Unknown topic: ${topic}`);
    }
  } catch (error) {
    console.error('[notifications] Error sending email:', error);
    // Don't throw - registration should succeed even if email fails
  }

  // TODO(Worker): Replace with BullMQ job enqueue once worker is connected
  return Promise.resolve();
}
