import { Room } from "@shared/api";

// In-memory database
export interface StoredStudent {
  registrationNumber: string;
  createdAt: number;
}

interface DataStore {
  rooms: Map<string, Room>;
  students: Map<string, StoredStudent>;
  admins: Map<string, { adminId: string; password: string }>;
  syncVersion: number;
}

const store: DataStore = {
  rooms: new Map(),
  students: new Map(),
  admins: new Map([
    ["admin1", { adminId: "admin1", password: "admin123" }],
    ["admin2", { adminId: "admin2", password: "secure456" }],
  ]),
  syncVersion: 0,
};

// Initialize with sample data
function initializeSampleData() {
  const sampleRooms: Room[] = [
    {
      id: "room_001",
      blockName: "Block A",
      floorNumber: 1,
      roomNumber: "101",
      departmentName: "Computer Science",
      capacity: 30,
      createdAt: Date.now(),
    },
    {
      id: "room_002",
      blockName: "Block A",
      floorNumber: 1,
      roomNumber: "102",
      departmentName: "Electronics",
      capacity: 25,
      createdAt: Date.now(),
    },
    {
      id: "room_003",
      blockName: "Block B",
      floorNumber: 2,
      roomNumber: "201",
      departmentName: "Mechanical Engineering",
      capacity: 35,
      createdAt: Date.now(),
    },
    {
      id: "room_004",
      blockName: "Block B",
      floorNumber: 2,
      roomNumber: "202",
      departmentName: "Civil Engineering",
      capacity: 30,
      createdAt: Date.now(),
    },
    {
      id: "room_005",
      blockName: "Block C",
      floorNumber: 3,
      roomNumber: "301",
      departmentName: "Computer Science",
      capacity: 40,
      createdAt: Date.now(),
    },
  ];

  sampleRooms.forEach((room) => {
    store.rooms.set(room.id, room);
  });

  // Initialize sample students
  ["STU001", "STU002", "STU003"].forEach((regNum) => {
    store.students.set(regNum, { registrationNumber: regNum, createdAt: Date.now() });
  });
}

initializeSampleData();

// Export database functions
export function getAllRooms(): Room[] {
  return Array.from(store.rooms.values());
}

export function getRoomById(id: string): Room | undefined {
  return store.rooms.get(id);
}

export function createRoom(room: Omit<Room, "id" | "createdAt">): Room {
  const id = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  const newRoom: Room = {
    ...room,
    id,
    createdAt: Date.now(),
  };
  store.rooms.set(id, newRoom);
  store.syncVersion++;
  return newRoom;
}

export function updateRoom(id: string, updates: Partial<Omit<Room, "id" | "createdAt">>): Room | undefined {
  const room = store.rooms.get(id);
  if (!room) return undefined;

  const updated = { ...room, ...updates };
  store.rooms.set(id, updated);
  store.syncVersion++;
  return updated;
}

export function deleteRoom(id: string): boolean {
  const result = store.rooms.delete(id);
  if (result) store.syncVersion++;
  return result;
}

export function authenticateStudent(registrationNumber: string): boolean {
  return store.students.has(registrationNumber);
}

export function authenticateAdmin(adminId: string, password: string): boolean {
  const admin = store.admins.get(adminId);
  return admin?.password === password || false;
}

export function getSyncVersion(): number {
  return store.syncVersion;
}

export function searchRooms(query: {
  departmentName?: string;
  blockName?: string;
  floorNumber?: number;
  roomNumber?: string;
}): Room[] {
  const rooms = Array.from(store.rooms.values());

  return rooms.filter((room) => {
    if (query.departmentName && !room.departmentName.toLowerCase().includes(query.departmentName.toLowerCase())) {
      return false;
    }
    if (query.blockName && !room.blockName.toLowerCase().includes(query.blockName.toLowerCase())) {
      return false;
    }
    if (query.floorNumber !== undefined && room.floorNumber !== query.floorNumber) {
      return false;
    }
    if (query.roomNumber && !room.roomNumber.toLowerCase().includes(query.roomNumber.toLowerCase())) {
      return false;
    }
    return true;
  });
}
