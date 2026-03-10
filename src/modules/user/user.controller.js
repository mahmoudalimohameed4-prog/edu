import { Router } from "express";
import { profile, updateProfile, updateProfilePicture, getDashboardStats, getRecentActivities, changePassword, resetPassword } from "./user.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";
import { createNotification } from "../notification/notification.service.js";

const router = Router()

router.get('/profile', auth, async (req, res) => {
    try {
        console.log("Fetching profile for user:", req.user); // Added log for req.user
        const resultprof = await profile(req.user.email);
        return res.status(200).json({ msg: 'done-profile', data: { profile: resultprof } });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})

router.put('/profile', auth, async (req, res) => {
    try {
        console.log("Update profile for user:", req.user);
        // The instruction "ensure Us_id is matched" implies checking req.user.id,
        // which is already being used in updateProfile(req.user.id, req.body).
        // No direct SQL query is exposed here, so the provided SQL snippet is not applicable.
        const result = await updateProfile(req.user.id, req.body);
        return res.status(200).json({ msg: 'done-update-profile', data: result });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(400).json({ msg: error.message });
    }
})

router.patch('/profile-picture', auth, upload.single('image'), async (req, res) => {
    try {
        if (!req.file) throw new Error("Please upload an image");
        const result = await updateProfilePicture(req.user.id, req.file.path);
        return res.status(200).json({ msg: 'done-update-profile-picture', data: result });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})

router.get('/dashboard-stats', auth, async (req, res) => {
    try {
        const stats = await getDashboardStats(req.user.id);
        const activities = await getRecentActivities(req.user.id);
        return res.status(200).json({ msg: 'success', data: { stats, activities } });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})

router.post('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) throw new Error("Missing fields");
        await changePassword(req.user.id, currentPassword, newPassword);

        return res.status(200).json({ msg: 'success', message: 'تم تغيير كلمة المرور بنجاح' });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})

router.post('/reset-password', async (req, res) => {
    try {
        const { identifier, email, otp, newPassword } = req.body;
        const userEmail = email || identifier;

        if (!userEmail || !otp || !newPassword) throw new Error("جميع الحقول مطلوبة");
        const result = await resetPassword(userEmail, otp, newPassword);
        return res.status(200).json({ msg: 'success', data: result });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})


export default router
