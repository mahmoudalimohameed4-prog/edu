import { connected } from "../../db/database.connection.js";

/**
 * Get all notifications for a specific user
 */
export const getNotifications = async (userId) => {
    const db = await connected();
    const query = `
        SELECT * FROM notifications 
        WHERE Us_id = ? 
        ORDER BY No_created_at DESC
    `;
    const [rows] = await db.execute(query, [userId]);
    return rows;
};

/**
 * Mark a single notification as read
 */
export const markAsRead = async (notificationId, userId) => {
    const db = await connected();
    const query = `
        UPDATE notifications 
        SET No_is_read = 1 
        WHERE No_id = ? AND Us_id = ?
    `;
    await db.execute(query, [notificationId, userId]);
    return { success: true };
};

/**
 * Mark all notifications for a user as read
 */
export const markAllAsRead = async (userId) => {
    const db = await connected();
    const query = `
        UPDATE notifications 
        SET No_is_read = 1 
        WHERE Us_id = ?
    `;
    await db.execute(query, [userId]);
    return { success: true };
};

/**
 * Create a new notification
 */
export const createNotification = async (data) => {
    const { userId, title, message, type = 'info', link = null } = data;
    const db = await connected();
    const query = `
        INSERT INTO notifications (Us_id, No_title, No_message, No_type, No_link) 
        VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(query, [userId, title, message, type, link]);
    return { id: result.insertId, userId, title, message, type, link };
};

/**
 * Delete a notification
 */
export const deleteNotification = async (notificationId, userId) => {
    const db = await connected();
    const query = `
        DELETE FROM notifications 
        WHERE No_id = ? AND Us_id = ?
    `;
    await db.execute(query, [notificationId, userId]);
    return { success: true };
};

/**
 * Send notification to all users
 */
export const broadcastNotification = async (title, message, type = 'info', link = null) => {
    const db = await connected();
    const [users] = await db.execute("SELECT Us_id FROM users");

    if (users.length > 0) {
        // Use multiple insert
        let query = `INSERT INTO notifications (Us_id, No_title, No_message, No_type, No_link) VALUES `;
        const params = [];
        const placeholders = users.map(u => {
            params.push(u.Us_id, title, message, type, link);
            return "(?, ?, ?, ?, ?)";
        }).join(", ");

        query += placeholders;
        await db.execute(query, params);
    }
    return { success: true, count: users.length };
};
