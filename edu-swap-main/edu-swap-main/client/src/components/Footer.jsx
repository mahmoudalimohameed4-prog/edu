import { RefreshCw, Mail, Phone, MapPin, Facebook, Twitter, Linkedin } from "lucide-react";

const Footer = ()=> {
  return (
    <footer className="bg-white border-t border-gray-100 pt-12 pb-6" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">

          {/* Col 1 — Logo + Contact */}
          <div className="flex flex-col gap-4">
            {/* Logo Icon */}
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg,var(--color-primary),var(--color-primary-600))",
              }}
            >
              <RefreshCw size={18} color="white" strokeWidth={2.5} />
            </div>

            {/* Contact Info */}
            <div className="flex flex-col gap-3 mt-1">
              <a
                href="mailto:hello@skillbridge.com"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <Mail size={15} className="shrink-0 text-gray-400" />
                hello@skillbridge.com
              </a>
              <a
                href="tel:+2091813 23 230"
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors"
              >
                <Phone size={15} className="shrink-0 text-gray-400" />
                +20 91813 23 230
              </a>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <MapPin size={15} className="shrink-0 text-gray-400" />
                Somewhere in the World
              </span>
            </div>
          </div>

          {/* Col 2 — الرئيسيه */}
          <div>
            <h4 className="text-sm font-black text-gray-800 mb-4" style={{ fontFamily: "'Georgia', serif" }}>
              الرئيسيه
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "المميزات", href: "/home" },
                { label: "دوراتنا", href: "/exchange" },
                { label: "آراء عملائنا", href: "/rewards" },
                { label: "الاسئله الشائعه", href: "/help" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — نبذه عنا */}
          <div>
            <h4 className="text-sm font-black text-gray-800 mb-4" style={{ fontFamily: "'Georgia', serif" }}>
              نبذه عنا
            </h4>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: "الشركه", href: "/home" },
                { label: "الانجازات", href: "/dashboard" },
                { label: "اهدافنا", href: "/help" },
              ].map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4 — Social */}
          <div>
            <h4 className="text-sm font-black text-gray-800 mb-4" style={{ fontFamily: "'Georgia', serif" }}>
              الحسابات الاجتماعيه
            </h4>
            <div className="flex items-center gap-3">
              {[
                { icon: <Facebook size={18} />, href: "#" },
                { icon: <Twitter size={18} />, href: "#" },
                { icon: <Linkedin size={18} />, href: "#" },
              ].map(({ icon, href }, i) => (
                <a
                  key={i}
                  href={href}
                  className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-primary hover:text-white transition-all hover:-translate-y-0.5"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* ── Divider + Copyright ── */}
        <div className="border-t border-gray-100 pt-5 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} EduSwap — جميع الحقوق محفوظة
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
