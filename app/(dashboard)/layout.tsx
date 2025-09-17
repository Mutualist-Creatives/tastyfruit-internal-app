import Sidebar from "@/components/sidebar"; // Pastikan path import benar

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar akan selalu ditampilkan di sini */}
      <Sidebar />

      {/* Konten halaman dinamis akan dirender di sini */}
      <main className="flex-1 overflow-y-auto pl-64">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
