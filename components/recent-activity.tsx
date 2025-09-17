import { PlusCircle, FilePenLine } from "lucide-react";

// Data dummy untuk aktivitas
const activities = [
  {
    action: "Produk baru ditambahkan",
    item: "Jus Jambu Merah",
    time: "15 menit lalu",
    icon: PlusCircle,
  },
  {
    action: "Artikel baru dipublikasi",
    item: "5 Manfaat Buah Naga",
    time: "1 jam lalu",
    icon: FilePenLine,
  },
  {
    action: "Produk baru ditambahkan",
    item: "Salad Buah Komplit",
    time: "3 jam lalu",
    icon: PlusCircle,
  },
  {
    action: "Produk baru ditambahkan",
    item: "Pisang Cavendish",
    time: "8 jam lalu",
    icon: PlusCircle,
  },
];

export default function RecentActivity() {
  return (
    <div className="rounded-lg border bg-white p-6 shadow-sm">
      <h3 className="font-heading text-lg font-semibold mb-4">
        Aktivitas Terbaru
      </h3>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li key={index} className="flex items-start gap-4">
            <div className="rounded-full bg-slate-100 p-2">
              <activity.icon className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-800">
                {activity.action}
              </p>
              <p className="text-sm text-slate-600">{activity.item}</p>
              <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
