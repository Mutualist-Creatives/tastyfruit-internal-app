"use client";

import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

// Map of path segments to display names
const pathNameMap: Record<string, string> = {
  dashboard: "Dashboard",
  produk: "Produk",
  publikasi: "Publikasi",
  resep: "Resep",
  users: "Users",
  profile: "Profile",
  tambah: "Tambah",
  edit: "Edit",
  "fruit-types": "Fruit Types",
};

export function DynamicBreadcrumb() {
  const pathname = usePathname();

  // Split path and filter empty segments
  const segments = pathname.split("/").filter(Boolean);

  // Build breadcrumb items
  const breadcrumbItems = segments.map((segment, index) => {
    // Build the href for this segment
    const href = "/" + segments.slice(0, index + 1).join("/");

    // Get display name (mapped name or capitalize first letter)
    const displayName =
      pathNameMap[segment] ||
      (segment.length > 20
        ? segment.substring(0, 8) + "..."
        : segment.charAt(0).toUpperCase() + segment.slice(1));

    // Check if this is the last segment (current page)
    const isLast = index === segments.length - 1;

    return {
      href,
      label: displayName,
      isLast,
    };
  });

  // Don't render if no segments or only one segment
  if (breadcrumbItems.length === 0) {
    return null;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {breadcrumbItems.map((item, index) => (
          <React.Fragment key={item.href}>
            {index > 0 && <BreadcrumbSeparator />}
            <BreadcrumbItem>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link href={item.href}>{item.label}</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </React.Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
