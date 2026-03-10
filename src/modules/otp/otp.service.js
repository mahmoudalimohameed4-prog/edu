import { connected } from "../../db/database.connection.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

/**
 * Configure Nodemailer transporter
 * Users should update these in their .env file
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
    });
};

/**
 * Generates and sends an OTP to the user via Email.
 * @param {string} email - User email
 * @returns {Promise<string>} Success message
 */
export const sendOTP = async (email) => {
    const db = await connected();

    let userEmail = email?.trim();

    if (!userEmail) {
        throw new Error("البريد الإلكتروني مطلوب");
    }

    // 1. Fetch user data to verify email exists
    const [users] = await db.execute(`SELECT Us_email FROM users WHERE Us_email = ?`, [userEmail]);

    if (users.length === 0) {
        throw new Error("لم نتمكن من العثور على حساب بهذا البريد الإلكتروني");
    }

    // 2. Generate OTP (6 digits)
    const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
        lowerCaseAlphabets: false,
        digits: true
    });

    // 3. Hash and Store OTP
    const hashedOTP = await bcrypt.hash(otp, 10);
    const insertQuery = `INSERT INTO otp_codes (email, otp_hash, expires_at, used) VALUES (?, ?, DATE_ADD(NOW(), INTERVAL 10 MINUTE), 0)`;
    await db.execute(insertQuery, [userEmail, hashedOTP]);

    // 4. Send OTP via Email
    return await sendEmail(userEmail, otp);
};

/**
 * Internal helper to send Email via Nodemailer
 */
async function sendEmail(email, otp) {
    const transporter = createTransporter();

    const mailOptions = {
        from: `"EduSwap Verification" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "رمز التحقق - EduSwap",
        html: `
            <div dir="rtl" style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 500px; margin: auto;">
                <h2 style="color: #2D3748; text-align: center;">مرحباً بك في EduSwap</h2>
                <p style="font-size: 16px; color: #4A5568;">رمز التحقق الخاص بك هو:</p>
                <div style="background: #F7FAFC; padding: 15px; text-align: center; border-radius: 8px;">
                    <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #3182CE;">${otp}</span>
                </div>
                <p style="font-size: 14px; color: #718096; margin-top: 20px;">هذا الرمز صالح لمدة 10 دقائق فقط. إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد.</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
                <p style="text-align: center; font-size: 12px; color: #A0AEC0;">© 2026 EduSwap Platform</p>
            </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        return "تم إرسال رمز التحقق إلى بريدك الإلكتروني بنجاح";
    } catch (error) {
        console.error("Email Error:", error.message);
        // Fallback for dev - STILL print to terminal for debugging
        console.log("\x1b[33m%s\x1b[0m", "--- [DEV DEBUG] OTP Code ---");
        console.log("\x1b[33m%s\x1b[0m", `Email: ${email}`);
        console.log("\x1b[33m%s\x1b[0m", `OTP: ${otp}`);
        console.log("\x1b[33m%s\x1b[0m", "----------------------------");
        return "تم الإرسال لبريدك (تحقق من البريد أو الـ Terminal في حال وجود مشكلة تقنية)";
    }
}

/**
 * Verifies the provided OTP.
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @param {boolean} markUsed - Whether to mark OTP as used (default true)
 * @param {boolean} updateVerified - Whether to mark user as verified (default true)
 * @returns {Promise<boolean>} Success status
 */
export const verifyOTP = async (email, otp, markUsed = true, updateVerified = true) => {
    const db = await connected();
    let userEmail = email?.trim();

    const query = `SELECT * FROM otp_codes WHERE email = ? AND used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`;
    const [rows] = await db.execute(query, [userEmail]);

    if (rows.length === 0) {
        throw new Error("رمز التحقق غير موجود أو منتهي الصلاحية");
    }

    const record = rows[0];
    const isValid = await bcrypt.compare(otp, record.otp_hash);
    if (!isValid) {
        throw new Error("رمز التحقق غير صحيح");
    }

    if (markUsed) {
        // Mark as used
        await db.execute(`UPDATE otp_codes SET used = 1 WHERE id = ?`, [record.id]);
    }

    if (updateVerified) {
        // Mark user as verified
        await db.execute(`UPDATE users SET is_verified = 1 WHERE Us_email = ?`, [userEmail]);
    }

    return true;
};
