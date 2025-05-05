import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', // Ganti sesuai SMTP provider kamu
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendVerificationEmail(to: string, token: string, username: string) {
    const verificationUrl = `http://localhost:3000/api/auth/verify-email?token=${token}`;
    const mailOptions = {
      from: `"Real Estate " <${process.env.SMTP_USER}>`,
      to,
      subject: 'Email Verification',
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 30px;">
            <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
            <div style="background-color: #4a90e2; color: white; padding: 20px; text-align: center;">
                <h2 style="margin: 0;">Verify Your Email</h2>
            </div>
            <div style="padding: 30px;">
                <p>Hi 👋 ${username},</p>
                <p>Thank you for registering with <strong>RealEstate</strong>.</p>
                <p>Please click the button below to verify your email address and activate your account:</p>
                <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" style="background-color: #4a90e2; color: white; text-decoration: none; padding: 12px 24px; border-radius: 5px; font-size: 16px;">
                    Verify Email
                </a>
                </div>
                <p>If you didn't request this, you can safely ignore this email.</p>
                <p style="margin-top: 40px; font-size: 13px; color: #888;">This link will expire in 24 hours for your security.</p>
            </div>
            </div>
            <p style="text-align: center; font-size: 12px; color: #999; margin-top: 20px;">
            © ${new Date().getFullYear()} Real Estate. All rights reserved.
            </p>
        </div>
    `,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
