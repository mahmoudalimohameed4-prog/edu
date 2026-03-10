import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CircleCheckBig,
  LoaderCircle,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ShieldCheck,
  ChevronLeft
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { sendOTP, verifyOTP, resetPassword } from "../api/api";
import { toast } from "react-hot-toast";

const OTP_LENGTH = 6;
const RESEND_SECONDS = 60;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("email"); // email, otp, new_password, success
  const [otp, setOtp] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);
  const [error, setError] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (step !== "otp" || resendCountdown <= 0) return;
    const timer = setInterval(() => {
      setResendCountdown((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, resendCountdown]);

  const handleSendCode = async () => {
    if (!email || !email.includes("@")) {
      toast.error("يرجى إدخال بريد إلكتروني صحيح");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await sendOTP(email);
      setStep("otp");
      setResendCountdown(RESEND_SECONDS);
      toast.success("تم إرسال رمز التحقق إلى بريدك الإلكتروني");
    } catch (error) {
      const msg = error.response?.data?.msg || "حدث خطأ أثناء إرسال الرمز";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async () => {
    if (otp.length < OTP_LENGTH) {
      toast.error("يرجى إدخال الرمز كاملاً");
      return;
    }
    setLoading(true);
    setError("");
    try {
      // Pass checkOnly: true so the OTP is not marked as used yet
      await verifyOTP(email, otp, true);
      setStep("new_password");
      toast.success("تم التحقق من الرمز بنجاح");
    } catch (error) {
      setError(error.response?.data?.msg || "رمز التحقق غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  // Validate password complexity (must match backend rules)
  const passwordValidation = {
    length: newPassword.length >= 6,
    uppercase: /[A-Z]/.test(newPassword),
    lowercase: /[a-z]/.test(newPassword),
    number: /[0-9]/.test(newPassword),
  };
  const isPasswordValid = Object.values(passwordValidation).every(Boolean);

  const handleResetPassword = async () => {
    setError("");
    if (!isPasswordValid) {
      toast.error("كلمة المرور يجب أن تحتوي على: 6 أحرف، حرف كبير، حرف صغير، ورقم");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    try {
      await resetPassword({
        email: email,
        otp: otp,
        newPassword: newPassword
      });

      setStep("success");
      toast.success("تم تغيير كلمة المرور بنجاح");
      // Navigate to login after 1.5 seconds
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      const msg = err.response?.data?.msg || "فشل إعادة تعيين كلمة المرور";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden relative">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16" />

        <div className="p-8 relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => navigate("/login")} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 transition-all">
              <ChevronLeft className="w-6 h-6 rotate-180" />
            </button>
            <h1 className="text-xl font-black text-slate-800">استعادة الحساب</h1>
            <div className="w-10" /> {/* Spacer */}
          </div>

          {step === "email" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3">
                  <Mail className="w-10 h-10 text-primary -rotate-3" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">نسيت كلمة المرور؟</h2>
                <p className="text-sm text-slate-500 px-4">أدخل بريدك الإلكتروني المسجل وسنرسل لك رمزاً لتأكيد هويتك</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">البريد الإلكتروني</label>
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-right"
                    />
                  </div>
                  {error && <p className="mt-2 text-xs text-red-500 mr-1">{error}</p>}
                </div>

                <button
                  onClick={handleSendCode}
                  disabled={loading}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {loading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "إرسال الرمز"}
                  {!loading && <ArrowLeft className="w-5 h-5 mr-1" />}
                </button>
              </div>
            </div>
          )}

          {step === "otp" && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-emerald-50 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-6">
                  <ShieldCheck className="w-10 h-10 text-emerald-600 -rotate-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">تأكيد الرمز</h2>
                <p className="text-sm text-slate-500 mb-2">أدخل الرمز المكون من 6 أرقام المرسل إلى:</p>
                <p className="text-sm font-black text-primary">{email}</p>
              </div>

              <div className="space-y-6">
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-2xl font-black text-center tracking-[1rem] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-primary"
                  autoFocus
                />

                {error && <p className="text-xs text-red-500 text-center">{error}</p>}

                <button
                  onClick={handleVerifyCode}
                  disabled={loading || otp.length < 6}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {loading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "تحقق وتأكيد"}
                </button>

                <div className="text-center">
                  <button
                    onClick={handleSendCode}
                    disabled={resendCountdown > 0 || loading}
                    className="text-sm font-bold text-slate-400 hover:text-primary disabled:opacity-50 transition-colors"
                  >
                    {resendCountdown > 0 ? `إعادة الإرسال خلال ${resendCountdown} ثانية` : "لم يصلك الرمز؟ إعادة الإرسال"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {step === "new_password" && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-50 rounded-3xl flex items-center justify-center mx-auto mb-4 rotate-3">
                  <LockKeyhole className="w-10 h-10 text-blue-600 -rotate-3" />
                </div>
                <h2 className="text-2xl font-black text-slate-800 mb-2">كلمة مرور جديدة</h2>
                <p className="text-sm text-slate-500 px-4">يجب أن تحتوي على: حرف كبير، حرف صغير، ورقم</p>
              </div>

              <div className="space-y-5">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">كلمة المرور الجديدة</label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-right"
                        autoFocus
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors">
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    {/* Password strength indicators */}
                    {newPassword.length > 0 && (
                      <div className="grid grid-cols-2 gap-1.5 mt-2 px-1">
                        {[
                          { label: "6 أحرف فأكثر", met: passwordValidation.length },
                          { label: "حرف كبير (A-Z)", met: passwordValidation.uppercase },
                          { label: "حرف صغير (a-z)", met: passwordValidation.lowercase },
                          { label: "رقم (0-9)", met: passwordValidation.number },
                        ].map((rule, i) => (
                          <div key={i} className={`flex items-center gap-1.5 text-xs font-semibold ${rule.met ? 'text-emerald-600' : 'text-slate-400'}`}>
                            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${rule.met ? 'bg-emerald-500' : 'bg-slate-300'}`} />
                            {rule.label}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 mr-1">تأكيد كلمة المرور</label>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`w-full bg-slate-50 border rounded-2xl px-5 py-4 text-slate-700 outline-none focus:ring-4 transition-all text-right ${confirmPassword && confirmPassword !== newPassword
                          ? 'border-red-300 focus:border-red-400 focus:ring-red-100'
                          : 'border-slate-200 focus:border-primary focus:ring-primary/10'
                        }`}
                    />
                    {confirmPassword && confirmPassword !== newPassword && (
                      <p className="text-xs text-red-500 mt-1 mr-1">كلمات المرور غير متطابقة</p>
                    )}
                  </div>
                </div>

                {/* Error from backend */}
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 font-semibold text-right">
                    ⚠️ {error}
                  </div>
                )}

                <button
                  onClick={handleResetPassword}
                  disabled={loading || !isPasswordValid || newPassword !== confirmPassword}
                  className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
                >
                  {loading ? <LoaderCircle className="w-5 h-5 animate-spin" /> : "حفظ كلمة المرور"}
                </button>
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="text-center py-6 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CircleCheckBig className="w-12 h-12 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-3">تم تغيير كلمة المرور!</h2>
              <p className="text-sm text-slate-500 mb-4 px-6">تم حفظ كلمة المرور الجديدة بنجاح.</p>
              <p className="text-xs text-slate-400 mb-8">سيتم تحويلك لصفحة تسجيل الدخول تلقائياً...</p>

              <button
                onClick={() => navigate("/login")}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                تسجيل الدخول الآن
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

