import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { getProfile, updateProfile, updateProfilePicture, getMyItems, createItem, getAllCategories, sendOTP, verifyOTP } from "../api/api";
import { Plus, X, Upload } from "lucide-react";
import {
  User,
  Phone,
  Mail,
  Calendar,
  BookOpen,
  Edit2,
  LogOut,
  LayoutDashboard,
  MapPin,
  ChevronDown,
  Save,
  CheckCircle,
} from "lucide-react";

/* ── Input Field ── */
function InputField({ label, helper, icon: Icon, type = "text", value, onChange, placeholder, disabled, suffix }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs sm:text-sm text-slate-500 text-right">{label}</label>
      {helper && (
        <p className="text-[11px] text-slate-400 text-right leading-snug">{helper}</p>
      )}
      <div className="relative">
        {suffix && (
          <div className="absolute left-2 top-1/2 -translate-y-1/2 z-10">
            {suffix}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          dir="rtl"
          className={`w-full rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-700
            placeholder:text-slate-300 outline-none transition py-2.5 px-3
            ${Icon ? "pr-9" : ""}
            ${suffix ? "pl-14" : ""}
            focus:border-primary focus:ring-2 focus:ring-primary-100
            ${disabled ? "bg-slate-50 text-slate-400 cursor-not-allowed" : ""}
          `}
        />
        {Icon && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-300 pointer-events-none">
            <Icon size={14} />
          </span>
        )}
      </div>
    </div>
  );
}

/* ── Select Field ── */
function SelectField({ label, options, value, onChange }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs sm:text-sm text-slate-500 text-right">{label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={onChange}
          dir="rtl"
          className="w-full appearance-none rounded-lg border border-slate-200 bg-white text-xs sm:text-sm text-slate-700
            outline-none transition py-2.5 px-3 pl-8
            focus:border-primary focus:ring-2 focus:ring-primary-100"
        >
          {options.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
        <ChevronDown size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
      </div>
    </div>
  );
}

/* ── Section Card ── */
function SectionCard({ children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
      {children}
    </div>
  );
}

