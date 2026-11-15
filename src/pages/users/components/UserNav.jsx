import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import logo from "../../../../src/assets/logo.png";
import { useAuth } from "../../../context/AuthContext";

function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "My Bookings", path: "/user/bookings" },
    { label: "Live Queue", path: "/user/queue" },
    { label: "History", path: "/user/history" },
    { label: "Profile", path: "/user/profile" },
  ];

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  return (
    <header className="bg-[#0b0f19] border-b border-slate-800/80 sticky top-0 z-30 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded-md" aria-label="WaitLess Home">
              <img src={logo} alt="WaitLess Logo" className="h-8 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-indigo-600/20 text-indigo-400 font-semibold border border-indigo-500/30"
                        : "text-slate-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action / Profile */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              to="/discover"
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700/80 transition-colors shadow-2xs"
            >
              Find a Service
            </Link>
            <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-800 text-white flex items-center justify-center font-bold text-xs ring-1 ring-indigo-400/30">
              {userInitial}
            </div>
            <button
              onClick={handleLogout}
              className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded transition-colors cursor-pointer"
            >
              Sign out
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500 flex items-center justify-center transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1 bg-[#0d121f] -mx-4 px-4 sm:-mx-6 sm:px-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 min-h-[44px] flex items-center rounded-lg text-xs font-semibold ${
                    isActive
                      ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30"
                      : "text-slate-300 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <Link
                to="/discover"
                onClick={() => setIsOpen(false)}
                className="block text-center px-3 py-2.5 min-h-[44px] flex items-center justify-center rounded-lg text-xs font-semibold bg-slate-800 text-slate-100 border border-slate-700"
              >
                Find a Service
              </Link>
              <button
                onClick={() => {
                  setIsOpen(false);
                  handleLogout();
                }}
                className="w-full text-left px-3 py-2.5 min-h-[44px] flex items-center rounded-lg text-xs font-semibold text-rose-400 hover:text-rose-300 hover:bg-white/5"
              >
                Sign out
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default UserNav;
