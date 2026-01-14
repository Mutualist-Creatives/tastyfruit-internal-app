import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get products grouped by category
    const productsByCategory = await prisma.product.groupBy({
      by: ["category"],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: "desc",
        },
      },
    });

    // Calculate total for percentages
    const total = productsByCategory.reduce(
      (sum, item) => sum + item._count.id,
      0
    );

    // Format the response
    const categories = productsByCategory.map((item) => ({
      name: item.category,
      count: item._count.id,
      percentage: total > 0 ? Math.round((item._count.id / total) * 100) : 0,
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}