/* ── Section Header ── */
function SectionHeader({ title, icon: Icon, iconClass }) {
  return (
    <div className="flex items-center justify-end gap-3 px-4 sm:px-5 py-3.5 border-b border-slate-100">
      <h2 className="text-sm sm:text-base font-bold text-slate-800">{title}</h2>
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconClass}`}>
        <Icon size={15} />
      </div>
    </div>
  );
}

/* ── Book Card ── */
function BookCard({ title, img, tag, onClick }) {
  return (
    <div onClick={onClick} className="rounded-xl border border-slate-200 overflow-hidden bg-white hover:shadow-md transition-shadow cursor-pointer flex flex-col">
      <div className="h-[100px] sm:h-[130px] bg-slate-100 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-2.5 flex flex-col gap-1.5 flex-1 text-right">
        <p className="text-xs sm:text-sm font-bold text-slate-800 leading-snug line-clamp-2">{title}</p>
        {tag && (
          <div className="flex items-center justify-between mt-auto pt-1">
            <span className="text-[10px] sm:text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded-full">
              {tag}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">نقط</span>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Empty Slot ── */
function AddSlot({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="rounded-xl border border-slate-200 bg-white flex flex-col items-center justify-center gap-2 min-h-[155px] sm:min-h-[185px] w-full text-slate-300 hover:border-primary-300 hover:text-primary transition-colors border-dashed"
    >
      <Plus size={26} strokeWidth={1.5} />
      <span className="text-xs font-semibold">إضافة أداة</span>
    </button>
  );
}

/* ── Add Item Modal ── */
function AddItemModal({ show, onClose, onSave, categories }) {
  const [form, setForm] = useState({
    name: "",
    categoryId: "",
    description: "",
    price: "",
    condition: "new"
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!show) return null;

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("categoryId", form.categoryId);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("condition", form.condition);
    formData.append("quantity", 1);
    if (image) formData.append("image", image);

    try {
      await onSave(formData);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-row-reverse">
          <h3 className="text-lg font-bold text-slate-800">إضافة أداة جديدة</h3>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="flex flex-col gap-1 items-end">
            <label className="text-xs font-bold text-slate-500">صورة الأداة</label>
            <div
              onClick={() => document.getElementById('item-img').click()}
              className="w-full aspect-video rounded-xl bg-slate-50 border-2 border-dashed border-slate-200 flex flex-col items-center justify-center cursor-pointer hover:border-primary/30 transition-all overflow-hidden relative"
            >
              {preview ? (
                <img src={preview} className="w-full h-full object-cover" />
              ) : (
                <>
                  <Upload size={24} className="text-slate-300 mb-2" />
                  <span className="text-xs text-slate-400">اضغط لرفع صورة</span>
                </>
              )}
              <input id="item-img" type="file" hidden onChange={handleImage} accept="image/*" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 items-end">
              <label className="text-xs font-bold text-slate-500">اسم الأداة</label>
              <input
                required
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                dir="rtl"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                placeholder="مثال: كتاب تفاضل"
              />
            </div>
            <div className="flex flex-col gap-1 items-end">
              <label className="text-xs font-bold text-slate-500">الفئة</label>
              <select
                required
                value={form.categoryId}
                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                dir="rtl"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">اختر فئة</option>
                {categories.map(cat => (
                  <option key={cat.Cat_id} value={cat.Cat_id}>{cat.Cat_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1 items-end">
            <label className="text-xs font-bold text-slate-500">الوصف</label>
            <textarea
              required
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              dir="rtl" rows="3"
              className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
              placeholder="وصف بسيط للأداة..."
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1 items-end">
              <label className="text-xs font-bold text-slate-500">السعر (0 للمجاني)</label>
              <div className="relative w-full">
                <input
                  type="number"
                  value={form.price}
                  onChange={e => setForm({ ...form, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary text-left"
                  placeholder="0.00"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">جنيه</span>
              </div>
            </div>
            <div className="flex flex-col gap-1 items-end">
              <label className="text-xs font-bold text-slate-500">الحالة</label>
              <select
                value={form.condition}
                onChange={e => setForm({ ...form, condition: e.target.value })}
                dir="rtl"
                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="new">جديد</option>
                <option value="like_new">كأنه جديد</option>
                <option value="good">جيد</option>
                <option value="fair">مقبول</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50"
            >
              إلغاء
            </button>
            <button
              disabled={isSubmitting}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 disabled:opacity-50"
            >
              {isSubmitting ? "جاري النشر..." : "نشر الأداة"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ── Notification Card ── */
function NotificationCard({ show, title, message, type = "success" }) {
  if (!show) return null;
  const isError = type === "error";
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-[2px] animate-in fade-in duration-300 pointer-events-none">
      <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)] border border-slate-100 animate-in zoom-in-95 duration-300 max-w-[280px] w-full pointer-events-auto">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center scale-110 ${isError ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500"}`}>
          {isError ? (
            <X size={32} strokeWidth={2.5} className="animate-in zoom-in-50 duration-500" />
          ) : (
            <CheckCircle size={32} strokeWidth={2.5} className="animate-in zoom-in-50 duration-500" />
          )}
        </div>
        <div className="text-center">
          <h3 className={`text-base font-bold ${isError ? "text-red-600" : "text-slate-800"}`}>{title}</h3>
          <p className="text-slate-500 text-[11px] mt-1 leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */

