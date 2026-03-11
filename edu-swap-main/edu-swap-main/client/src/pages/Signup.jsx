import { useState } from "react";
import { Check, Chrome, Eye, EyeOff, Mail, Phone, ShieldCheck, ArrowRight, Loader2, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { signup, sendOTP, verifyOTP as confirmOTP } from "../api/api";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1: Info, 2: Verify
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const passwordValidation = {
    length: form.password.length >= 6,
    uppercase: /[A-Z]/.test(form.password),
    lowercase: /[a-z]/.test(form.password),
    number: /[0-9]/.test(form.password),
  };

  const handleSignupAndSendOTP = async () => {
    if (!form.name || !form.email || !form.password || !form.phone) {
      toast.error("يرجى تعبئة جميع الحقول");
      return;
    }
    if (!agreed) {
      toast.error("يرجى الموافقة على الشروط أولاً");
      return;
    }

    setIsLoading(true);
    try {
      // 1. Initial Signup
      await signup(form);

      // 2. Send OTP automatically via Email
      await sendOTP(form.email);

      toast.success("تم إنشاء الحساب، يرجى إدخال رمز التحقق المرسل لبريدك");
      setStep(2);
    } catch (error) {
      const errorMessage = error.response?.data?.msg || "حدث خطأ أثناء العملية";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      await sendOTP(form.email);
      toast.success("تم إعادة إرسال الرمز لبريدك الإلكتروني");
    } catch (error) {
      toast.error(error.response?.data?.msg || "فشل إرسال الرمز");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (otpCode.length < 6) {
      toast.error("يرجى إدخال رمز التحقق كاملاً (6 أرقام)");
      return;
    }
    setIsLoading(true);
    try {
      await confirmOTP(form.email, otpCode);
      toast.success("تم تفعيل حسابك بنجاح! يمكنك الآن تسجيل الدخول");
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.msg || "الرمز غير صحيح");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>
      {/* Progress Stepper */}
      <div className="flex items-center gap-4 mb-8 w-full max-w-md px-6">
        {[1, 2].map((s) => (
          <div key={s} className="flex-1 flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${step >= s ? 'bg-primary text-white scale-110 shadow-lg' : 'bg-slate-200 text-slate-500'}`}>
              {step > s ? <Check className="w-5 h-5" /> : s}
            </div>
            {s < 2 && <div className={`flex-1 h-1 rounded-full transition-all duration-500 ${step > s ? 'bg-primary' : 'bg-slate-200'}`} />}
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-8 relative overflow-hidden transition-all duration-500 hover:shadow-primary/10">
        {step === 1 ? (
          <div className="animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-black text-slate-800 mb-2">إنشاء حساب</h1>
              <p className="text-sm text-slate-500">ابدأ رحلتك معنا اليوم</p>
            </div>

            <div className="space-y-4">
              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-1.5 mr-1">الاسم بالكامل</label>
                <input
                  type="text"
                  placeholder="أدخل اسمك الكامل"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-right"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-1.5 mr-1">البريد الإلكتروني</label>
                <input
                  type="email"
                  placeholder="name@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3.5 text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-right"
                />
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-1.5 mr-1">رقم الهاتف</label>
                <div className="relative" dir="ltr">
                   <PhoneInput
                    country={"eg"}
                    value={form.phone}
                    onChange={(phone) => setForm({ ...form, phone: "+" + phone })}
                    inputStyle={{
                      width: '100%',
                      height: '54px',
                      borderRadius: '1rem',
                      border: '1px solid #e2e8f0',
                      backgroundColor: '#f8fafc',
                      fontSize: '1rem',
                      color: '#334155',
                      paddingLeft: '50px',
                      textAlign: 'left'
                    }}
                    buttonStyle={{
                      border: 'none',
                      backgroundColor: 'transparent',
                      borderRadius: '1rem 0 0 1rem',
                      paddingLeft: '10px'
                    }}
                    dropdownStyle={{
                      textAlign: 'left',
                      borderRadius: '1rem',
                      marginTop: '8px'
                    }}
                    placeholder="رقم الهاتف"
                  />
                </div>
              </div>

              <div className="group">
                <label className="block text-sm font-bold text-slate-700 mb-1.5 mr-1">كلمة المرور</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    onFocus={() => setIsPasswordFocused(true)}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-12 pr-5 py-3.5 text-slate-700 outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-right"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div className={`mt-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 ${isPasswordFocused || form.password ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0 py-0 border-0'}`}>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { label: "6 أحرف فأكثر", met: passwordValidation.length },
                      { label: "حرف كبير", met: passwordValidation.uppercase },
                      { label: "حرف صغير", met: passwordValidation.lowercase },
                      { label: "رقم", met: passwordValidation.number },
                    ].map((rule, idx) => (
                      <div key={idx} className="flex items-center gap-2 justify-end">
                        <span className={`text-[10px] ${rule.met ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>{rule.label}</span>
                        <div className={`w-3 h-3 rounded-full ${rule.met ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setAgreed(!agreed)}
                  className={`w-5 h-5 rounded-md border-2 flex-shrink-0 flex items-center justify-center transition-all ${agreed ? "bg-primary border-primary" : "border-slate-300 bg-white"}`}
                >
                  {agreed && <Check className="w-3 h-3 text-white" />}
                </button>
                <p className="text-xs text-slate-500">
                  أوافق على <span className="text-primary font-bold">شروط الاستخدام</span> و <span className="text-primary font-bold">سياسة الخصوصية</span>
                </p>
              </div>

              <button
                onClick={handleSignupAndSendOTP}
                disabled={isLoading}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-primary/20 flex items-center justify-center gap-2 mt-4"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "إنشاء حسابي"}
              </button>

              <div className="relative my-6 text-center">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                <span className="relative bg-white px-4 text-xs text-slate-400 font-semibold">أو</span>
              </div>

              <button className="w-full border-2 border-slate-100 hover:border-primary/20 hover:bg-slate-50 text-slate-700 font-bold py-3.5 rounded-2xl transition-all duration-300 flex items-center justify-center gap-3">
                <Chrome className="w-5 h-5" />
                التسجيل عبر جوجل
              </button>

              <p className="text-center text-sm text-slate-500 mt-6">
                لديك حساب؟
                <a href="/login" className="text-primary font-black hover:underline mr-1">سجل دخولك</a>
              </p>
            </div>
          </div>
        ) : (
          <div className="animate-in fade-in zoom-in-95 duration-500">
            <button onClick={() => setStep(1)} className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <ArrowRight className="w-5 h-5 text-slate-400" />
            </button>

            <div className="text-center mb-10 mt-4">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-black text-slate-800 mb-2">تفعيل الحساب</h2>
              <p className="text-sm text-slate-500">لقد أرسلنا رمز التحقق المكون من 6 أرقام إلى بريدك الإلكتروني:</p>
              <p className="text-sm font-black text-primary mt-1">{form.email}</p>
            </div>

            <div className="space-y-6">
              <input
                type="text"
                maxLength={6}
                placeholder="0 0 0 0 0 0"
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-5 py-4 text-2xl font-black text-center tracking-[1rem] outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all text-primary"
                autoFocus
              />

              <button
                onClick={handleVerifyOTP}
                disabled={isLoading || otpCode.length < 6}
                className="w-full bg-primary hover:bg-primary/90 text-white font-black py-4 rounded-2xl transition-all duration-300 hover:scale-[1.02] shadow-xl shadow-primary/20 flex items-center justify-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "تحقق وتفعيل"}
              </button>

              <div className="text-center">
                <p className="text-xs text-slate-500 mb-4">لم يصلك الرمز بعد؟</p>
                <button
                  onClick={handleResendOTP}
                  disabled={isLoading}
                  className="text-primary font-black text-sm hover:underline"
                >
                  إعادة إرسال الرمز
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Signup;

