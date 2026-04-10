import jwt from "jsonwebtoken";
import env from "../config/dotenv.js";
import { ACCESS_TOKEN_EXPIRY, REFRESH_TOKEN_EXPIRY } from "../constant.js";


/**
 * Generate an access token (short-lived)
 * @param {Object} payload - Data to encode (e.g. { userId, email })
 * @returns {string} Signed JWT access token
 */
const generateAccessToken = (payload) => {
    return jwt.sign(payload, env.ACCESS_TOKEN_SECRET, {
        expiresIn: ACCESS_TOKEN_EXPIRY
    });
};

/**
 * Generate a refresh token (long-lived)
 * @param {Object} payload - Data to encode (e.g. { userId })
 * @returns {string} Signed JWT refresh token
 */
const generateRefreshToken = (payload) => {
    return jwt.sign(payload, env.REFRESH_TOKEN_SECRET, {
        expiresIn: REFRESH_TOKEN_EXPIRY
    });
};

/**
 * Verify an access token
 * @param {string} token - The JWT access token to verify
 * @returns {Object} Decoded payload if valid
 * @throws {JsonWebTokenError | TokenExpiredError} If token is invalid or expired
 */
const verifyAccessToken = (token) => {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

/**
 * Verify a refresh token
 * @param {string} token - The JWT refresh token to verify
 * @returns {Object} Decoded payload if valid
 * @throws {JsonWebTokenError | TokenExpiredError} If token is invalid or expired
 */
const verifyRefreshToken = (token) => {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
};

/**
 * Generate both access and refresh tokens at once
 * @param {Object} user - User object from DB (must have _id and email)
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const generateTokens = (user) => {
    const accessToken = generateAccessToken({
        userId: user._id,
        email: user.email,
    });

    const refreshToken = generateRefreshToken({
        userId: user._id,
    });

    return { accessToken, refreshToken };
};

export {
    generateAccessToken,
    generateRefreshToken,
    verifyAccessToken,
    verifyRefreshToken,
    generateTokens,
};