function Profile() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    gender: "male",
    birthdate: "",
    email: "",
    phone: "",
    phone2: "",
    bio: "",
    profilePicture: "",
  });
  const fileInputRef = useRef(null);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [userMetadata, setUserMetadata] = useState(null);
  const [activeTab, setActiveTab] = useState("tools");
  const [saved, setSaved] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [myItems, setMyItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [verificationStep, setVerificationStep] = useState("idle"); // idle, verifying_old, verifying_new
  const [tempPhone, setTempPhone] = useState("");
  const [notification, setNotification] = useState({ show: false, title: "", message: "", type: "success" });
  const API_BASE_URL = "http://localhost:4000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const [profileRes, itemsRes, catsRes] = await Promise.all([
          getProfile(),
          getMyItems(),
          getAllCategories()
        ]);

        const profileData = profileRes.data.data.profile;
        setUserMetadata(profileData);
        setMyItems(itemsRes.data.data);
        setCategories(catsRes.data.data);

        // Split name if needed or map directly
        const names = profileData.name?.split(" ") || ["", ""];
        setForm({
          firstName: names[0] || "",
          lastName: names.slice(1).join(" ") || "",
          gender: profileData.gender || "male",
          birthdate: profileData.birthdate?.split("T")[0] || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          phone2: profileData.phone2 || "",
          bio: profileData.bio || "",
          profilePicture: profileData.profilePicture || "",
        });
        setIsPhoneVerified(profileData.isVerified === 1);
      } catch (error) {
        console.error("Failed to fetch profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const upd = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const handleSave = async () => {
    try {
      const updateData = {
        name: `${form.firstName} ${form.lastName}`.trim(),
        phone: form.phone,
        phone2: form.phone2,
        gender: form.gender,
        birthdate: form.birthdate,
        bio: form.bio,
      };
      await updateProfile(updateData);
      setIsEditingBio(false);
      showNotify("تم الحفظ", "تم تحديث بياناتك الشخصية بنجاح بنجاح");
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  const handleAddItem = async (formData) => {
    try {
      await createItem(formData);
      const itemsRes = await getMyItems();
      setMyItems(itemsRes.data.data);
      showNotify("تمت الإضافة", "تمت إضافة الأداة بنجاح");
    } catch (err) {
      console.error("Failed to add item:", err);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await updateProfilePicture(formData);
      const newPath = response.data.data.imagePath;
      setForm(prev => ({ ...prev, profilePicture: newPath }));
      showNotify("تم التحديث", "تم تحديث صورة الملف الشخصي");
    } catch (error) {
      console.error("Failed to upload image:", error);
    }
  };

  const showNotify = (title, message, type = "success") => {
    setNotification({ show: true, title, message, type });
    setTimeout(() => setNotification(prev => ({ ...prev, show: false })), 3000);
  };

  const handleSendOtp = async (targetPhone = null) => {
    const phoneToVerify = targetPhone || (verificationStep === "verifying_old" ? userMetadata.phone : form.phone);
    if (!phoneToVerify) return showNotify("تنبيه", "رقم الهاتف غير موجود", "error");

    setIsSendingOtp(true);
    try {
      await sendOTP(form.email, phoneToVerify);
      setShowOtpInput(true);
      showNotify("تم الإرسال", `تم إرسال رمز التحقق إلى ${phoneToVerify}`);
    } catch (error) {
      console.error("Failed to send OTP:", error);
      showNotify("خطأ", error.response?.data?.msg || "فشل إرسال رمز التحقق", "error");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode) return showNotify("تنبيه", "يرجى إدخال رمز التحقق", "error");
    try {
      await verifyOTP(form.email, otpCode);

      if (verificationStep === "verifying_old") {
        showNotify("تم التحقق", "تم التحقق من ملكيتك للرقم القديم، يمكنك الآن إدخال الرقم الجديد");
        setVerificationStep("verifying_new");
        setIsPhoneVerified(false);
        setForm(prev => ({ ...prev, phone: "" })); // Clear for new input
        setShowOtpInput(false);
        setOtpCode("");
      } else {
        setIsPhoneVerified(true);
        setVerificationStep("idle");
        setShowOtpInput(false);
        setOtpCode("");
        showNotify("تم التحقق", "تم ربط و توثيق رقم الهاتف الجديد بنجاح");
      }
    } catch (error) {
      console.error("Failed to verify OTP:", error);
      showNotify("خطأ", error.response?.data?.msg || "رمز التحقق غير صحيح", "error");
    }
  };

  const startChangePhone = () => {
    setVerificationStep("verifying_old");
    handleSendOtp(userMetadata.phone);
  };

  return (
    <div dir="rtl" className="bg-slate-100" style={{ fontFamily: "'Cairo', sans-serif" }}>

      <NotificationCard
        show={notification.show}
        title={notification.title}
        message={notification.message}
        type={notification.type}
      />
      <AddItemModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddItem}
        categories={categories}
      />

      {/* ── Page Title ── */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5 text-right">
          <h1 className="text-lg sm:text-2xl font-extrabold text-slate-900">المعلومات الشخصية</h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">ادارة بياناتك الشخصية وتفضيلاتك</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-4">

        {/* ══ Profile Card ══ */}
        <SectionCard>
          {/* Blue cover */}
          <div className="h-[80px] sm:h-[96px] bg-gradient-to-l from-primary-900 via-primary-700 to-primary-500 relative overflow-hidden">
            <div className="absolute -top-10 right-8 w-44 h-44 bg-white/5 rounded-full" />
            <div className="absolute -bottom-10 left-16 w-32 h-32 bg-white/5 rounded-full" />
          </div>

          {/* Main info row: avatar+name RIGHT, buttons LEFT */}
          <div className="flex items-start justify-between px-4 sm:px-6 pt-3 pb-1 gap-3">

            {/* RIGHT: avatar + name stacked */}
            <div className="flex items-start gap-3 flex-row-reverse -mt-10 sm:-mt-12">
              {/* Avatar */}
              <div className="relative shrink-0">
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                />
                <div className="w-[68px] h-[68px] sm:w-[80px] sm:h-[80px] rounded-full border-4 border-white shadow-lg overflow-hidden bg-slate-100 flex items-center justify-center">
                  {form.profilePicture ? (
                    <img
                      src={`${API_BASE_URL}/${form.profilePicture}`}
                      alt="avatar"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={40} className="text-slate-300" />
                  )}
                </div>
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0.5 left-0.5 bg-primary text-white rounded-full p-[5px] shadow border-2 border-white hover:bg-primary-700 transition-colors"
                >
                  <Edit2 size={9} />
                </button>
              </div>

              {/* Name + meta */}
              <div className="text-right pt-10 sm:pt-12">
                <h2 className="text-sm sm:text-base font-extrabold text-slate-900 leading-tight">
                  {isLoading ? "جاري التحميل..." : `${form.firstName} ${form.lastName}`}
                </h2>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{form.email}</p>
                <p className="text-[11px] sm:text-xs text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                  <span>جامعة المنصورة</span>
                  <MapPin size={9} className="text-slate-400" />
                </p>
              </div>
            </div>

            {/* LEFT: action buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2 flex-wrap justify-end w-full sm:w-auto">
              <button
                onClick={() => navigate("/dashboard")}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold border border-slate-200 text-slate-600 bg-white hover:bg-slate-50 px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap"
              >
                <LayoutDashboard size={12} />
                <span>لوحة التحكم</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold border border-red-200 text-red-500 bg-red-50 hover:bg-red-100 px-2.5 sm:px-3 py-1.5 rounded-lg transition whitespace-nowrap"
              >
                <LogOut size={12} />
                <span>خروج</span>
              </button>
            </div>
          </div>

          {/* Bio section */}
          <div className="px-4 sm:px-6 py-3 border-t border-slate-100 mt-2">
            <div className="flex items-center justify-between flex-row-reverse mb-1">
              <p className="text-xs font-bold text-slate-400">بيو</p>
              <button
                onClick={() => setIsEditingBio(!isEditingBio)}
                className="text-primary hover:bg-primary-50 p-1 rounded-md transition-colors"
              >
                <Edit2 size={12} />
              </button>
            </div>
            {isEditingBio ? (
              <div className="flex flex-col gap-2">
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  dir="rtl"
                  rows="3"
                  className="w-full text-xs sm:text-sm text-slate-700 bg-slate-50 border border-slate-200 rounded-lg p-2 outline-none focus:border-primary transition-all"
                  placeholder="اكتب شيئاً عن نفسك..."
                />
                <div className="flex justify-end gap-2">
                  <button onClick={() => setIsEditingBio(false)} className="text-[10px] text-slate-500 font-bold">إلغاء</button>
                  <button onClick={handleSave} className="bg-primary text-white px-3 py-1 rounded-md text-[10px] font-bold">حفظ البيو</button>
                </div>
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-slate-600 text-right leading-relaxed">
                {form.bio || "لا يوجد وصف حالياً، اضغط على القلم للإضافة"}
              </p>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-t border-slate-100">
            {[["tools", "أدواتي"], ["files", "ملفاتي"]].map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className={`flex-1 py-2.5 text-xs sm:text-sm font-semibold transition ${activeTab === key
                  ? "text-primary border-b-2 border-primary"
                  : "text-slate-400 hover:text-slate-600"
                  }`}
              >
                {label}
              </button>
            ))}
          </div>
        </SectionCard>

        {/* ══ Books ══ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-3 sm:p-5">
          <div className="flex flex-row-reverse justify-between items-center mb-4 px-1">
            <h3 className="font-extrabold text-slate-800 text-sm">أدواتي المنشورة</h3>
            <span className="text-[10px] text-slate-400 font-bold">{myItems.length} أداة</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            <AddSlot onClick={() => setShowAddModal(true)} />
            {myItems.map(item => (
              <BookCard
                key={item.It_id}
                title={item.It_name}
                img={item.primaryImage ? `${API_BASE_URL}/${item.primaryImage}` : "https://images.unsplash.com/photo-1596496050827-8299e0220de1?w=300&q=80"}
                tag={parseFloat(item.It_price) === 0 ? "مجاني" : `${item.It_price} ج.م`}
                onClick={() => navigate(`/item/${item.It_id}`)}
              />
            ))}
          </div>
        </div>

        {/* ══ Basic Info ══ */}
        <SectionCard>
          <SectionHeader title="المعلومات الاساسيه" icon={User} iconClass="bg-primary-50 text-primary" />
          <div className="p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InputField
                label="الاسم الاول"
                value={form.firstName}
                onChange={upd("firstName")}
                placeholder="الاسم الأول"
              />
              <InputField
                label="اسم العائلة"
                value={form.lastName}
                onChange={upd("lastName")}
                placeholder="اسم العائلة"
              />
              <SelectField
                label="الجنس"
                value={form.gender}
                onChange={upd("gender")}
                options={[
                  { value: "male", label: "ذكر" },
                  { value: "female", label: "أنثى" },
                ]}
              />
              <InputField
                label="تاريخ الميلاد"
                type="date"
                icon={Calendar}
                value={form.birthdate}
                onChange={upd("birthdate")}
              />
            </div>
          </div>
        </SectionCard>

        {/* ══ Contact Info ══ */}
        <SectionCard>
          <SectionHeader title="معلومات الاتصال" icon={Phone} iconClass="bg-primary-50 text-primary" />
          <div className="p-4 sm:p-5 flex flex-col gap-3 sm:gap-4">
            <InputField
              label="البريد الالكتروني"
              type="email"
              icon={Mail}
              value={form.email}
              onChange={upd("email")}
              disabled
              helper="البريد الالكتروني الجامعي مطلوب للتحقق."
            />
            <div className="flex flex-col gap-2">
              <InputField
                label="رقم الهاتف"
                icon={Phone}
                value={form.phone}
                onChange={(e) => {
                  upd("phone")(e);
                }}
                disabled={isPhoneVerified || verificationStep === "verifying_old"}
                placeholder="+20XXXXXXXXXX"
                suffix={
                  <div className="flex gap-1">
                    {isPhoneVerified && verificationStep === "idle" && (
                      <button
                        onClick={startChangePhone}
                        className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded-md hover:bg-slate-200 transition-colors"
                      >
                        تغيير
                      </button>
                    )}
                    {!isPhoneVerified && !showOtpInput && verificationStep !== "verifying_old" && (
                      <button
                        onClick={() => handleSendOtp()}
                        disabled={isSendingOtp}
                        className="text-[10px] font-bold text-primary bg-primary-50 px-2 py-1 rounded-md hover:bg-primary-100 transition-colors"
                      >
                        {isSendingOtp ? "جاري الإرسال..." : "تحقق"}
                      </button>
                    )}
                  </div>
                }
              />
              {showOtpInput && (
                <div className="flex gap-2 items-end justify-start animate-in slide-in-from-top-2 duration-300">
                  <div className="flex flex-col gap-1 items-start flex-1 max-w-[120px]">
                    <label className="text-[10px] text-slate-400">
                      {verificationStep === "verifying_old" ? "رمز الرقم القديم" : "رمز الرقم الجديد"}
                    </label>
                    <input
                      type="text"
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value)}
                      placeholder="000000"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2 text-center text-sm outline-none focus:border-primary"
                    />
                  </div>
                  <button
                    onClick={handleVerifyOtp}
                    className="bg-primary text-white px-3 py-2 rounded-lg text-xs font-bold h-[38px]"
                  >
                    تأكيد الرمز
                  </button>
                </div>
              )}
              {isPhoneVerified && (
                <div className="flex items-center justify-end gap-1 text-emerald-500 text-[10px] font-bold mt-1">
                  <span>تم التحقق من الرقم</span>
                  <CheckCircle size={12} />
                </div>
              )}
              {verificationStep === "verifying_old" && (
                <p className="text-[10px] text-orange-500 text-right">يرجى تأكيد ملكيتك للرقم الحالي أولاً قبل التغيير</p>
              )}
              {verificationStep === "verifying_new" && (
                <p className="text-[10px] text-primary text-right">أدخل الآن رقم هاتفك الجديد للتحقق منه</p>
              )}
            </div>
            <InputField
              label="رقم هاتف بديل(اختياري)"
              icon={Phone}
              value={form.phone2}
              onChange={upd("phone2")}
              placeholder="+20XXXXXXXXXX"
            />
          </div>
        </SectionCard>

        {/* ══ Action Buttons ══ */}
        <div className="flex gap-3 pb-6">
          <button className="px-6 sm:px-8 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-600 bg-white hover:bg-slate-50 transition whitespace-nowrap">
            إلغاء
          </button>
          <button
            onClick={handleSave}
            className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white transition-all flex items-center justify-center gap-2 ${notification.show && notification.type === "success" ? "bg-emerald-500" : "bg-primary hover:bg-primary-700"
              }`}
          >
            {notification.show && notification.type === "success" ? (
              <><CheckCircle size={14} /> تم الحفظ!</>
            ) : (
              <><Save size={14} /> حفظ التغييرات</>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
export default Profile;
