import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Room, RoomsResponse, CreateRoomRequest } from "@shared/api";
import {
  Building2,
  LogOut,
  Trash2,
  Edit2,
  Plus,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [adminId, setAdminId] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState<string | null>(null);

  // Form state
  const [blockName, setBlockName] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [departmentName, setDepartmentName] = useState("");
  const [capacity, setCapacity] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const id = localStorage.getItem("adminId");
    if (!token || !id) {
      navigate("/admin-login");
      return;
    }
    setAdminId(id);
    fetchRooms();
  }, [navigate]);

  // Auto-hide success message
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/rooms");
      const data: RoomsResponse = await response.json();
      setRooms(data.rooms);
    } catch (err) {
      setError("Failed to fetch rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenModal = (room?: Room) => {
    if (room) {
      setEditingRoomId(room.id);
      setBlockName(room.blockName);
      setFloorNumber(room.floorNumber.toString());
      setRoomNumber(room.roomNumber);
      setDepartmentName(room.departmentName);
      setCapacity(room.capacity?.toString() || "");
    } else {
      setEditingRoomId(null);
      setBlockName("");
      setFloorNumber("");
      setRoomNumber("");
      setDepartmentName("");
      setCapacity("");
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingRoomId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    try {
      const roomData: CreateRoomRequest = {
        blockName,
        floorNumber: Number(floorNumber),
        roomNumber,
        departmentName,
        capacity: capacity ? Number(capacity) : undefined,
      };

      let response;
      if (editingRoomId) {
        response = await fetch(`/api/rooms/${editingRoomId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(roomData),
        });
      } else {
        response = await fetch("/api/rooms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(roomData),
        });
      }

      if (response.ok) {
        setSuccessMessage(
          editingRoomId
            ? "Room updated successfully!"
            : "Room created successfully!",
        );
        handleCloseModal();
        fetchRooms();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to save room");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleDelete = async (roomId: string) => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;

    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin-login");
      return;
    }

    setError("");
    try {
      const response = await fetch(`/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setSuccessMessage("Room deleted successfully!");
        fetchRooms();
      } else {
        const data = await response.json();
        setError(data.error || "Failed to delete room");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminId");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition"
          >
            <Building2 className="w-8 h-8 text-cyan-500" />
            <span className="text-xl font-bold text-white">
              RoomFinder Admin
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:block">
              {adminId}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="text-slate-300 border-slate-600 hover:bg-slate-800"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-32 right-10 w-96 h-96 bg-cyan-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        </div>

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12">
          <div>
            <h1 className="text-4xl font-bold text-white mb-3">
              Room Management
            </h1>
            <p className="text-slate-400">Manage all rooms in the system</p>
          </div>
          <Button
            onClick={() => handleOpenModal()}
            className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Room
          </Button>
        </div>

        {/* Messages */}
        {error && (
          <div className="flex gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg mb-6">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {successMessage && (
          <div className="flex gap-3 p-4 bg-green-900/20 border border-green-700 rounded-lg mb-6">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-green-300">{successMessage}</p>
          </div>
        )}

        {/* Rooms List */}
        {loading && !showModal ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400">Loading rooms...</p>
          </div>
        ) : rooms.length === 0 ? (
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
            <p className="text-slate-400 mb-6">No rooms added yet.</p>
            <Button
              onClick={() => handleOpenModal()}
              className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Room
            </Button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-4 px-4 font-semibold text-slate-300">
                    Room
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-300 hidden sm:table-cell">
                    Block
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-300 hidden md:table-cell">
                    Floor
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-300">
                    Department
                  </th>
                  <th className="text-left py-4 px-4 font-semibold text-slate-300 hidden lg:table-cell">
                    Capacity
                  </th>
                  <th className="text-right py-4 px-4 font-semibold text-slate-300">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room.id}
                    className="border-b border-slate-700 hover:bg-slate-800/50 transition"
                  >
                    <td className="py-4 px-4 text-white font-medium">
                      {room.roomNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-400 hidden sm:table-cell">
                      {room.blockName}
                    </td>
                    <td className="py-4 px-4 text-slate-400 hidden md:table-cell">
                      {room.floorNumber}
                    </td>
                    <td className="py-4 px-4 text-slate-400">
                      {room.departmentName}
                    </td>
                    <td className="py-4 px-4 text-slate-400 hidden lg:table-cell">
                      {room.capacity || "-"}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          onClick={() => handleOpenModal(room)}
                          size="sm"
                          variant="outline"
                          className="border-slate-600 text-slate-300 hover:bg-slate-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(room.id)}
                          size="sm"
                          variant="outline"
                          className="border-red-700 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-white mb-6">
              {editingRoomId ? "Edit Room" : "Add New Room"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Room Number *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., 101"
                    value={roomNumber}
                    onChange={(e) => setRoomNumber(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Block Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Block A"
                    value={blockName}
                    onChange={(e) => setBlockName(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Floor Number *
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 1"
                    value={floorNumber}
                    onChange={(e) => setFloorNumber(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Department Name *
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Computer Science"
                    value={departmentName}
                    onChange={(e) => setDepartmentName(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Capacity (Optional)
                  </label>
                  <Input
                    type="number"
                    placeholder="e.g., 30"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-semibold py-2 rounded-lg"
                >
                  {editingRoomId ? "Update Room" : "Create Room"}
                </Button>
                <Button
                  type="button"
                  onClick={handleCloseModal}
                  variant="outline"
                  className="flex-1 border-slate-600 text-slate-300 hover:bg-slate-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
