import express from "express";
import logger from "morgan";
import cookieParser from "cookie-parser";
import passport from "./config/passport.js";
import { notFoundResponse } from "./utils/responsehandler.js";
import errorhandlerMiddleware from "./utils/errorhandler.js";
import userRoutes from "./routes/user/index.js";
import authRoutes from "./routes/auth/google.routes.js";
import graphService from "./services/ai/graph.service.js";

const app = express();
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.set("trust proxy", true);


// ─── API Routes ──────────────────────────────────────────────
app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);


app.post("/graph", async (req, res) => {
    try {
        const problem = "Muje Fever lag rha hai or sir me dard bhi hai! i am feel very bad sinse tommorow."
        const result = await graphService( problem)
        console.log(result);
        res.json(result)
    } catch (error) {
        console.log(error);
    }

});

app.use((req, res) => {
    return notFoundResponse(res, {
        ip: req.ip,
        method: req.method,
        url: `${req.protocol}://${req.get("host")}${req.originalUrl}`
    });
});



app.use(errorhandlerMiddleware);
export default app;
