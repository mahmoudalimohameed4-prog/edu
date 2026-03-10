import { Router } from "express";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "./notification.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

// Get user notifications
router.get('/', auth, async (req, res) => {
    try {
        const notifications = await getNotifications(req.user.id);
        return res.status(200).json({ msg: 'success', data: notifications });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// Mark all as read
router.patch('/read-all', auth, async (req, res) => {
    try {
        await markAllAsRead(req.user.id);
        return res.status(200).json({ msg: 'all marked as read' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

// Mark one as read
router.patch('/:id/read', auth, async (req, res) => {
    try {
        await markAsRead(req.params.id, req.user.id);
        return res.status(200).json({ msg: 'marked as read' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});


// Delete notification
router.delete('/:id', auth, async (req, res) => {
    try {
        await deleteNotification(req.params.id, req.user.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

export default router;
