const ACCESS_TOKEN_EXPIRY = "15m";
const REFRESH_TOKEN_EXPIRY = "7d";

// Cookie options for auth tokens
const ACCESS_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",  // ✅ Cross-origin ke liye
    maxAge: 15 * 60 * 1000, 
};

const REFRESH_TOKEN_COOKIE_OPTIONS = {
    httpOnly: true,
    secure: true,
    sameSite: "none",  // ✅ Cross-origin ke liye
    maxAge: 7 * 24 * 60 * 60 * 1000, 
    path: "/",
};

export {
    ACCESS_TOKEN_EXPIRY,
    REFRESH_TOKEN_EXPIRY,
    ACCESS_TOKEN_COOKIE_OPTIONS,
    REFRESH_TOKEN_COOKIE_OPTIONS,
};