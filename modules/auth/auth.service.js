import { connected } from "../../db/database.connection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";


/**
 * Registers a new user.
 * Hashes the password and stores user details including phone number in the database.
 * @param {Object} input - User registration data
 * @returns {Promise<Object>} Database insertion result
 */
export const signup = async (input) => {
    const { username, email, password, phone } = input
    const DEFAULT_TYPE_ID = 2;
    const db = await connected()

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `insert into users (Us_name,Us_email,Us_password,Us_phone,Ty_id)values(?,?,?,?,?)`;
    const [data] = await db.execute(insertQuery, [username, email, hashedPassword, phone, DEFAULT_TYPE_ID])
    return data
}

export const login = async (data) => {
    const { email, password } = data;
    const db = await connected();

    const query = `SELECT * FROM users WHERE Us_email = ?`;
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
        throw new Error("email not found");
    }

    const user = rows[0];

    // Compare hashed password
    const match = await bcrypt.compare(password, user.Us_password);
    if (!match) {
        throw new Error("wrong password");
    }

    // JWT
    const token = jwt.sign(
        { id: user.Us_id, email: user.Us_email },
        process.env.JWT_SECRET || 'defaultSecret', // Use env var or fallback
        { expiresIn: "7d" }
    );

    return {
        token,
        user: {
            id: user.Us_id,
            name: user.Us_name,
            email: user.Us_email
        }
    };
};