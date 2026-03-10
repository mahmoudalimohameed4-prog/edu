import { connected } from "../../db/database.connection.js";
import { broadcastNotification } from "../notification/notification.service.js";

/**
 * Get all ads
 */
export const getAllAds = async () => {
    const db = await connected();
    const query = `
        SELECT 
            a.Ads_id as id,
            a.Ads_title as title,
            a.Ads_description as description,
            a.Ads_status as status,
            i.It_id as itemId,
            i.It_name as itemName,
            i.It_price as price,
            i.It_condition as itemCondition,
            c.Cat_name as category,
            u.Us_name as userName,
            (SELECT Img_path FROM item_images WHERE It_id = i.It_id LIMIT 1) as image
        FROM ads a
        JOIN items i ON a.It_id = i.It_id
        JOIN categories c ON i.Cat_id = c.Cat_id
        JOIN users u ON a.Us_id = u.Us_id
        WHERE i.It_status = 'available'
    `;
    const [rows] = await db.execute(query);
    return rows;
};

/**
 * Get ad by ID
 */
export const getAdById = async (id) => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM ads WHERE Ads_id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0];
};

/**
 * Create a new ad
 */
export const createAd = async (data) => {
    const { title, description, itemId, userId, startDate, endDate, status } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO ads (Ads_title, Ads_description, It_id, Us_id, Ads_start_date, Ads_end_date, Ads_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [title, description, itemId, userId, startDate, endDate, status]
    );

    // Broadcast
    await broadcastNotification(
        "إعلان جديد! 📢",
        `تم نشر إعلان جديد: "${title}" ✨. تفضّل بزيارته الآن!`,
        "info",
        `/item/${itemId}`
    );

    return { id: result.insertId, ...data };
};

/**
 * Update ad
 */
export const updateAd = async (id, data, userId) => {
    const { title, description, status } = data;
    const db = await connected();

    // Check ownership
    const [rows] = await db.execute('SELECT Us_id FROM ads WHERE Ads_id = ?', [id]);
    if (rows.length === 0) throw new Error('Ad not found');
    if (rows[0].Us_id !== userId) throw new Error('Unauthorized');

    await db.execute(
        'UPDATE ads SET Ads_title = ?, Ads_description = ?, Ads_status = ? WHERE Ads_id = ?',
        [title, description, status, id]
    );
    return { id, ...data };
};

/**
 * Delete ad
 */
export const deleteAd = async (id, userId) => {
    const db = await connected();

    // Check ownership
    const [rows] = await db.execute('SELECT Us_id FROM ads WHERE Ads_id = ?', [id]);
    if (rows.length === 0) throw new Error('Ad not found');
    if (rows[0].Us_id !== userId) throw new Error('Unauthorized');

    await db.execute('DELETE FROM ads WHERE Ads_id = ?', [id]);
    return { message: 'Ad deleted successfully' };
};
