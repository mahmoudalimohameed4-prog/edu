import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar";
import { Route, Routes, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentExchange from "./pages/StudentExchange";
import Home from "./pages/Home";
import Footer from "./components/Footer";
import Chat from "./pages/Chat";
import Profile from "./pages/Profile";
import Files from "./pages/Files";
import Login from "./pages/Login";
import Start from "./pages/Start";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import Settings from "./pages/Settings";
import Help from "./pages/Help";
import Dashboard from "./pages/Dashboard";
import Rewards from "./pages/Rewards";
import Security from "./pages/Security";
import ProtectedRoute from "./components/ProtectedRoute";
import ItemDetails from "./pages/ItemDetails";

const App = () => {
  const [isDark, setIsDark] = useState(false);
  const location = useLocation().pathname;
  // const hideNavLinks = ["/log"]
  const hideNavAndFooter =
    location === "/" ||
    location.startsWith("/login") ||
    location.startsWith("/signup") ||
    location.startsWith("/forgot-password");

  useEffect(() => {
    const stored = localStorage.getItem("theme");
    if (stored === "dark") {
      setIsDark(true);
      return;
    }
    if (stored === "light") {
      setIsDark(false);
      return;
    }
    // Always default to light mode, independent from OS preference.
    setIsDark(false);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
  }, [isDark]);

  return (
    <div className="min-h-screen flex flex-col">
      {!hideNavAndFooter && (
        <Navbar isDark={isDark} onToggleDark={() => setIsDark((prev) => !prev)} />
      )}
      <main className="flex-1">
        <Routes>
          <Route
            path="/"
            element={
              <Start
                isDark={isDark}
                onToggleDark={() => setIsDark((prev) => !prev)}
              />
            }
          />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/item/:id" element={<ItemDetails />} />

          {/* Protected Routes */}
          <Route path="/exchange" element={<ProtectedRoute><StudentExchange /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/files" element={<ProtectedRoute><Files /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/help" element={<Help />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/rewards" element={<ProtectedRoute><Rewards /></ProtectedRoute>} />
          <Route path="/security" element={<ProtectedRoute><Security /></ProtectedRoute>} />
        </Routes>
      </main>
      {!hideNavAndFooter && <Footer />}

      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2800,
          style: {
            direction: "rtl",
            fontFamily: "Cairo, sans-serif",
            borderRadius: "12px",
            background: isDark ? "var(--color-slate-100)" : "#ffffff",
            border: isDark
              ? "1px solid var(--color-slate-300)"
              : "1px solid var(--color-primary-100)",
            color: isDark ? "var(--color-slate-800)" : "var(--color-primary-900)",
          },
          success: {
            style: {
              border: isDark ? "1px solid var(--color-green-300)" : "1px solid #86efac",
            },
          },
          error: {
            style: {
              border: isDark ? "1px solid var(--color-red-300)" : "1px solid #fca5a5",
            },
          },
        }}
      />
    </div>
  );
};

export default App;
