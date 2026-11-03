/**
 * Email Notification Service
 *
 * Sends contact form notifications to site admins.
 * - If SMTP is configured, emails are sent via nodemailer.
 * - If SMTP is not configured, emails are logged to console and stored in the database.
 */

import nodemailer from 'nodemailer';
import { site } from '@/config/site';
import { db } from '@/lib/db';

// ─── Types ──────────────────────────────────────────────────────────────────────

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string | null;
  institution: string;
  numberOfStudents?: string | null;
  city: string;
  currentSoftware?: string | null;
  message?: string | null;
}

export interface EmailResult {
  success: boolean;
  method: 'smtp' | 'console';
  messageId?: string;
  error?: string;
}

// ─── Configuration ──────────────────────────────────────────────────────────────

const SMTP_HOST = process.env.SMTP_HOST || '';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '587', 10);
const SMTP_USER = process.env.SMTP_USER || '';
const SMTP_PASS = process.env.SMTP_PASS || '';
const NOTIFICATION_EMAIL = process.env.NOTIFICATION_EMAIL || site.leadEmail;
const SITE_NAME = process.env.SITE_NAME || 'ChaloSchools';

export function isSmtpConfigured(): boolean {
  return !!(SMTP_HOST && SMTP_USER && SMTP_PASS);
}

// ─── Transport Layer (Pluggable) ────────────────────────────────────────────────

export interface EmailTransport {
  send(mailOptions: nodemailer.SendMailOptions): Promise<string>;
}

/**
 * SMTP transport using nodemailer.
 */
class SmtpTransport implements EmailTransport {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  async send(mailOptions: nodemailer.SendMailOptions): Promise<string> {
    const info = await this.transporter.sendMail(mailOptions);
    return info.messageId;
  }
}

/**
 * Console transport — logs the email to console for development.
 */
class ConsoleTransport implements EmailTransport {
  async send(mailOptions: nodemailer.SendMailOptions): Promise<string> {
    const separator = '═'.repeat(60);
    console.log('\n' + separator);
    console.log('📧 EMAIL NOTIFICATION (Console Transport)');
    console.log(separator);
    console.log('From:', mailOptions.from);
    console.log('To:', mailOptions.to);
    if (mailOptions.replyTo) console.log('Reply-To:', mailOptions.replyTo);
    console.log('Subject:', mailOptions.subject);
    console.log('─'.repeat(60));
    if (typeof mailOptions.html === 'string') {
      // Strip HTML tags for console readability
      const plainText = mailOptions.html
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/p>/gi, '\n')
        .replace(/<\/li>/gi, '\n')
        .replace(/<\/tr>/gi, '\n')
        .replace(/<\/h[1-6]>/gi, '\n')
        .replace(/<li>/gi, '  • ')
        .replace(/<[^>]*>/g, '')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#x27;/g, "'")
        .replace(/\n{3,}/g, '\n\n')
        .trim();
      console.log(plainText);
    } else if (typeof mailOptions.text === 'string') {
      console.log(mailOptions.text);
    }
    console.log(separator + '\n');
    return 'console-log-' + Date.now();
  }
}

// ─── Email Formatting ───────────────────────────────────────────────────────────

