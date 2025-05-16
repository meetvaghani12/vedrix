import { Router } from 'express';
import { 
  register, 
  login, 
  verifyEmail, 
  verifyLoginOTP, 
  resendOTP, 
  forgotPassword, 
  resetPassword, 
  logout, 
  getUserProfile 
} from '../controller/auth-controller';
import googleAuthRoutes from './google-auth-routes';

const router = Router();

// Regular auth routes
router.post('/register', register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/verify-login-otp', verifyLoginOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/logout', logout);
router.get('/profile', getUserProfile);

// Google OAuth routes
router.use('/google', googleAuthRoutes);

export default router; 