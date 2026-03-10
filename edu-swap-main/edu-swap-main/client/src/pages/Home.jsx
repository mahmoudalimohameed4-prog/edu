import {
  Search,
  Bookmark,
  ChevronLeft,
  Download,
  BookOpen,
  Microscope,
  Package,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllAds, getLatestItems, getAllCategories, API_BASE_URL } from "../api/api";

function StarRating({ rating }) {
  return (
    <div className="flex items-center gap-1">
      <span className="text-primary text-xs">★</span>
      <span className="text-xs font-semibold text-slate-600">{rating || "5.0"}</span>
    </div>
  );
}

function ToolCard({ tool, onClick }) {
  const [saved, setSaved] = useState(false);
  const imageUrl = tool.image ? `${API_BASE_URL}/${tool.image}` : "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=260&fit=crop";

  return (
    <div onClick={onClick} className="group relative bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-slate-100 hover:-translate-y-1 cursor-pointer">
      {/* Image */}
      <div className="relative h-44 overflow-hidden bg-slate-100">
        <img
          src={imageUrl}
          alt={tool.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          onError={(e) => {
            e.target.src = "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=260&fit=crop";
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

        {/* Badge */}
        <span className={`absolute top-3 right-3 text-xs font-bold px-2.5 py-1 rounded-full bg-primary text-white shadow-sm`}>
          {tool.itemCondition || "متاح"}
        </span>

        {/* Bookmark */}
        <button
          onClick={() => setSaved(!saved)}
          className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-sm transition-all duration-300 ${saved ? "bg-primary text-white" : "bg-white/80 text-slate-500 hover:bg-white"
            }`}
        >
          <Bookmark className="w-4 h-4" fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Info */}
      <div className="p-4" dir="rtl">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[10px] text-white font-bold bg-primary/80 backdrop-blur-sm px-2 py-0.5 rounded-lg uppercase tracking-wider">{tool.category || "عام"}</span>
          <span className={`text-[10px] font-black ${parseFloat(tool.price) === 0 ? "text-emerald-500" : "text-slate-500"}`}>
            {parseFloat(tool.price) === 0 ? "مجاني ✨" : `${tool.price} ج.م`}
          </span>
        </div>
        <h3 className="text-sm font-bold text-slate-800 leading-snug line-clamp-1 group-hover:text-primary transition-colors">{tool.title}</h3>
        <p className="mt-1 text-[11px] text-slate-400 line-clamp-1">{tool.description || "لا يوجد وصف متوفر"}</p>
        <div className="mt-3 pt-3 border-t border-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-primary font-black border border-slate-200">
              {(tool.userName || "U")[0]}
            </div>
            <span className="text-[10px] font-medium text-slate-500">{tool.userName || "مستخدم"}</span>
          </div>
          <StarRating rating={tool.rating} />
        </div>
      </div>
    </div>
  );
}


const Home = () => {
  const navigate = useNavigate();
  const [ads, setAds] = useState([]);
  const [latestItems, setLatestItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  const filteredAds = ads.filter((ad) => {
    const matchesSearch =
      ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      activeCategory === "الكل" || ad.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [adsRes, itemsRes, catsRes] = await Promise.all([
          getAllAds(),
          getLatestItems(),
          getAllCategories()
        ]);
        setAds(adsRes.data.data);
        setLatestItems(itemsRes.data.data);
        setCategories(catsRes.data.data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div dir="rtl" className="min-h-screen bg-slate-50 font-sans overflow-x-clip" style={{ fontFamily: "'Segoe UI', Tahoma, sans-serif" }}>

      {/* ─── Hero ─── */}
      <section
        className="relative overflow-hidden text-white bg-primary-900"
      >
        {/* Decorative blobs */}
        <div className="absolute top-0 left-0 w-80 h-80 bg-primary-500/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[26rem] h-[26rem] bg-primary-700/25 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/3 w-44 h-44 bg-white/5 rounded-full blur-2xl" />
        <div className="absolute inset-0 bg-black/20 pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-1.5 text-sm text-white">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              منصة الطلاب الجامعيين المجانية
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight tracking-tight">
              تبادل الأدوات،{" "}
              <span className="text-primary-100">
                شارك المعرفة،
              </span>{" "}
              تواصل. مجاناً.
            </h1>
            <p className="text-white/85 text-sm sm:text-base leading-relaxed max-w-md">
              المنصة الطلابية لطلاب الجامعات لتبادل الكتب الدراسية، استعارة
              المعدات، ومشاركة المواد الدراسية دون أي تكلفة.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button className="w-full sm:w-auto bg-white hover:bg-primary-100 text-primary-900 font-bold px-6 py-3 rounded-xl transition-all duration-300 shadow-lg shadow-primary-900/20 hover:scale-105 text-sm">
                تصفح الأدوات المجانية
              </button>
              <button className="w-full sm:w-auto border border-white/30 hover:bg-white/10 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-300 backdrop-blur-sm text-sm">
                ابحث عن ملخصات
              </button>
            </div>
          </div>

          {/* Floating cards visual */}
          <div className="hidden md:flex justify-center items-center relative h-64">
            <div className="absolute rotate-6 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 w-48 top-0 right-8 shadow-2xl">
              <div className="w-full h-24 rounded-xl bg-gradient-to-br from-primary to-primary mb-3 flex items-center justify-center">
                <BookOpen className="w-10 h-10 text-white" />
              </div>
              <div className="h-2 bg-white/30 rounded-full w-3/4 mb-1" />
              <div className="h-2 bg-white/20 rounded-full w-1/2" />
            </div>
            <div className="absolute -rotate-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-4 w-44 bottom-0 left-8 shadow-2xl">
              <div className="w-full h-20 rounded-xl bg-gradient-to-br from-primary to-primary mb-3 flex items-center justify-center">
                <Microscope className="w-9 h-9 text-white" />
              </div>
              <div className="h-2 bg-white/30 rounded-full w-full mb-1" />
              <div className="h-2 bg-white/20 rounded-full w-2/3" />
            </div>
          </div>
        </div>
      </section>

      {/* ─── Search ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 sm:-mt-6 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl shadow-primary-200/50 border border-slate-100 p-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
          <button className="bg-primary hover:bg-primary text-white px-5 py-3 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap sm:w-auto">
            <Search className="w-5 h-5" />
            بحث
          </button>
          <input
            type="text"
            placeholder="ابحث عن كتب، معدات، إلكترونيات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-slate-700 placeholder-slate-400 text-sm outline-none text-right py-3 px-2 min-w-0"
          />
          <div className="hidden sm:flex w-10 h-10 items-center justify-center text-slate-400">
            <Search className="w-5 h-5" />
          </div>
        </div>
      </section>

      {/* ─── Categories ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-slate-800">الأقسام</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <button
            onClick={() => setActiveCategory("الكل")}
            className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-center transition-all duration-300 hover:scale-105 ${activeCategory === "الكل"
              ? "border-primary bg-primary text-white"
              : "border-slate-100 bg-white hover:border-primary text-slate-700"
              }`}
          >
            <div className="text-3xl mb-2">🏷️</div>
            <div className={`font-bold text-sm`}>الكل</div>
            <div className={`text-xs mt-0.5 opacity-70`}>{ads.length} أداة</div>
          </button>
          {categories.map((cat) => (
            <button
              key={cat.Cat_id}
              onClick={() => setActiveCategory(cat.Cat_name === activeCategory ? "الكل" : cat.Cat_name)}
              className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-center transition-all duration-300 hover:scale-105 ${activeCategory === cat.Cat_name
                ? "border-primary bg-primary text-white"
                : "border-slate-100 bg-white hover:border-primary text-slate-700"
                }`}
            >
              <div className="text-3xl mb-2">{cat.Cat_icon || "📁"}</div>
              <div className={`font-bold text-sm`}>
                {cat.Cat_name}
              </div>
              <div className={`text-xs mt-0.5 opacity-70`}>{cat.itemCount || 0}+ أداة</div>
            </button>
          ))}
        </div>
      </section>

      {/* ─── Tools Grid ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
        <div className="flex items-center justify-between mb-6">
          <button className="text-sm text-primary font-semibold hover:text-primary transition-colors flex items-center gap-1">
            عرض الكل
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
          <h2 className="text-xl font-black text-slate-800">الادوات</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {isLoading ? (
            <div className="col-span-full py-10 text-center text-slate-500">جاري التحميل...</div>
          ) : filteredAds.length > 0 ? (
            filteredAds.map((tool) => <ToolCard key={tool.id} tool={tool} onClick={() => navigate(`/item/${tool.itemId}`)} />)
          ) : (
            <div className="col-span-full py-20 bg-white border border-dashed border-slate-200 rounded-3xl text-center text-slate-400">
              <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm font-bold">لا يوجد بيانات لعرضها حالياً في هذا القسم</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Summaries ─── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14 mb-16">
        <div className="flex items-center justify-between mb-6">
          <button className="text-sm text-primary font-semibold hover:text-primary transition-colors flex items-center gap-1">
            عرض الكل
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </button>
          <h2 className="text-xl font-black text-slate-800">أحدث الإضافات</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {latestItems.length > 0 ? (
            latestItems.map((item) => (
              <div
                key={item.It_id}
                onClick={() => navigate(`/item/${item.It_id}`)}
                className="group flex items-center gap-4 bg-gradient-to-r from-primary-50 to-primary-100 border border-primary-200 rounded-2xl p-5 hover:shadow-md transition-all duration-300 cursor-pointer hover:-translate-y-0.5"
              >
                <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300 overflow-hidden">
                  {item.primaryImage ? (
                    <img src={`${API_BASE_URL}/${item.primaryImage}`} alt={item.It_name} className="w-full h-full object-cover rounded-xl" />
                  ) : (
                    <Package className="w-6 h-6 text-primary" />
                  )}
                </div>
                <div className="flex-1 text-right min-w-0">
                  <h3 className="font-bold text-sm text-slate-800 line-clamp-1">{item.It_name}</h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{item.It_description}</p>
                  <div className="flex items-center justify-end gap-3 mt-1.5">
                    <span className="text-xs font-bold text-primary bg-primary-50 px-2 py-0.5 rounded-full">
                      {parseFloat(item.It_price) === 0 ? "مجاني" : `${item.It_price} ج.م`}
                    </span>
                    <span className="text-xs text-slate-500">{item.sellerName || "مستخدم"}</span>
                  </div>
                </div>
                <div className="text-slate-400 group-hover:text-primary transition-colors">
                  <ChevronLeft className="w-5 h-5 rotate-180" />
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-6 text-center text-slate-400 text-sm">لا توجد أدوات حالياً</div>
          )}
        </div>

        {/* CTA Banner */}
        <div className="mt-8 relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary-800 via-primary-700 to-primary-600 p-8 text-center text-white">
          <div className="absolute top-0 left-0 w-40 h-40 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
          <div className="relative">
            <p className="text-xs text-white/80 font-medium mb-1">انضم إلى أكثر من ٥٠٠٠ طالب</p>
            <h3 className="text-2xl font-black mb-2">هل لديك أداة أو ملخص؟</h3>
            <p className="text-white/85 text-sm mb-5">شاركه مع زملائك وساعد مجتمعك الجامعي</p>
            <button className="bg-white hover:bg-primary-100 text-primary-900 font-bold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105 shadow-lg shadow-primary-900/20 text-sm">
              ابدأ الآن مجاناً ✨
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
export default Home;
