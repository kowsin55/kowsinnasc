/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

// Authentication
export interface StudentLoginRequest {
  registrationNumber: string;
}

export interface AdminLoginRequest {
  adminId: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  token?: string;
  message?: string;
}

// Room Data
export interface Room {
  id: string;
  blockName: string;
  floorNumber: number;
  roomNumber: string;
  departmentName: string;
  capacity?: number;
  createdAt: number;
}

export interface RoomSearchQuery {
  departmentName?: string;
  blockName?: string;
  floorNumber?: number;
  roomNumber?: string;
}

export interface RoomsResponse {
  rooms: Room[];
}

export interface RoomResponse {
  room: Room;
}

// Admin operations
export interface CreateRoomRequest {
  blockName: string;
  floorNumber: number;
  roomNumber: string;
  departmentName: string;
  capacity?: number;
}

export interface UpdateRoomRequest extends Partial<CreateRoomRequest> {}

export interface DeleteRoomRequest {
  id: string;
}

export interface DemoResponse {
  message: string;
}
