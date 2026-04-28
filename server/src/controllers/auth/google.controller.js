import { generateTokens } from "../../utils/token.js";
import {
    ACCESS_TOKEN_COOKIE_OPTIONS,
    REFRESH_TOKEN_COOKIE_OPTIONS,
} from "../../constant.js";
import logger from "../../config/logger.js";

export const googleCallback = async (req, res) => {
    try {
        const user = req.user;

        const { accessToken, refreshToken } = generateTokens(user);

        user.refreshToken = refreshToken;
        await user.save();

        
        res.clearCookie("accessToken", { ...ACCESS_TOKEN_COOKIE_OPTIONS });
        res.clearCookie("refreshToken", { ...REFRESH_TOKEN_COOKIE_OPTIONS });

    
        res.cookie("accessToken", accessToken, ACCESS_TOKEN_COOKIE_OPTIONS);
        res.cookie("refreshToken", refreshToken, REFRESH_TOKEN_COOKIE_OPTIONS);

        // ✅ Role based redirect
        const redirectPath = user.role === "admin" ? "/admin/dashboard"
            : user.role === "hospitalAdmin" ? "/hospital/dashboard"
            : "/dashboard";

        return res.redirect(
            `${process.env.CLIENT_URL || "https://healthaxis-plum.vercel.app"}${redirectPath}`
        );
    } catch (error) {
        logger.error("Google Auth Callback Error", { 
            error: error.message, 
            stack: error.stack,
            userId: req.user?.id 
        });
        return res.redirect(
            `${process.env.CLIENT_URL || "https://healthaxis-plum.vercel.app"}/auth?error=google_auth_failed`
        );
    }
};