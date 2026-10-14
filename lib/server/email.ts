import "server-only";
import nodemailer from "nodemailer";
import { siteConfig } from "../../config/site";
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

/** Sends the "you've paid — now pick your time" link. Returns false if email isn't configured or fails. */
export async function sendScheduleLinkEmail(order: Order, scheduleUrl: string) {
  const mailer = transport();
  if (!mailer) {
    console.warn(`[email] SMTP not configured; schedule link for ${order.reference} not emailed.`);
    return false;
  }

  const from = process.env.EMAIL_FROM || process.env.SMTP_USER!;
  const text = [
    `Hi ${order.customer_name},`,
    "",
    `We received your payment of ${formatCents(order.amount_cents)} for ${order.service_title} (order ${order.reference}).`,
    "",
    "Your appointment is not booked yet. Choose your date and time here:",
    scheduleUrl,
    "",
    "Keep this link private. You can use it again if you close the page — you will not be charged again.",
    "",
    `Questions? Call ${siteConfig.phoneDisplay} or reply to this email.`,
    siteConfig.title,
  ].join("\n");

  try {
    await mailer.sendMail({
      from,
      to: order.customer_email,
      bcc: process.env.OWNER_NOTIFICATION_EMAIL || undefined,
      subject: `Next step: choose your appointment time (${order.reference})`,
      text,
    });
    return true;
  } catch (error) {
    console.error(`[email] Failed to send schedule link for ${order.reference}`, error);
    return false;
  }
}
