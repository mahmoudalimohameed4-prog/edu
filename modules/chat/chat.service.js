import { connected } from "../../db/database.connection.js";

export const getAllChats = async () => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM chats');
    return rows;
};

export const createChat = async (data) => {
    const { senderId, receiverId, text } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO chats (sender_id, receiver_id, Ch_text, Ch_read, Ch_created_at) VALUES (?, ?, ?, 0, NOW())',
        [senderId, receiverId, text]
    );
    return { id: result.insertId, ...data };
};

export const getChatsByUserId = async (userId) => {
    const db = await connected();
    const [rows] = await db.execute(
        'SELECT * FROM chats WHERE sender_id = ? OR receiver_id = ? ORDER BY Ch_created_at DESC',
        [userId, userId]
    );
    return rows;
};
