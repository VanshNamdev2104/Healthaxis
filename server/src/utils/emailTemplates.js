/**
 * Email Templates for HealthAxis
 * Each template returns { subject, text, html }
 */

// ─── Shared Styles ──────────────────────────────────────────────
const brandColor = "#0ea5e9";
const bgColor = "#f8fafc";

const wrapHtml = (content) => `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0; padding:0; background-color:${bgColor}; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:${bgColor}; padding: 40px 0;">
        <tr>
            <td align="center">
                <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff; border-radius:12px; overflow:hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
                    <!-- Header -->
                    <tr>
                        <td style="background: linear-gradient(135deg, ${brandColor}, #0284c7); padding: 32px 40px; text-align:center;">
                            <h1 style="margin:0; color:#ffffff; font-size:28px; font-weight:700; letter-spacing:-0.5px;">HealthAxis</h1>
                        </td>
                    </tr>
                    <!-- Body -->
                    <tr>
                        <td style="padding: 40px;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 24px 40px; background-color:#f1f5f9; text-align:center; border-top: 1px solid #e2e8f0;">
                            <p style="margin:0; color:#94a3b8; font-size:13px;">© ${new Date().getFullYear()} HealthAxis. All rights reserved.</p>
                            <p style="margin:4px 0 0; color:#94a3b8; font-size:12px;">This is an automated email, please do not reply.</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
`;

// ─── Welcome Email (Registration) ───────────────────────────────
export const welcomeEmail = (name) => {
    const subject = "Welcome to HealthAxis! 🎉";

    const text = `Hi ${name},\n\nWelcome to HealthAxis! Your account has been created successfully.\n\nYou can now access all our health management features.\n\nBest regards,\nThe HealthAxis Team`;

    const html = wrapHtml(`
        <h2 style="margin:0 0 16px; color:#1e293b; font-size:22px;">Welcome aboard, ${name}! 🎉</h2>
        <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
            Your HealthAxis account has been created successfully. We're excited to have you on board!
        </p>
        <p style="margin:0 0 24px; color:#475569; font-size:15px; line-height:1.6;">
            You now have access to all our health management features. Start exploring and take control of your health journey.
        </p>
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto;">
            <tr>
                <td style="background-color:${brandColor}; border-radius:8px; padding:14px 32px;">
                    <span style="color:#ffffff; font-size:15px; font-weight:600; text-decoration:none;">Get Started</span>
                </td>
            </tr>
        </table>
        <p style="margin:24px 0 0; color:#94a3b8; font-size:13px;">If you didn't create this account, please ignore this email.</p>
    `);

    return { subject, text, html };
};

// ─── Login Alert Email ──────────────────────────────────────────
export const loginAlertEmail = (name, ip, timestamp) => {
    const subject = "New Login to Your HealthAxis Account";

    const text = `Hi ${name},\n\nA new login was detected on your HealthAxis account.\n\nTime: ${timestamp}\nIP Address: ${ip}\n\nIf this wasn't you, please secure your account immediately.\n\nBest regards,\nThe HealthAxis Team`;

    const html = wrapHtml(`
        <h2 style="margin:0 0 16px; color:#1e293b; font-size:22px;">New Login Detected 🔐</h2>
        <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
            Hi ${name}, a new login was detected on your HealthAxis account.
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:8px; border: 1px solid #e2e8f0; margin-bottom:24px;">
            <tr>
                <td style="padding:16px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="color:#94a3b8; font-size:13px;">Time</span><br>
                    <span style="color:#1e293b; font-size:15px; font-weight:500;">${timestamp}</span>
                </td>
            </tr>
            <tr>
                <td style="padding:16px 20px;">
                    <span style="color:#94a3b8; font-size:13px;">IP Address</span><br>
                    <span style="color:#1e293b; font-size:15px; font-weight:500;">${ip}</span>
                </td>
            </tr>
        </table>
        <p style="margin:0; color:#ef4444; font-size:14px; font-weight:500;">
            ⚠️ If this wasn't you, please change your password immediately.
        </p>
    `);

    return { subject, text, html };
};

