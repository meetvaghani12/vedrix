import nodemailer from 'nodemailer';

// Configure mail transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Send verification email with OTP
export const sendVerificationEmail = async (
  email: string, 
  otp: string, 
  firstName: string,
  isLogin: boolean = false,
  isPasswordReset: boolean = false
): Promise<void> => {
  let subject: string;
  let htmlContent: string;
  
  if (isPasswordReset) {
    subject = 'Reset Your Password';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Reset Your Password</h2>
        <p>Hello ${firstName},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${process.env.FRONTEND_URL}/reset-password?token=${otp}" style="background-color: #4CAF50; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; font-weight: bold;">Reset Password</a>
        </div>
        <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
        <p>This link will expire in 1 hour.</p>
        <p>Best regards,<br>The Property Marketplace Team</p>
      </div>
    `;
  } else if (isLogin) {
    subject = 'Login Verification Code';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Login Verification Code</h2>
        <p>Hello ${firstName},</p>
        <p>Your login verification code is:</p>
        <div style="text-align: center; margin: 30px 0;">
                    <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">${otp}</div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't attempt to log in, please secure your account by changing your password immediately.</p>
        <p>Best regards,<br>The Property Marketplace Team</p>
      </div>
    `;
  } else {
    subject = 'Verify Your Email Address';
    htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
        <h2 style="color: #333;">Welcome to Property Marketplace!</h2>
        <p>Hello ${firstName},</p>
        <p>Thank you for registering. To complete your registration, please verify your email address using the verification code below:</p>
        <div style="text-align: center; margin: 30px 0;">
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 15px; background-color: #f5f5f5; border-radius: 4px;">${otp}</div>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't create an account, please ignore this email.</p>
        <p>Best regards,<br>The Property Marketplace Team</p>
      </div>
    `;
  }
  
  const mailOptions = {
    from: `"Property Marketplace" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html: htmlContent,
  };
  
  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error('Failed to send email');
  }
};