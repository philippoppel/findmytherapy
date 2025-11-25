/**
 * Email template for therapist lead notification
 */

export interface LeadEmailData {
  therapistName: string;
  therapistEmail: string;
  leadName: string;
  leadEmail: string;
  leadPhone?: string;
  leadMessage: string;
  micrositeUrl: string;
  leadsUrl: string;
}

export function generateLeadNotificationEmail(data: LeadEmailData): {
  subject: string;
  html: string;
  text: string;
} {
  const subject = `Neue Kontaktanfrage von ${data.leadName}`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f5f5f5;
    }
    .container {
      background-color: #ffffff;
      border-radius: 8px;
      padding: 30px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      padding-bottom: 20px;
      border-bottom: 2px solid #14b8a6;
      margin-bottom: 30px;
    }
    .header h1 {
      color: #14b8a6;
      margin: 0;
      font-size: 24px;
    }
    .content {
      margin-bottom: 30px;
    }
    .lead-info {
      background-color: #f0fdfa;
      border-left: 4px solid #14b8a6;
      padding: 15px;
      margin: 20px 0;
      border-radius: 4px;
    }
    .lead-info h3 {
      margin-top: 0;
      color: #0f766e;
    }
    .lead-info p {
      margin: 8px 0;
    }
    .message-box {
      background-color: #f9fafb;
      padding: 15px;
      border-radius: 4px;
      margin: 15px 0;
      border: 1px solid #e5e7eb;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(to right, #14b8a6, #06b6d4);
      color: white;
      text-decoration: none;
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: 600;
      margin: 10px 5px;
      box-shadow: 0 2px 4px rgba(20, 184, 166, 0.3);
    }
    .footer {
      text-align: center;
      padding-top: 20px;
      border-top: 1px solid #e5e7eb;
      color: #6b7280;
      font-size: 14px;
      margin-top: 30px;
    }
    .footer a {
      color: #14b8a6;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎉 Neue Kontaktanfrage!</h1>
      <p style="color: #6b7280; margin: 10px 0 0 0;">Sie haben eine neue Anfrage über Ihre Microsite erhalten</p>
    </div>

    <div class="content">
      <p>Hallo ${data.therapistName},</p>
      <p>Sie haben eine neue Kontaktanfrage über Ihre FindMyTherapy Microsite erhalten:</p>

      <div class="lead-info">
        <h3>📬 Kontaktdaten</h3>
        <p><strong>Name:</strong> ${data.leadName}</p>
        <p><strong>Email:</strong> <a href="mailto:${data.leadEmail}">${data.leadEmail}</a></p>
        ${data.leadPhone ? `<p><strong>Telefon:</strong> ${data.leadPhone}</p>` : ''}
      </div>

      <div class="message-box">
        <p><strong>Nachricht:</strong></p>
        <p>${data.leadMessage.replace(/\n/g, '<br>')}</p>
      </div>

      <p style="margin-top: 30px;">
        <strong>Nächste Schritte:</strong>
      </p>
      <ul style="color: #4b5563;">
        <li>Antworten Sie direkt auf diese Email oder kontaktieren Sie ${data.leadName} über die angegebenen Kontaktdaten</li>
        <li>Verwalten Sie alle Ihre Anfragen im Dashboard</li>
        <li>Markieren Sie die Anfrage als "Kontaktiert" oder "Konvertiert"</li>
      </ul>

      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.leadsUrl}" class="cta-button">
          Zu meinen Anfragen
        </a>
        <a href="${data.micrositeUrl}" class="cta-button" style="background: linear-gradient(to right, #6b7280, #9ca3af);">
          Meine Microsite ansehen
        </a>
      </div>
    </div>

    <div class="footer">
      <p>Diese Email wurde automatisch generiert.</p>
      <p>Sie können direkt auf diese Email antworten, um ${data.leadName} zu kontaktieren.</p>
      <p style="margin-top: 15px;">
        <a href="${data.leadsUrl}">Anfragen verwalten</a> •
        <a href="${data.micrositeUrl}">Microsite anzeigen</a>
      </p>
      <p style="margin-top: 20px; color: #9ca3af;">
        © ${new Date().getFullYear()} FindMyTherapy. Alle Rechte vorbehalten.
      </p>
    </div>
  </div>
</body>
</html>
  `;

  const text = `
Neue Kontaktanfrage von ${data.leadName}

Hallo ${data.therapistName},

Sie haben eine neue Kontaktanfrage über Ihre FindMyTherapy Microsite erhalten:

KONTAKTDATEN:
Name: ${data.leadName}
Email: ${data.leadEmail}
${data.leadPhone ? `Telefon: ${data.leadPhone}` : ''}

NACHRICHT:
${data.leadMessage}

NÄCHSTE SCHRITTE:
- Antworten Sie direkt auf diese Email oder kontaktieren Sie ${data.leadName} über die angegebenen Kontaktdaten
- Verwalten Sie alle Ihre Anfragen im Dashboard: ${data.leadsUrl}
- Markieren Sie die Anfrage als "Kontaktiert" oder "Konvertiert"

---
Ihre Microsite: ${data.micrositeUrl}
Anfragen verwalten: ${data.leadsUrl}

© ${new Date().getFullYear()} FindMyTherapy
  `;

  return { subject, html, text };
}
