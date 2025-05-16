import { Redis } from 'ioredis';
import { getExpiryTime, isExpired } from './date-time';
import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';

// Initialize Redis client
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const prisma = new PrismaClient();

// OTP expiry time in minutes
const OTP_EXPIRY_MINUTES = 10;

// Generate a random 6-digit OTP using the user's 2FA secret
export const generateOTP = async (email: string): Promise<string> => {
  // Get user's 2FA secret
  const user = await prisma.user.findUnique({
    where: { email },
    select: { twoFactorSecret: true }
  });

  if (!user?.twoFactorSecret) {
    // Fallback to random OTP if no 2FA secret exists
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  // Generate OTP using the 2FA secret
  const timestamp = Math.floor(Date.now() / 1000 / 30); // 30-second window
  const hmac = crypto.createHmac('sha256', user.twoFactorSecret);
  hmac.update(timestamp.toString());
  const hash = hmac.digest('hex');
  
  // Convert hash to 6-digit number
  const offset = parseInt(hash.slice(-1), 16);
  const binary = parseInt(hash.slice(offset * 2, offset * 2 + 8), 16) & 0x7fffffff;
  return (binary % 1000000).toString().padStart(6, '0');
};

// Store OTP in Redis with expiry
export const storeOTP = async (email: string, otp: string): Promise<void> => {
  const key = `otp:${email}`;
  const expiryTime = getExpiryTime(OTP_EXPIRY_MINUTES);
  
  // Store OTP and expiry time
  await redis.set(key, JSON.stringify({
    otp,
    expiryTime: expiryTime.toISOString(),
  }));
  
  // Set Redis key expiry
  await redis.expire(key, OTP_EXPIRY_MINUTES * 60);
};

// Verify OTP
export const verifyOTP = async (email: string, providedOTP: string): Promise<boolean> => {
  const key = `otp:${email}`;
  const storedData = await redis.get(key);
  
  if (!storedData) {
    return false;
  }
  
  const { otp, expiryTime } = JSON.parse(storedData);
  
  // Check if OTP is expired
  if (isExpired(new Date(expiryTime))) {
    await redis.del(key);
    return false;
  }
  
  // Check if OTP matches
  if (otp !== providedOTP) {
    return false;
  }
  
  // Delete OTP after successful verification
  await redis.del(key);
  return true;
};

// Clear OTP
export const clearOTP = async (email: string): Promise<void> => {
  const key = `otp:${email}`;
  await redis.del(key);
};