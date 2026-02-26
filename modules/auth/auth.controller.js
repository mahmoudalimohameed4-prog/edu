import { Router } from "express";
import { login, signup } from "./auth.service.js";
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
export default router;