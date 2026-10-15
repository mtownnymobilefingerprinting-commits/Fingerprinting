import "server-only";
import nodemailer from "nodemailer";
import { siteConfig } from "../../config/site";
import { formatAppointmentTime } from "../bookingEmails";
import { formatCents } from "../pricing";
import type { Order } from "./db";

function transport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) return null;
  const port = Number(SMTP_PORT || 465);
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

export function emailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

async function send(order: Order, subject: string, lines: string[], { copyOwner = false } = {}) {
  const mailer = transport();
  if (!mailer) {
    console.warn(`[email] SMTP not configured; "${subject}" not sent.`);
    return false;
  }
  try {
    await mailer.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER!,
      to: order.customer_email,
      bcc: copyOwner ? process.env.OWNER_NOTIFICATION_EMAIL || undefined : undefined,
      subject,
      text: [...lines, "", `Questions? Call ${siteConfig.phoneDisplay} or reply to this email.`, siteConfig.title].join("\n"),
    });
    return true;
  } catch (error) {
    console.error(`[email] Failed to send "${subject}"`, error);
    return false;
  }
}

/** Sent once the order is both paid and booked. The owner gets a copy. */
export function sendBookingConfirmationEmail(order: Order, startTime: string | null) {
  const when = startTime ? formatAppointmentTime(startTime) : null;
  return send(
    order,
    when ? `Confirmed: your fingerprinting appointment on ${when} (${order.reference})` : `Confirmed: your fingerprinting appointment (${order.reference})`,
    [
      `Hi ${order.customer_name},`,
      "",
      "Your appointment is booked and paid. Here are the details:",
      "",
      `When: ${when ?? "See your Calendly confirmation email for the date and time"}`,
      `Where: ${order.service_address}`,
      `Service: ${order.service_title}${order.people > 1 ? ` for ${order.people} people` : ""}`,
      `Paid: ${formatCents(order.amount_cents)}`,
      `Order: ${order.reference}`,
      "",
      "What to bring:",
      "- A valid photo ID",
      "- The required fingerprint form or your agency's instructions",
      "- Any appointment confirmation from your employer or licensing agency",
      "",
      "Need to reschedule? Use the reschedule link in your Calendly confirmation email, or call us.",
    ],
    { copyOwner: true }
  );
}

/** Sent when a paid order still has no appointment time. */
export function sendBookingReminderEmail(order: Order, scheduleUrl: string, final: boolean) {
  return send(order, `${final ? "Last reminder" : "Reminder"}: choose your appointment time (${order.reference})`, [
    `Hi ${order.customer_name},`,
    "",
    `Thanks for your payment of ${formatCents(order.amount_cents)} for ${order.service_title} (order ${order.reference}).`,
    "",
    "Your appointment isn't booked yet. Please choose your date and time here:",
    scheduleUrl,
    "",
    "You won't be charged again. Keep this link private.",
  ]);
}

/** Re-sends the scheduling link on request (the "Already paid?" page). */
export function sendScheduleLinkEmail(order: Order, scheduleUrl: string) {
  return send(order, `Your link to choose your appointment time (${order.reference})`, [
    `Hi ${order.customer_name},`,
    "",
    `We received your payment of ${formatCents(order.amount_cents)} for ${order.service_title} (order ${order.reference}).`,
    "",
    "Your appointment is not booked yet. Choose your date and time here:",
    scheduleUrl,
    "",
    "Keep this link private. You can use it again if you close the page — you will not be charged again.",
  ]);
}
