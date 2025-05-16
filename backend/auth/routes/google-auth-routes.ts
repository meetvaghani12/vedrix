import { Router } from 'express';
import { initiateGoogleAuth, handleGoogleCallback } from '../controller/google-auth-controller';

const router = Router();

// Note: These routes will be mounted under /api/auth/google
router.get('/', initiateGoogleAuth);
router.post('/callback', handleGoogleCallback);

export default router; 