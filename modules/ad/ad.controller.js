import { Router } from "express";
import { getAllAds, getAdById, createAd, updateAd, deleteAd } from "./ad.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const ads = await getAllAds();
        return res.status(200).json({ msg: 'success', data: ads });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const ad = await getAdById(req.params.id);
        if (!ad) return res.status(404).json({ msg: 'Ad not found' });
        return res.status(200).json({ msg: 'success', data: ad });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newAd = await createAd({ ...req.body, userId: req.user.id });
        return res.status(201).json({ msg: 'created', data: newAd });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const updatedAd = await updateAd(req.params.id, req.body, req.user.id);
        return res.status(200).json({ msg: 'updated', data: updatedAd });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await deleteAd(req.params.id, req.user.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

export default router;
