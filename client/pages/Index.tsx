import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Building2, UserCheck, Key, Zap } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-slate-700 bg-slate-900/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Building2 className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">RoomFinder</span>
          </div>
          <div className="flex gap-3">
            <Link to="/student-login">
              <Button variant="outline" className="text-slate-300 border-slate-600 hover:bg-slate-800">
                Student Login
              </Button>
            </Link>
            <Link to="/admin-login">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                Admin Login
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Find Your Room
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400"> Instantly</span>
            </h1>
            <p className="text-xl text-slate-400 mb-8 leading-relaxed">
              A smart college room and department locator system. Search for any room by department, block, floor, or room number. Real-time updates keep you always informed.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/student-login">
                <Button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg font-semibold rounded-lg transition-all transform hover:scale-105">
                  Student Search
                </Button>
              </Link>
              <Link to="/admin-login">
                <Button variant="outline" className="w-full sm:w-auto border-slate-600 text-slate-300 hover:bg-slate-800 px-8 py-6 text-lg font-semibold rounded-lg">
                  Admin Panel
                </Button>
              </Link>
            </div>

            {/* Demo Credentials */}
            <div className="mt-12 p-6 bg-slate-800/50 border border-slate-700 rounded-lg max-w-md mx-auto">
              <p className="text-sm text-slate-400 mb-4">Demo Credentials</p>
              <div className="space-y-2 text-sm">
                <div className="text-left">
                  <p className="text-slate-500">Student Registration:</p>
                  <p className="text-slate-200 font-mono">STU001, STU002, STU003</p>
                </div>
                <div className="text-left">
                  <p className="text-slate-500">Admin Login:</p>
                  <p className="text-slate-200 font-mono">admin1 / admin123</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">Why Choose RoomFinder?</h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-all hover:bg-slate-800/80">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Instant Search</h3>
            <p className="text-slate-400">
              Search for rooms by department, block, floor, or room number. Get results instantly.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-all hover:bg-slate-800/80">
            <div className="w-12 h-12 bg-cyan-600 rounded-lg flex items-center justify-center mb-4">
              <UserCheck className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Real-Time Updates</h3>
            <p className="text-slate-400">
              Room information is always up-to-date. Changes made by admins reflect instantly.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-8 hover:border-slate-600 transition-all hover:bg-slate-800/80">
            <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center mb-4">
              <Key className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">Secure & Simple</h3>
            <p className="text-slate-400">
              Secure authentication system with a clean, intuitive interface for all users.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 border-t border-slate-700">
        <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-12">How It Works</h2>

        <div className="grid md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-bold text-white mb-6">For Students</h3>
            <div className="space-y-4">
              {[
                { number: "1", title: "Login", desc: "Use your registration number to log in" },
                { number: "2", title: "Search", desc: "Enter room details to search" },
                {
                  number: "3",
                  title: "Find",
                  desc: "Get instant results with full room information",
                },
              ].map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">{step.number}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{step.title}</h4>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-2xl font-bold text-white mb-6">For Admins</h3>
            <div className="space-y-4">
              {[
                { number: "1", title: "Admin Login", desc: "Access the admin dashboard" },
                { number: "2", title: "Manage Rooms", desc: "Add, edit, or delete room information" },
                { number: "3", title: "Instant Sync", desc: "Changes reflect to students immediately" },
              ].map((step) => (
                <div key={step.number} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-cyan-600 flex items-center justify-center flex-shrink-0">
                    <span className="font-bold text-white">{step.number}</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-white">{step.title}</h4>
                    <p className="text-slate-400 text-sm">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700 bg-slate-900/50 backdrop-blur-lg py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-6 h-6 text-blue-500" />
              <span className="font-semibold text-white">RoomFinder</span>
            </div>
            <p className="text-slate-400 text-sm">© 2024 RoomFinder. Find your room, instantly.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
