// backend/src/app.js
import express from "express";
import cors from "cors";
import configRoutes from "./routes/config.routes.js";
import paymentRoutes from "./routes/payment.routes.js";

export const app = express();

// Permitir orígenes en local + producción (Render)
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL, // ej: https://tu-frontend.onrender.com
].filter(Boolean);

app.use(
  cors({
    origin(origin, cb) {
      // Permite requests sin origin (Postman / server-to-server)
      if (!origin) return cb(null, true);

      if (allowedOrigins.includes(origin)) return cb(null, true);

      return cb(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  }),
);

app.use(express.json({ limit: "1mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));

app.use("/api/configs", configRoutes);
app.use("/api/payments", paymentRoutes);
