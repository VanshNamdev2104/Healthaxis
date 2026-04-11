import { Router } from "express";
import passport from "../../config/passport.js";
import { googleCallback } from "../../controllers/auth/google.controller.js";

const router = Router();

/**
 * @route   GET /api/auth/google
 * @desc    Redirect user to Google consent screen
 * @access  Public
 */
router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
        session: false,
    })
);

/**
 * @route   GET /api/auth/google/callback
 * @desc    Google redirects here after user grants consent
 * @access  Public
 */
router.get(
    "/google/callback",
    passport.authenticate("google", {
        session: false,
        failureRedirect: (process.env.CLIENT_URL || "http://localhost:5173") + "/login?error=google_auth_failed",
    }),
    googleCallback
);

export default router;
