import { Router } from "express";
import { getAllAdmins, getAdminById, createAdmin, updateAdmin, deleteAdmin } from "./admin.service.js";

const router = Router();

router.get('/', async (req, res) => {
    try {
        const admins = await getAllAdmins();
        return res.status(200).json({ msg: 'success', data: admins });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const admin = await getAdminById(req.params.id);
        if (!admin) return res.status(404).json({ msg: 'Admin not found' });
        return res.status(200).json({ msg: 'success', data: admin });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', async (req, res) => {
    try {
        const newAdmin = await createAdmin(req.body);
        return res.status(201).json({ msg: 'created', data: newAdmin });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.put('/:id', async (req, res) => {
    try {
        const updatedAdmin = await updateAdmin(req.params.id, req.body);
        return res.status(200).json({ msg: 'updated', data: updatedAdmin });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await deleteAdmin(req.params.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

export default router;
