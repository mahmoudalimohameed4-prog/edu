import { connected } from "../../db/database.connection.js";
import bcrypt from 'bcrypt';

/**
 * Get all admins
 */
export const getAllAdmins = async () => {
    const db = await connected();
    const [rows] = await db.execute('SELECT Adm_id, Adm_name, Adm_email, Adm_phone FROM admins');
    return rows;
};

/**
 * Get admin by ID
 */
export const getAdminById = async (id) => {
    const db = await connected();
    const [rows] = await db.execute('SELECT Adm_id, Adm_name, Adm_email, Adm_phone FROM admins WHERE Adm_id = ?', [id]);
    if (rows.length === 0) return null;
    return rows[0];
};

/**
 * Create a new admin
 */
export const createAdmin = async (data) => {
    const { name, email, password, phone } = data;
    const db = await connected();

    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const [result] = await db.execute(
        'INSERT INTO admins (Adm_name, Adm_email, Adm_password, Adm_phone) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, phone]
    );
    return { id: result.insertId, name, email, phone };
};

/**
 * Update admin
 */
export const updateAdmin = async (id, data) => {
    const { name, email, phone } = data;
    const db = await connected();
    await db.execute(
        'UPDATE admins SET Adm_name = ?, Adm_email = ?, Adm_phone = ? WHERE Adm_id = ?',
        [name, email, phone, id]
    );
    return { id, ...data };
};

/**
 * Delete admin
 */
export const deleteAdmin = async (id) => {
    const db = await connected();
    await db.execute('DELETE FROM admins WHERE Adm_id = ?', [id]);
    return { message: 'Admin deleted successfully' };
};
