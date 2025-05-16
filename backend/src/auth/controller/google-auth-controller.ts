import { Request, Response } from 'express';
import { googleClient } from '../utils/oauth-config';
import { generateToken } from '../utils/jwt';
import { findUserByEmail, createUser } from '../db/user';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

interface GoogleUserInfo {
  email: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export const initiateGoogleAuth = async (_req: Request, res: Response): Promise<void> => {
  try {
    const authUrl = googleClient.generateAuthUrl({
      access_type: 'offline',
      scope: [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email'
      ],
      prompt: 'consent'
    });
    
    res.json({ authUrl });
  } catch (error) {
    console.error('Google auth initiation error:', error);
    res.status(500).json({ message: 'Error initiating Google authentication' });
  }
};

export const handleGoogleCallback = async (req: Request, res: Response): Promise<void> => {
  try {
    const { code } = req.body;
    
    // Exchange code for tokens
    const { tokens } = await googleClient.getToken(code);
    googleClient.setCredentials(tokens);
    
    // Get user info from Google
    const { data } = await googleClient.request<GoogleUserInfo>({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo'
    });
    
    const { email, given_name, family_name, picture } = data;
    
    // Check if user exists
    let user = await findUserByEmail(email);
    
    if (!user) {
      // Create new user with all required fields
      user = await createUser({
        firstName: given_name,
        lastName: family_name,
        email,
        password: crypto.randomBytes(32).toString('hex'), // Generate random password for Google users
        image: picture,
        emailVerified: new Date(), // Google users are automatically verified
        phone: undefined, // Optional field
        twoFactorSecret: undefined // No 2FA for Google users
      });
    }
    
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
        expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });
    
    // Return success response with user data
    res.status(200).json({
      success: true,
      message: 'Google authentication successful',
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        image: user.image,
        phone: user.phone,
       
      }
    });
  } catch (error) {
    console.error('Google callback error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error processing Google authentication',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}; 