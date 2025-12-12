import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Room, RoomsResponse } from "@shared/api";
import { Building2, LogOut, Search, AlertCircle } from "lucide-react";

export default function StudentSearch() {
  const navigate = useNavigate();
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Search filters
  const [departmentName, setDepartmentName] = useState("");
  const [blockName, setBlockName] = useState("");
  const [floorNumber, setFloorNumber] = useState("");
  const [roomNumber, setRoomNumber] = useState("");

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("studentToken");
    const regNum = localStorage.getItem("registrationNumber");
    if (!token || !regNum) {
      navigate("/student-login");
      return;
    }
    setRegistrationNumber(regNum);
    fetchRooms();
  }, [navigate]);

  const fetchRooms = useCallback(async (query?: string) => {
    setLoading(true);
    setError("");
    try {
      let url = "/api/rooms";
      if (query) {
        url += `?${query}`;
      }
      const response = await fetch(url);
      const data: RoomsResponse = await response.json();
      setRooms(data.rooms);
    } catch (err) {
      setError("Failed to fetch rooms. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (departmentName) params.append("departmentName", departmentName);
    if (blockName) params.append("blockName", blockName);
    if (floorNumber) params.append("floorNumber", floorNumber);
    if (roomNumber) params.append("roomNumber", roomNumber);

    fetchRooms(params.toString());
  };

  const handleLogout = () => {
    localStorage.removeItem("studentToken");
    localStorage.removeItem("registrationNumber");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">RoomFinder</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-slate-400 text-sm hidden sm:block">
              {registrationNumber}
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
          <div className="absolute top-32 right-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10"></div>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-3">Find Your Room</h1>
          <p className="text-slate-400 text-lg">
            Search for any room by entering the details below
          </p>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 mb-12 backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-8">Search Filters</h2>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Department Name
              </label>
              <Input
                type="text"
                placeholder="e.g., Computer Science"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Block Name
              </label>
              <Input
                type="text"
                placeholder="e.g., Block A"
                value={blockName}
                onChange={(e) => setBlockName(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Floor Number
              </label>
              <Input
                type="number"
                placeholder="e.g., 1"
                value={floorNumber}
                onChange={(e) => setFloorNumber(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Room Number
              </label>
              <Input
                type="text"
                placeholder="e.g., 101"
                value={roomNumber}
                onChange={(e) => setRoomNumber(e.target.value)}
                className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold h-12 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50"
            >
              <Search className="w-4 h-4 mr-2" />
              {loading ? "Searching..." : "Search Rooms"}
            </Button>
            <Button
              type="button"
              onClick={() => {
                setDepartmentName("");
                setBlockName("");
                setFloorNumber("");
                setRoomNumber("");
                fetchRooms();
              }}
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-700"
            >
              Clear
            </Button>
          </div>
        </form>

        {/* Results Section */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">
            Results {rooms.length > 0 && `(${rooms.length})`}
          </h2>

          {error && (
            <div className="flex gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg mb-6">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300">{error}</p>
            </div>
          )}

          {!loading && rooms.length === 0 && !error && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <p className="text-slate-400">
                {departmentName || blockName || floorNumber || roomNumber
                  ? "No rooms found matching your search criteria."
                  : "Enter search criteria to find rooms."}
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-12 text-center">
              <p className="text-slate-400">Loading rooms...</p>
            </div>
          )}

          {!loading && rooms.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-slate-800/50 border border-slate-700 rounded-lg p-6 hover:border-slate-600 transition-all hover:bg-slate-800/80 transform hover:scale-105"
                >
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-white mb-1">
                      Room {room.roomNumber}
                    </h3>
                    <p className="text-slate-400 text-sm">{room.departmentName}</p>
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Block:</span>
                      <span className="text-slate-200 font-medium">{room.blockName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Floor:</span>
                      <span className="text-slate-200 font-medium">{room.floorNumber}</span>
                    </div>
                    {room.capacity && (
                      <div className="flex justify-between">
                        <span className="text-slate-400">Capacity:</span>
                        <span className="text-slate-200 font-medium">{room.capacity}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 p-3 bg-slate-700/30 border border-slate-600 rounded text-xs text-slate-400">
                    Updated: {new Date(room.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
