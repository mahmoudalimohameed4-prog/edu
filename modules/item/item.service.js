import { connected } from "../../db/database.connection.js";

/**
 * Get all items
 */
export const getAllItems = async () => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM items');
    return rows;
};

/**
 * Get item by ID with images
 */
export const getItemById = async (id) => {
    const db = await connected();
    const [itemRows] = await db.execute('SELECT * FROM items WHERE It_id = ?', [id]);
    if (itemRows.length === 0) return null;

    const [imageRows] = await db.execute('SELECT * FROM item_images WHERE It_id = ?', [id]);

    return { ...itemRows[0], images: imageRows };
};

/**
 * Create a new item
 */
export const createItem = async (data) => {
    const { name, categoryId, description, condition, price, quantity, sellerId, status } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO items (It_name, Cat_id, It_description, It_condition, It_price, It_quantity, seller_id, It_status, It_created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [name, categoryId, description, condition, price, quantity, sellerId, status]
    );
    return { id: result.insertId, ...data };
};

/**
 * Create item image
 */
export const createItemImage = async (data, userId) => {
    const { itemId, path, isPrimary } = data;
    const db = await connected();

    // Check ownership of the item
    const [rows] = await db.execute('SELECT seller_id FROM items WHERE It_id = ?', [itemId]);
    if (rows.length === 0) throw new Error('Item not found');
    if (rows[0].seller_id !== userId) throw new Error('Unauthorized');

    const [result] = await db.execute(
        'INSERT INTO item_images (It_id, Img_path, is_primary, Img_created_at) VALUES (?, ?, ?, NOW())',
        [itemId, path, isPrimary]
    );
    return { id: result.insertId, ...data };
};

/**
 * Update item
 */
export const updateItem = async (id, data, userId) => {
    const { name, description, price, quantity, status } = data;
    const db = await connected();

    // Check ownership
    const [rows] = await db.execute('SELECT seller_id FROM items WHERE It_id = ?', [id]);
    if (rows.length === 0) throw new Error('Item not found');
    if (rows[0].seller_id !== userId) throw new Error('Unauthorized');

    await db.execute(
        'UPDATE items SET It_name = ?, It_description = ?, It_price = ?, It_quantity = ?, It_status = ?, It_updated_at = NOW() WHERE It_id = ?',
        [name, description, price, quantity, status, id]
    );
    return { id, ...data };
};

/**
 * Delete item
 */
export const deleteItem = async (id, userId) => {
    const db = await connected();

    // Check ownership
    const [rows] = await db.execute('SELECT seller_id FROM items WHERE It_id = ?', [id]);
    if (rows.length === 0) throw new Error('Item not found');
    if (rows[0].seller_id !== userId) throw new Error('Unauthorized');

    await db.execute('DELETE FROM items WHERE It_id = ?', [id]);
    return { message: 'Item deleted' };
};
