import { useEffect, useState } from "react";
import { Heart, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllAds, API_BASE_URL } from "../api/api"; // Moved to top

// ─── Constants ───────────────────────────────────────────────────────────────

const CATEGORIES = ["الكل", "كتب", "إلكترونيات", "معدات", "أخرى"];

// Initial static items removed in favor of real data

// ─── Main Page ────────────────────────────────────────────────────────────────


const StudentExchange = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [search, setSearch] = useState("");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAds = async () => {
      try {
        const response = await getAllAds();
        setItems(response.data.data);
      } catch (error) {
        console.error("Failed to fetch ads:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAds();
  }, []);

  const toggleLike = (id) =>
    setItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, liked: !item.liked } : item,
      ),
    );

  const filtered = items.filter((item) => {
    const matchCat =
      activeCategory === "الكل" || item.category === activeCategory;
    const matchSearch =
      search === "" ||
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(search.toLowerCase())) ||
      (item.userName && item.userName.toLowerCase().includes(search.toLowerCase()));
    return matchCat && matchSearch;
  });

  return (
    <div
      className="bg-primary-50"
      style={{
        background: "var(--color-primary-50)",
        fontFamily: "'Segoe UI', Tahoma, Arial, sans-serif",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Hero Header ── */}
        <div
          dir="rtl"
          className="px-0 pt-8 pb-4 flex flex-col md:flex-row md:items-start justify-between gap-4"
        >
          <div>
            <h1
              className="text-3xl sm:text-4xl font-black text-gray-900 mb-1"
              style={{ fontFamily: "Georgia, serif", letterSpacing: "-0.5px" }}
            >
              سوق التبادل
            </h1>
            <p className="text-gray-500 text-sm">
              تبادل، تبرع، أو استعر الأدوات مجاناً داخل الحرم الجامعي.
            </p>
          </div>
          <button
            onClick={() => navigate("/files")}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-md transition-all hover:opacity-90 active:scale-95"
            style={{
              background:
                "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            إضافة أداة
          </button>
        </div>

        {/* ── Filter & Search Bar ── */}
        <div
          dir="rtl"
          className="px-0 py-3 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-3 items-center"
        >
          <div className="order-2 lg:order-1 flex items-center gap-2 overflow-x-auto pb-1 whitespace-nowrap">
            <button className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:text-gray-800 hover:border-gray-300 transition flex-shrink-0">
              <SlidersHorizontal size={16} />
            </button>

            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 ${activeCategory === cat
                  ? "text-white shadow-md"
                  : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                style={
                  activeCategory === cat
                    ? {
                      background:
                        "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
                    }
                    : {}
                }
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="order-1 lg:order-2 relative w-full">
            <Search
              size={16}
              className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 pointer-events-none"
            />
            <input
              dir="rtl"
              type="text"
              placeholder="ابحث في الأدوات..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-xl py-2.5 pr-10 pl-4 text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary transition"
            />
          </div>
        </div>

        {/* ── Items Grid ── */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <p className="text-sm">جاري تحميل الأدوات...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Search size={40} strokeWidth={1.5} className="mb-3 opacity-40" />
            <p className="text-sm">لا توجد نتائج مطابقة</p>
          </div>
        ) : (
          <div className="px-0 pb-12 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-2">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => navigate(`/item/${item.itemId}`)}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                {/* Card Image */}
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <img
                    src={item.image ? `${API_BASE_URL}/${item.image}` : "https://via.placeholder.com/400x300"}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Condition Badge */}
                  <span
                    className="absolute bottom-2 right-2 px-2.5 py-0.5 rounded-lg text-xs font-bold text-white bg-primary"
                  >
                    {item.itemCondition || "مستخدم"}
                  </span>
                </div>

                {/* Card Body */}
                <div dir="rtl" className="p-4">
                  <div className="flex items-center justify-between mb-1">
                    <span
                      className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{
                        background: "var(--color-primary-100)",
                        color: "var(--color-primary)",
                      }}
                    >
                      {item.category || "عام"}
                    </span>
                    <span className="text-xs text-gray-400">{item.userName || "طالب"}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mt-2 mb-2 leading-snug line-clamp-2">
                    {item.title}
                  </h3>
                  <p
                    className="text-base font-extrabold"
                    style={{ color: "var(--color-primary)" }}
                  >
                    {!item.price || item.price === "0" || item.price === 0 ? "مجاني" : `${item.price} ج.م`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentExchange;
