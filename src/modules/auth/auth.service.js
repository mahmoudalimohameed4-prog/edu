import { connected } from "../../db/database.connection.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


/**
 * Registers a new user.
 * Hashes the password and stores user details including phone number in the database.
 * @param {Object} input - User registration data
 * @returns {Promise<Object>} Database insertion result
 */
export const signup = async (input) => {
    const { name, username, email, password, phone } = input;
    const displayName = name || username;
    const DEFAULT_TYPE_ID = 2;
    const db = await connected();

    // 1. Validate required fields
    if (!phone) {
        throw new Error("رقم الهاتف مطلوب لإتمام عملية التسجيل");
    }

    // 1. Check if email already exists
    const [existingUsers] = await db.execute(`SELECT Us_id FROM users WHERE Us_email = ?`, [email]);
    if (existingUsers.length > 0) {
        throw new Error("البريد الإلكتروني مسجل بالفعل لمستخدم آخر");
    }

    // 2. Validate Password Complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        throw new Error("كلمة المرور يجب أن تحتوي على 6 أحرف على الأقل، تشمل حرف كبير، حرف صغير، ورقم (بالإنجليزي)");
    }

    // 3. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const insertQuery = `INSERT INTO users (Us_name, Us_email, Us_password, Us_phone, Ty_id, is_verified) VALUES (?, ?, ?, ?, ?, 0)`;
    const [data] = await db.execute(insertQuery, [displayName, email, hashedPassword, phone, DEFAULT_TYPE_ID]);
    return data;
};


export const login = async (data) => {
    const { email, password } = data;
    const db = await connected();

    const query = `SELECT * FROM users WHERE Us_email = ?`;
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
        throw new Error("البريد الإلكتروني غير موجود");
    }

    const user = rows[0];

    // Check if user is verified
    if (!user.is_verified) {
        throw new Error("يرجى تفعيل حسابك أولاً عن طريق رمز التحقق المرسل إليك");
    }

    // Compare hashed password
    const match = await bcrypt.compare(password, user.Us_password);
    if (!match) {
        throw new Error("كلمة المرور غير صحيحة");
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

/**
 * Handle Google Login
 * @param {string} idToken - The ID token from Google
 * @returns {Promise<Object>} Token and user info
 */
export const googleLogin = async (idToken) => {
    const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name, picture, sub: googleId } = payload;

    const db = await connected();

    // Check if user exists
    const query = `SELECT * FROM users WHERE Us_email = ?`;
    const [rows] = await db.execute(query, [email]);

    let user;
    if (rows.length === 0) {
        // Create new user if not exists
        const DEFAULT_TYPE_ID = 2;
        // Generate a random password since it's NOT NULL
        const randomPassword = Math.random().toString(36).slice(-10);
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(randomPassword, saltRounds);

        const insertQuery = `insert into users (Us_name, Us_email, Us_password, Us_profile_picture, Ty_id, is_verified) values (?, ?, ?, ?, ?, ?)`;
        const [result] = await db.execute(insertQuery, [name, email, hashedPassword, picture, DEFAULT_TYPE_ID, 1]);

        const [newUser] = await db.execute(`SELECT * FROM users WHERE Us_id = ?`, [result.insertId]);
        user = newUser[0];
    } else {
        user = rows[0];
    }

    // JWT
    const token = jwt.sign(
        { id: user.Us_id, email: user.Us_email },
        process.env.JWT_SECRET || 'defaultSecret',
        { expiresIn: "7d" }
    );

    return {
        token,
        user: {
            id: user.Us_id,
            name: user.Us_name,
            email: user.Us_email,
            picture: user.Us_profile_picture
        }
    };
};
