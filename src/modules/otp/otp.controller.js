import { Router } from "express";
import { sendOTP, verifyOTP } from "./otp.service.js";

const router = Router();

router.post('/send-otp', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) throw new Error("Email is required");

        const result = await sendOTP(email);
        return res.status(200).json({ msg: result });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
});

router.post('/verify-otp', async (req, res) => {
    try {
        const { email, code, checkOnly } = req.body;
        if (!email || !code) throw new Error("Email and Code are required");

        // If checkOnly is true, don't mark as used or update verified status
        const markUsed = checkOnly ? false : true;
        const updateVerified = checkOnly ? false : true;

        await verifyOTP(email, code, markUsed, updateVerified);
        return res.status(200).json({ msg: "تم التحقق بنجاح" });
    } catch (error) {
        return res.status(400).json({ msg: error.message });
    }
});



export default router;
