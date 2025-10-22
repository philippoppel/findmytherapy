import nodemailer from 'nodemailer';
import { env, isProduction } from '@mental-health/config';

type SendMagicLinkParams = {
  email: string;
  url: string;
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
  const transporter = resolveTransport();

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
    await transporter.sendMail({
      to: email,
      from: env.EMAIL_FROM,
      subject: 'Dein Login-Link für FindMyTherapy',
      html,
      text,
    });
  } catch (error) {
    console.error('[email] Failed to send magic link:', error);
    throw new Error('EMAIL_DELIVERY_FAILED');
  }

  if (!isProduction) {
    console.info(`[email] Magic link for ${email}: ${url}`);
  }
};
