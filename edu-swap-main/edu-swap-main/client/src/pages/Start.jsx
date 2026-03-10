import { useEffect, useState } from "react";
import {
  ArrowLeft,
  RefreshCw,
  Shield,
  Zap,
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  Moon,
  Sun,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const FEATURES = [
  {
    Icon: RefreshCw,
    title: "تبادل سريع",
    desc: "اعرض كتبك وتواصل مع طلاب جامعتك خلال دقائق بدون خطوات معقدة.",
  },
  {
    Icon: Shield,
    title: "بيئة موثوقة",
    desc: "ملفات شخصية واضحة وتقييمات تساعدك على تبادل آمن ومنظم.",
  },
  {
    Icon: Zap,
    title: "نتائج فورية",
    desc: "ابحث عن المادة المطلوبة واقترح صفقة مباشرة من نفس الصفحة.",
  },
];

const STATS = [
  { Icon: Users, value: 5200, suffix: "+", label: "طالب مسجل" },
  { Icon: BookOpen, value: 12800, suffix: "+", label: "مورد تعليمي متاح" },
  { Icon: DollarSign, value: 540, suffix: "K+", label: "قيمة وفرها الطلاب" },
];

const STEPS = [
  { no: "01", title: "أنشئ حسابك", desc: "سجل بياناتك الأكاديمية في أقل من دقيقة." },
  { no: "02", title: "أضف ما لديك", desc: "ارفع الكتب أو الأدوات التي تريد تبادلها." },
  { no: "03", title: "ابدأ التبادل", desc: "تواصل مباشرة واتفق مع طلاب قريبين منك." },
];

const AnimatedCounter = ({ target, suffix = "" }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1400;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <span>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

const Start = ({ isDark = false, onToggleDark = () => {} }) => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      dir="rtl"
      style={{ fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}
      className="min-h-screen bg-white text-gray-900"
    >
      <section className="relative overflow-hidden bg-gradient-to-b from-primary-50 via-white to-primary-50">
        <div
          className="absolute inset-0 pointer-events-none opacity-10"
          style={{
            backgroundImage:
              "radial-gradient(var(--color-primary-700) 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div
          className="absolute top-0 right-0 h-72 w-72 -translate-y-1/3 translate-x-1/3 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary-400) 0%, transparent 72%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 h-72 w-72 translate-y-1/3 -translate-x-1/3 rounded-full opacity-20"
          style={{
            background:
              "radial-gradient(circle, var(--color-primary-300) 0%, transparent 72%)",
          }}
        />

        <div className="relative mx-auto w-full max-w-7xl px-4 pt-5 sm:px-6 lg:px-8 lg:pt-6">
          <button
            type="button"
            onClick={onToggleDark}
            className="group inline-flex items-center gap-2 rounded-2xl border border-primary-200/80 bg-white/85 px-3 py-2 text-xs font-bold text-primary-800 shadow-sm backdrop-blur-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            title={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            aria-label={isDark ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
          >
            <span className="relative flex h-7 w-14 items-center rounded-full bg-primary-100 p-1 transition-colors">
              <span
                className="h-5 w-5 rounded-full bg-white shadow-sm transition-transform"
                style={{ transform: isDark ? "translateX(-1.75rem)" : "translateX(0)" }}
              />
              <span className="absolute right-1.5 text-primary-700">
                <Moon size={12} />
              </span>
              <span className="absolute left-1.5 text-amber-500">
                <Sun size={12} />
              </span>
            </span>
            <span>{isDark ? "الوضع النهاري" : "الوضع الليلي"}</span>
          </button>
        </div>

        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-10 px-4 pb-16 pt-6 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pt-14 lg:pb-24">
          <div className="text-center lg:text-right">
            <div
              className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold"
              style={{
                background: "var(--color-primary-100)",
                borderColor: "var(--color-primary-200)",
                color: "var(--color-primary-800)",
              }}
            >
              <TrendingUp size={13} />
              منصة تبادل جامعية ذكية
            </div>

            <h1
              className="mt-5 text-3xl font-black leading-tight text-primary-900 sm:text-4xl lg:text-5xl"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.55s ease",
              }}
            >
              تبادل موادك الدراسية
              <span className="block bg-gradient-to-l from-primary-700 to-primary bg-clip-text text-transparent">
                ووفر وقتك ومالك
              </span>
            </h1>

            <p
              className="mx-auto mt-4 max-w-xl text-sm leading-7 text-primary-700 sm:text-base lg:mx-0"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.55s ease 0.08s",
              }}
            >
              EduSwap يساعدك على تبادل الكتب والملخصات والأدوات مع طلاب حقيقيين في
              بيئة آمنة، مع تجربة سريعة تناسب احتياجاتك اليومية.
            </p>

            <div
              className="mt-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
              style={{
                opacity: mounted ? 1 : 0,
                transform: mounted ? "translateY(0)" : "translateY(16px)",
                transition: "all 0.55s ease 0.16s",
              }}
            >
              <button
                className="inline-flex items-center gap-2 rounded-xl px-8 py-3 text-sm font-bold text-white shadow-lg transition-all hover:scale-[1.02] hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
                }}
                onClick={() => navigate("/login")}
              >
                ابدأ الآن
                <ArrowLeft size={16} />
              </button>
              <button
                className="rounded-xl border border-primary-200 bg-white px-6 py-3 text-sm font-bold text-primary-800 transition-colors hover:bg-primary-50"
                onClick={() => navigate("/home")}
              >
                استكشاف المنصة
              </button>
            </div>
          </div>

          <div
            className="grid grid-cols-2 gap-3 sm:gap-4"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "all 0.6s ease 0.2s",
            }}
          >
            {[
              { title: "كتب جامعية", value: "+12K", emoji: "📚" },
              { title: "ملخصات", value: "+7K", emoji: "📝" },
              { title: "أدوات علمية", value: "+2K", emoji: "🔬" },
              { title: "صفقات ناجحة", value: "+18K", emoji: "🤝" },
            ].map((card) => (
              <div
                key={card.title}
                className="rounded-2xl border border-primary-100 bg-white/90 p-4 text-right shadow-sm backdrop-blur-sm"
              >
                <div className="text-2xl">{card.emoji}</div>
                <p className="mt-2 text-sm font-bold text-primary-900">{card.title}</p>
                <p className="text-xs font-semibold text-primary-700">{card.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-center text-xl font-extrabold text-gray-900 sm:text-2xl">
            لماذا EduSwap؟
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-sm text-gray-600 sm:text-base">
            تجربة تبادل بسيطة ومهيكلة لتخدم الطالب على الهاتف واللاب توب بنفس
            الجودة.
          </p>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ Icon, title, desc }) => (
              <article
                key={title}
                className="rounded-2xl border border-gray-100 bg-primary-50/60 p-5 text-right shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="mb-3 flex justify-end">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm">
                    <Icon size={20} className="text-primary" />
                  </div>
                </div>
                <h3 className="text-sm font-extrabold text-gray-900">{title}</h3>
                <p className="mt-1 text-xs leading-6 text-gray-600 sm:text-sm">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-gray-100 bg-gray-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 gap-6 text-center sm:grid-cols-3">
          {STATS.map(({ Icon, value, suffix, label }) => (
            <div key={label} className="flex flex-col items-center">
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-2xl bg-white shadow">
                <Icon size={22} className="text-primary" />
              </div>
              <p className="text-2xl font-black text-primary sm:text-3xl">
                <AnimatedCounter target={value} suffix={suffix} />
              </p>
              <p className="mt-1 text-xs text-gray-600 sm:text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <h2 className="text-center text-xl font-extrabold text-gray-900 sm:text-2xl">
            كيف تبدأ؟
          </h2>
          <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {STEPS.map((step) => (
              <article
                key={step.no}
                className="rounded-2xl border border-primary-100 bg-white p-5 text-right shadow-sm"
              >
                <p className="text-xs font-black tracking-wider text-primary-500">
                  {step.no}
                </p>
                <h3 className="mt-1 text-sm font-extrabold text-gray-900 sm:text-base">
                  {step.title}
                </h3>
                <p className="mt-1 text-xs leading-6 text-gray-600 sm:text-sm">
                  {step.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="relative overflow-hidden px-4 py-16 text-center text-white sm:px-6 lg:px-8"
        style={{
          background:
            "linear-gradient(135deg,var(--app-gradient-start) 0%,var(--app-gradient-mid) 55%,var(--app-gradient-end) 100%)",
        }}
      >
        <div
          className="absolute top-0 left-0 h-48 w-48 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/10"
          aria-hidden
        />
        <div
          className="absolute bottom-0 right-0 h-56 w-56 translate-x-1/3 translate-y-1/3 rounded-full bg-white/10"
          aria-hidden
        />

        <div className="relative mx-auto w-full max-w-3xl">
          <h2 className="text-2xl font-black sm:text-3xl">جاهز لتبدأ التبادل؟</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
            أنشئ حسابك الآن وابدأ الوصول إلى المواد التعليمية بطريقة أذكى وأسهل.
          </p>
          <button
            className="mt-7 rounded-xl bg-white px-10 py-3 text-sm font-black text-primary-900 shadow-lg transition-colors hover:bg-primary-100"
            onClick={() => navigate("/signup")}
          >
            إنشاء حساب جديد
          </button>
        </div>
      </section>
    </div>
  );
};

export default Start;
