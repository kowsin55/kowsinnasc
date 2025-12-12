import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, ArrowRight, AlertCircle } from "lucide-react";

export default function StudentLogin() {
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/student-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registrationNumber }),
      });

      const data = await response.json();

      if (data.success && data.token) {
        localStorage.setItem("studentToken", data.token);
        localStorage.setItem("registrationNumber", registrationNumber);
        navigate("/student-search");
      } else {
        setError(data.message || "Invalid registration number. Try STU001, STU002, or STU003");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex flex-col">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">RoomFinder</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="w-full max-w-md">
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-8 backdrop-blur-xl">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-2">Student Login</h1>
              <p className="text-slate-400">Enter your registration number to search for rooms</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="flex gap-3 p-4 bg-red-900/20 border border-red-700 rounded-lg">
                  <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <div>
                <label htmlFor="regNum" className="block text-sm font-medium text-slate-300 mb-2">
                  Registration Number
                </label>
                <Input
                  id="regNum"
                  type="text"
                  placeholder="e.g., STU001"
                  value={registrationNumber}
                  onChange={(e) => setRegistrationNumber(e.target.value)}
                  className="bg-slate-900 border-slate-600 text-white placeholder:text-slate-500 h-12"
                  disabled={loading}
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={loading || !registrationNumber}
                className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold h-12 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Continue"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>

            {/* Demo Info */}
            <div className="mt-8 p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
              <p className="text-xs text-slate-400 mb-2">Demo Registration Numbers:</p>
              <p className="text-sm text-slate-300 font-mono space-y-1">
                <div>STU001 • STU002 • STU003</div>
              </p>
            </div>

            {/* Back to Home */}
            <div className="text-center mt-6">
              <Link to="/" className="text-slate-400 hover:text-slate-200 text-sm transition">
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
