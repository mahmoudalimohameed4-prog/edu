import { Router } from "express";
import { getAllItems, getItemById, createItem, updateItem, deleteItem, createItemImage, getItemsBySellerId, getLatestItems } from "./item.service.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { upload } from "../../middlewares/multer.middleware.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const items = await getAllItems();
        return res.status(200).json({ msg: 'success', data: items });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.get('/my-items', auth, async (req, res) => {
    try {
        const items = await getItemsBySellerId(req.user.id);
        return res.status(200).json({ msg: 'success', data: items });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.get('/latest', async (req, res) => {
    try {
        const items = await getLatestItems(6);
        return res.status(200).json({ msg: 'success', data: items });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const item = await getItemById(req.params.id);
        if (!item) return res.status(404).json({ msg: 'Item not found' });
        return res.status(200).json({ msg: 'success', data: item });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const newItem = await createItem({ ...req.body, sellerId: req.user.id }, req.file);
        return res.status(201).json({ msg: 'created', data: newItem });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});


router.post('/image', auth, async (req, res) => {
    try {
        const newImage = await createItemImage(req.body, req.user.id);
        return res.status(201).json({ msg: 'created', data: newImage });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const updatedItem = await updateItem(req.params.id, req.body, req.user.id);
        return res.status(200).json({ msg: 'updated', data: updatedItem });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await deleteItem(req.params.id, req.user.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

export default router;
