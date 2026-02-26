import { connected } from "../../db/database.connection.js";

/**
 * Retrieves user profile data.
 * Queries the database for user details by email.
 * @param {string} email - User email
 * @returns {Promise<Object>} User profile data
 */
export const profile = async (email) => {
    const db = await connected();
    const query = `SELECT Us_id, Us_name, Us_email, Us_phone, Ty_id FROM users WHERE Us_email = ?`;
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
        throw new Error("user not found");
    }

    return rows[0];
};

