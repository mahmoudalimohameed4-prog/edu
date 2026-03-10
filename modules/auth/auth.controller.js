import { Router } from "express";
import { login, signup, googleLogin } from "./auth.service.js";
const router = Router();

router.post('/signup', async (req, res) => {
    try {
        const result = await signup(req.body)
        return res.status(201).json({ msg: 'done-signup', data: result })
    } catch (error) {
        return res.status(400).json({ msg: error.message })
    }
})

router.post('/login', async (req, res) => {
    try {
        const result = await login(req.body);
        return res.status(200).json({
            msg: 'done-login',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        });
    }
});

router.post('/google-login', async (req, res) => {
    try {
        const { idToken } = req.body;
        if (!idToken) {
            return res.status(400).json({ msg: 'idToken is required' });
        }
        const result = await googleLogin(idToken);
        return res.status(200).json({
            msg: 'done-google-login',
            data: result
        });
    } catch (error) {
        return res.status(400).json({
            msg: error.message
        });
    }
});

export default router;
