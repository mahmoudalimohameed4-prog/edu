import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getItemById, updateItem, deleteItem, sendChat, API_BASE_URL } from "../api/api";
import {
    ArrowRight,
    MessageCircle,
    Edit2,
    Trash2,
    User,
    Calendar,
    Tag,
    Package,
    CheckCircle,
    X,
    Save,
    MapPin,
    Shield,
} from "lucide-react";



/* ── condition labels ── */
const conditionLabels = {
    new: "جديد",
    like_new: "كأنه جديد",
    good: "جيد",
    fair: "مقبول",
};

const conditionColors = {
    new: "bg-emerald-100 text-emerald-700",
    like_new: "bg-blue-100 text-blue-700",
    good: "bg-amber-100 text-amber-700",
    fair: "bg-slate-100 text-slate-600",
};

/* ── Success Toast ── */
function SuccessToast({ show, message }) {
    if (!show) return null;
    return (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[200] animate-in slide-in-from-top-4 duration-300">
            <div className="bg-white rounded-xl px-5 py-3 shadow-xl border border-emerald-200 flex items-center gap-2">
                <CheckCircle size={18} className="text-emerald-500" />
                <span className="text-sm font-bold text-slate-700">{message}</span>
            </div>
        </div>
    );
}

/* ── Edit Modal ── */
function EditModal({ show, onClose, item, onSave }) {
    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        condition: "new",
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (item) {
            setForm({
                name: item.It_name || "",
                description: item.It_description || "",
                price: item.It_price || "",
                condition: item.It_condition || "new",
            });
        }
    }, [item]);

    if (!show) return null;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await onSave(form);
            onClose();
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-row-reverse">
                    <h3 className="text-lg font-bold text-slate-800">تعديل الأداة</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-5 space-y-4">
                    <div className="flex flex-col gap-1 items-end">
                        <label className="text-xs font-bold text-slate-500">اسم الأداة</label>
                        <input
                            required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                            dir="rtl"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <label className="text-xs font-bold text-slate-500">الوصف</label>
                        <textarea
                            required value={form.description}
                            onChange={(e) => setForm({ ...form, description: e.target.value })}
                            dir="rtl" rows="3"
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1 items-end">
                            <label className="text-xs font-bold text-slate-500">السعر</label>
                            <input
                                type="number" value={form.price}
                                onChange={(e) => setForm({ ...form, price: e.target.value })}
                                className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-sm outline-none focus:border-primary text-left"
                            />
                        </div>
                        <div className="flex flex-col gap-1 items-end">
                            <label className="text-xs font-bold text-slate-500">الحالة</label>
                            <select
                                value={form.condition}
                                onChange={(e) => setForm({ ...form, condition: e.target.value })}
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
                    <div className="flex gap-3 pt-2">
                        <button type="button" onClick={onClose}
                            className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">
                            إلغاء
                        </button>
                        <button disabled={saving}
                            className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 disabled:opacity-50 flex items-center justify-center gap-2">
                            <Save size={14} />
                            {saving ? "جاري الحفظ..." : "حفظ التعديلات"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* ── Delete Confirm ── */
function DeleteConfirm({ show, onClose, onConfirm, deleting }) {
    if (!show) return null;
    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-sm shadow-2xl p-6 text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                    <Trash2 size={28} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">حذف الأداة؟</h3>
                <p className="text-sm text-slate-500 mb-6">هل أنت متأكد من حذف هذه الأداة؟ لا يمكن التراجع عن هذا الإجراء.</p>
                <div className="flex gap-3">
                    <button onClick={onClose}
                        className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-600 hover:bg-slate-50">
                        إلغاء
                    </button>
                    <button onClick={onConfirm} disabled={deleting}
                        className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 disabled:opacity-50">
                        {deleting ? "جاري الحذف..." : "نعم، احذف"}
                    </button>
                </div>
            </div>
        </div>
    );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */

function ItemDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [item, setItem] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "" });
    const [chatMessage, setChatMessage] = useState("");
    const [sendingChat, setSendingChat] = useState(false);
    const [activeImage, setActiveImage] = useState(0);

    // Get current user ID from localStorage
    const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
    const isOwner = item && currentUser?.id === item.seller_id;

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await getItemById(id);
                setItem(res.data.data);
            } catch (err) {
                console.error("Failed to fetch item:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchItem();
    }, [id]);

    const showToast = (msg) => {
        setToast({ show: true, message: msg });
        setTimeout(() => setToast({ show: false, message: "" }), 3000);
    };

    const handleEdit = async (formData) => {
        try {
            await updateItem(id, formData);
            const res = await getItemById(id);
            setItem(res.data.data);
            showToast("تم تعديل الأداة بنجاح");
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async () => {
        setDeleting(true);
        try {
            await deleteItem(id);
            showToast("تم حذف الأداة");
            setTimeout(() => navigate("/profile"), 1500);
        } catch (err) {
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    const handleSendChat = async () => {
        if (!chatMessage.trim()) return;
        setSendingChat(true);
        try {
            await sendChat(item.sellerId, chatMessage);
            showToast("تم إرسال الرسالة بنجاح");
            setChatMessage("");
        } catch (err) {
            console.error("Failed to send chat:", err);
        } finally {
            setSendingChat(false);
        }
    };

    if (isLoading) {
        return (
            <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center" style={{ fontFamily: "'Cairo', sans-serif" }}>
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    <p className="text-slate-500 text-sm">جاري التحميل...</p>
                </div>
            </div>
        );
    }

    if (!item) {
        return (
            <div dir="rtl" className="min-h-screen bg-slate-50 flex items-center justify-center" style={{ fontFamily: "'Cairo', sans-serif" }}>
                <div className="text-center">
                    <Package size={48} className="text-slate-300 mx-auto mb-3" />
                    <h2 className="text-xl font-bold text-slate-700 mb-2">الأداة غير موجودة</h2>
                    <button onClick={() => navigate("/home")} className="text-primary font-bold text-sm">العودة للرئيسية</button>
                </div>
            </div>
        );
    }

    const images = item.images || [];
    const primaryImage = images.length > 0 ? `${API_BASE_URL}/${images[activeImage]?.Img_path}` : null;
    const createdDate = item.It_created_at ? new Date(item.It_created_at).toLocaleDateString("ar-EG", { year: "numeric", month: "long", day: "numeric" }) : "";

    return (
        <div dir="rtl" className="min-h-screen bg-slate-50" style={{ fontFamily: "'Cairo', sans-serif" }}>
            <SuccessToast show={toast.show} message={toast.message} />
            <EditModal show={showEdit} onClose={() => setShowEdit(false)} item={item} onSave={handleEdit} />
            <DeleteConfirm show={showDelete} onClose={() => setShowDelete(false)} onConfirm={handleDelete} deleting={deleting} />

            {/* ── Top Bar ── */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
                    <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-primary text-sm font-bold transition-colors">
                        <ArrowRight size={16} />
                        رجوع
                    </button>
                    {isOwner && (
                        <div className="flex items-center gap-2">
                            <button onClick={() => setShowEdit(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 text-primary text-xs font-bold hover:bg-primary-100 transition-colors">
                                <Edit2 size={12} /> تعديل
                            </button>
                            <button onClick={() => setShowDelete(true)}
                                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 text-red-500 text-xs font-bold hover:bg-red-100 transition-colors">
                                <Trash2 size={12} /> حذف
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

                    {/* ══ Left: Images ══ */}
                    <div className="lg:col-span-3 space-y-3">
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
                            <div className="aspect-[4/3] bg-slate-100 flex items-center justify-center overflow-hidden">
                                {primaryImage ? (
                                    <img src={primaryImage} alt={item.It_name} className="w-full h-full object-contain" />
                                ) : (
                                    <Package size={64} className="text-slate-300" />
                                )}
                            </div>

                            {/* Thumbnails */}
                            {images.length > 1 && (
                                <div className="p-3 flex gap-2 overflow-x-auto">
                                    {images.map((img, i) => (
                                        <button key={img.Img_id} onClick={() => setActiveImage(i)}
                                            className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === i ? "border-primary shadow-md" : "border-slate-200 hover:border-slate-300"}`}
                                        >
                                            <img src={`${API_BASE_URL}/${img.Img_path}`} className="w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* ── Description ── */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3">الوصف</h3>
                            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">
                                {item.It_description || "لا يوجد وصف لهذه الأداة"}
                            </p>
                        </div>
                    </div>

                    {/* ══ Right: Info Sidebar ══ */}
                    <div className="lg:col-span-2 space-y-3">

                        {/* Item Info Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <div className="flex items-start justify-between mb-3">
                                <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${conditionColors[item.It_condition] || "bg-slate-100 text-slate-600"}`}>
                                    {conditionLabels[item.It_condition] || "متاح"}
                                </span>
                            </div>
                            <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 leading-tight mb-4">{item.It_name}</h1>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 text-sm">
                                    <Tag size={15} className="text-primary" />
                                    <span className="text-slate-500">السعر:</span>
                                    <span className="font-extrabold text-primary text-lg mr-auto">
                                        {parseFloat(item.It_price) === 0 ? "مجاني" : `${item.It_price} ج.م`}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Calendar size={15} className="text-slate-400" />
                                    <span className="text-slate-500">تاريخ النشر:</span>
                                    <span className="text-slate-700 font-medium mr-auto">{createdDate}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm">
                                    <Shield size={15} className="text-slate-400" />
                                    <span className="text-slate-500">الحالة:</span>
                                    <span className="text-slate-700 font-medium mr-auto">{item.It_status || "متاح"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Seller Card */}
                        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                            <h3 className="font-bold text-slate-800 mb-3 text-sm">معلومات البائع</h3>
                            <div className="flex items-center gap-3 flex-row-reverse">
                                <div className="w-12 h-12 rounded-full bg-slate-100 overflow-hidden flex items-center justify-center flex-shrink-0">
                                    {item.sellerPicture ? (
                                        <img src={`${API_BASE_URL}/${item.sellerPicture}`} className="w-full h-full object-cover" />
                                    ) : (
                                        <User size={22} className="text-slate-400" />
                                    )}
                                </div>
                                <div className="text-right flex-1">
                                    <p className="font-bold text-slate-800 text-sm">{item.sellerName || "مستخدم"}</p>
                                    <p className="text-[11px] text-slate-400 flex items-center gap-1 justify-end mt-0.5">
                                        <MapPin size={10} /> جامعة المنصورة
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Chat with Seller (only if NOT owner) */}
                        {!isOwner && (
                            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                                <h3 className="font-bold text-slate-800 mb-3 text-sm flex items-center gap-2">
                                    <MessageCircle size={15} className="text-primary" />
                                    تواصل مع البائع
                                </h3>
                                <textarea
                                    value={chatMessage}
                                    onChange={(e) => setChatMessage(e.target.value)}
                                    dir="rtl" rows="3"
                                    placeholder={`مرحبا، أنا مهتم بـ "${item.It_name}"...`}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm outline-none focus:border-primary transition-all resize-none"
                                />
                                <button
                                    onClick={handleSendChat}
                                    disabled={sendingChat || !chatMessage.trim()}
                                    className="w-full mt-3 py-3 rounded-xl bg-primary text-white text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <MessageCircle size={15} />
                                    {sendingChat ? "جاري الإرسال..." : "إرسال رسالة"}
                                </button>
                            </div>
                        )}

                        {/* Owner badge */}
                        {isOwner && (
                            <div className="bg-primary-50 rounded-2xl border border-primary-200 p-4 flex items-center gap-3 flex-row-reverse">
                                <Shield size={20} className="text-primary" />
                                <div className="text-right flex-1">
                                    <p className="text-sm font-bold text-primary-800">هذه أداتك</p>
                                    <p className="text-[11px] text-primary-600">يمكنك تعديل أو حذف هذه الأداة</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ItemDetails;
