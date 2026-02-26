import { connected } from "../../db/database.connection.js";

export const getAllReviews = async () => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM reviews');
    return rows;
};

export const createReview = async (data) => {
    const { reviewerId, reviewedUserId, orderId, itemId, rating, comment } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO reviews (reviewer_id, reviewed_user_id, Order_id, It_id, Rev_rating, Rev_comment, Rev_created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [reviewerId, reviewedUserId, orderId, itemId, rating, comment]
    );
    return { id: result.insertId, ...data };
};

export const deleteReview = async (id, userId) => {
    const db = await connected();

    // Check ownership
    const [rows] = await db.execute('SELECT reviewer_id FROM reviews WHERE Rev_id = ?', [id]);
    if (rows.length === 0) throw new Error('Review not found');
    if (rows[0].reviewer_id !== userId) throw new Error('Unauthorized');

    await db.execute('DELETE FROM reviews WHERE Rev_id = ?', [id]);
    return { message: 'Review deleted' };
};
