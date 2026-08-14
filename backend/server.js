import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import {notFound, errorHandler} from "./middleware/errorHandler.js";

const app = express();

const allowedOrigins = (process.env.CLIENT_URL || "")
.split(",")
.map(origin => origin.trim())
.filter(Boolean);

const corsOptions = {
    origin(origin, cb){
        // Allow requests that don't have an Origin header
        if (!origin) {
            return cb(null, true);
        }
        if(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin)) {
            return cb(null, true);
        } 
        if (allowedOrigins.includes(origin)) {
            return cb(null, true);
        }
        return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Enable pre-flight for all routes
app.use(express.json({limit: "1mb"}));

app.get("/api/health", (req, res) => 
    res.json({ status:"ok", time: new Date().toISOString()})
);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 8000;
// Start the server
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});