import {
  Bell,
  Home as HomeIcon,
  Wrench,
  Folder,
  MessageCircle,
  User,
  RefreshCw,
  Moon,
  Sun,
  Menu,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import NotificationDropdown from "./NotificationDropdown";

const NAV_ITEMS = [
  { to: "/home", label: "الرئيسية", Icon: HomeIcon },
  { to: "/exchange", label: "الأدوات", Icon: Wrench },
  { to: "/files", label: "الملفات", Icon: Folder },
  { to: "/chat", label: "المحادثات", Icon: MessageCircle },
  { to: "/profile", label: "الملف الشخصي", Icon: User },
];

const Navbar = ({ isDark = false, onToggleDark }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const token = localStorage.getItem("token");

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-1.5 text-sm font-medium px-3 py-2 rounded-lg transition-all ${isActive
      ? "text-white bg-primary"
      : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
    }`;

  return (
    <nav
      dir="rtl"
      className="w-full bg-white border-b border-gray-100 sticky top-0 z-50"
      style={{ boxShadow: "0 1px 12px rgba(0,0,0,0.06)" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        {/* Mobile / Tablet Header */}
        <div className="flex lg:hidden items-center justify-between gap-2">
          <NavLink to="/home" className="flex items-center gap-2 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
              }}
            >
              <RefreshCw size={18} color="white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight text-right min-w-0">
              <p
                className="font-bold text-gray-900 text-sm truncate"
                style={{ fontFamily: "Georgia, serif" }}
              >
                EduSwap
              </p>
              <p className="text-xs text-gray-400 truncate">تبادل طلابي مجاني</p>
            </div>
          </NavLink>

          <div className="flex items-center gap-2">
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
              aria-label={isDark ? "الوضع النهاري" : "الوضع الليلي"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {token && <NotificationDropdown />}

            {!token && (
              <button
                className="hidden sm:inline-flex px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
                }}
                onClick={() => navigate("/login")}
              >
                تسجيل الدخول
              </button>
            )}

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              aria-label="تبديل القائمة"
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Laptop / Desktop Header */}
        <div className="hidden lg:flex items-center justify-between gap-4">
          <NavLink to="/home" className="flex items-center gap-2 min-w-0">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background:
                  "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
              }}
            >
              <RefreshCw size={18} color="white" strokeWidth={2.5} />
            </div>
            <div className="leading-tight text-right min-w-0">
              <p
                className="font-bold text-gray-900 text-sm truncate"
                style={{ fontFamily: "Georgia, serif" }}
              >
                EduSwap
              </p>
              <p className="text-xs text-gray-400 truncate">تبادل طلابي مجاني</p>
            </div>
          </NavLink>

          <div className="flex-1 flex items-center justify-center px-2">
            <div className="flex items-center gap-2 xl:gap-3 overflow-x-auto pb-1">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <NavLink key={to} to={to} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <Icon size={17} className={isActive ? "text-white" : ""} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={onToggleDark}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              title={isDark ? "الوضع النهاري" : "الوضع الليلي"}
              aria-label={isDark ? "الوضع النهاري" : "الوضع الليلي"}
            >
              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {token && <NotificationDropdown />}

            {!token && (
              <button
                className="px-4 py-2 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
                }}
                onClick={() => navigate("/login")}
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-gray-100">
            <div className="grid grid-cols-2 gap-2">
              {NAV_ITEMS.map(({ to, label, Icon }) => (
                <NavLink key={to} to={to} className={navItemClass}>
                  {({ isActive }) => (
                    <>
                      <Icon size={17} className={isActive ? "text-white" : ""} />
                      {label}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
            {!token && (
              <button
                className="mt-3 w-full px-4 py-2.5 rounded-xl text-white text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
                style={{
                  background:
                    "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
                }}
                onClick={() => navigate("/login")}
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
