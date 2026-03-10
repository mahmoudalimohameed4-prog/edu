import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Gift,
  Star,
  User,
  Trophy,
  BookOpen,
  UserPlus,
  TrendingUp,
  Share2,
  ChevronLeft,
  Lock,
  CheckCircle,
  Zap,
  Users,
  Award,
} from "lucide-react";

/* ── data ── */
const REWARDS = [
  { id: 1, title: "خصم 10% علي القرطاسيه", points: 500, color: "bg-primary-100 text-primary", icon: Gift, canRedeem: true },
  { id: 2, title: "بطاقه هدايا مكتبه جرير", points: 1000, color: "bg-primary-100 text-primary", icon: Gift, canRedeem: true },
  { id: 3, title: "اشتراك شهري مجاني", points: 1500, color: "bg-primary-100 text-primary", icon: Gift, canRedeem: true },
  { id: 4, title: "بطاقه هدايا أمازون", points: 2000, color: "bg-primary-100 text-primary", icon: Gift, canRedeem: true },
  { id: 5, title: "اشتراك سنوي في منصة تعليميه", points: 2000, color: "bg-primary-50 text-primary", icon: Gift, canRedeem: false },
];

const ACHIEVEMENTS = [
  { id: 1, title: "البدايه الرائعه", desc: "أكمل اول عمليه تبادل", earned: true, color: "bg-primary", icon: Star },
  { id: 2, title: "متبادل نشط", desc: "10 عمليات تبادل ناجحه", earned: true, color: "bg-primary-700", icon: User },
  { id: 3, title: "الخبير", desc: "50 عمليه تبادل ناجحه", earned: false, color: "bg-slate-300", icon: Award },
  { id: 4, title: "نجم المجتمع", desc: "حصل 90 تقييم ايجابي", earned: true, color: "bg-primary-700", icon: Star },
  { id: 5, title: "الاسطوره", desc: "100 عمليه تبادل ناجحه", earned: false, color: "bg-slate-300", icon: Trophy },
];

const HOW_TO_EARN = [
  { label: "اكمال عمليه التبادل", pts: "+100 نقطه", icon: TrendingUp, color: "bg-primary-50 text-primary" },
  { label: "تلقي تقييم 5 نجوم", pts: "+50 نقطه", icon: Star, color: "bg-primary-50 text-primary" },
  { label: "نشر كتاب جديد", pts: "+25 نقطه", icon: BookOpen, color: "bg-primary-50 text-primary" },
  { label: "احاله صديق جديد", pts: "+200 نقطه", icon: UserPlus, color: "bg-primary-50 text-primary" },
];

const USER_POINTS = 2450;
const NEXT_REWARD = 2700;
const GOLD_LEVEL = 3000;
const progress = Math.round((USER_POINTS / NEXT_REWARD) * 100);

