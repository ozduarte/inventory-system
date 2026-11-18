
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";
import inventoryRoutes from "./inventoryRoutes.js";
import orderRoutes from "./orderRoutes.js";
import orderItemRoutes from "./orderItemRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173"
}));

app.use(express.json());
app.use("/api/inventory", inventoryRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/order-items", orderItemRoutes);
// Test the PostgreSQL connection
app.get("/api/health", async (req, res) => {
    try {
        await pool.query("SELECT 1");

        res.json({
            status: "ok",
            database: "connected"
        });
    } catch (error) {
        console.error("Database connection error:", error);

        res.status(500).json({
            status: "error",
            database: "disconnected"
        });
    }
});

app.listen(PORT, () => {
    console.log(`Inventory API running at http://localhost:${PORT}`);
});
