import { Package, CookingPot, FileText } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
      title: "Produk Baru",
      count: recentActivity?.newProducts || 0,
      description: "Ditambahkan minggu ini",
      icon: Package,
      color: "bg-[#003CE9]/10 text-[#003CE9]",
    },
    {
      title: "Resep Baru",
      count: recentActivity?.newRecipes || 0,
      description: "Ditambahkan minggu ini",
      icon: CookingPot,
      color: "bg-[#B5FE28]/20 text-[#003CE9]",
    },
    {
      title: "Publikasi Baru",
      count: recentActivity?.newPublications || 0,
      description: "Ditambahkan minggu ini",
      icon: FileText,
      color: "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>
          Konten yang ditambahkan dalam 7 hari terakhir
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-center gap-4">
            <div className={`rounded-lg p-3 ${activity.color}`}>
              <activity.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">{activity.title}</p>
              <p className="text-xs text-muted-foreground">
                {activity.description}
              </p>
            </div>
            <Badge variant="secondary" className="text-lg font-bold">
              {activity.count}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
