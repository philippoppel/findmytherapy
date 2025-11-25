import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import { env, isProduction } from '@mental-health/config';

type SendMagicLinkParams = {
  email: string;
  url: string;
};

// Helper to check if we should use Resend (evaluated at runtime)
const shouldUseResend = () => {
  const hasApiKey = Boolean(process.env.RESEND_API_KEY || env.RESEND_API_KEY);
  console.log('[email] Checking Resend availability:', {
    hasApiKey,
    RESEND_API_KEY_length: process.env.RESEND_API_KEY?.length || 0,
    isProduction,
  });
  return hasApiKey;
};

// Helper to get Resend client (evaluated at runtime)
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY || env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error('RESEND_API_KEY not available');
  }
  return new Resend(apiKey);
};

const resolveTransport = () => {
  const host = env.EMAIL_SMTP_HOST;
  const port = env.EMAIL_SMTP_PORT;
  const user = env.EMAIL_SMTP_USER;
  const pass = env.EMAIL_SMTP_PASS;

  const hasAuth = Boolean(user && pass);

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: hasAuth
      ? {
          user,
          pass,
        }
      : undefined,
    ignoreTLS: !isProduction && port !== 465,
  });
};

export const sendMagicLinkEmail = async ({ email, url }: SendMagicLinkParams) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.5;">
      <h2>Login-Link für FindMyTherapy</h2>
      <p>Hallo,</p>
      <p>über den folgenden Button kannst du dich sicher bei FindMyTherapy anmelden:</p>
      <p style="margin: 24px 0;">
        <a href="${url}" style="background-color:#0F766E;color:#ffffff;padding:12px 20px;border-radius:6px;text-decoration:none;font-weight:bold;">
          Jetzt anmelden
        </a>
      </p>
      <p>Der Link ist nur für kurze Zeit gültig. Wenn du die Anmeldung nicht angefordert hast, kannst du diese E-Mail ignorieren.</p>
      <p style="margin-top:32px;">Beste Grüße<br/>Dein FindMyTherapy Team</p>
    </div>
  `;

  const text = `Login-Link für FindMyTherapy\n\nÖffne folgenden Link in deinem Browser, um dich anzumelden:\n${url}\n\nDer Link ist nur für kurze Zeit gültig. Wenn du diese Anmeldung nicht angefordert hast, kannst du diese E-Mail ignorieren.`;

  try {
    if (shouldUseResend()) {
      const resend = getResendClient();
      console.log('[email] Sending via Resend to:', email);
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Dein Login-Link für FindMyTherapy',
        html,
        text,
      });
      console.log('[email] ✓ Sent via Resend');
    } else {
      console.log('[email] Sending via SMTP to:', email);
      const transporter = resolveTransport();
      await transporter.sendMail({
        to: email,
        from: env.EMAIL_FROM,
        subject: 'Dein Login-Link für FindMyTherapy',
        html,
        text,
      });
      console.log('[email] ✓ Sent via SMTP');
    }
  } catch (error) {
    console.error('[email] Failed to send magic link:', error);
    throw new Error('EMAIL_DELIVERY_FAILED');
  }

  if (!isProduction) {
    console.info(`[email] Magic link for ${email}: ${url}`);
  }
};

type SendClientWelcomeParams = {
  email: string;
  firstName: string;
  loginUrl: string;
};

export const sendClientWelcomeEmail = async ({
  email,
  firstName,
  loginUrl,
}: SendClientWelcomeParams) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0F766E; font-size: 24px; margin-bottom: 20px;">Willkommen bei FindMyTherapy!</h1>
        <p>Hallo ${firstName},</p>
        <p>vielen Dank für deine Registrierung bei FindMyTherapy. Dein Account wurde erfolgreich erstellt.</p>
        <p><strong>Was dich erwartet:</strong></p>
        <ul style="line-height: 1.8;">
          <li>Zugang zu empfohlenen Programmen und Kursen</li>
          <li>Persönliche Empfehlungen aus der Ersteinschätzung</li>
          <li>Direkter Kontakt zum Care-Team</li>
          <li>Therapeuten-Vermittlung bei Bedarf</li>
        </ul>
        <p style="margin: 32px 0;">
          <a href="${loginUrl}" style="background-color:#0F766E;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
            Jetzt anmelden
          </a>
        </p>
        <p style="color: #666; font-size: 14px;">Deine Daten sind bei uns sicher und werden DSGVO-konform verarbeitet.</p>
        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        <p style="color: #666; font-size: 14px;">
          Bei Fragen erreichst du uns unter <a href="mailto:support@findmytherapy.net" style="color: #0F766E;">support@findmytherapy.net</a>
        </p>
        <p style="margin-top: 32px;">Beste Grüße<br/><strong>Dein FindMyTherapy Team</strong></p>
      </div>
    </div>
  `;

  const text = `Willkommen bei FindMyTherapy!

Hallo ${firstName},

vielen Dank für deine Registrierung bei FindMyTherapy. Dein Account wurde erfolgreich erstellt.

Was dich erwartet:
- Zugang zu empfohlenen Programmen und Kursen
- Persönliche Empfehlungen aus der Ersteinschätzung
- Direkter Kontakt zum Care-Team
- Therapeuten-Vermittlung bei Bedarf

Jetzt anmelden: ${loginUrl}

Deine Daten sind bei uns sicher und werden DSGVO-konform verarbeitet.

Bei Fragen erreichst du uns unter support@findmytherapy.net

Beste Grüße
Dein FindMyTherapy Team`;

  try {
    if (shouldUseResend()) {
      const resend = getResendClient();
      console.log('[email] Sending client welcome via Resend to:', email);
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Willkommen bei FindMyTherapy - Dein Account ist bereit',
        html,
        text,
      });
      console.log('[email] ✓ Sent client welcome via Resend');
    } else {
      console.log('[email] Sending client welcome via SMTP to:', email);
      const transporter = resolveTransport();
      await transporter.sendMail({
        to: email,
        from: env.EMAIL_FROM,
        subject: 'Willkommen bei FindMyTherapy - Dein Account ist bereit',
        html,
        text,
      });
      console.log('[email] ✓ Sent client welcome via SMTP');
    }
  } catch (error) {
    console.error('[email] Failed to send client welcome email:', error);
    throw new Error('EMAIL_DELIVERY_FAILED');
  }

  if (!isProduction) {
    console.info(`[email] Client welcome email sent to ${email}`);
  }
};