function formatContactEmail(data: ContactFormData): nodemailer.SendMailOptions {
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const emailSubject = `[${SITE_NAME}] New Demo Request — ${data.institution}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .field-group { margin-bottom: 20px; }
    .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600; margin-bottom: 4px; }
    .field-value { font-size: 16px; color: #111827; padding: 10px 14px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; }
    .field-value.message { min-height: 80px; white-space: pre-wrap; }
    .footer { background: #f3f4f6; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center; font-size: 13px; color: #6b7280; }
    .footer a { color: #d97706; text-decoration: none; }
    .divider { height: 1px; background: #e5e7eb; margin: 20px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📩 New Demo Request</h1>
      <p>Received on ${submittedAt}</p>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="field-label">From</div>
        <div class="field-value">${data.name} (${data.email})</div>
      </div>
      <div class="field-group">
        <div class="field-label">Institution</div>
        <div class="field-value">${data.institution}</div>
      </div>
      <div class="field-group">
        <div class="field-label">City</div>
        <div class="field-value">${data.city}</div>
      </div>
      ${data.phone ? `
      <div class="field-group">
        <div class="field-label">Phone</div>
        <div class="field-value">${data.phone}</div>
      </div>
      ` : ''}
      ${data.numberOfStudents ? `
      <div class="field-group">
        <div class="field-label">Number of Students</div>
        <div class="field-value">${data.numberOfStudents}</div>
      </div>
      ` : ''}
      ${data.currentSoftware ? `
      <div class="field-group">
        <div class="field-label">Current Software</div>
        <div class="field-value">${data.currentSoftware}</div>
      </div>
      ` : ''}
      ${data.message ? `
      <div class="divider"></div>
      <div class="field-group">
        <div class="field-label">Additional Notes</div>
        <div class="field-value message">${data.message}</div>
      </div>
      ` : ''}
    </div>
    <div class="footer">
      <p>This email was sent from the ${SITE_NAME} contact form.</p>
      <p>Reply directly to this email to respond to the inquiry.</p>
    </div>
  </div>
</body>
</html>`;

  const textBody = `
New Demo Request
Received: ${submittedAt}

From: ${data.name} (${data.email})
Institution: ${data.institution}
City: ${data.city}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.numberOfStudents ? `Number of Students: ${data.numberOfStudents}` : ''}
${data.currentSoftware ? `Current Software: ${data.currentSoftware}` : ''}
${data.message ? `\nAdditional Notes:\n${data.message}` : ''}
---

This email was sent from the ${SITE_NAME} contact form.
Reply directly to this email to respond to the inquiry.
`.trim();

  return {
    from: `"${SITE_NAME}" <${SMTP_USER || 'noreply@chaloschools.com'}>`,
    to: NOTIFICATION_EMAIL,
    replyTo: data.email,
    subject: emailSubject,
    html: htmlBody,
    text: textBody,
  };
}

// ─── Public API ─────────────────────────────────────────────────────────────────

/**
 * Send a contact form notification email.
 */
