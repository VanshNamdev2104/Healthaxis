import express from "express";
import logger from "morgan";
import { notFoundResponse } from "./utils/responsehandler.js";
import errorhandlerMiddleware from "./utils/errorhandler.js";
import userRoutes from "./routes/user/index.js";
import graphService from "./services/ai/graph.service.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("trust proxy", true);
app.use(logger("dev"));

// ─── API Routes ──────────────────────────────────────────────
app.use("/api/user", userRoutes);

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
