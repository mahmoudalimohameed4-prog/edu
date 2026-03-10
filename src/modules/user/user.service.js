import { connected } from "../../db/database.connection.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

/**
 * Retrieves user profile data.
 * Queries the database for user details by email.
 * @param {string} email - User email
 * @returns {Promise<Object>} User profile data
 */
export const profile = async (email) => {
    const db = await connected();
    const query = `SELECT Us_id, Us_name, Us_email, Us_phone, Us_phone2, Us_university, Us_gender, Us_birthdate, Ty_id, Us_profile_picture, Us_bio, is_verified FROM users WHERE Us_email = ?`;
    const [rows] = await db.execute(query, [email]);


    if (rows.length === 0) {
        throw new Error("user not found");
    }

    const user = rows[0];
    return {
        id: user.Us_id,
        name: user.Us_name,
        email: user.Us_email,
        phone: user.Us_phone,
        phone2: user.Us_phone2,
        university: user.Us_university,
        gender: user.Us_gender,
        birthdate: user.Us_birthdate,
        typeId: user.Ty_id,
        profilePicture: user.Us_profile_picture,
        bio: user.Us_bio,
        isVerified: user.is_verified
    };
};

/**
 * Updates user profile picture.
 * @param {number} userId - User ID
 * @param {string} imagePath - Path to the uploaded image
 * @returns {Promise<Object>} Update result
 */
export const updateProfilePicture = async (userId, imagePath) => {
    const db = await connected();
    await db.execute('UPDATE users SET Us_profile_picture = ?, Us_updated_at = NOW() WHERE Us_id = ?', [imagePath, userId]);
    return { userId, imagePath };
};



/**
 * Updates user profile data.
 * @param {number} userId - User ID
 * @param {Object} data - Profile data (name, phone, phone2, gender, birthdate)
 * @returns {Promise<Object>} Update result
 */
export const updateProfile = async (userId, data) => {
    const db = await connected();

    // 1. Fetch current data to merge
    const [existing] = await db.execute("SELECT * FROM users WHERE Us_id = ?", [userId]);
    if (existing.length === 0) throw new Error("User not found");
    const user = existing[0];

    // 2. Merge provided data with existing data
    const updated = {
        name: data.name !== undefined ? data.name : user.Us_name,
        phone: data.phone !== undefined ? data.phone : user.Us_phone,
        phone2: data.phone2 !== undefined ? data.phone2 : user.Us_phone2,
        university: data.university !== undefined ? data.university : user.Us_university,
        gender: data.gender !== undefined ? data.gender : user.Us_gender,
        birthdate: data.birthdate !== undefined ? data.birthdate : user.Us_birthdate,
        bio: data.bio !== undefined ? data.bio : user.Us_bio
    };

    // 3. Execute Update
    const query = `
        UPDATE users 
        SET Us_name = ?, Us_phone = ?, Us_phone2 = ?, Us_university = ?, Us_gender = ?, Us_birthdate = ?, Us_bio = ?, Us_updated_at = NOW() 
        WHERE Us_id = ?
    `;

    await db.execute(query, [
        updated.name,
        updated.phone,
        updated.phone2,
        updated.university,
        updated.gender,
        updated.birthdate,
        updated.bio,
        userId
    ]);

    return { userId, ...updated };
};

/**
 * Get dashboard stats for a user
 */
export const getDashboardStats = async (userId) => {
    const db = await connected();

    // Total Exchanges (Confirmed/Delivered Orders)
    const [orders] = await db.execute(
        `SELECT COUNT(*) as count FROM orders WHERE (buyer_id = ? OR seller_id = ?) AND Order_status IN ('confirmed', 'delivered')`,
        [userId, userId]
    );

    // Total Items Added
    const [items] = await db.execute(
        `SELECT COUNT(*) as count FROM items WHERE seller_id = ? AND It_status != 'deleted'`,
        [userId]
    );

    // Total Views (Sum of views on user's items)
    const [views] = await db.execute(
        `SELECT SUM(It_views) as count FROM items WHERE seller_id = ?`,
        [userId]
    );

    // User Rating
    const [rating] = await db.execute(
        `SELECT Us_rating FROM users WHERE Us_id = ?`,
        [userId]
    );

    return {
        exchanges: orders[0].count,
        totalItems: items[0].count,
        views: views[0].count || 0,
        rating: rating[0].Us_rating
    };
};

