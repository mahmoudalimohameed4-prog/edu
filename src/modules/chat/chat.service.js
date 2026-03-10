import { connected } from "../../db/database.connection.js";
import { createNotification } from "../notification/notification.service.js";

/**
 * Get all conversations for a user
 */
export const getConversationsByUserId = async (userId) => {
    const db = await connected();
    const query = `
        SELECT 
            u.Us_id as id,
            u.Us_name as name,
            u.Us_profile_picture as avatar,
            c.Ch_text as lastMsg,
            c.Ch_created_at as time,
            (SELECT COUNT(*) FROM chats WHERE receiver_id = ? AND sender_id = u.Us_id AND Ch_read = 0) as unread
        FROM users u
        JOIN chats c ON (c.sender_id = u.Us_id OR c.receiver_id = u.Us_id)
        WHERE (c.sender_id = ? OR c.receiver_id = ?) 
        AND u.Us_id != ?
        AND c.Ch_id IN (
            SELECT MAX(Ch_id) FROM chats 
            WHERE sender_id = ? OR receiver_id = ?
            GROUP BY IF(sender_id = ?, receiver_id, sender_id)
        )
        ORDER BY c.Ch_created_at DESC
    `;
    const [rows] = await db.execute(query, [userId, userId, userId, userId, userId, userId, userId]);
    return rows;
};

/**
 * Get messages between two users
 */
export const getMessagesByUsers = async (userId, otherId) => {
    const db = await connected();
    const query = `
        SELECT 
            Ch_id as id,
            sender_id as senderId,
            receiver_id as receiverId,
            Ch_text as text,
            Ch_created_at as time,
            IF(sender_id = ?, 1, 0) as mine
        FROM chats
        WHERE (sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?)
        ORDER BY Ch_created_at ASC
    `;
    const [rows] = await db.execute(query, [userId, userId, otherId, otherId, userId]);
    return rows;
};

/**
 * Create a new chat message
 */
export const createChat = async (data) => {
    const { senderId, receiverId, text } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO chats (sender_id, receiver_id, Ch_text, Ch_read, Ch_created_at) VALUES (?, ?, ?, 0, NOW())',
        [senderId, receiverId, text]
    );

    // Fetch sender name for better notification
    const [sender] = await db.execute("SELECT Us_name FROM users WHERE Us_id = ?", [senderId]);
    const senderName = sender[0]?.Us_name || "مستخدم";

    // Notify receiver
    await createNotification({
        userId: receiverId,
        title: "رسالة جديدة 💬",
        message: `لديك رسالة جديدة من ${senderName}: "${text.substring(0, 30)}${text.length > 30 ? '...' : ''}"`,
        type: "info",
        link: `/chat`
    });

    return { id: result.insertId, ...data, time: new Date() };
};
