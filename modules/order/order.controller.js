import { Router } from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder, createOrderItem } from "./order.service.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router = Router();

router.get('/', auth, async (req, res) => {
    try {
        const orders = await getAllOrders(req.user.id);
        return res.status(200).json({ msg: 'success', data: orders });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.get('/:id', auth, async (req, res) => {
    try {
        const order = await getOrderById(req.params.id, req.user.id);
        if (!order) return res.status(404).json({ msg: 'Order not found or unauthorized' });
        return res.status(200).json({ msg: 'success', data: order });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/', auth, async (req, res) => {
    try {
        const newOrder = await createOrder({ ...req.body, buyerId: req.user.id });
        return res.status(201).json({ msg: 'created', data: newOrder });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.post('/item', auth, async (req, res) => {
    try {
        const newOrderItem = await createOrderItem(req.body);
        return res.status(201).json({ msg: 'created', data: newOrderItem });
    } catch (error) {
        return res.status(500).json({ msg: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const updatedOrder = await updateOrder(req.params.id, req.body, req.user.id);
        return res.status(200).json({ msg: 'updated', data: updatedOrder });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

router.delete('/:id', auth, async (req, res) => {
    try {
        await deleteOrder(req.params.id, req.user.id);
        return res.status(200).json({ msg: 'deleted' });
    } catch (error) {
        return res.status(error.message === 'Unauthorized' ? 403 : 500).json({ msg: error.message });
    }
});

export default router;
