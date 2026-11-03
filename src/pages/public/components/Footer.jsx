import logo from "../../../assets/logo.png";
import { Link } from "react-router";
import { useLocation } from "react-router";

function Footer() {
  const currentYear = new Date().getFullYear();
  const { pathname } = useLocation();
  const homeSection = (id) => pathname === "/" ? `#${id}` : `/#${id}`;

  return (
    <footer className="bg-[#111827] text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-slate-800">
          {/* WaitLess Branding & Short Description */}
          <div className="lg:col-span-2">
            <Link to="/" aria-label="WaitLess Home">
              <img
                src={logo}
                alt="WaitLess Logo"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="mt-4 text-sm text-slate-400 max-w-sm leading-relaxed">
              WaitLess is a smart service booking and queue management platform designed to help customers find services, book slots, and wait less.
            </p>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Platform
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/discover"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Discover
                </Link>
              </li>
              <li>
                <a
                  href={homeSection("how-it-works")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  How It Works
                </a>
              </li>
              <li>
                <Link
                  to="/login"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Get Started
                </Link>
              </li>
            </ul>
          </div>

          {/* Business Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Business
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  to="/business-register"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Register Your Business
                </Link>
              </li>
              <li>
                <Link
                  to="/business-register"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Business Dashboard
                </Link>
              </li>
              <li>
                <a
                  href={homeSection("for-businesses")}
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  For Businesses
                </a>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h3 className="text-xs font-semibold text-white uppercase tracking-wider">
              Support
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <a
                  href="mailto:support@waitless.app"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="mailto:privacy@waitless.app?subject=Privacy%20Policy"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@waitless.app?subject=Terms%20of%20Service"
                  className="text-slate-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center sm:text-left text-xs text-slate-500">
          <p>© {currentYear} WaitLess. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
