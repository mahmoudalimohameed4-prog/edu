

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { changePassword } from "../api/api";
import {
  ArrowRight,
  Lock,
  Eye,
  EyeOff,
  Shield,
  ShieldCheck,
  Smartphone,
  Key,
  MonitorSmartphone,
  Tablet,
  Laptop,
  AlertTriangle,
  CheckCircle,
  Info,
  LogOut,
  Flag,
  Check,
} from "lucide-react";

/* ── Toggle Switch ── */
function Toggle({ enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-300 focus:outline-none shrink-0 ${enabled ? "bg-primary" : "bg-slate-300"}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${enabled ? "translate-x-5" : "translate-x-0"}`}
      />
    </button>
  );
}

/* ── Password Input ── */
function PasswordInput({ label, value, onChange, placeholder, onFocus, onBlur }) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs sm:text-sm text-slate-500 text-right">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition"
        >
          {show ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          placeholder={placeholder}
          dir="rtl"
          className="w-full rounded-xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-300 outline-none transition py-2.5 px-4 pl-10 focus:border-primary focus:ring-2 focus:ring-primary-100"
        />
      </div>
    </div>
  );
}

/* ── Section Card ── */
function Card({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ title, icon: Icon, iconClass }) {
  return (
    <div className="flex items-center justify-end gap-2.5 px-4 sm:px-5 py-4">
      <h2 className="text-base font-extrabold text-slate-800">{title}</h2>
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${iconClass}`}>
        <Icon size={15} />
      </div>
    </div>
  );
}

/* ── Device Icon ── */
function DeviceIcon({ type }) {
  const cls = "text-primary";
  if (type === "phone") return <Smartphone size={18} className={cls} />;
  if (type === "tablet") return <Tablet size={18} className={cls} />;
  return <Laptop size={18} className={cls} />;
}

