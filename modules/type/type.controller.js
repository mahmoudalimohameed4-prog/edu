import { Router } from "express";
import { getAllTypes, createType } from "./type.service.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const types = await getAllTypes();
        return res.status(200).json({ msg: 'success', data: types });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newType = await createType(req.body);
        return res.status(201).json({ msg: 'created', data: newType });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

export default router;
