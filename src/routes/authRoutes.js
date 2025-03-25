import express from 'express';
import { registerUser, loginUser, getUserProfile, logoutUser} from '../controller/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', authMiddleware, getUserProfile);
router.post('/logout', logoutUser); 


export default router; 