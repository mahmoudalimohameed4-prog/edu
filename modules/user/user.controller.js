import { Router } from "express";
import { profile } from "./user.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router()

router.get('/profile', auth, async (req, res) => {
    try {
        const resultprof = await profile(req.user.email);
        return res.status(200).json({ msg: 'done-profile', data: { profile: resultprof } });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
})

export default router