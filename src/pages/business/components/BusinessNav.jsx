import { useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../../../../src/assets/logo.png";

function BusinessNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/business/dashboard" },
    { label: "Profile", path: "/business/profile" },
    { label: "Services", path: "/business/services" },
    { label: "Bookings", path: "/business/bookings" },
    { label: "Queue Desk", path: "/business/queue" },
    { label: "Reviews", path: "/business/reviews" },
  ];

  return (
    <header className="bg-[#1E1B4B] border-b border-indigo-950 sticky top-0 z-30 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none" aria-label="WaitLess Home">
              <img src={logo} alt="WaitLess Logo" className="h-8 w-auto object-contain" />
              <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-indigo-900 text-cyan-300 border border-indigo-700/50">
                Business Portal
              </span>
            </Link>

            {/* Desktop Navigation Links */}
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
                        : "text-indigo-200 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Business Identifier Badge */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-semibold text-indigo-100">
              Crown &amp; Blade Studio
            </span>
            <div className="h-7 w-7 rounded-lg bg-[#3730A3] text-white flex items-center justify-center font-bold text-xs ring-1 ring-white/20">
              CB
            </div>
          </div>

          {/* Mobile menu trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="p-2 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10 focus:outline-none"
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

        {/* Mobile dropdown menu */}
        {isOpen && (
          <div className="md:hidden py-3 border-t border-indigo-900 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-xs font-semibold ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-indigo-200 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
}

export default BusinessNav;
