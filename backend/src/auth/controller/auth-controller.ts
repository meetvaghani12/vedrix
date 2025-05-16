import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import { generateOTP, verifyOTP, storeOTP } from '../utils/login-utils';
import { sendVerificationEmail } from '../utils/mail';
import { generateToken, verifyToken } from '../utils/jwt';
import crypto from 'crypto';

import { 
  findUserByEmail, 
  createUser, 
  updateUser, 
  getUserWithPreferences 
} from '../db/user';

const prisma = new PrismaClient();

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { 
      firstName, 
      lastName, 
      email, 
      password, 
      phone, 
    } = req.body;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      res.status(400).json({ message: 'User already exists with this email' });
      return;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Generate 2FA secret
    const twoFactorSecret = crypto.randomBytes(32).toString('hex');

    // Create user with properly typed accountType and 2FA secret
    const user = await createUser({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      phone,
      twoFactorSecret,
    });

    // Generate OTP for email verification
    const otp = await generateOTP(email);
    await storeOTP(email, otp);

    // Send verification email
    await sendVerificationEmail(email, otp, firstName);

    res.status(201).json({
      message: 'User registered successfully. Please verify your email with the OTP sent.',
      userId: user.id,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

export const verifyEmail = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Verify OTP
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // Update user's email verification status
    await updateUser(email, {
      emailVerified: new Date(),
    });

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({ message: 'Server error during email verification' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Check if email is verified
    if (!user.emailVerified) {
      // Generate new OTP for unverified users
      const otp = await generateOTP(email);
      await storeOTP(email, otp);
      await sendVerificationEmail(email, otp, user.firstName);
      
      res.status(400).json({ 
        message: 'Email not verified. A new verification code has been sent to your email.' 
      });
      return;
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(400).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate 2FA OTP using the user's secret
    const otp = await generateOTP(email);
    await storeOTP(email, otp);
    
    // Send verification email with 2FA OTP
    await sendVerificationEmail(email, otp, user.firstName, true);

    res.status(200).json({
      message: 'OTP sent to your email for 2FA verification',
      userId: user.id,
      requiresOTP: true,
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

export const verifyLoginOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, otp } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    // Verify OTP against user's 2FA secret
    const isValid = await verifyOTP(email, otp);
    if (!isValid) {
      res.status(400).json({ message: 'Invalid or expired OTP' });
      return;
    }

    // // Get user preferences
    // const userWithPreferences = await getUserWithPreferences(user.id);
    // const preferredTypes = userWithPreferences?.preferredPropertyTypes.map(p => p.propertyType) || [];

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      email: user.email,
    });

    // Create session
    await prisma.session.create({
      data: {
        sessionToken: token,
        userId: user.id,
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });

    // Return user info and token
    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Server error during OTP verification' });
  }
};

export const resendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    // Generate new OTP
    const otp = await generateOTP(email);
    await storeOTP(email, otp);
    await sendVerificationEmail(email, otp, user.firstName);

    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Server error while resending OTP' });
  }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    // Find user
    const user = await findUserByEmail(email);
    if (!user) {
      res.status(400).json({ message: 'User not found' });
      return;
    }

    // Generate reset token
    const resetToken = generateToken({ id: user.id, email: user.email }, '1h');
    
    // Send password reset email
    await sendVerificationEmail(email, resetToken, user.firstName, false, true);

    res.status(200).json({ message: 'Password reset instructions sent to your email' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token, newPassword } = req.body;

    // Verify token
    const decoded = verifyToken(token);
    if (!decoded) {
      res.status(400).json({ message: 'Invalid or expired token' });
      return;
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update user password
    await updateUser(decoded.email, {
      password: hashedPassword,
    });

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    const { token } = req.body;

    // Delete session
    await prisma.session.deleteMany({
      where: {
        sessionToken: token,
      },
    });

    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'Server error during logout' });
  }
};

export const getUserProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    // @ts-ignore - req.user is added by auth middleware
    const userId = req.user.id;
    
    const userWithPreferences = await getUserWithPreferences(userId);
    
    if (!userWithPreferences) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    
    
    // Return user profile without sensitive information
    res.status(200).json({
      user: {
        id: userWithPreferences.id,
        firstName: userWithPreferences.firstName,
        lastName: userWithPreferences.lastName,
        email: userWithPreferences.email,
        phone: userWithPreferences.phone,
        createdAt: userWithPreferences.createdAt,
      }
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({ message: 'Server error while fetching user profile' });
  }
};