function Rewards() {
  const [redeemed, setRedeemed] = useState({});
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleRedeem = (id) => {
    setRedeemed((p) => ({ ...p, [id]: true }));
  };

  const handleShare = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 leading-tight">الولاء والمكافآت</h1>
            <p className="text-[11px] sm:text-xs text-slate-400">تابع نقاطك ومكافآتك ومزايا العضوية الخاصة بك</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col gap-5">

        {/* ══ Points Banner ══ */}
        <div className="rounded-2xl overflow-hidden shadow-lg relative"
          style={{ background: "linear-gradient(135deg, var(--app-gradient-start) 0%, var(--app-gradient-mid) 55%, var(--app-gradient-end) 100%)" }}>
          {/* decorative circles */}
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/5 rounded-full -translate-x-1/3 -translate-y-1/3 pointer-events-none" />
          <div className="absolute bottom-0 right-0 w-36 h-36 bg-white/5 rounded-full translate-x-1/4 translate-y-1/4 pointer-events-none" />

          <div className="relative p-5">
            {/* Top: icon + points */}
            <div className="flex items-start justify-between mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Gift size={20} className="text-white" />
              </div>
              <div className="text-right">
                <p className="text-3xl sm:text-4xl font-black text-white leading-none">
                  {USER_POINTS.toLocaleString()} <span className="text-xl font-bold">نقطه</span>
                </p>
                <p className="text-white/70 text-xs mt-0.5">رصيدك الحالي</p>
              </div>
            </div>

            {/* Progress */}
            <div className="mb-1 flex items-center justify-between text-xs text-white/80">
              <span>{NEXT_REWARD - USER_POINTS} نقطه متبقيه</span>
              <span>التقدم للمكافأة التالية</span>
            </div>
            <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-white rounded-full transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Gold level note */}
            <div className="bg-white/15 rounded-xl px-3 py-2 text-center">
              <p className="text-white text-xs font-semibold">
                اكسب {GOLD_LEVEL - USER_POINTS} نقطه اضافيه للوصول الى المستوى الذهبي 🏆
              </p>
            </div>
          </div>
        </div>

        {/* ══ Recent Rewards ══ */}
        <div>
          <h2 className="text-base font-extrabold text-slate-800 text-right mb-3">المكافآت الاخيره</h2>
          <div className="flex flex-col gap-2.5">
            {REWARDS.map((r) => (
              <div
                key={r.id}
                className={`bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between gap-3 shadow-sm transition ${!r.canRedeem ? "opacity-60" : ""}`}
              >
                {/* Redeem button */}
                <button
                  onClick={() => r.canRedeem && handleRedeem(r.id)}
                  disabled={!r.canRedeem || redeemed[r.id]}
                  className={`shrink-0 text-xs font-bold px-4 py-1.5 rounded-lg transition ${
                    redeemed[r.id]
                      ? "bg-emerald-100 text-emerald-600 cursor-default"
                      : r.canRedeem
                      ? "bg-slate-800 text-white hover:bg-slate-700"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  {redeemed[r.id] ? "تم ✓" : "استبدال"}
                </button>

                {/* Title + points */}
                <div className="flex-1 text-right">
                  <p className={`text-sm font-bold ${r.canRedeem ? "text-slate-800" : "text-slate-400"}`}>{r.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{r.points} نقطه</p>
                </div>

                {/* Icon */}
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${r.color}`}>
                  <Gift size={16} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Achievements ══ */}
        <div>
          <h2 className="text-base font-extrabold text-slate-800 text-right mb-3">شارك الانجاز</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {ACHIEVEMENTS.map((a) => (
              <div
                key={a.id}
                className={`bg-white rounded-xl border border-slate-200 p-3.5 shadow-sm flex flex-col gap-2 ${!a.earned ? "opacity-60" : ""}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${a.color}`}>
                    {a.earned ? (
                      <a.icon size={17} className="text-white" />
                    ) : (
                      <Lock size={15} className="text-white" />
                    )}
                  </div>
                  <div className="flex-1 text-right">
                    <p className="text-xs font-extrabold text-slate-800 leading-tight">{a.title}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{a.desc}</p>
                  </div>
                </div>
                {a.earned && (
                  <button className="w-full bg-primary hover:bg-primary-700 text-white text-[11px] font-bold py-1.5 rounded-lg transition">
                    تم الحصول عليها
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ══ How to earn points ══ */}
        <div>
          <h2 className="text-base font-extrabold text-slate-800 text-right mb-3">كيفيه كسب النقاط</h2>
          <div className="flex flex-col gap-2">
            {HOW_TO_EARN.map((item, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center justify-between shadow-sm">
                <span className="text-sm font-bold text-primary">{item.pts}</span>
                <div className="flex items-center gap-3 flex-row-reverse">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                    <item.icon size={16} />
                  </div>
                  <p className="text-sm font-semibold text-slate-700 text-right">{item.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ══ Invite Friend Banner ══ */}
        <div
          className="rounded-2xl p-5 text-center shadow-lg"
          style={{ background: "linear-gradient(135deg, var(--app-gradient-mid) 0%, var(--app-gradient-end) 55%, color-mix(in srgb, var(--app-gradient-end) 85%, white) 100%)" }}
        >
          <p className="text-white text-lg font-extrabold mb-1">أحل صديقاً</p>
          <p className="text-white/80 text-xs mb-4">احصل علي 200 نقطه لكل صديق ينضم عبر رابطك</p>
          <button
            onClick={handleShare}
            className="w-full bg-white/20 hover:bg-white/30 border border-white/30 text-white font-bold text-sm py-2.5 rounded-xl transition flex items-center justify-center gap-2"
          >
            <Share2 size={15} />
            {copied ? "تم نسخ الرابط ✓" : "مشاركه الرابط"}
          </button>
        </div>

        {/* ══ Ranking ══ */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 text-center">
          <h2 className="text-base font-extrabold text-slate-800 text-right mb-4">ترتيبك</h2>
          <div className="flex flex-col items-center gap-2 py-2">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <Trophy size={30} className="text-primary" />
            </div>
            <p className="text-4xl font-black text-slate-900">#12</p>
            <p className="text-xs text-slate-400">من أصل 1,245 مستخدم نشط</p>
          </div>
          <button className="mt-4 w-full border border-primary-200 text-primary font-bold text-sm py-2.5 rounded-xl hover:bg-primary-50 transition">
            عرض لوحة الصداره
          </button>
        </div>

      </div>
    </div>
  );
}

export default Rewards
