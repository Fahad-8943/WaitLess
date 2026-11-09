import { useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../../../../src/assets/logo.png";

function UserNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/user/dashboard" },
    { label: "My Bookings", path: "/user/bookings" },
    { label: "Live Queue", path: "/user/queue" },
    { label: "History", path: "/user/history" },
    { label: "Profile", path: "/user/profile" },
  ];

  return (
    <header className="bg-[#3730A3] border-b border-indigo-900 sticky top-0 z-30 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none" aria-label="WaitLess Home">
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
                        ? "bg-white/15 text-white font-bold"
                        : "text-indigo-100 hover:text-white hover:bg-white/10"
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
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#111827] hover:bg-indigo-50 transition-colors shadow-2xs"
            >
              Find a Service
            </Link>
            <div className="h-7 w-7 rounded-full bg-indigo-700 text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/30">
              F
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-white hover:bg-white/10 focus:outline-none flex items-center justify-center transition-colors"
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
          <div className="md:hidden py-3 border-t border-indigo-700/60 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 min-h-[44px] flex items-center rounded-lg text-xs font-semibold ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-indigo-100 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <Link
                to="/discover"
                onClick={() => setIsOpen(false)}
                className="block text-center px-3 py-2.5 min-h-[44px] flex items-center justify-center rounded-lg text-xs font-semibold bg-white text-[#111827]"
              >
                Find a Service
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default UserNav;
