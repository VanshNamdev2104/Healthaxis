import dotenv from "dotenv";
dotenv.config();

const Env = ["PORT" , "MONGO_URI" , "ACCESS_TOKEN_SECRET" , "REFRESH_TOKEN_SECRET" , "MAIL_CLIENT_ID" , "MAIL_CLIENT_SECRET" , "MAIL_REFRESH" , "MAIL_USER", "GEMINI_API_KEY", "MISTRAL_API_KEY", "GROQ_API_KEY", "GOOGLE_CLIENT", "GOOGLE_SECRET", "CLIENT_URL"];

Env.forEach((key) => {
    if (!process.env[key]) {
        throw new Error(`Environment variable ${key} is not defined`);
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
    CLIENT_URL: process.env.CLIENT_URL
}

export default env;
