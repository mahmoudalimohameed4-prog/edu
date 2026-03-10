import { Router } from "express";
import { getAllCategories, createCategory, updateCategory, deleteCategory } from "./category.service.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const categories = await getAllCategories();
        return res.status(200).json({ msg: 'success', data: categories });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newCategory = await createCategory(req.body);
        return res.status(201).json({ msg: 'created', data: newCategory });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedCategory = await updateCategory(req.params.id, req.body);
        return res.status(200).json({ msg: 'updated', data: updatedCategory });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteCategory(req.params.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

export default router;
