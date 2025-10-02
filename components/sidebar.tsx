"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Package,
  FileText,
  CookingPot,
  Users,
  LogOut,
  ChevronDown,
  ChevronRight,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [artikelOpen, setArtikelOpen] = useState(
    pathname.startsWith("/publikasi") || pathname.startsWith("/resep")
  );

  const isArtikelActive =
    pathname.startsWith("/publikasi") || pathname.startsWith("/resep");

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
          <ul className="space-y-1">
            {/* Dashboard */}
            <li>
              <Link
                href="/dashboard"
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
                  pathname.startsWith("/dashboard")
                    ? "bg-blue-100 font-bold text-primary"
                    : ""
                }`}
              >
                <Home className="h-5 w-5" />
                Dashboard
              </Link>
            </li>

            {/* Produk */}
            <li>
              <Link
                href="/produk"
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
                  pathname.startsWith("/produk")
                    ? "bg-blue-100 font-bold text-primary"
                    : ""
                }`}
              >
                <Package className="h-5 w-5" />
                Produk
              </Link>
            </li>

            {/* Artikel (Accordion) */}
            <li>
              <button
                onClick={() => setArtikelOpen(!artikelOpen)}
                className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
                  isArtikelActive ? "bg-blue-100 font-bold text-primary" : ""
                }`}
              >
                <div className="flex items-center gap-3">
                  <FileText className="h-5 w-5" />
                  Artikel
                </div>
                {artikelOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </button>

              {/* Submenu */}
              {artikelOpen && (
                <ul className="ml-4 mt-1 space-y-1 border-l-2 border-slate-200 pl-4">
                  <li>
                    <Link
                      href="/publikasi"
                      className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
                        pathname.startsWith("/publikasi")
                          ? "bg-blue-50 font-semibold text-primary"
                          : ""
                      }`}
                    >
                      <FileText className="h-4 w-4" />
                      Publikasi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/resep"
                      className={`flex items-center gap-3 rounded-lg px-4 py-2 text-sm text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
                        pathname.startsWith("/resep")
                          ? "bg-blue-50 font-semibold text-primary"
                          : ""
                      }`}
                    >
                      <CookingPot className="h-4 w-4" />
                      Resep
                    </Link>
                  </li>
                </ul>
              )}
            </li>

            {/* Users */}
            <li>
              <Link
                href="/users"
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
                  pathname.startsWith("/users")
                    ? "bg-blue-100 font-bold text-primary"
                    : ""
                }`}
              >
                <Users className="h-5 w-5" />
                Users
              </Link>
            </li>
          </ul>
        </nav>

        {/* Bagian Logout */}
        <div>
          <form action="/auth/logout" method="post">
            <button
              type="submit"
              className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
            >
              <LogOut className="h-5 w-5" />
              Logout
            </button>
          </form>
        </div>
      </div>
    </aside>
  );
}
