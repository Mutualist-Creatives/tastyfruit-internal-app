import Link from "next/link";
import { Home, Package, FileText, CookingPot, LogOut } from "lucide-react";

// Anda bisa membuat array seperti ini untuk memudahkan penambahan link di masa depan
const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: Home },
  { href: "/produk", label: "Produk", icon: Package },
  { href: "/publikasi", label: "Publikasi", icon: FileText },
  { href: "/resep", label: "Resep", icon: CookingPot },
];

export default function Sidebar() {
  // Untuk saat ini, kita hardcode link aktif. Nanti ini akan dinamis menggunakan useRouter.
  const activePath = "/dashboard";

  return (
    <aside className="fixed left-0 top-0 h-full w-64 flex-col border-r bg-slate-50">
      <div className="flex h-full flex-col p-4">
        {/* Bagian Logo */}
        <div className="mb-8 p-4">
          <h1 className="text-2xl font-bold text-slate-800">TastyFruit</h1>
          <p className="text-sm text-slate-500">Admin Panel</p>
        </div>

        {/* Bagian Navigasi Utama */}
        <nav className="flex-grow">
          <ul>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
                    activePath === link.href
                      ? "bg-blue-100 font-bold text-primary" // Style untuk link aktif
                      : ""
                  }`}
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bagian Logout */}
        <div>
          <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
