import { generateTokens } from "../../utils/token.js";
import {
    ACCESS_TOKEN_COOKIE_OPTIONS,
    REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../constant.js";
import logger from "../../config/logger.js";

/**
 * @desc    Handle Google OAuth callback — issue JWTs and redirect
 * @route   GET /api/auth/google/callback
 * @access  Public (called by Google after consent)
 */
export const googleCallback = async (req, res) => {
    try {
        const user = req.user; // set by Passport after successful Google auth

        // Generate JWT tokens
        const { accessToken, refreshToken } = generateTokens(user);

        // Persist refresh token in DB
        user.refreshToken = refreshToken;
        await user.save();

        // Set tokens as httpOnly cookies
        res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
        res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        // Redirect to frontend after successful login
        // Update this URL to your frontend's dashboard / home page
        return res.redirect(process.env.CLIENT_URL || "http://localhost:5173");
    } catch (error) {
        logger.error("Google Auth Callback Error", { 
            error: error.message, 
            stack: error.stack,
            userId: req.user?.id 
        });
        return res.redirect(
            (process.env.CLIENT_URL || "http://localhost:5173") + "/login?error=google_auth_failed"
        );
    }
};
