import dotenv from "dotenv";
dotenv.config();

const Env = ["PORT" , "MONGO_URI" , "ACCESS_TOKEN_SECRET" , "REFRESH_TOKEN_SECRET" ]

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
}

export default env;
