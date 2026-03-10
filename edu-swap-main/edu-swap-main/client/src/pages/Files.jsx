import { useState, useRef, useEffect } from "react";
import { Upload, ArrowRight, FileText, X, CheckCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getAllCategories, createItem, createAd } from "../api/api";

const Files = () => {
  const navigate = useNavigate();
  const [dragOver, setDragOver] = useState(false);
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploaded, setUploaded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getAllCategories();
        setCategories(response.data.data);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
  }, []);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) setFile(dropped);
  };

  const handleFileInput = (e) => {
    if (e.target.files[0]) setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file || !title || !selectedCategory) {
      toast.error("يرجى ملء جميع الحقول المطلوبة (الملف، العنوان، القسم)");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('name', title);
      formData.append('categoryId', selectedCategory);
      formData.append('description', description);
      formData.append('condition', 'good');
      formData.append('price', 0);
      formData.append('quantity', 1);

      const itemRes = await createItem(formData);
      const itemId = itemRes.data.data.id;

      await createAd({
        title: title,
        description: description,
        itemId: itemId,
        startDate: new Date().toISOString().slice(0, 19).replace('T', ' '),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 19).replace('T', ' '),
        status: 'active'
      });

      toast.success("تم رفع الأداة بنجاح!");
      setUploaded(true);
      setTimeout(() => navigate("/exchange"), 1500);
    } catch (error) {
      toast.error("حدث خطأ أثناء الرفع");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      dir="rtl"
      className="bg-slate-100 min-h-screen"
      style={{ fontFamily: "'Cairo', 'Segoe UI', sans-serif" }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
        <div className="text-right mb-6">
          <h1 className="text-2xl font-black text-slate-800">إضافة أداة / كتاب</h1>
          <p className="text-sm text-slate-500 mt-1">
            شارك مواردك التعليمية مع زملائك في الجامعة
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-primary transition mb-5 w-fit"
          >
            العودة للمقايضة
            <ArrowRight size={14} />
          </button>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5 md:p-7">
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              تفاصيل الأداة
            </h2>

            <div
              onClick={() => inputRef.current.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all mb-5 ${dragOver
                  ? "border-primary bg-primary-50"
                  : file
                    ? "border-primary bg-primary-50"
                    : "border-gray-200 bg-gray-50 hover:border-primary hover:bg-primary-50"
                }`}
            >
              <input
                ref={inputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileInput}
              />

              {file ? (
                <>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <FileText size={22} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-primary">
                    {file.name}
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="absolute top-3 left-3 text-gray-400 hover:text-primary transition"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <>
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Upload size={22} className="text-white" />
                  </div>
                  <p className="text-sm font-semibold text-gray-700">
                    انقر للرفع أو اسحب الصورة هنا
                  </p>
                  <p className="text-xs text-gray-400">
                    JPG, PNG • حتى ٥ ميجابايت
                  </p>
                </>
              )}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-600 mb-1 text-right">
                العنوان
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: كتاب الفيزياء 101"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right bg-gray-50 focus:outline-none focus:border-primary focus:bg-white transition"
              />
            </div>

            <div className="mb-4 text-right">
              <label className="block text-sm font-medium text-gray-600 mb-1">
                القسم
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right bg-gray-50 focus:outline-none focus:border-primary focus:bg-white transition"
              >
                <option value="">اختر القسم</option>
                {categories.map((cat) => (
                  <option key={cat.Cat_id} value={cat.Cat_id}>
                    {cat.Cat_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-600 mb-1 text-right">
                الوصف
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="وصف حالة الأداة..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-right bg-gray-50 focus:outline-none focus:border-primary focus:bg-white transition resize-none"
              />
            </div>

            <button
              onClick={handleSubmit}
              disabled={!file || !title || !selectedCategory || isLoading}
              className={`w-full py-3 rounded-xl text-sm font-bold transition flex items-center justify-center gap-2 ${file && title && selectedCategory && !isLoading
                  ? "bg-primary hover:bg-primary text-white shadow-md hover:shadow-lg"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
            >
              {isLoading ? "جاري الرفع..." : uploaded ? (
                <>
                  <CheckCircle size={16} />
                  تم الرفع بنجاح!
                </>
              ) : (
                <>
                  <Upload size={16} />
                  إضافة الأداة
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Files;