/* ── Login session row ── */
function SessionRow({ device, type, location, time, isCurrent, isSuspicious }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 last:border-0 gap-3">
      <div className="w-8 h-8 bg-primary-50 rounded-xl flex items-center justify-center shrink-0">
        <Check size={16} className="text-primary" />
      </div>
      <div className="flex-1 text-right">
        <div className="flex items-center gap-2 justify-end">
          {isCurrent && (
            <span className="bg-primary-100 text-primary text-[10px] font-bold px-2 py-0.5 rounded-full">نشط الآن</span>
          )}
          {isSuspicious && (
            <span className="bg-red-100 text-red-500 text-[10px] font-bold px-2 py-0.5 rounded-full">محظور</span>
          )}
          <p className={`text-sm font-bold ${isSuspicious ? "text-red-500" : "text-slate-800"}`}>{device}</p>
        </div>
        <p className="text-[11px] text-slate-400 mt-0.5">{location}</p>
        <p className="text-[11px] text-slate-400">{time}</p>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
function Security() {
  const navigate = useNavigate();
  const [passwords, setPasswords] = useState({ current: "", new: "", confirm: "" });
  const [twoFA, setTwoFA] = useState(false);
  const [biometric, setBiometric] = useState(true);

  const upd = (k) => (e) => setPasswords({ ...passwords, [k]: e.target.value });

  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [isUpdating, setIsUpdating] = useState(false);
  const [pwUpdated, setPwUpdated] = useState(false);
  const [isNewPwFocused, setIsNewPwFocused] = useState(false);

  const newPwValidation = {
    length: passwords.new.length >= 6,
    uppercase: /[A-Z]/.test(passwords.new),
    lowercase: /[a-z]/.test(passwords.new),
    number: /[0-9]/.test(passwords.new),
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  const handleUpdatePw = async () => {
    console.log("Attempting password update...", {
      currentProvided: !!passwords.current,
      newProvided: !!passwords.new,
      confirmProvided: !!passwords.confirm
    });

    if (!passwords.current || !passwords.new || !passwords.confirm) {
      showNotification("يرجى ملء جميع الحقول", "error");
      return;
    }
    if (passwords.new !== passwords.confirm) {
      showNotification("كلمة المرور الجديدة وتأكيدها غير متطابقان", "error");
      return;
    }
    if (passwords.new.length < 6) {
      showNotification("يجب أن تكون كلمة المرور 6 أحرف على الأقل", "error");
      return;
    }

    setIsUpdating(true);
    try {
      console.log("Calling changePassword API...");
      const response = await changePassword({
        currentPassword: passwords.current,
        newPassword: passwords.new
      });
      console.log("API Success:", response.data);

      setPwUpdated(true);
      setPasswords({ current: "", new: "", confirm: "" });
      showNotification("تم تحديث كلمة المرور بنجاح", "success");
      setTimeout(() => setPwUpdated(false), 3000);
    } catch (error) {
      console.error("Change Password Error:", error);
      const errorMsg = error.response?.data?.msg || error.message || "فشل تحديث كلمة المرور";
      showNotification(errorMsg, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const securitySteps = [
    { label: "كلمه مرور قويه", done: true },
    { label: "المصادقه الثنائيه", done: twoFA },
    { label: "تسجيل الدخول", done: true },
    { label: "الاجهزه الموثوقه", done: true },
  ];
  const doneCount = securitySteps.filter((s) => s.done).length;

  const sessions = [
    { device: "iphone 13 Pro", type: "phone", location: "المنصوره، القاهره", time: "اليوم الساعة 2:30 م", isCurrent: true },
    { device: "MacBook Pro", type: "laptop", location: "أجا, القاهره", time: "أمس الساعة 9:15 ص" },
    { device: "ipad", type: "tablet", location: "المنصوره، القاهره", time: "منذ 3 أيام" },
    { device: "جهاز غير معروف", type: "phone", location: "جده، السعوديه", time: "منذ أسبوع", isSuspicious: true },
  ];

  const tips = [
    "استخدم كلمة مرور قويه ومختلفه لكل حساب",
    "فعل المصادقه الثنائيه دائما",
    "راجع سجل تسجيل الدخول بانظام",
    "لا تشارك معلومات حسابك مع أحد",
  ];

  return (
    <div dir="rtl" className="bg-slate-50" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* ── Header ── */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-500"
          >
            <ArrowRight size={18} />
          </button>
          <div className="flex-1 text-right">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">الامان وتسجيل الدخول</h1>
            <p className="text-[11px] sm:text-xs text-slate-400">ادارة أمان حسابك واعدادات تسجيل الدخول</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">

        {/* ══ Security Score Banner ══ */}
        <div
          className="rounded-2xl p-5 relative overflow-hidden shadow-md"
          style={{ background: "linear-gradient(135deg, var(--app-gradient-start) 0%, var(--app-gradient-mid) 55%, var(--app-gradient-end) 100%)" }}
        >
          {/* decorative */}
          <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/5 rounded-full pointer-events-none" />
          <div className="absolute -bottom-8 right-4 w-28 h-28 bg-white/5 rounded-full pointer-events-none" />

          <div className="relative flex items-start justify-between mb-5">
            <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center">
              <Shield size={24} className="text-white" />
            </div>
            <div className="text-right">
              <p className="text-xl font-extrabold text-white">حسابك أمن</p>
              <p className="text-white/70 text-xs mt-0.5">لديك {doneCount} من 4 إجراءات أمان مفعله</p>
            </div>
          </div>

          {/* Step tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {securitySteps.map((s, i) => (
              <div
                key={i}
                className={`flex flex-col items-center gap-1.5 rounded-xl px-1 py-2 text-center ${s.done ? "bg-white/20" : "bg-white/10 opacity-70"}`}
              >
                <div className={`w-6 h-6 rounded-full flex items-center justify-center ${s.done ? "bg-white/30" : "bg-white/10"}`}>
                  {s.done
                    ? <Check size={12} className="text-white" />
                    : <AlertTriangle size={11} className="text-yellow-300" />}
                </div>
                <p className="text-[10px] text-white font-semibold leading-tight">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Change Password ══ */}
        <Card>
          <SectionHeader title="تغيير كلمه المرور" icon={Lock} iconClass="bg-primary-50 text-primary" />
          <div className="px-4 sm:px-5 pb-5 flex flex-col gap-3 border-t border-slate-100 pt-4">
            <PasswordInput label="كلمه المرور الحاليه" value={passwords.current} onChange={upd("current")} />
            <PasswordInput
              label="كلمه المرور الجديده"
              value={passwords.new}
              onChange={upd("new")}
              onFocus={() => setIsNewPwFocused(true)}
              onBlur={() => setIsNewPwFocused(false)}
            />
            {/* Password Instructions Container */}
            <div className={`p-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${isNewPwFocused || passwords.new ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0 py-0 border-0'}`}>
              <p className="text-[10px] font-bold text-slate-500 mb-2 border-b border-slate-100 pb-1">تعليمات كلمة المرور الجديدة:</p>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                {[
                  { label: "6 أحرف فأكثر", met: newPwValidation.length },
                  { label: "حرف كبير (A-Z)", met: newPwValidation.uppercase },
                  { label: "حرف صغير (a-z)", met: newPwValidation.lowercase },
                  { label: "رقم (0-9)", met: newPwValidation.number },
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 justify-end">
                    <span className={`text-[10px] ${rule.met ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>{rule.label}</span>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${rule.met ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                      {rule.met && <Check size={8} className="text-emerald-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <PasswordInput label="تاكيد كلمه المرور الجديده" value={passwords.confirm} onChange={upd("confirm")} />
            <div className="flex justify-start mt-1">
              <button
                onClick={handleUpdatePw}
                disabled={isUpdating}
                className={`px-7 py-2.5 rounded-xl text-sm font-bold text-white transition-all ${pwUpdated ? "bg-emerald-500" : "bg-primary hover:bg-primary-700 disabled:opacity-50"}`}
              >
                {isUpdating ? "جاري التحديث..." : pwUpdated ? "✓ تم التحديث" : "تحديث كلمه المرور"}
              </button>
            </div>
          </div>
        </Card>

        {/* ══ Two Factor Auth ══ */}
        <Card>
          <SectionHeader title="المصادقه الثنائيه" icon={Key} iconClass="bg-primary-50 text-primary" />
          <div className="px-4 sm:px-5 pb-5 border-t border-slate-100 pt-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <Toggle enabled={twoFA} onChange={setTwoFA} />
              <div className="text-right flex-1">
                <p className="text-sm font-bold text-slate-800">تفعيل المصادقه الثنائيه(2FA)</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  أضف طبقه حمايه اضافيه لحسابك باستخدام رمز التحقق
                </p>
              </div>
            </div>

            {!twoFA && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-2.5 flex-row-reverse">
                <Info size={16} className="text-amber-500 shrink-0 mt-0.5" />
                <div className="text-right">
                  <p className="text-xs font-bold text-amber-700">يوصي بتفعيل المصادقه الثنائيه</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">حمايه اضافيه لمنع الوصول غير المصرح به لحسابك</p>
                </div>
              </div>
            )}

            {twoFA && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2.5 flex-row-reverse">
                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                <p className="text-xs font-bold text-emerald-700 text-right">المصادقه الثنائيه مفعّله ✓</p>
              </div>
            )}
          </div>
        </Card>

        {/* ══ Biometric Login ══ */}
        <Card>
          <SectionHeader title="تسجيل الدخول الحيوي" icon={Smartphone} iconClass="bg-primary-50 text-primary" />
          <div className="px-4 sm:px-5 pb-5 border-t border-slate-100 pt-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-4">
              <Toggle enabled={biometric} onChange={setBiometric} />
              <div className="text-right flex-1">
                <p className="text-sm font-bold text-slate-800">Face ID / Touch ID</p>
                <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">
                  استخدم البصمه أو التعرف على الوجه لتسجيل الدخول
                </p>
              </div>
            </div>

            {biometric && (
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 flex items-center gap-2.5 flex-row-reverse">
                <CheckCircle size={16} className="text-emerald-500 shrink-0" />
                <p className="text-xs font-bold text-emerald-700 text-right">مفعل على جهاز iphone 13 Pro</p>
              </div>
            )}
          </div>
        </Card>

        {/* ══ Login Sessions ══ */}
        <Card>
          <SectionHeader title="سجل تسجيل الدخول" icon={MonitorSmartphone} iconClass="bg-slate-100 text-slate-500" />
          <div className="border-t border-slate-100">
            {sessions.map((s, i) => (
              <SessionRow key={i} {...s} />
            ))}
          </div>
        </Card>

        {/* ══ Security Tips ══ */}
        <Card>
          <SectionHeader title="نصائح أمنيه" icon={ShieldCheck} iconClass="bg-primary-50 text-primary" />
          <div className="px-4 sm:px-5 pb-5 border-t border-slate-100 pt-3 flex flex-col gap-2.5">
            {tips.map((tip, i) => (
              <div key={i} className="flex items-center gap-3 flex-row-reverse">
                <div className="w-5 h-5 bg-primary-100 rounded-full flex items-center justify-center shrink-0">
                  <Check size={11} className="text-primary" />
                </div>
                <p className="text-sm text-slate-700 text-right">{tip}</p>
              </div>
            ))}
          </div>
        </Card>

        {/* ══ Emergency Actions ══ */}
        <Card className="mb-2">
          <SectionHeader title="اجراءات طارئه" icon={AlertTriangle} iconClass="bg-red-50 text-red-400" />
          <div className="px-4 sm:px-5 pb-5 border-t border-slate-100 pt-4 flex flex-col gap-3">
            <button className="w-full border-2 border-red-200 text-red-500 font-bold text-sm py-3 rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2">
              <LogOut size={16} />
              تسجيل الخروج من جميع الاجهزه
            </button>
            <button className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm py-3 rounded-xl transition flex items-center justify-center gap-2">
              <Flag size={16} />
              ابلاغ عن نشاط مشبوه
            </button>
          </div>
        </Card>

      </div>

      {/* ── Notification Card ── */}
      {notification.show && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-top-4">
          <div className={`rounded-2xl shadow-2xl p-4 flex items-center gap-3 border ${notification.type === "success" ? "bg-white border-emerald-100" : "bg-white border-red-100"}`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${notification.type === "success" ? "bg-emerald-50 text-emerald-500" : "bg-red-50 text-red-500"}`}>
              {notification.type === "success" ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
            </div>
            <div className="text-right">
              <p className={`text-sm font-black ${notification.type === "success" ? "text-emerald-900" : "text-red-900"}`}>
                {notification.type === "success" ? "تم بنجاح" : "خطأ"}
              </p>
              <p className="text-xs text-slate-500">{notification.message}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Security;
