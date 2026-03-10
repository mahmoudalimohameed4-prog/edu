import { useState } from "react";
import { Chrome, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { login } from "../api/api"; // Updated import

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Added loading state

  const handleLogin = async () => {
    if (!form.email || !form.password) {
      toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
      return;
    }

    setIsLoading(true);
    try {
      const response = await login(form);
      const { token, user } = response.data.data;

      // Save data for later use
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("تم تسجيل الدخول بنجاح");
      setTimeout(() => navigate("/home"), 800);
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "حدث خطأ أثناء تسجيل الدخول";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    toast("جاري تجربة تسجيل الدخول عبر جوجل");
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-100 flex flex-col"
      style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
    >
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        <div className="bg-white rounded-3xl shadow-xl w-full max-w-md p-6 sm:p-8 relative overflow-hidden">
          {/* Heading */}
          <div className="text-center mb-7">
            <h1 className="text-3xl font-black text-slate-800 mb-2">
              تسجيل الدخول
            </h1>
            <p className="text-sm text-slate-500">
              مرحباً بعودتك! يرجى تسجيل الدخول للوصول إلى حسابك
            </p>
          </div>

          <div className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                placeholder="أدخل بريدك الإلكتروني"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-slate-50 text-right"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-1.5">
                كلمه المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-slate-50 text-right pr-4 pl-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember me & Forget password */}
            <div className="flex items-center justify-between">
              <a
                href="/forgot-password"
                className="text-xs text-primary font-semibold hover:underline"
              >
                هل نسيت كلمة المرور؟
              </a>
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">تذكرني</span>
                <button
                  onClick={() => setRememberMe(!rememberMe)}
                  className={`relative w-9 h-5 rounded-full transition-all duration-300 ${rememberMe ? "bg-primary" : "bg-slate-200"}`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all duration-300 ${rememberMe ? "left-4" : "left-0.5"}`}
                  />
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleLogin}
              className="w-full bg-primary hover:bg-primary text-white font-bold py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary-200 text-sm"
            >
              تسجيل الدخول
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-xs text-slate-400">أو</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Google */}
            <button
              onClick={handleGoogleLogin}
              className="w-full border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm"
            >
              <Chrome className="w-5 h-5" />
              تسجيل الدخول باستخدام جوجل
            </button>

            {/* Signup link */}
            <p className="text-center text-sm text-slate-500">
              ليس لديك حساب؟{" "}
              <a
                href="/signup"
                className="text-primary font-bold hover:underline"
              >
                أنشاء حساب
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};
export default Login;
