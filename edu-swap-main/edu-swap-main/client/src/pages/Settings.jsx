import { useState, useEffect } from "react";
import {
  User,
  Lock,
  Bell,
  Moon,
  Shield,
  Eye,
  EyeOff,
  ChevronDown,
  CheckCircle,
  AlertTriangle,
  Smartphone,
  Key,
  Check,
} from "lucide-react";
import { getProfile, updateProfile, sendOTP, verifyOTP, changePassword } from "../api/api";

function SectionCard({ icon, iconBg, iconColor, title, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-4">
      <div className="flex items-center justify-end gap-3 mb-5">
        <h2 className="text-lg font-black text-slate-800">{title}</h2>
        <div
          className={`w-9 h-9 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center`}
        >
          {icon}
        </div>
      </div>
      {children}
    </div>
  );
}

function InputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  suffix,
}) {
  return (
    <div className="mb-4">
      <label className="block text-sm font-semibold text-slate-600 mb-1.5 text-right">
        {label}
      </label>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-white text-right"
        />
        {suffix && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
            {suffix}
          </div>
        )}
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options }) {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-sm font-semibold text-slate-600 mb-1.5 text-right">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-white text-right appearance-none cursor-pointer"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0 ${checked ? "bg-primary" : "bg-slate-200"
        }`}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-all duration-300 ${checked ? "left-5" : "left-0.5"
          }`}
      />
    </button>
  );
}

function NotificationRow({ title, desc, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
      <Toggle checked={checked} onChange={onChange} />
      <div className="text-right flex-1 mr-3">
        <p className="text-sm font-semibold text-slate-700">{title}</p>
        <p className="text-xs text-slate-400 mt-0.5">{desc}</p>
      </div>
    </div>
  );
}

