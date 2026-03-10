import { connected } from "../../db/database.connection.js";

/**
 * Get all categories
 * @returns {Promise<Array>} List of categories
 */
export const getAllCategories = async () => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM categories');
    return rows;
};

/**
 * Create a new category
 * @param {Object} data - Category data (name, nameEn, description, icon)
 * @returns {Promise<Object>} Newly created category
 */
export const createCategory = async (data) => {
    const { name, nameEn, description, icon } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO categories (Cat_name, Cat_name_en, Cat_description, Cat_icon) VALUES (?, ?, ?, ?)',
        [name, nameEn, description, icon]
    );
    return { id: result.insertId, ...data };
};

/**
 * Update category by ID
 * @param {number} id - Category ID
 * @param {Object} data - Updated category data
 * @returns {Promise<Object>} Updated category
 */
export const updateCategory = async (id, data) => {
    const { name, nameEn, description, icon } = data;
    const db = await connected();
    await db.execute(
        'UPDATE categories SET Cat_name = ?, Cat_name_en = ?, Cat_description = ?, Cat_icon = ? WHERE Cat_id = ?',
        [name, nameEn, description, icon, id]
    );
    return { id, ...data };
};

/**
 * Delete category by ID
 * @param {number} id - Category ID
 * @returns {Promise<Object>} Deletion confirmation
 */
export const deleteCategory = async (id) => {
    const db = await connected();
    await db.execute('DELETE FROM categories WHERE Cat_id = ?', [id]);
    return { message: 'Category deleted' };
};
