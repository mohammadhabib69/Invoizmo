import nodemailer from 'nodemailer';
import { env } from '../config/env';

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
});

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text,
      html,
    });
    console.log(`✉️ Email sent to ${to}`);
  } catch (error) {
    console.error('❌ Email sending failed:', error);
  }
};