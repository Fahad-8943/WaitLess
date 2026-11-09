import { useState } from "react";
import { Link, useLocation } from "react-router";
import logo from "../../../../src/assets/logo.png";

function AdminNav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard" },
    { label: "Businesses", path: "/admin/businesses" },
    { label: "Users", path: "/admin/users" },
    { label: "Reviews", path: "/admin/reviews" },
    { label: "Settings", path: "/admin/settings" },
  ];

  return (
    <header className="bg-[#111827] border-b border-slate-800 sticky top-0 z-30 shadow-xs">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo & Platform Admin Badge */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 focus:outline-none" aria-label="WaitLess Home">
              <img src={logo} alt="WaitLess Logo" className="h-8 w-auto object-contain" />
              <span className="text-xs font-bold tracking-wider uppercase px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
                Platform Admin
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-1 text-xs font-semibold">
              {navItems.map((item) => {
                const isActive =
                  location.pathname === item.path ||
                  (item.path === "/admin/businesses" && location.pathname.startsWith("/admin/businesses/"));
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-3 py-1.5 rounded-lg transition-colors ${
                      isActive
                        ? "bg-slate-800 text-white font-bold"
                        : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                    }`}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Admin Tag */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-xs font-medium text-slate-300">
              Admin Console
            </span>
            <div className="h-7 w-7 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              type="button"
              className="min-h-[44px] min-w-[44px] p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 focus:outline-none flex items-center justify-center transition-colors"
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
          <div className="md:hidden py-3 border-t border-slate-800 space-y-1">
            {navItems.map((item) => {
              const isActive =
                location.pathname === item.path ||
                (item.path === "/admin/businesses" && location.pathname.startsWith("/admin/businesses/"));
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2.5 min-h-[44px] flex items-center rounded-lg text-xs font-semibold ${
                    isActive
                      ? "bg-slate-800 text-white"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
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

export default AdminNav;