// ─── Account Deleted Email ──────────────────────────────────────
export const accountDeletedEmail = (name) => {
    const subject = "Your HealthAxis Account Has Been Deleted";

    const text = `Hi ${name},\n\nYour HealthAxis account has been successfully deleted. All your data has been removed.\n\nWe're sorry to see you go. If you ever want to come back, you're always welcome.\n\nBest regards,\nThe HealthAxis Team`;

    const html = wrapHtml(`
        <h2 style="margin:0 0 16px; color:#1e293b; font-size:22px;">Account Deleted</h2>
        <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
            Hi ${name}, your HealthAxis account has been successfully deleted and all your data has been removed.
        </p>
        <p style="margin:0 0 24px; color:#475569; font-size:15px; line-height:1.6;">
            We're sorry to see you go. If you ever want to come back, you're always welcome to create a new account.
        </p>
        <p style="margin:0; color:#94a3b8; font-size:13px;">
            This is a confirmation email. No further action is needed.
        </p>
    `);

    return { subject, text, html };
};
export const forgotPasswordEmail = (name, resetToken) => {
    const subject = "Reset Your HealthAxis Password";

    const resetLink = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password?token=${resetToken}`;

    const text = `Hi ${name},\n\nWe received a request to reset your HealthAxis account password.\n\nClick the link below to reset your password:\n${resetLink}\n\nThis link will expire in 15 minutes.\n\nIf you didn't request a password reset, please ignore this email. Your password will remain unchanged.\n\nBest regards,\nThe HealthAxis Team`;

    const html = wrapHtml(`
        <h2 style="margin:0 0 16px; color:#1e293b; font-size:22px;">Reset Your Password 🔑</h2>
        <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
            Hi ${name}, we received a request to reset your HealthAxis account password.
        </p>
        <p style="margin:0 0 24px; color:#475569; font-size:15px; line-height:1.6;">
            Click the button below to create a new password:
        </p>
        <table cellpadding="0" cellspacing="0" style="margin: 0 auto 24px;">
            <tr>
                <td style="background-color:${brandColor}; border-radius:8px; padding:14px 32px;">
                    <a href="${resetLink}" style="color:#ffffff; font-size:15px; font-weight:600; text-decoration:none; display:inline-block;">Reset Password</a>
                </td>
            </tr>
        </table>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#fffbeb; border-radius:8px; border: 1px solid #fde68a; margin-bottom:24px;">
            <tr>
                <td style="padding:16px 20px;">
                    <span style="color:#92400e; font-size:14px; font-weight:500;">⏱️ This link will expire in 15 minutes.</span>
                </td>
            </tr>
        </table>
        <p style="margin:0 0 8px; color:#94a3b8; font-size:13px;">
            If the button doesn't work, copy and paste this link into your browser:
        </p>
        <p style="margin:0 0 16px; color:#0ea5e9; font-size:13px; word-break:break-all;">
            ${resetLink}
        </p>
        <p style="margin:0; color:#ef4444; font-size:14px; font-weight:500;">
            ⚠️ If you didn't request this, please ignore this email. Your password will remain unchanged.
        </p>
    `);

    return { subject, text, html };
}
// ─── Password Changed Email ─────────────────────────────────────
export const passwordChangedEmail = (name) => {
    const subject = "Your HealthAxis Password Was Changed";

    const text = `Hi ${name},\n\nYour HealthAxis account password has been changed successfully.\n\nIf you didn't make this change, please secure your account immediately.\n\nBest regards,\nThe HealthAxis Team`;

    const html = wrapHtml(`
        <h2 style="margin:0 0 16px; color:#1e293b; font-size:22px;">Password Changed ✅</h2>
        <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
            Hi ${name}, your HealthAxis account password has been changed successfully.
        </p>
        <p style="margin:0; color:#ef4444; font-size:14px; font-weight:500;">
            ⚠️ If you didn't make this change, please secure your account immediately.
        </p>
    `);

    return { subject, text, html };
};

// ─── Profile Updated Email ──────────────────────────────────────
export const profileUpdatedEmail = (name, updatedFields) => {
    const subject = "Your HealthAxis Profile Was Updated";

    const fieldsList = Object.keys(updatedFields).join(", ");

    const text = `Hi ${name},\n\nYour HealthAxis profile has been updated. The following fields were changed: ${fieldsList}.\n\nIf you didn't make these changes, please secure your account immediately.\n\nBest regards,\nThe HealthAxis Team`;

    const fieldsHtml = Object.entries(updatedFields)
        .map(([key, value]) => `
            <tr>
                <td style="padding:12px 20px; border-bottom: 1px solid #e2e8f0;">
                    <span style="color:#94a3b8; font-size:13px; text-transform:capitalize;">${key}</span><br>
                    <span style="color:#1e293b; font-size:15px; font-weight:500;">${value}</span>
                </td>
            </tr>
        `)
        .join("");

    const html = wrapHtml(`
        <h2 style="margin:0 0 16px; color:#1e293b; font-size:22px;">Profile Updated ✏️</h2>
        <p style="margin:0 0 16px; color:#475569; font-size:15px; line-height:1.6;">
            Hi ${name}, the following changes were made to your profile:
        </p>
        <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; border-radius:8px; border: 1px solid #e2e8f0; margin-bottom:24px;">
            ${fieldsHtml}
        </table>
        <p style="margin:0; color:#ef4444; font-size:14px; font-weight:500;">
            ⚠️ If you didn't make these changes, please secure your account immediately.
        </p>
    `);

    return { subject, text, html };
};
