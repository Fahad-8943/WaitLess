import { useState } from "react";
import logo from "../../../../src/assets/logo.png";
import { Link, useLocation } from "react-router";

function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const { pathname } = useLocation();
  const homeSection = (id) => pathname === "/" ? `#${id}` : `/#${id}`;

  return (
    <header>
      <nav className="fixed inset-x-0 top-0 z-30 border-b border-indigo-900/40 bg-[#3730A3]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-3.5">
          <Link
            to="/"
            className="flex items-center space-x-3 focus:outline-none focus:ring-2 focus:ring-[#06B6D4] rounded-md"
            aria-label="WaitLess Home"
          >
            <img
              src={logo}
              className="h-8 md:h-9 w-auto object-contain"
              alt="WaitLess Logo"
            />
          </Link>

          <button
            onClick={() => setIsOpen((open) => !open)}
            type="button"
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg p-2 text-white hover:bg-white/10 md:hidden transition-colors focus:outline-none focus:ring-2 focus:ring-[#06B6D4]"
            aria-controls="navbar-default"
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close main menu" : "Open main menu"}
          >
            <span className="sr-only">
              {isOpen ? "Close main menu" : "Open main menu"}
            </span>

            <svg
              className="h-5 w-5"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              {isOpen ? (
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 18 6M6 6l12 12"
                />
              ) : (
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 7h14M5 12h14M5 17h14"
                />
              )}
            </svg>
          </button>

          <div
            className={`w-full md:block md:w-auto ${!isOpen ? "hidden" : "block"}`}
            id="navbar-default"
          >
            <ul className="font-semibold flex md:items-center flex-col p-4 md:p-0 mt-3 md:mt-0 border-t border-indigo-800 md:border-0 rounded-xl bg-[#312E81] md:bg-transparent md:flex-row md:space-x-7 text-xs">
              <li className="my-1 md:my-0">
                <Link
                  to="/discover"
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 px-2.5 text-indigo-100 rounded-md hover:bg-white/10 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 transition-colors"
                >
                  Discover
                </Link>
              </li>
              <li className="my-1 md:my-0">
                <a
                  href={homeSection("how-it-works")}
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 px-2.5 text-indigo-100 rounded-md hover:bg-white/10 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li className="my-1 md:my-0">
                <a
                  href={homeSection("for-businesses")}
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 px-2.5 text-indigo-100 rounded-md hover:bg-white/10 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 transition-colors"
                >
                  For Businesses
                </a>
              </li>
              <li className="my-1 md:my-0 md:ml-2">
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 px-3 text-center text-indigo-100 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                >
                  Login
                </Link>
              </li>
              <li className="my-1 md:my-0">
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block py-1.5 px-3.5 text-center font-bold text-[#111827] bg-white rounded-lg hover:bg-indigo-50 transition-all shadow-2xs"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
