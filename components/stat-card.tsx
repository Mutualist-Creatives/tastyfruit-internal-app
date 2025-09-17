import { LucideIcon } from "lucide-react"; // Tipe untuk ikon

// Definisikan props yang akan diterima oleh komponen
interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
}

export default function StatCard({ title, value, icon: Icon }: StatCardProps) {
  return (
    <div className="flex items-center rounded-lg border bg-white p-6 shadow-sm">
      <div className="mr-4 rounded-full bg-blue-100 p-3">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
      </div>
    </div>
  );
}
