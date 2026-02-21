// backend/src/app.js
import express from "express";
import cors from "cors";
import configRoutes from "./routes/config.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

export const app = express();
app.use(cors({ origin: ["http://localhost:5173"] }));
app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/configs", configRoutes);
app.use("/api/payments", paymentRoutes);
