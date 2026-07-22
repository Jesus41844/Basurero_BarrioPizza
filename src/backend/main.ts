import "reflect-metadata";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { AppDataSource } from "../shared/database";
import { hardwareRoutes } from "./routes/hardware";
import { clientRoutes } from "./routes/client";
import { staffRoutes } from "./routes/staff";
import { adminRoutes } from "./routes/admin";
import { binsRoutes } from "./routes/bins";
import { authRoutes, authMiddleware } from "../shared/auth";
import { sseHandler } from "../shared/events";
import { errorHandler } from "../shared/errorHandler";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/events", sseHandler);

app.use("/api/v1/bins", binsRoutes);
app.use("/api/v1/hardware", hardwareRoutes);
app.use("/api/v1/client", authMiddleware, clientRoutes);
app.use("/api/v1/staff", authMiddleware, staffRoutes);
app.use("/api/v1/admin", authMiddleware, adminRoutes);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Backend corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al conectar DB:", err);
  });
