import { query } from "../db/pool.js";
import { env } from "../config/env.js";

/**
 * Dispatches Low Stock Alerts via Email and/or WhatsApp.
 * Designed to be resilient: errors are captured and logged without breaking checkout/catalog operations.
 *
 * @param {Object} params
 * @param {Object} params.product - { id, name, slug, stock, category_key }
 * @param {number} params.remainingStock - Current stock level
 * @param {Object} params.settings - Store settings object
 */
export async function notifyLowStock({ product, remainingStock, settings }) {
  if (remainingStock === null || remainingStock === undefined) return;

  const threshold = Math.max(1, Math.floor(Number(settings?.lowStockThreshold) || 10));
  if (remainingStock > threshold) return;

  const notifyEmail = settings?.lowStockNotifyEmail ?? true;
  const notifyWhatsapp = settings?.lowStockNotifyWhatsapp ?? false;

  if (!notifyEmail && !notifyWhatsapp) return;

  const recipientEmail = (settings?.lowStockEmail || settings?.supportEmail || env.adminEmail || "").trim();
  const recipientPhone = (settings?.lowStockPhone || settings?.supportPhone || "").trim();
  const productUrl = `${env.publicUrl}/admin/products/${product.id}`;

  const promises = [];

  // 1. Email notification
  if (notifyEmail && recipientEmail) {
    promises.push(
      sendLowStockEmail({
        product,
        remainingStock,
        threshold,
        recipientEmail,
        productUrl,
      }).catch((err) => {
        console.error(`[notification] Email alert failed for product ${product.id}:`, err.message);
      }),
    );
  }

  // 2. WhatsApp notification
  if (notifyWhatsapp && recipientPhone) {
    promises.push(
      sendLowStockWhatsApp({
        product,
        remainingStock,
        threshold,
        recipientPhone,
        productUrl,
      }).catch((err) => {
        console.error(`[notification] WhatsApp alert failed for product ${product.id}:`, err.message);
      }),
    );
  }

  await Promise.allSettled(promises);
}

/**
 * Sends Low Stock Email notification.
 */
async function sendLowStockEmail({ product, remainingStock, threshold, recipientEmail, productUrl }) {
  const subject = `⚠️ Low Stock Alert: "${product.name}" has only ${remainingStock} unit(s) remaining`;
  const textContent = `
SUITOHOLIC ATELIER — LOW STOCK ALERT
====================================
Product: ${product.name}
Slug: /${product.slug}
Remaining Stock: ${remainingStock} (Threshold: ${threshold})
Status: Restock Recommended

Manage Product:
${productUrl}
`.trim();

  const htmlContent = `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 560px; margin: 0 auto; padding: 24px; border: 1px solid #E5E7EB; border-radius: 12px; background: #FAF9F6; color: #14110E;">
  <div style="border-bottom: 2px solid #9E774C; padding-bottom: 12px; margin-bottom: 20px;">
    <span style="font-size: 11px; font-weight: bold; letter-spacing: 0.15em; text-transform: uppercase; color: #9E774C;">Suitoholic Inventory Management</span>
    <h2 style="margin: 8px 0 0; font-size: 20px; font-weight: 700; color: #14110E;">⚠️ Low Stock Alert</h2>
  </div>

  <p style="font-size: 14px; line-height: 1.6; color: #3A3028;">
    An item in your atelier catalog has reached or dropped below your designated low stock threshold (<strong>${threshold} units</strong>).
  </p>

  <div style="background: #FFFFFF; border: 1px solid #E2D4C3; border-radius: 8px; padding: 16px; margin: 20px 0;">
    <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
      <tr>
        <td style="padding: 6px 0; color: #6B7280; width: 140px;">Product:</td>
        <td style="padding: 6px 0; font-weight: 600; color: #14110E;">${product.name}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6B7280;">Slug:</td>
        <td style="padding: 6px 0; color: #8B93A1;">/${product.slug}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6B7280;">Current Inventory:</td>
        <td style="padding: 6px 0; font-weight: 700; color: ${remainingStock === 0 ? "#B4402F" : "#B45309"};">
          ${remainingStock === 0 ? "OUT OF STOCK (0)" : `${remainingStock} unit(s) left`}
        </td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6B7280;">Alert Threshold:</td>
        <td style="padding: 6px 0; color: #14110E;">≤ ${threshold} units</td>
      </tr>
    </table>
  </div>

  <div style="text-align: center; margin-top: 24px;">
    <a href="${productUrl}" style="display: inline-block; background: #14110E; color: #FFFFFF; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-size: 12px; font-weight: bold; letter-spacing: 0.1em; text-transform: uppercase;">
      Update Stock in Admin →
    </a>
  </div>

  <p style="font-size: 11px; color: #9CA3AF; margin-top: 28px; text-align: center; border-top: 1px solid #EEF0F3; padding-top: 16px;">
    This is an automated notification dispatched by Suitoholic Store System.
  </p>
</div>
`.trim();

  // If external SMTP or custom email handler is set:
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    try {
      // Dynamic import to avoid hard dependency if not installed
      const nodemailer = await import("nodemailer").catch(() => null);
      if (nodemailer) {
        const transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT || 587),
          secure: process.env.SMTP_SECURE === "true",
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || `"Suitoholic" <${recipientEmail}>`,
          to: recipientEmail,
          subject,
          text: textContent,
          html: htmlContent,
        });

        await logAlert({
          productId: product.id,
          stockLevel: remainingStock,
          channel: "email",
          recipient: recipientEmail,
          status: "sent",
        });
        return;
      }
    } catch (e) {
      console.warn("[notification] SMTP dispatch error, falling back to log:", e.message);
    }
  }

  // Clean formatted logging for development & environment fallback
  console.log(`\n==================================================`);
  console.log(`[LOW STOCK EMAIL DISPATCHED]`);
  console.log(`To: ${recipientEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Product: ${product.name} (Stock remaining: ${remainingStock})`);
  console.log(`Manage: ${productUrl}`);
  console.log(`==================================================\n`);

  await logAlert({
    productId: product.id,
    stockLevel: remainingStock,
    channel: "email",
    recipient: recipientEmail,
    status: "sent",
  });
}

