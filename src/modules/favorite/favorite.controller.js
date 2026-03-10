import { Router } from "express";
import { getFavoritesByUserId, addFavorite, removeFavorite } from "./favorite.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const favorites = await getFavoritesByUserId(req.user.id);
        return res.status(200).json({ msg: 'success', data: favorites });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newFavorite = await addFavorite({ ...req.body, userId: req.user.id });
        return res.status(201).json({ msg: 'created', data: newFavorite });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await removeFavorite(req.params.id, req.user.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

export default router;
