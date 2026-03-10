import { useState, useEffect } from "react";
import { getDashboardStats } from "../api/api";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  Eye,
  Star,
  BookOpen,
  ArrowLeftRight,
  MessageCircle,
  Users,
  Settings,
  HelpCircle,
  Gift,
  ShieldCheck,
  UserCircle,
  ChevronLeft,
  Calendar,
} from "lucide-react";

const stats = [
  {
    value: "18",
    label: "عمليات التبادل",
    icon: <TrendingUp className="w-5 h-5" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
  {
    value: "342",
    label: "المشاهدات",
    icon: <Eye className="w-5 h-5" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
  {
    value: "4.8",
    label: "التقييم",
    icon: <Star className="w-5 h-5" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
  {
    value: "24",
    label: "إجمالي الكتب",
    icon: <BookOpen className="w-5 h-5" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
];

const activities = [
  {
    id: 1,
    title: "تم تبادل كتاب الخوارزميات",
    time: "منذ ساعتين",
    icon: <ArrowLeftRight className="w-4 h-4" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
  {
    id: 2,
    title: "رسالة جديدة من أحمد.م",
    time: "منذ ٤ ساعات",
    icon: <MessageCircle className="w-4 h-4" />,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-500",
  },
  {
    id: 3,
    title: "شاهد ١٥ شخص كتابك",
    time: "اليوم",
    icon: <Users className="w-4 h-4" />,
    iconBg: "bg-primary",
    iconColor: "text-white",
  },
  {
    id: 4,
    title: "تقييم جديد من سارة.ج",
    time: "أمس",
    icon: <Star className="w-4 h-4" />,
    iconBg: "bg-primary-100",
    iconColor: "text-primary",
  },
];

const progress = [
  {
    label: "الكتب المنشوره",
    current: 10,
    target: 8,
    color: "bg-primary",
    width: "75%",
  },
  {
    label: "عمليات التبادل",
    current: 8,
    target: 5,
    color: "bg-primary",
    width: "60%",
  },
  {
    label: "الكتب المقروءه",
    current: 15,
    target: 12,
    color: "bg-primary",
    width: "80%",
  },
];

const quickActions = [
  {
    label: "الإعدادات",
    icon: <Settings className="w-5 h-5 text-white" />,
    iconBg: "bg-primary",
  },
  {
    label: "المساعدة والدعم",
    icon: <HelpCircle className="w-5 h-5 text-white" />,
    iconBg: "bg-primary",
  },
  {
    label: "المكافآت",
    icon: <Gift className="w-5 h-5 text-white" />,
    iconBg: "bg-primary",
  },
  {
    label: "الامان وتسجيل الدخول",
    icon: <ShieldCheck className="w-5 h-5 text-white" />,
    iconBg: "bg-primary",
  },
  {
    label: "المعلومات الشخصيه",
    icon: <UserCircle className="w-5 h-5 text-white" />,
    iconBg: "bg-primary",
  },
];

const upcomingExchanges = [
  "تبادل كتاب الفيزياء - غداً الساعة 2:00 م",
  "تبادل كتاب الكيمياء - الأحد الساعة 10:00 ص",
];

const Dashboard = () => {
  const [showAll, setShowAll] = useState(false);
  const [data, setData] = useState({
    stats: { exchanges: 0, totalItems: 0, views: 0, rating: 0 },
    activities: [],
    user: JSON.parse(localStorage.getItem("user") || "{}")
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getDashboardStats();
        setData(prev => ({
          ...prev,
          stats: res.data.data.stats,
          activities: res.data.data.activities
        }));
      } catch (err) {
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const stats = [
    {
      value: data.stats.exchanges,
      label: "عمليات التبادل",
      icon: <TrendingUp className="w-5 h-5" />,
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
    {
      value: data.stats.views,
      label: "المشاهدات",
      icon: <Eye className="w-5 h-5" />,
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
    {
      value: data.stats.rating,
      label: "التقييم",
      icon: <Star className="w-5 h-5" />,
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
    {
      value: data.stats.totalItems,
      label: "إجمالي الأغراض",
      icon: <BookOpen className="w-5 h-5" />,
      iconBg: "bg-primary",
      iconColor: "text-white",
    },
  ];

  const formatActivityTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
    if (diffHrs < 1) return "الآن";
    if (diffHrs < 24) return `منذ ${diffHrs} ساعة`;
    return `منذ ${Math.floor(diffHrs / 24)} يوم`;
  };

  const quickActionRoutes = {
    الإعدادات: "/settings",
    "المساعدة والدعم": "/help",
    المكافآت: "/rewards",
    "الامان وتسجيل الدخول": "/security",
    "المعلومات الشخصيه": "/profile",
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-slate-100"
      style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}
    >
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 pt-6">
        {/* ── Welcome ── */}
        <div className="text-right mb-6">
          <h1 className="text-2xl font-black text-slate-800">
            مرحبا، {data.user.Us_name || "أحمد جمال"} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            إليك ملخص لنشاطك على المنصة
          </p>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
          {stats.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-4 flex flex-col items-end shadow-sm border border-slate-100 hover:shadow-md transition-shadow duration-300"
            >
              <div
                className={`w-9 h-9 rounded-xl ${s.iconBg} ${s.iconColor} flex items-center justify-center mb-3`}
              >
                {s.icon}
              </div>
              <span className="text-2xl font-black text-slate-800">
                {s.value}
              </span>
              <span className="text-xs text-slate-500 mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>

        {/* ── Recent Activities ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-xs text-primary font-semibold hover:text-primary transition-colors"
            >
              عرض الكل
            </button>
            <h2 className="text-base font-black text-slate-800">
              النشاطات الاخيره
            </h2>
          </div>

          <div className="space-y-1">
            {data.activities.length === 0 ? (
              <p className="text-center py-4 text-slate-400 text-xs text-right">لا توجد نشاطات حالياً</p>
            ) : (
              data.activities.map((a, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0 hover:bg-slate-50 rounded-xl px-2 transition-colors cursor-pointer group"
                >
                  <div
                    className={`w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}
                  >
                    <ArrowLeftRight className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-right mx-3">
                    <p className="text-sm font-semibold text-slate-700">
                      طلب تبادل: {a.title}
                    </p>
                    <p className="text-xs text-slate-400 mt-0.5">{formatActivityTime(a.time)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ── Monthly Progress ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 mb-5">
          <div className="flex items-center justify-between mb-5">
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> هذا الشهر
            </span>
            <h2 className="text-base font-black text-slate-800">
              تقدمك هذا الشهر
            </h2>
          </div>

          <div className="space-y-4">
            {progress.map((p) => (
              <div key={p.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-500 font-medium">
                    {p.current}/{p.target}
                  </span>
                  <span className="text-xs font-bold text-slate-700">
                    {p.label}
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`${p.color} h-full rounded-full transition-all duration-700`}
                    style={{ width: p.width }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Quick Actions ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-primary p-5 mb-5">
          <h2 className="text-base font-black text-slate-800 text-right mb-4">
            اجراءات سريعه
          </h2>

          <div className="space-y-1">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(quickActionRoutes[action.label] || "/home")}
                className="w-full flex items-center justify-between py-3.5 px-2 hover:bg-slate-50 rounded-xl transition-colors group border-b border-slate-50 last:border-0"
              >
                <ChevronLeft className="w-4 h-4 text-slate-300 group-hover:text-primary transition-colors rotate-180" />
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-700">
                    {action.label}
                  </span>
                  <div
                    className={`w-9 h-9 rounded-xl ${action.iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
                  >
                    {action.icon}
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Upcoming Exchanges */}
          <div className="mt-4 bg-primary rounded-2xl p-4 border border-primary">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-white/80">قريباً</span>
              <h3 className="text-sm font-black text-white">
                التبادلات القادمه
              </h3>
            </div>
            <div className="space-y-2">
              {upcomingExchanges.map((ex, i) => (
                <div key={i} className="flex items-start gap-2">
                  <ArrowLeftRight className="w-3.5 h-3.5 text-white mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-white font-medium leading-relaxed">
                    {ex}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