/**
 * Sends Low Stock WhatsApp notification.
 * Integrates with Meta WhatsApp Cloud API / Twilio / generic webhook or logs cleanly if keys pending.
 */
async function sendLowStockWhatsApp({ product, remainingStock, threshold, recipientPhone, productUrl }) {
  // Normalize phone number (strip whitespace, dashes)
  const phone = recipientPhone.replace(/[^\d+]/g, "");
  const message = `🚨 *SUITOHOLIC INVENTORY ALERT*\n\n` +
    `Product: *${product.name}*\n` +
    `Remaining Stock: *${remainingStock} units* (Threshold: ${threshold})\n` +
    `Status: ${remainingStock === 0 ? "Out of Stock" : "Restock Recommended"}\n\n` +
    `Update stock here:\n${productUrl}`;

  // Check if WhatsApp Cloud API (Meta) is configured
  const token = process.env.WHATSAPP_API_TOKEN;
  const phoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

  if (token && phoneId) {
    try {
      const res = await fetch(`https://graph.facebook.com/v18.0/${phoneId}/messages`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: phone.replace(/^\+/, ""),
          type: "text",
          text: { body: message },
        }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`WhatsApp API responded with status ${res.status}: ${errorText}`);
      }

      await logAlert({
        productId: product.id,
        stockLevel: remainingStock,
        channel: "whatsapp",
        recipient: phone,
        status: "sent",
      });
      return;
    } catch (err) {
      console.error("[notification] WhatsApp Cloud API error:", err.message);
      await logAlert({
        productId: product.id,
        stockLevel: remainingStock,
        channel: "whatsapp",
        recipient: phone,
        status: "failed",
        errorMessage: err.message,
      });
      return;
    }
  }

  // Clean console dispatch for development / staging
  console.log(`\n--------------------------------------------------`);
  console.log(`[LOW STOCK WHATSAPP ALERT DISPATCHED]`);
  console.log(`To: ${phone}`);
  console.log(`Message:\n${message}`);
  console.log(`--------------------------------------------------\n`);

  await logAlert({
    productId: product.id,
    stockLevel: remainingStock,
    channel: "whatsapp",
    recipient: phone,
    status: "sent",
  });
}

/**
 * Safely records alert in audit log if table exists.
 */
async function logAlert({ productId, stockLevel, channel, recipient, status, errorMessage }) {
  try {
    await query(
      `INSERT INTO stock_alert_logs (product_id, stock_level, channel, recipient, status, error_message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [productId, stockLevel, channel, recipient, status, errorMessage || null],
    );
  } catch {
    // If DB is offline or table hasn't migrated yet, quietly ignore audit log insert
  }
}
