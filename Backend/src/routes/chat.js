import express from 'express';
import { handleChat, getVectorStoreStatus } from '../controllers/chatController.js';

const router = express.Router();

// Handle chat questions via POST
router.post('/', handleChat);
router.get('/status', getVectorStoreStatus);

// Render chat page via GET
router.get('/', (req, res) => {
    res.render('chat');
});

export default router;