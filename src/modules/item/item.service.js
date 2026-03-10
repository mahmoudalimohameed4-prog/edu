import { connected } from "../../db/database.connection.js";
import sharp from "sharp";
import path from "path";
import fs from "fs";
import { broadcastNotification } from "../notification/notification.service.js";

/**
 * Get all items
 */
export const getAllItems = async () => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM items');
    return rows;
};

/**
 * Get item by ID with images and seller info
 */
export const getItemById = async (id) => {
    const db = await connected();
    const query = `
        SELECT i.*, u.Us_id as sellerId, u.Us_name as sellerName, u.Us_email as sellerEmail, u.Us_profile_picture as sellerPicture
        FROM items i
        LEFT JOIN users u ON i.seller_id = u.Us_id
        WHERE i.It_id = ?
    `;
    const [itemRows] = await db.execute(query, [id]);
    if (itemRows.length === 0) return null;

    const [imageRows] = await db.execute('SELECT * FROM item_images WHERE It_id = ?', [id]);

    return { ...itemRows[0], images: imageRows };
};

/**
 * Create a new item
 */
export const createItem = async (data, file) => {
    const { name, categoryId, description, condition, price, quantity, sellerId, status } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO items (It_name, Cat_id, It_description, It_condition, It_price, It_quantity, seller_id, It_status, It_created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())',
        [name, categoryId, description, condition, price, quantity, sellerId, status || 'available']
    );

    const itemId = result.insertId;

    if (file) {
        const resizedPath = `uploads/items/resized-${path.basename(file.path)}`;

        // Resize image
        await sharp(file.path)
            .resize(500, 500, { fit: 'inside' })
            .toFile(resizedPath);

        // Optional: remove original file
        // fs.unlinkSync(file.path);

        // Store in item_images
        await db.execute(
            'INSERT INTO item_images (It_id, Img_path, is_primary, Img_created_at) VALUES (?, ?, ?, NOW())',
            [itemId, resizedPath, 1]
        );
    }

    // 3. Broadcast notification to all users
    await broadcastNotification(
        "أداة جديدة متاحة! 🚀",
        `تم إضافة "${name}" في الموقع. تفقدها الآن!`,
        "info",
        `/item/${itemId}`
    );

    return { id: itemId, ...data, imagePath: file ? file.path : null };
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
/**
 * Get items by seller ID with primary images
 */
export const getItemsBySellerId = async (sellerId) => {
    const db = await connected();
    const query = `
        SELECT i.*, COALESCE(img.Img_path, NULL) as primaryImage
        FROM items i
        LEFT JOIN item_images img ON i.It_id = img.It_id AND img.is_primary = 1
        WHERE i.seller_id = ?
        ORDER BY i.It_created_at DESC
    `;
    const [rows] = await db.execute(query, [sellerId]);
    return rows;
};

/**
 * Get latest items (for homepage summaries)
 */
export const getLatestItems = async (limit = 6) => {
    const db = await connected();
    const query = `
        SELECT i.It_id, i.It_name, i.It_description, i.It_price, i.It_condition, i.It_created_at,
               u.Us_name as sellerName,
               COALESCE(img.Img_path, NULL) as primaryImage
        FROM items i
        LEFT JOIN users u ON i.seller_id = u.Us_id
        LEFT JOIN item_images img ON i.It_id = img.It_id AND img.is_primary = 1
        ORDER BY i.It_created_at DESC
        LIMIT ${parseInt(limit)}
    `;
    const [rows] = await db.execute(query);
    return rows;
};
