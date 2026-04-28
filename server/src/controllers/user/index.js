import User from "../../models/user/user.model.js";
import crypto from "crypto";
import { generateTokens, verifyRefreshToken } from "../../utils/token.js";
import {
    successResponse,
    errorResponse,
    conflictResponse,
    unauthorizedResponse,
    validationError,
    notFoundResponse,
} from "../../utils/responsehandler.js";
import {
    ACCESS_TOKEN_COOKIE_OPTIONS,
    REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../constant.js";
import sendMail from "../../services/mail.service.js";
import {
    welcomeEmail,
    loginAlertEmail,
    profileUpdatedEmail,
    accountDeletedEmail,
    forgotPasswordEmail,
    passwordChangedEmail,
} from "../../utils/emailTemplates.js";

/**
 * @desc    Register a new user
 * @route   POST /api/user/register
 * @access  Public
 */


export const register = async (req, res) => {
    try {
        const { name, email, password, number } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return conflictResponse(res, "User with this email already exists");
        }

        // Create the user (password is hashed via pre-save hook)
        // Always set role to "user" during registration - no privilege escalation
        const user = await User.create({ name, email, password, number, role: "user" });

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to DB
        user.refreshToken = refreshToken;
        await user.save();

        // Set tokens as httpOnly cookies
        res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
        res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        // Send welcome email (fire-and-forget)
        const { subject, text, html } = welcomeEmail(user.name);
        sendMail(user.email, subject, text, html);

        return successResponse(
            res,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                    role: user.role,
                },
            },
            "User registered successfully",
            201
        );
    } catch (error) {
        return errorResponse(res, error, "Registration failed");
    }
};

/**
 * @desc    Login user
 * @route   POST /api/user/login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, number, password } = req.body;

        // Build query to find by either email or number
        const query = {};
        if (email) {
            query.email = email;
        } else if (number) {
            query.number = number;
        } else {
            return validationError(res, "Please provide email or number");
        }

        // Find user
        const user = await User.findOne(query);
        if (!user) {
            return unauthorizedResponse(res, "Invalid credentials");
        }

        // Compare password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return unauthorizedResponse(res, "Invalid credentials");
        }

        // Generate tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Save refresh token to DB
        user.refreshToken = refreshToken;
        await user.save();

        // Set tokens as httpOnly cookies
        res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
        res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        // Send login alert email (fire-and-forget)
        const loginTime = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
        const { subject, text, html } = loginAlertEmail(user.name, req.ip, loginTime);
        sendMail(user.email, subject, text, html);

        return successResponse(
            res,
            {
                user: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    number: user.number,
                    role: user.role,
                },
            },
            "Login successful"
        );
    } catch (error) {
        return errorResponse(res, error, "Login failed");
    }
};

/**
 * @desc    Logout user (invalidate refresh token)
 * @route   POST /api/user/logout
 * @access  Private
 */
export const logout = async (req, res) => {
    try {
        // Clear the refresh token from DB
        await User.findByIdAndUpdate(req.user._id, { refreshToken: null });

        // Clear auth cookies
        res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
        res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);

        return successResponse(res, null, "Logged out successfully");
    } catch (error) {
        return errorResponse(res, error, "Logout failed");
    }
};

/**
 * @desc    Refresh access token using refresh token
 * @route   POST /api/user/refresh-token
 * @access  Public
 */
export const refreshToken = async (req, res) => {
    try {
        // Read refresh token from cookies first, then fall back to body
        const token = req.cookies?.refreshToken || req.body.refreshToken;

        if (!token) {
            return validationError(res, "Refresh token is required");
        }

        // Verify the refresh token
        const decoded = verifyRefreshToken(token);

        // Find the user and check if the refresh token matches
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== token) {
            return unauthorizedResponse(res, "Invalid refresh token");
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);

        // Update refresh token in DB
        user.refreshToken = newRefreshToken;
        await user.save();

        // Set new tokens as httpOnly cookies
        res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
        res.cookie("refreshToken", newRefreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        return successResponse(
            res,
            null,
            "Token refreshed successfully"
        );
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            return unauthorizedResponse(res, "Refresh token has expired, please login again");
        }
        return unauthorizedResponse(res, "Invalid refresh token");
    }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
export const getProfile = async (req, res) => {
    try {
        return successResponse(res, { user: req.user }, "Profile fetched successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to fetch profile");
    }
};

/**
 * @desc    Update user profile (name, email, profile image)
 * @route   PUT /api/user/profile
 * @access  Private
 */
export const updateProfile = async (req, res) => {
    try {
        const { name, email, number } = req.body;
        const updates = {};

        if (name) updates.name = name;
        if (number) updates.number = number;

        // If email is being changed, check for duplicates and require verification
        if (email && email !== req.user.email) {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return conflictResponse(res, "Email is already in use");
            }
            // ⚠️ TODO: Send verification email and require confirmation before updating
            // For now, we only allow email update if it's unique
            // In production: Create a pendingEmail field and send verification link
            updates.email = email;
        }

        // Handle profile image upload
        if (req.file) {
            const mimeType = req.file.mimetype || 'image/jpeg';
            updates.profileImage = `data:${mimeType};base64,${req.file.buffer.toString('base64')}`;
        }

        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            updates,
            { new: true, runValidators: true }
        ).select("-password -refreshToken");

        // Send profile updated email (fire-and-forget)
        if (Object.keys(updates).length > 0) {
            const { subject, text, html } = profileUpdatedEmail(updatedUser.name, updates);
            sendMail(updatedUser.email, subject, text, html);
        }

        return successResponse(res, { user: updatedUser }, "Profile updated successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to update profile");
    }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/user/account
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
    try {
        const { name, email } = req.user;

        await User.findByIdAndDelete(req.user._id);

        // Clear auth cookies
        res.clearCookie("accessToken", ACCESS_TOKEN_COOKIE_OPTIONS);
        res.clearCookie("refreshToken", REFRESH_TOKEN_COOKIE_OPTIONS);

        // Send account deleted email (fire-and-forget)
        const { subject, text, html } = accountDeletedEmail(name);
        sendMail(email, subject, text, html);

        return successResponse(res, null, "Account deleted successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to delete account");
    }
};


export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return notFoundResponse(res, "User not found");
        }
        const resetToken = crypto.randomBytes(32).toString("hex");
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
        await user.save();
        const { subject, text, html } = forgotPasswordEmail(user.name, resetToken);
        sendMail(user.email, subject, text, html);
        return successResponse(res, null, "Forgot password email sent successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to forgot password");
    }
}

export const resetPassword = async (req, res) => {
    try {
        const { resetToken, password } = req.body;
        const user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return notFoundResponse(res, "Invalid or expired reset token");
        }
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;
        await user.save();
        const { subject, text, html } = passwordChangedEmail(user.name);
        sendMail(user.email, subject, text, html);
        return successResponse(res, null, "Password reset successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to reset password");
    }
}

/**
 * @desc    Change user password (authenticated)
 * @route   PUT /api/user/change-password
 * @access  Private
 */
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        if (!user) {
            return notFoundResponse(res, "User not found");
        }

        // Verify current password
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return unauthorizedResponse(res, "Current password is incorrect");
        }

        // Update password
        user.password = newPassword;
        await user.save();

        // Send password changed email (fire-and-forget)
        const { subject, text, html } = passwordChangedEmail(user.name);
        sendMail(user.email, subject, text, html);

        return successResponse(res, null, "Password changed successfully");
    } catch (error) {
        return errorResponse(res, error, "Failed to change password");
    }
}