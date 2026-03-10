import { connected } from "../../db/database.connection.js";

export const getFavoritesByUserId = async (userId) => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM favorites WHERE Us_id = ?', [userId]);
    return rows;
};

export const addFavorite = async (data) => {
    const { userId, itemId } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO favorites (Us_id, It_id, Fav_created_at) VALUES (?, ?, NOW())',
        [userId, itemId]
    );
    return { id: result.insertId, ...data };
};

export const removeFavorite = async (id, userId) => {
    const db = await connected();

    // Check ownership
    const [rows] = await db.execute('SELECT Us_id FROM favorites WHERE Fav_id = ?', [id]);
    if (rows.length === 0) throw new Error('Favorite not found');
    if (rows[0].Us_id !== userId) throw new Error('Unauthorized');

    await db.execute('DELETE FROM favorites WHERE Fav_id = ?', [id]);
    return { message: 'Favorite removed' };
};
