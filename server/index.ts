import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { handleStudentLogin, handleAdminLogin } from "./routes/auth";
import {
  handleGetAllRooms,
  handleSearchRooms,
  handleGetRoom,
  handleCreateRoom,
  handleUpdateRoom,
  handleDeleteRoom,
  handleGetSyncVersion,
} from "./routes/rooms";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Auth routes
  app.post("/api/auth/student-login", handleStudentLogin);
  app.post("/api/auth/admin-login", handleAdminLogin);

  // Room routes - public (students can view)
  app.get("/api/rooms", handleGetAllRooms);
  app.get("/api/rooms/search", handleSearchRooms);
  app.get("/api/rooms/:id", handleGetRoom);
  app.get("/api/sync/version", handleGetSyncVersion);

  // Room routes - admin only
  app.post("/api/rooms", handleCreateRoom);
  app.patch("/api/rooms/:id", handleUpdateRoom);
  app.delete("/api/rooms/:id", handleDeleteRoom);

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
