import express from 'express';
import {
  register,
  verifyEmail,
  login,
  verifyLoginOTP,
  resendOTP,
  forgotPassword,
  resetPassword,
  logout,
} from '../controller/auth-controller';
import {
  validateRequest,
  registrationValidationRules,
  loginValidationRules,
  otpValidationRules,
  passwordResetValidationRules,
} from '../middleware/validate.middleware';
import { authenticate } from '../middleware/auth.middleware';

const router = express.Router();

// Public routes
router.post('/register', validateRequest(registrationValidationRules), register);
router.post('/verify-email', validateRequest(otpValidationRules), verifyEmail);
router.post('/login', validateRequest(loginValidationRules), login);
router.post('/verify-login-otp', validateRequest(otpValidationRules), verifyLoginOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', validateRequest(passwordResetValidationRules), resetPassword);

// Protected routes
router.post('/logout', authenticate, logout);

export default router;