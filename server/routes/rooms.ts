import { RequestHandler } from "express";
import {
  RoomsResponse,
  RoomResponse,
  CreateRoomRequest,
  UpdateRoomRequest,
  DeleteRoomRequest,
  RoomSearchQuery,
} from "@shared/api";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  updateRoom,
  deleteRoom,
  getSyncVersion,
  searchRooms,
} from "../db";

// Authentication middleware
const requireAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
};

const requireAdminAuth: RequestHandler = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token || !token.startsWith("admin_")) {
    return res
      .status(403)
      .json({ success: false, message: "Admin access required" });
  }
  next();
};

export const handleGetAllRooms: RequestHandler<{}, RoomsResponse> = (
  _req,
  res,
) => {
  const rooms = getAllRooms();
  res.json({ rooms });
};

export const handleSearchRooms: RequestHandler<
  {},
  RoomsResponse,
  {},
  RoomSearchQuery
> = (req, res) => {
  const query = req.query;
  const rooms = searchRooms({
    departmentName: query.departmentName,
    blockName: query.blockName,
    floorNumber: query.floorNumber
      ? parseInt(query.floorNumber as string)
      : undefined,
    roomNumber: query.roomNumber,
  });
  res.json({ rooms });
};

export const handleGetRoom: RequestHandler<
  { id: string },
  RoomResponse | { error: string }
> = (req, res) => {
  const room = getRoomById(req.params.id);
  if (!room) {
    return res.status(404).json({ error: "Room not found" });
  }
  res.json({ room });
};

export const handleCreateRoom: RequestHandler<
  {},
  RoomResponse | { error: string },
  CreateRoomRequest
> = (req, res) => {
  requireAdminAuth(req, res, () => {
    const { blockName, floorNumber, roomNumber, departmentName, capacity } =
      req.body;

    if (
      !blockName ||
      floorNumber === undefined ||
      !roomNumber ||
      !departmentName
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const room = createRoom({
        blockName,
        floorNumber: Number(floorNumber),
        roomNumber,
        departmentName,
        capacity,
      });
      res.status(201).json({ room });
    } catch (error) {
      res.status(500).json({ error: "Failed to create room" });
    }
  });
};

export const handleUpdateRoom: RequestHandler<
  { id: string },
  RoomResponse | { error: string },
  UpdateRoomRequest
> = (req, res) => {
  requireAdminAuth(req, res, () => {
    const room = updateRoom(req.params.id, req.body);
    if (!room) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ room });
  });
};

export const handleDeleteRoom: RequestHandler<
  { id: string },
  { success: boolean } | { error: string }
> = (req, res) => {
  requireAdminAuth(req, res, () => {
    const success = deleteRoom(req.params.id);
    if (!success) {
      return res.status(404).json({ error: "Room not found" });
    }
    res.json({ success: true });
  });
};

export const handleGetSyncVersion: RequestHandler<{}, { version: number }> = (
  _req,
  res,
) => {
  res.json({ version: getSyncVersion() });
};
