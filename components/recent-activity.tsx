import { PlusCircle, FilePenLine, CookingPot } from "lucide-react";

interface RecentActivityProps {
  recentActivity?: {
    newProducts: number;
    newRecipes: number;
    newPublications: number;
  };
}

export default function RecentActivity({
  recentActivity,
}: RecentActivityProps) {
  const activities = [
    {
      action: "Produk baru (7 hari terakhir)",
      item: `${recentActivity?.newProducts || 0} produk`,
      time: "Minggu ini",
      icon: PlusCircle,
    },
    {
      action: "Resep baru (7 hari terakhir)",
      item: `${recentActivity?.newRecipes || 0} resep`,
      time: "Minggu ini",
      icon: CookingPot,
    },
    {
      action: "Publikasi baru (7 hari terakhir)",
      item: `${recentActivity?.newPublications || 0} artikel`,
      time: "Minggu ini",
      icon: FilePenLine,
    },
  ];
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
