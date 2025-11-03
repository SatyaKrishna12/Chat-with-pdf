import express from 'express';
import { handleChat, getVectorStoreStatus } from '../controllers/chatController.js';

const router = express.Router();

// Handle chat questions
router.post('/', handleChat);
router.get('/status', getVectorStoreStatus);

// Render chat page
router.get('/', (req, res) => {
    res.render('chat');
});

export default router;