const Settings = () => {
  // Account
  const [fullName, setFullName] = useState("احمد جمال");
  const [email, setEmail] = useState("Ahmed.Gamal@university.edu");
  const [phone, setPhone] = useState("+201290752718");
  const [university, setUniversity] = useState("mansura");

  // Password
  const [currentPass, setCurrentPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Notifications
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);

  // Appearance
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("ar");

  // Status
  const [isUpdating, setIsUpdating] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: "", type: "success" });
  const [isNewPassFocused, setIsNewPassFocused] = useState(false);

  // OTP & Verification State
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [verificationStep, setVerificationStep] = useState("idle"); // idle, verifying_old, verifying_new
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await getProfile();
        const data = res.data.data.profile;
        setUserMetadata(data);
        setFullName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setUniversity(data.university || "mansura");
        setIsPhoneVerified(data.isVerified === 1);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleSaveAccount = async () => {
    setIsUpdating(true);
    try {
      await updateProfile({
        name: fullName,
        phone: phone,
        university: university,
      });
      showNotification("تم حفظ التغييرات بنجاح", "success");
    } catch (error) {
      console.error("Update failed:", error);
      showNotification(error.response?.data?.msg || "فشل تحديث البيانات", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSendOtp = async (targetPhone = null) => {
    // If no target phone provided, decide based on step
    const phoneToVerify = targetPhone || (verificationStep === "verifying_old" ? userMetadata.phone : phone);

    if (!phoneToVerify) return showNotification("رقم الهاتف غير موجود", "error");

    console.log(`[DEBUG] Sending OTP to: ${phoneToVerify} (Step: ${verificationStep})`);

    setIsSendingOtp(true);
    try {
      await sendOTP(email, phoneToVerify);
      setShowOtpInput(true);
      showNotification(`تم إرسال رمز التحقق إلى ${phoneToVerify}`, "success");
    } catch (error) {
      showNotification(error.response?.data?.msg || "فشل إرسال رمز التحقق", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return showNotification("يرجى إدخال رمز التحقق", "error");
    try {
      await verifyOTP(email, otpCode);
      if (verificationStep === "verifying_old") {
        showNotification("تم التحقق من الرقم القديم، أدخل الرقم الجديد", "success");
        setVerificationStep("verifying_new");
        setIsPhoneVerified(false);
        setPhone("");
        setShowOtpInput(false);
        setOtpCode("");
      } else {
        setIsPhoneVerified(true);
        setVerificationStep("idle");
        setShowOtpInput(false);
        setOtpCode("");
        showNotification("تم توثيق رقم الهاتف الجديد بنجاح", "success");
      }
    } catch (error) {
      showNotification(error.response?.data?.msg || "رمز التحقق غير صحيح", "error");
    }
  };

  const startChangePhone = () => {
    if (isPhoneVerified && userMetadata?.phone) {
      // Step 1: Verify ownership of OLD number
      setVerificationStep("verifying_old");
      handleSendOtp(userMetadata.phone);
    } else {
      // Direct verification of provided number
      setVerificationStep("verifying_new");
      handleSendOtp(phone);
    }
  };

  const passwordValidation = {
    length: newPass.length >= 6,
    uppercase: /[A-Z]/.test(newPass),
    lowercase: /[a-z]/.test(newPass),
    number: /[0-9]/.test(newPass),
  };

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const handleUpdatePassword = async () => {
    if (!currentPass || !newPass || !confirmPass) {
      showNotification("يرجى ملء جميع الحقول", "error");
      return;
    }
    if (newPass !== confirmPass) {
      showNotification("كلمة المرور الجديدة وتأكيدها غير متطابقان", "error");
      return;
    }
    if (newPass.length < 6) {
      showNotification("يجب أن تكون كلمة المرور 6 أحرف على الأقل", "error");
      return;
    }
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    if (!passwordRegex.test(newPass)) {
      showNotification("يجب أن تحتوي كلمة المرور على حرف كبير، حرف صغير، ورقم (بالإنجليزي)", "error");
      return;
    }

    setIsUpdating(true);
    try {
      await changePassword({ currentPassword: currentPass, newPassword: newPass });
      showNotification("تم تحديث كلمة المرور بنجاح", "success");
      setCurrentPass("");
      setNewPass("");
      setConfirmPass("");
    } catch (error) {
      const errorMsg = error.response?.data?.msg || "حدث خطأ أثناء تحديث كلمة المرور";
      showNotification(errorMsg, "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // Privacy
  const [profileVisibility, setProfileVisibility] = useState("public");
  const [emailVisibility, setEmailVisibility] = useState("hidden");

  return (
    <div
      dir="rtl"
      className="bg-slate-100"
      style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        {/* Page Header */}
        <div className="text-right mb-6">
          <h1 className="text-2xl font-black text-slate-800">الإعدادات</h1>
          <p className="text-sm text-slate-500 mt-1">
            التحكم في اعدادات التطبيق والخصوصيه
          </p>
        </div>

        {/* ── Account Settings ── */}
        <SectionCard
          icon={<User className="w-5 h-5" />}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          title="اعدادات الحساب"
        >
          <InputField
            label="الاسم الكامل"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
          <InputField
            label="البريد الإلكتروني"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <InputField
            label="رقم الهاتف"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            suffix={
              <div className="flex items-center gap-2">
                {isPhoneVerified ? (
                  <button
                    onClick={startChangePhone}
                    className="text-[10px] font-bold text-primary hover:text-primary-700 bg-primary-50 px-2 py-1 rounded-lg transition-colors border border-primary-100"
                  >
                    تغيير
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setVerificationStep("verifying_new");
                      handleSendOtp(phone);
                    }}
                    className="text-[10px] font-bold text-emerald-600 hover:text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg transition-colors border border-emerald-100"
                  >
                    تحقق
                  </button>
                )}
                {isPhoneVerified && <CheckCircle size={14} className="text-emerald-500" />}
              </div>
            }
          />

          {/* OTP Input UI */}
          {showOtpInput && (
            <div className="mb-4 p-4 bg-primary-50 rounded-2xl border border-primary-100 animate-in slide-in-from-top-2">
              <div className="flex items-center justify-between mb-3 flex-row-reverse">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary-900">تحقق من الرمز</span>
                  <Key size={14} className="text-primary-600" />
                </div>
                <button onClick={() => setShowOtpInput(false)} className="text-slate-400 hover:text-slate-600">
                  <AlertTriangle size={14} />
                </button>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleVerifyOtp}
                  className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl hover:bg-primary-700 transition-all shadow-sm"
                >
                  تأكيد
                </button>
                <input
                  type="text"
                  maxLength="6"
                  placeholder="000000"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  className="flex-1 bg-white border border-primary-200 rounded-xl px-3 py-2 text-center text-sm font-bold tracking-[0.5em] outline-none focus:ring-2 focus:ring-primary-400"
                  dir="ltr"
                />
              </div>
              <p className="text-[10px] text-primary-600 mt-2 text-right">أدخل الرمز المكون من 6 أرقام المرسل لهاتفك</p>
            </div>
          )}
          <SelectField
            label="الجامعه"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            options={[
              { value: "mansura", label: "جامعه المنصوره" },
              { value: "cairo", label: "جامعة القاهرة" },
              { value: "alex", label: "جامعة الإسكندرية" },
              { value: "ain", label: "جامعة عين شمس" },
            ]}
          />
          <div className="flex justify-start mt-2">
            <button
              onClick={handleSaveAccount}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary-100 text-sm disabled:opacity-50"
            >
              {isUpdating ? "جاري الحفظ..." : "حفظ التغيرات"}
            </button>
          </div>
        </SectionCard>

        {/* ── Change Password ── */}
        <SectionCard
          icon={<Lock className="w-5 h-5" />}
          iconBg="bg-primary"
          iconColor="text-white"
          title="تغيير كلمه المرور"
        >
          {/* Current Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 text-right">
              كلمة المرور الحاليه
            </label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                value={currentPass}
                onChange={(e) => setCurrentPass(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-white text-right pl-11"
              />
              <button
                onClick={() => setShowCurrent(!showCurrent)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showCurrent ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 text-right">
              كلمة المرور الجديده
            </label>
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onFocus={() => setIsNewPassFocused(true)}
                onBlur={() => setIsNewPassFocused(false)}
                onChange={(e) => setNewPass(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-white text-right pl-11"
              />
              <button
                onClick={() => setShowNew(!showNew)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showNew ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Password Instructions Box */}
            <div className={`mt-3 p-3 bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all duration-300 ${isNewPassFocused || newPass ? 'max-h-40 opacity-100 mb-2' : 'max-h-0 opacity-0 py-0 border-0'}`}>
              <p className="text-[10px] font-bold text-slate-500 mb-2 border-b border-slate-100 pb-1 text-right">تعليمات كلمة المرور الجيدة:</p>
              <div className="grid grid-cols-2 gap-y-1.5 gap-x-2">
                {[
                  { label: "6 أحرف فأكثر", met: passwordValidation.length },
                  { label: "حرف كبير (A-Z)", met: passwordValidation.uppercase },
                  { label: "حرف صغير (a-z)", met: passwordValidation.lowercase },
                  { label: "رقم (0-9)", met: passwordValidation.number },
                ].map((rule, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 justify-end">
                    <span className={`text-[10px] ${rule.met ? 'text-emerald-600 font-bold' : 'text-slate-400'}`}>{rule.label}</span>
                    <div className={`w-3 h-3 rounded-full flex items-center justify-center ${rule.met ? 'bg-emerald-100' : 'bg-slate-200'}`}>
                      {rule.met && <CheckCircle size={10} className="text-emerald-600" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="mb-5">
            <label className="block text-sm font-semibold text-slate-600 mb-1.5 text-right">
              تأكيد كلمة المرور الجديده
            </label>
            <div className="relative">
              <input
                type={showConfirm ? "text" : "password"}
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-white text-right pl-11"
              />
              <button
                onClick={() => setShowConfirm(!showConfirm)}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showConfirm ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <div className="flex justify-start">
            <button
              onClick={handleUpdatePassword}
              disabled={isUpdating}
              className="bg-primary hover:bg-primary text-white font-bold px-6 py-3.5 rounded-xl transition-all duration-300 hover:scale-[1.02] shadow-lg shadow-primary-100 text-sm disabled:opacity-50"
            >
              {isUpdating ? "جاري التحديث..." : "تحديث كلمة المرور"}
            </button>
          </div>
        </SectionCard>

        {/* ── Notifications ── */}
        <SectionCard
          icon={<Bell className="w-5 h-5" />}
          iconBg="bg-primary"
          iconColor="text-white"
          title="الاشعارات"
        >
          <NotificationRow
            title="اشعارات البريد الإلكتروني"
            desc="استلام التحديثات عبر البريد الإلكتروني"
            checked={emailNotif}
            onChange={setEmailNotif}
          />
          <NotificationRow
            title="الاشعارات الفوريه"
            desc="استلام التحديثات الفورية في جهازك"
            checked={pushNotif}
            onChange={setPushNotif}
          />
          <NotificationRow
            title="رسائل SMS"
            desc="استلام التحديثات عبر الرسائل النصية"
            checked={smsNotif}
            onChange={setSmsNotif}
          />
        </SectionCard>

        {/* ── Appearance ── */}
        <SectionCard
          icon={<Moon className="w-5 h-5" />}
          iconBg="bg-slate-100"
          iconColor="text-slate-600"
          title="المظهر"
        >
          <div className="flex items-center justify-between py-3 border-b border-slate-50">
            <Toggle checked={darkMode} onChange={setDarkMode} />
            <div className="text-right flex-1 mr-3">
              <p className="text-sm font-semibold text-slate-700">
                الوضع الليلي
              </p>
              <p className="text-xs text-slate-400 mt-0.5">
                تفعيل المظهر الداكن للتطبيق
              </p>
            </div>
          </div>

          <div className="pt-3">
            <p className="text-sm font-semibold text-slate-700 text-right mb-2">
              اللغه
            </p>
            <SelectField
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { value: "ar", label: "العربية" },
                { value: "en", label: "English" },
              ]}
            />
          </div>
        </SectionCard>

        {/* ── Privacy ── */}
        <SectionCard
          icon={<Shield className="w-5 h-5" />}
          iconBg="bg-primary"
          iconColor="text-white"
          title="الخصوصيه"
        >
          <div className="mb-4">
            <p className="text-sm font-semibold text-slate-700 text-right mb-2">
              ظهور الملف الشخصي
            </p>
            <SelectField
              value={profileVisibility}
              onChange={(e) => setProfileVisibility(e.target.value)}
              options={[
                {
                  value: "public",
                  label: "عام - يمكن لأي شخص رؤيه ملفي الشخصي",
                },
                { value: "friends", label: "الأصدقاء فقط" },
                { value: "private", label: "خاص" },
              ]}
            />
          </div>

          <div>
            <p className="text-sm font-semibold text-slate-700 text-right mb-2">
              اظهار البريد الإلكتروني
            </p>
            <SelectField
              value={emailVisibility}
              onChange={(e) => setEmailVisibility(e.target.value)}
              options={[
                { value: "hidden", label: "مخفي" },
                { value: "friends", label: "الأصدقاء فقط" },
                { value: "public", label: "عام" },
              ]}
            />
          </div>
        </SectionCard>
      </main>

      {/* ── Notification Card ── */}
      {notification.show && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-[4px] animate-in fade-in duration-300">
          <div className="bg-white rounded-[2.5rem] p-8 flex flex-col items-center gap-5 shadow-[0_25px_60px_rgba(0,0,0,0.2)] border border-slate-100 animate-in zoom-in-95 duration-300 max-w-[320px] w-full relative overflow-hidden">
            {/* Background decorative circles */}
            <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-10 ${notification.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />
            <div className={`absolute -bottom-10 -left-10 w-32 h-32 rounded-full opacity-10 ${notification.type === "success" ? "bg-emerald-500" : "bg-red-500"}`} />

            <div className={`w-20 h-20 rounded-full flex items-center justify-center scale-110 shadow-lg ${notification.type === "success" ? "bg-emerald-50 text-emerald-500 shadow-emerald-100" : "bg-red-50 text-red-500 shadow-red-100"}`}>
              {notification.type === "success" ? (
                <CheckCircle size={40} strokeWidth={2.5} className="animate-in zoom-in-50 duration-500" />
              ) : (
                <AlertTriangle size={40} strokeWidth={2.5} className="animate-in zoom-in-50 duration-500" />
              )}
            </div>
            <div className="text-center relative z-10">
              <h3 className={`text-xl font-black mb-2 ${notification.type === "success" ? "text-emerald-900" : "text-red-900"}`}>
                {notification.type === "success" ? "تمت العملية!" : "عذراً، حدث خطأ"}
              </h3>
              <p className="text-slate-500 text-sm font-medium leading-relaxed">
                {notification.message}
              </p>
            </div>
            <button
              onClick={() => setNotification(n => ({ ...n, show: false }))}
              className={`mt-2 w-full py-3 rounded-2xl font-bold text-sm transition-all active:scale-95 ${notification.type === "success" ? "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-200" : "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-200"}`}
            >
              فهمت
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
