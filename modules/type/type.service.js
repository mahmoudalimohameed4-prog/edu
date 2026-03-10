import { connected } from "../../db/database.connection.js";

export const getAllTypes = async () => {
    const db = await connected();
    const [rows] = await db.execute('SELECT * FROM types');
    return rows;
};

export const createType = async (data) => {
    const { name, nameEn } = data;
    const db = await connected();
    const [result] = await db.execute(
        'INSERT INTO types (Ty_name, Ty_name_en) VALUES (?, ?)',
        [name, nameEn]
    );
    return { id: result.insertId, ...data };
};
