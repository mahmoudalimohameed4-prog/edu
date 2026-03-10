import { useState } from "react";
import { Search, Mail, Phone, MessageCircle, ChevronDown, BookOpen, FileText, Clock } from "lucide-react";

const faqs = [
  "كيف أقوم بتبادل الكتاب؟",
  "هل الخدمة مجانية؟",
  "كيف أضمن سلامتي أثناء التبادل؟",
  "ماذا لو كان الكتاب في حالة سيئة؟",
  "كيف أقوم بتقييم المستخدمين؟",
  "هل يمكنني حذف اعلان كتاب؟",
];

const resources = [
  {
    icon: <BookOpen className="w-5 h-5" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
    title: "دليل البدء السريع",
    desc: "تعلم كيفية استخدام المنصة بسهوله",
  },
  {
    icon: <FileText className="w-5 h-5" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
    title: "نصائح الأمان",
    desc: "إرشادات للتبادل الآمن",
  },
  {
    icon: <Clock className="w-5 h-5" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
    title: "الاسئله الشائعه الكامله",
    desc: "جميع الإجابات التي تحتاجها",
  },
];

function FaqItem({ question }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-slate-100 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-4 px-2 hover:bg-slate-50 rounded-xl transition-colors text-right"
      >
        <ChevronDown
          className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
        />
        <span className="text-sm font-semibold text-slate-700 flex-1 mr-3">{question}</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-right">
          <p className="text-sm text-slate-500 leading-relaxed">
            يمكنك التواصل مع الدعم الفني أو مراجعة الدليل الشامل للإجابة على هذا السؤال. نحن هنا لمساعدتك في أي وقت.
          </p>
        </div>
      )}
    </div>
  );
}

export default function Help() {
  const [search, setSearch] = useState("");

  return (
    <div
      dir="rtl"
      className="bg-slate-100"
      style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">

        {/* Page Header */}
        <div className="text-right mb-6">
          <h1 className="text-2xl font-black text-slate-800">المساعده والدعم</h1>
          <p className="text-sm text-slate-500 mt-1">نحن هنا لمساعدتك في أي أسئله أو مشكلات</p>
        </div>

        {/* ── Main Card ── */}
        <div className="bg-white rounded-3xl border-2 border-primary shadow-sm overflow-hidden mb-4">

          {/* Hero */}
          <div className="px-5 sm:px-8 pt-10 pb-8 text-center border-b border-slate-100">
            <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <MessageCircle className="w-6 h-6 text-slate-500" />
            </div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">كيف يمكننا مساعدتك</h2>
            <p className="text-sm text-slate-500 mb-6">ابحث عن إجابات أو تواصل مع فريق الدعم</p>

            {/* Search */}
            <div className="relative max-w-md mx-auto">
              <input
                type="text"
                placeholder="إبحث عن سؤال..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 outline-none focus:border-primary focus:ring-2 focus:ring-primary transition-all bg-slate-50 text-right pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </div>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-6 border-b border-slate-100">
            {/* Email */}
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Mail className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">البريد الإلكتروني</p>
              <p className="text-xs text-slate-400">Support@eduswap.com</p>
            </div>

            {/* Phone */}
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Phone className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">الهاتف</p>
              <p className="text-xs text-slate-400 ltr">+201596698019</p>
            </div>

            {/* Live Chat */}
            <div className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer group">
              <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <MessageCircle className="w-5 h-5" />
              </div>
              <p className="text-xs font-bold text-slate-700">الدردشه المباشره</p>
              <p className="text-xs text-slate-400">متاح من ٩ صباحاً - ٦ مساءً</p>
            </div>
          </div>

          {/* FAQ */}
          <div className="p-6 border-b border-slate-100">
            <h3 className="text-base font-black text-slate-800 text-right mb-2">الاسئله الشائعه</h3>
            <div className="mt-2">
              {faqs.map((q) => (
                <FaqItem key={q} question={q} />
              ))}
            </div>
          </div>

          {/* Resources */}
          <div className="p-6">
            <h3 className="text-base font-black text-slate-800 text-right mb-4">أمثله ومصادر مفيده</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {resources.map((r) => (
                <div
                  key={r.title}
                  className="flex flex-col items-center text-center gap-2 p-4 rounded-2xl border border-slate-100 hover:border-primary hover:shadow-sm transition-all cursor-pointer group"
                >
                  <div className={`w-10 h-10 ${r.iconBg} ${r.iconColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    {r.icon}
                  </div>
                  <p className="text-xs font-bold text-slate-700 leading-snug">{r.title}</p>
                  <p className="text-xs text-slate-400 leading-snug">{r.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Banner */}
          <div className="bg-primary px-8 py-10 text-center">
            <h3 className="text-xl font-black text-white mb-2">لم تجد م تبحث عنه؟</h3>
            <p className="text-sm text-white/85 mb-6">تواصل معنا مباشره وسنكون سعداء بمساعدتك</p>
            <button className="bg-white text-primary font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:bg-primary hover:text-white hover:scale-105 shadow-lg text-sm">
              إرسال رساله
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
