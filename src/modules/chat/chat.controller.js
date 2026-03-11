import { Router } from "express";
import { getConversationsByUserId, getMessagesByUsers, createChat } from "./chat.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

// Get all conversations for the authenticated user
router.get('/conversations', auth, async (req, res) => {
    try {
        const chats = await getConversationsByUserId(req.user.id);
        return res.status(200).json({ msg: 'success', data: chats });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// Get messages between auth user and another user
router.get('/messages/:otherId', auth, async (req, res) => {
    try {
        const messages = await getMessagesByUsers(req.user.id, req.params.otherId);
        return res.status(200).json({ msg: 'success', data: messages });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// Create a new chat message
router.post('/', auth, async (req, res) => {
    try {
        const newChat = await createChat({ ...req.body, senderId: req.user.id });
        
        // Real-time delivery via socket
        const { emitToUser } = await import("../../socket/socket.handler.js");
        emitToUser(req.body.receiverId, "receive_message", newChat);

        return res.status(201).json({ msg: 'created', data: newChat });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

export default router;