type SendTherapistWelcomeParams = {
  email: string;
  firstName: string;
  city: string;
  loginUrl: string;
};

export const sendTherapistWelcomeEmail = async ({
  email,
  firstName,
  city,
  loginUrl,
}: SendTherapistWelcomeParams) => {
  const html = `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #0F766E; font-size: 24px; margin-bottom: 20px;">Vielen Dank für deine Registrierung!</h1>
        <p>Hallo ${firstName},</p>
        <p>willkommen im FindMyTherapy Pilot-Programm! Wir haben deine Registrierung für den Standort <strong>${city}</strong> erhalten und werden dein Profil in Kürze prüfen.</p>

        <div style="background-color: #f0fdfa; border-left: 4px solid #0F766E; padding: 16px; margin: 24px 0;">
          <h3 style="margin-top: 0; color: #0F766E; font-size: 16px;">Nächste Schritte</h3>
          <ol style="margin: 0; padding-left: 20px; line-height: 1.8;">
            <li>Wir prüfen dein Profil (werktags innerhalb von 24 Stunden)</li>
            <li>Du erhältst Zugang zum Pilot-Dashboard</li>
            <li>Wir senden dir Infos zum Listing und zur Verifizierung</li>
            <li>Optional: Gemeinsamer Walkthrough oder aufgezeichnete Tour</li>
          </ol>
        </div>

        <p><strong>Dein Profil beinhaltet:</strong></p>
        <ul style="line-height: 1.8;">
          <li>Therapeuten-Dashboard mit Terminverwaltung</li>
          <li>Öffentliches Listing für Klient:innen</li>
          <li>Kommunikationstools und Notfallhinweise</li>
          <li>Zugang zu Compliance-Unterlagen</li>
        </ul>

        <p style="margin: 32px 0;">
          <a href="${loginUrl}" style="background-color:#0F766E;color:#ffffff;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;display:inline-block;">
            Zum Dashboard
          </a>
        </p>

        <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin: 24px 0;">
          <p style="margin: 0; font-size: 14px;"><strong>Wichtig:</strong> Dein Profil ist noch nicht öffentlich sichtbar und wird erst nach der Freischaltung aktiviert.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
        <p style="color: #666; font-size: 14px;">
          Bei Fragen oder für einen Walkthrough-Termin kontaktiere uns unter <a href="mailto:support@findmytherapy.net" style="color: #0F766E;">support@findmytherapy.net</a>
        </p>
        <p style="margin-top: 32px;">Beste Grüße<br/><strong>Dein FindMyTherapy Team</strong></p>
      </div>
    </div>
  `;

  const text = `Vielen Dank für deine Registrierung!

Hallo ${firstName},

willkommen im FindMyTherapy Pilot-Programm! Wir haben deine Registrierung für den Standort ${city} erhalten und werden dein Profil in Kürze prüfen.

Nächste Schritte:
1. Wir prüfen dein Profil (werktags innerhalb von 24 Stunden)
2. Du erhältst Zugang zum Pilot-Dashboard
3. Wir senden dir Infos zum Listing und zur Verifizierung
4. Optional: Gemeinsamer Walkthrough oder aufgezeichnete Tour

Dein Profil beinhaltet:
- Therapeuten-Dashboard mit Terminverwaltung
- Öffentliches Listing für Klient:innen
- Kommunikationstools und Notfallhinweise
- Zugang zu Compliance-Unterlagen

Zum Dashboard: ${loginUrl}

WICHTIG: Dein Profil ist noch nicht öffentlich sichtbar und wird erst nach der Freischaltung aktiviert.

Bei Fragen oder für einen Walkthrough-Termin kontaktiere uns unter support@findmytherapy.net

Beste Grüße
Dein FindMyTherapy Team`;

  try {
    if (shouldUseResend()) {
      const resend = getResendClient();
      console.log('[email] Sending therapist welcome via Resend to:', email);
      await resend.emails.send({
        from: env.EMAIL_FROM,
        to: email,
        subject: 'Willkommen im FindMyTherapy Pilot - Nächste Schritte',
        html,
        text,
      });
      console.log('[email] ✓ Sent therapist welcome via Resend');
    } else {
      console.log('[email] Sending therapist welcome via SMTP to:', email);
      const transporter = resolveTransport();
      await transporter.sendMail({
        to: email,
        from: env.EMAIL_FROM,
        subject: 'Willkommen im FindMyTherapy Pilot - Nächste Schritte',
        html,
        text,
      });
      console.log('[email] ✓ Sent therapist welcome via SMTP');
    }
  } catch (error) {
    console.error('[email] Failed to send therapist welcome email:', error);
    throw new Error('EMAIL_DELIVERY_FAILED');
  }

  if (!isProduction) {
    console.info(`[email] Therapist welcome email sent to ${email}`);
  }
};
