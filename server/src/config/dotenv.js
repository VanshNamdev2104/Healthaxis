import dotenv from "dotenv";
dotenv.config();

const requiredEnv = ["PORT", "MONGO_URI"];
const optionalEnv = [
    "ACCESS_TOKEN_SECRET",
    "REFRESH_TOKEN_SECRET",
    "MAIL_CLIENT_ID",
    "MAIL_CLIENT_SECRET",
    "MAIL_REFRESH",
    "MAIL_USER",
    "GEMINI_API_KEY",
    "MISTRAL_API_KEY",
    "GROQ_API_KEY",
    "GOOGLE_CLIENT",
    "GOOGLE_SECRET",
    "CLIENT_URL",
    "SERVER_URL",
    "IMAGEKIT_PUBLIC_KEY",
    "IMAGEKIT_PRIVATE_KEY",
    "IMAGEKIT_URL_ENDPOINT"
];

requiredEnv.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Required environment variable ${key} is not defined`);
    }
});

optionalEnv.forEach((key) => {
    if (!process.env[key]) {
        console.warn(`[Config] Optional environment variable ${key} is not defined. Related features may be disabled.`);
    }
});

const env = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    ACCESS_TOKEN_SECRET: process.env.ACCESS_TOKEN_SECRET,
    REFRESH_TOKEN_SECRET: process.env.REFRESH_TOKEN_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    MISTRAL_API_KEY: process.env.MISTRAL_API_KEY,
    GROQ_API_KEY: process.env.GROQ_API_KEY,
    MAIL_CLIENT_ID: process.env.MAIL_CLIENT_ID,
    MAIL_CLIENT_SECRET: process.env.MAIL_CLIENT_SECRET,
    MAIL_REFRESH: process.env.MAIL_REFRESH,
    MAIL_USER: process.env.MAIL_USER,
    GOOGLE_CLIENT: process.env.GOOGLE_CLIENT,
    GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    CLIENT_URL: process.env.CLIENT_URL,
    SERVER_URL: process.env.SERVER_URL,
    IMAGEKIT_PUBLIC_KEY: process.env.IMAGEKIT_PUBLIC_KEY,
    IMAGEKIT_PRIVATE_KEY: process.env.IMAGEKIT_PRIVATE_KEY,
    IMAGEKIT_URL_ENDPOINT: process.env.IMAGEKIT_URL_ENDPOINT
}

export default env;
