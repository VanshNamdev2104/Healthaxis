import nodemailer from "nodemailer";
import env from "../config/dotenv.js";

let transporter = null;

const isMailConfigured = env.MAIL_USER && env.MAIL_CLIENT_ID && env.MAIL_CLIENT_SECRET && env.MAIL_REFRESH;

if (isMailConfigured) {
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            type: "OAuth2",
            user: env.MAIL_USER,
            clientId: env.MAIL_CLIENT_ID,
            clientSecret: env.MAIL_CLIENT_SECRET,
            refreshToken: env.MAIL_REFRESH,
        },
    });
    transporter.verify((error, success) => {
        if (error) {
            console.error('Error connecting to email server:', error);
        } else {
            console.log('mail service is ready to send');
        }
    });
} else {
    console.warn('[MailService] Email environment variables are missing. Email features will be disabled.');
}

/**
 * Send an email using the configured transporter
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} text - Plain text body (fallback)
 * @param {string} [html] - Optional HTML body for rich emails
 * @returns {Promise<boolean>} Whether the email was sent successfully
 */
const sendMail = async (to, subject, text, html) => {
    if (!transporter) {
        console.warn('[MailService] Mail transporter is not configured. Skipping send.');
        return false;
    }
    try {
        const mailOptions = {
            from: `"HealthAxis" <${env.MAIL_USER}>`,
            to,
            subject,
            text,
        };

        if (html) {
            mailOptions.html = html;
        }

        await transporter.sendMail(mailOptions);
        console.log(`Mail sent successfully to ${to}`);
        return true;
    } catch (error) {
        console.error("Error sending mail:", error);
        return false;
    }
};

export default sendMail;