export async function sendContactNotification(
  data: ContactFormData
): Promise<EmailResult> {
  const mailOptions = formatContactEmail(data);

  // Determine which transport to use
  const transport: EmailTransport = isSmtpConfigured()
    ? new SmtpTransport()
    : new ConsoleTransport();

  const method: 'smtp' | 'console' = isSmtpConfigured() ? 'smtp' : 'console';

  try {
    const messageId = await transport.send(mailOptions);

    if (!isSmtpConfigured()) {
      console.log(
        `[Email] SMTP not configured. Email logged above. To enable SMTP, set SMTP_HOST, SMTP_USER, and SMTP_PASS in .env`
      );
    }

    return { success: true, method, messageId };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Email] Failed to send notification (${method}):`, errorMessage);

    // Fallback: log to console if SMTP fails
    if (method === 'smtp') {
      console.log('[Email] Falling back to console logging...');
      try {
        const fallbackTransport = new ConsoleTransport();
        await fallbackTransport.send(mailOptions);
      } catch {
        // If even console logging fails, we still have the DB record
      }
    }

    return { success: false, method, error: errorMessage };
  }
}

/**
 * Store a contact submission in the database.
 */
export async function storeContactSubmission(data: ContactFormData): Promise<string> {
  const record = await db.contactSubmission.create({
    data: {
      name: data.name,
      email: data.email,
      phone: data.phone || null,
      institution: data.institution,
      numberOfStudents: data.numberOfStudents || null,
      city: data.city,
      currentSoftware: data.currentSoftware || null,
      message: data.message || null,
      status: 'new',
    },
  });
  return record.id;
}

// ─── WhatsApp Lead Capture ────────────────────────────────────────────────────────

export interface WhatsAppLeadData {
  name: string;
  phone: string;
  school?: string | null;
}

function formatWhatsAppLeadEmail(data: WhatsAppLeadData): nodemailer.SendMailOptions {
  const submittedAt = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short',
  });

  const emailSubject = `[${SITE_NAME}] New WhatsApp Lead — ${data.name}`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; background-color: #f9fafb; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #25D366 0%, #1da851 100%); color: white; padding: 30px; border-radius: 12px 12px 0 0; }
    .header h1 { margin: 0; font-size: 24px; font-weight: 700; }
    .header p { margin: 8px 0 0; opacity: 0.9; font-size: 14px; }
    .content { background: white; padding: 30px; border: 1px solid #e5e7eb; border-top: none; }
    .field-group { margin-bottom: 20px; }
    .field-label { font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: #6b7280; font-weight: 600; margin-bottom: 4px; }
    .field-value { font-size: 16px; color: #111827; padding: 10px 14px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; }
    .footer { background: #f3f4f6; padding: 20px 30px; border-radius: 0 0 12px 12px; text-align: center; font-size: 13px; color: #6b7280; }
    .note { background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; font-size: 13px; color: #92400e; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>💬 New WhatsApp Lead</h1>
      <p>Received on ${submittedAt}</p>
    </div>
    <div class="content">
      <div class="field-group">
        <div class="field-label">Name</div>
        <div class="field-value">${data.name}</div>
      </div>
      <div class="field-group">
        <div class="field-label">Phone / WhatsApp Number</div>
        <div class="field-value">${data.phone}</div>
      </div>
      ${data.school ? `
      <div class="field-group">
        <div class="field-label">School</div>
        <div class="field-value">${data.school}</div>
      </div>
      ` : ''}
      <div class="note">
        This person clicked the WhatsApp button on the website and provided their details before being redirected to WhatsApp. They may or may not have sent a message yet — check WhatsApp directly, and update this lead's status in the admin Leads page once you've made contact.
      </div>
    </div>
    <div class="footer">
      Tracked in the ${SITE_NAME} admin panel under Leads (source: WhatsApp).
    </div>
  </div>
</body>
</html>`;

  const textBody = `
New WhatsApp Lead
Received: ${submittedAt}

Name: ${data.name}
Phone: ${data.phone}
${data.school ? `School: ${data.school}` : ''}

This person clicked the WhatsApp button and provided their details before redirecting to WhatsApp. Update this lead's status in the admin Leads page once you've made contact.
`.trim();

  return {
    from: `"${SITE_NAME}" <${SMTP_USER || 'noreply@chaloschools.com'}>`,
    to: NOTIFICATION_EMAIL,
    subject: emailSubject,
    html: htmlBody,
    text: textBody,
  };
}

/**
 * Send a notification email for a new WhatsApp lead.
 */
export async function sendWhatsAppLeadNotification(data: WhatsAppLeadData): Promise<EmailResult> {
  const mailOptions = formatWhatsAppLeadEmail(data);

  const transport: EmailTransport = isSmtpConfigured() ? new SmtpTransport() : new ConsoleTransport();
  const method: 'smtp' | 'console' = isSmtpConfigured() ? 'smtp' : 'console';

  try {
    const messageId = await transport.send(mailOptions);
    return { success: true, method, messageId };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[Email] Failed to send WhatsApp lead notification (${method}):`, errorMessage);

    if (method === 'smtp') {
      try {
        await new ConsoleTransport().send(mailOptions);
      } catch {
        // If even console logging fails, we still have the DB record
      }
    }

    return { success: false, method, error: errorMessage };
  }
}

/**
 * Store a WhatsApp lead in the database (same table as the main contact form,
 * distinguished by source: 'whatsapp').
 */
export async function storeWhatsAppLead(data: WhatsAppLeadData): Promise<string> {
  const record = await db.contactSubmission.create({
    data: {
      name: data.name,
      phone: data.phone,
      institution: data.school || null,
      status: 'new',
      source: 'whatsapp',
    },
  });
  return record.id;
}
