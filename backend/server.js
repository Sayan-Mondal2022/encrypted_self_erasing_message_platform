import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";

import { connectDB } from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "100kb" }));
app.use(morgan("tiny"));

// Routes
app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/users", userRoutes);
app.use("/messages", messageRoutes);

// Start server
connectDB(process.env.MONGO_URI).then(() => {
  app.listen(PORT, () => console.log(`🚀 ReadOnce backend running on http://localhost:${PORT}`));
});