/**
 * Get recent activities for a user
 */
export const getRecentActivities = async (userId) => {
    const db = await connected();

    // Recent orders/swaps
    const [activities] = await db.execute(
        `SELECT 'order' as type, Order_status as title, Order_created_at as time FROM orders WHERE buyer_id = ? OR seller_id = ? ORDER BY Order_created_at DESC LIMIT 5`,
        [userId, userId]
    );

    return activities;
};

/**
 * Change user password
 */
export const changePassword = async (userId, currentPassword, newPassword) => {
    const db = await connected();

    // 1. Get user's current hashed password
    const [rows] = await db.execute('SELECT Us_password FROM users WHERE Us_id = ?', [userId]);
    if (rows.length === 0) throw new Error("User not found");

    const user = rows[0];

    // 2. Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.Us_password);
    if (!isMatch) throw new Error("كلمة المرور الحالية غير صحيحة");

    // 3. Validate New Password Complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        throw new Error("كلمة المرور الجديدة يجب أن تحتوي على 6 أحرف على الأقل، تشمل حرف كبير، حرف صغير، ورقم (بالإنجليزي)");
    }

    // 4. Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update in database
    await db.execute('UPDATE users SET Us_password = ? WHERE Us_id = ?', [hashedNewPassword, userId]);

    // 5. Notify
    try {
        const { createNotification } = await import("../notification/notification.service.js");
        const now = new Date();
        const formattedDate = now.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        await createNotification({
            userId: userId,
            title: "تغيير كلمة المرور 🛡️",
            message: `لقد قمت بتغيير كلمة المرور الخاصة بك في ${formattedDate}.`,
            type: "security",
            link: "/profile"
        });
    } catch (err) {
        console.error("Notification Error:", err.message);
    }

    return { message: "Password updated successfully" };
};

/**
 * Reset password using OTP
 * returns token and user info for automatic login
 */
export const resetPassword = async (email, otp, newPassword) => {
    const db = await connected();

    // 1. Verify OTP internally for security
    const otpQuery = `SELECT * FROM otp_codes WHERE email = ? AND used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`;
    const [otpRows] = await db.execute(otpQuery, [email]);

    if (otpRows.length === 0) {
        throw new Error("رمز التحقق غير موجود أو منتهي الصلاحية");
    }

    const otpRecord = otpRows[0];
    const isOtpValid = await bcrypt.compare(otp, otpRecord.otp_hash);
    if (!isOtpValid) {
        throw new Error("رمز التحقق غير صحيح");
    }

    // 2. Validate New Password Complexity
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPassword)) {
        throw new Error("كلمة المرور الجديدة يجب أن تحتوي على 6 أحرف على الأقل، تشمل حرف كبير، حرف صغير، ورقم (بالإنجليزي)");
    }

    // 3. Hash new password
    const saltRounds = 10;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // 4. Update password
    const [userRows] = await db.execute("SELECT * FROM users WHERE Us_email = ?", [email]);
    if (userRows.length === 0) throw new Error("المستخدم غير موجود");

    const user = userRows[0];
    await db.execute('UPDATE users SET Us_password = ?, is_verified = 1 WHERE Us_id = ?', [hashedNewPassword, user.Us_id]);

    // 5. Mark OTP as used
    await db.execute(`UPDATE otp_codes SET used = 1 WHERE id = ?`, [otpRecord.id]);

    // 6. Generate JWT for automatic login
    const token = jwt.sign(
        { id: user.Us_id, email: user.Us_email },
        process.env.JWT_SECRET || 'superSecretKey123',
        { expiresIn: "7d" }
    );

    // 7. Send Notification
    try {
        const { createNotification } = await import("../notification/notification.service.js");
        const now = new Date();
        const formattedDate = now.toLocaleDateString('ar-EG', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

        await createNotification({
            userId: user.Us_id,
            title: "تحديث حماية الحساب 🛡️",
            message: `تم تغيير كلمة المرور الخاصة بك بنجاح في ${formattedDate}. تم تسجيل دخولك تلقائياً.`,
            type: "security",
            link: "/profile"
        });
    } catch (err) {
        console.error("Notification Error:", err.message);
    }

    return {
        token,
        user: {
            id: user.Us_id,
            name: user.Us_name,
            email: user.Us_email
        }
    };
};
