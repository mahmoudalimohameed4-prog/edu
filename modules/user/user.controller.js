import { Router } from "express";
import { profile, updateProfilePicture } from "./user.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router()

router.get('/profile', auth, async (req, res) => {
    try {
        const resultprof = await profile(req.user.email);
        return res.status(200).json({ msg: 'done-profile', data: { profile: resultprof } });
    } catch (error) {
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

export default router
