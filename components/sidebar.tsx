"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/auth/auth-provider";
import AlertDialog from "@/components/ui/alert-dialog";
import {
  Home,
  Package,
  FileText,
  CookingPot,
  User,
  Users,
  LogOut,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export default function AppSidebar() {
  const pathname = usePathname();
  const { logout, user } = useAuth();
  const { state } = useSidebar();
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [artikelOpen, setArtikelOpen] = useState(
    pathname.startsWith("/publikasi") || pathname.startsWith("/resep")
  );

  const isArtikelActive =
    pathname.startsWith("/publikasi") || pathname.startsWith("/resep");

  // Sync accordion with sidebar state - close when sidebar is collapsed
  useEffect(() => {
    if (state === "collapsed") {
      setArtikelOpen(false);
    } else if (isArtikelActive) {
      // Re-open if on artikel page and sidebar expands
      setArtikelOpen(true);
    }
  }, [state, isArtikelActive]);

  const handleLogout = () => {
    logout();
    setLogoutDialogOpen(false);
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <h1 className="text-2xl font-bold text-slate-800">TastyFruit</h1>
        <p className="text-sm text-slate-500">Admin Panel</p>
      </SidebarHeader>

      <SidebarContent className="flex-grow px-4">
        <nav>
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

            {/* Produk (Admin Only) */}
            {user?.role === "admin" && (
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
            )}

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

            {/* Users (Admin Only) */}
            {user?.role === "admin" && (
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
            )}
          </ul>
        </nav>
      </SidebarContent>

      <SidebarFooter className="space-y-1 px-4 pb-4">
        <Link
          href="/profile"
          className={`flex items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900 ${
            pathname.startsWith("/profile")
              ? "bg-blue-100 font-bold text-primary"
              : ""
          }`}
        >
          <User className="h-5 w-5" />
          Profile
        </Link>
        <button
          onClick={() => setLogoutDialogOpen(true)}
          className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-slate-600 transition-all hover:bg-slate-200 hover:text-slate-900"
        >
          <LogOut className="h-5 w-5" />
          Logout
        </button>
      </SidebarFooter>

      <AlertDialog
        isOpen={logoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={handleLogout}
        title="Konfirmasi Logout"
        description="Apakah Anda yakin ingin keluar dari aplikasi?"
        confirmLabel="Keluar"
        cancelLabel="Batal"
        isDestructive={true}
      />
    </Sidebar>
  );
}
