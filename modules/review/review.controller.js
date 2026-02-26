import { Router } from "express";
import { getAllReviews, createReview, deleteReview } from "./review.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const reviews = await getAllReviews();
        return res.status(200).json({ msg: 'success', data: reviews });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newReview = await createReview({ ...req.body, reviewerId: req.user.id });
        return res.status(201).json({ msg: 'created', data: newReview });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await deleteReview(req.params.id, req.user.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

export default router;
