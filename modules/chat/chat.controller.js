import { Router } from "express";
import { getAllChats, createChat, getChatsByUserId } from "./chat.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

// Get all chats for the authenticated user
router.get('/', auth, async (req, res) => {
    try {
        const chats = await getChatsByUserId(req.user.id);
        return res.status(200).json({ msg: 'success', data: chats });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// Create a new chat message
router.post('/', auth, async (req, res) => {
    try {
        const newChat = await createChat({ ...req.body, senderId: req.user.id });
        return res.status(201).json({ msg: 'created', data: newChat });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

export default router;
