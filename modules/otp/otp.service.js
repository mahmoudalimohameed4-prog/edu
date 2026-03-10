import { connected } from "../../db/database.connection.js";
import otpGenerator from "otp-generator";
import bcrypt from "bcrypt";
import twilio from "twilio";

/**
 * Generates and sends an OTP to the user's registered phone number.
 * @param {string} email - User email used to look up phone number
 * @returns {Promise<string>} Success message
 */
export const sendOTP = async (email) => {
    const db = await connected();

    // 1. Fetch user's phone number
    const [users] = await db.execute(`SELECT Us_phone FROM users WHERE Us_email = ?`, [email]);
    if (users.length === 0) {
        throw new Error("User with this email not found");
    }

    const phoneNumber = users[0].Us_phone;
    if (!phoneNumber) {
        throw new Error("No phone number found for this user account");
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
    await db.execute(insertQuery, [email, hashedOTP]);

    // 4. Format Phone Number (Ensuring E.164 format for Twilio)
    let formattedPhone = phoneNumber.trim();
    if (!formattedPhone.startsWith('+')) {
        // If it starts with 0, remove it (e.g., 010... -> 10...)
        if (formattedPhone.startsWith('0')) {
            formattedPhone = formattedPhone.substring(1);
        }
        // Assume Egypt (+20) if no other code is provided
        formattedPhone = `+20${formattedPhone}`;
    }

    // 5. Send SMS via Twilio
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

    await client.messages.create({
        body: `Your EduSwap verification code is: ${otp}. Valid for 10 minutes.`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: formattedPhone
    });

    return "OTP sent successfully to your registered phone number";
};

/**
 * Verifies the provided OTP.
 * @param {string} email - User email
 * @param {string} otp - OTP to verify
 * @returns {Promise<string>} Verification result
 */
export const verifyOTP = async (email, otp) => {
    const db = await connected();

    const query = `SELECT * FROM otp_codes WHERE email = ? AND used = 0 AND expires_at > NOW() ORDER BY created_at DESC LIMIT 1`;
    const [rows] = await db.execute(query, [email]);

    if (rows.length === 0) {
        throw new Error("OTP not found, expired, or already used");
    }

    const record = rows[0];
    const isValid = await bcrypt.compare(otp, record.otp_hash);
    if (!isValid) {
        throw new Error("Invalid OTP");
    }

    await db.execute(`UPDATE otp_codes SET used = 1 WHERE id = ?`, [record.id]);

    return "OTP verified successfully";
};
