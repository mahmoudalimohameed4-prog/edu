import { connected } from "../../db/database.connection.js";

/**
 * Get all orders for a specific user (either as buyer or seller)
 */
export const getAllOrders = async (userId) => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM orders WHERE buyer_id = ? OR seller_id = ?', [userId, userId]);
    return rows;
};

/**
 * Get order by ID with items, ensuring the user is part of the order
 */
export const getOrderById = async (id, userId) => {
    const db = await connected();
    const [orderRows] = await db.execute('SELECT * FROM orders WHERE Order_id = ? AND (buyer_id = ? OR seller_id = ?)', [id, userId, userId]);
    if (orderRows.length === 0) return null;

    const [itemRows] = await db.execute('SELECT * FROM order_items WHERE Order_id = ?', [id]);

    return { ...orderRows[0], items: itemRows };
};

/**
 * Create a new order
 */
export const createOrder = async (data) => {
    const { buyerId, sellerId, total, status, notes, address } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO orders (buyer_id, seller_id, Order_total, Order_status, Order_notes, delivery_address, Order_created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [buyerId, sellerId, total, status, notes, address]
    );
    return { id: result.insertId, ...data };
};

/**
 * Create order item
 */
export const createOrderItem = async (data) => {
    const { orderId, itemId, quantity, price, subtotal } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO order_items (Order_id, It_id, Item_quantity, Item_price, Item_subtotal) VALUES (?, ?, ?, ?, ?)',
        [orderId, itemId, quantity, price, subtotal]
    );
    return { id: result.insertId, ...data };
};

/**
 * Update order
 */
export const updateOrder = async (id, data, userId) => {
    const { status, notes } = data;
    const db = await connected();

    // Check participation
    const [rows] = await db.execute('SELECT buyer_id, seller_id FROM orders WHERE Order_id = ?', [id]);
    if (rows.length === 0) throw new Error('Order not found');
    if (rows[0].buyer_id !== userId && rows[0].seller_id !== userId) throw new Error('Unauthorized');

    await db.execute(
        'UPDATE orders SET Order_status = ?, Order_notes = ?, Order_updated_at = NOW() WHERE Order_id = ?',
        [status, notes, id]
    );
    return { id, ...data };
};

/**
 * Delete order
 */
export const deleteOrder = async (id, userId) => {
    const db = await connected();

    // Check participation
    const [rows] = await db.execute('SELECT buyer_id, seller_id FROM orders WHERE Order_id = ?', [id]);
    if (rows.length === 0) throw new Error('Order not found');
    if (rows[0].buyer_id !== userId && rows[0].seller_id !== userId) throw new Error('Unauthorized');

    await db.execute('DELETE FROM orders WHERE Order_id = ?', [id]);
    return { message: 'Order deleted' };
};
