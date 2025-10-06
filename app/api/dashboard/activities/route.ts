import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const skip = (page - 1) * limit;

    // For now, we'll create a simple activity log based on recent content
    // In a real implementation, you'd have a dedicated activity log table
    const [products, recipes, publications] = await Promise.all([
      prisma.product.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.recipe.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
      prisma.publication.findMany({
        take: limit,
        skip: skip,
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          title: true,
          createdAt: true,
          updatedAt: true,
        },
      }),
    ]);

    // Combine and format activities
    const activities = [
      ...products.map((p) => ({
        id: `product-${p.id}`,
        type: "create" as const,
        contentType: "product" as const,
        contentTitle: p.name,
        contentId: p.id,
        timestamp: p.createdAt,
      })),
      ...recipes.map((r) => ({
        id: `recipe-${r.id}`,
        type: "create" as const,
        contentType: "recipe" as const,
        contentTitle: r.title,
        contentId: r.id,
        timestamp: r.createdAt,
      })),
      ...publications.map((p) => ({
        id: `publication-${p.id}`,
        type: "create" as const,
        contentType: "publication" as const,
        contentTitle: p.title,
        contentId: p.id,
        timestamp: p.createdAt,
      })),
    ];

    // Sort by timestamp and take top N
    const sortedActivities = activities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);

    return NextResponse.json({
      activities: sortedActivities,
      hasMore: activities.length > limit,
      page,
      limit,
    });
  } catch (error) {
    console.error("Failed to fetch activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}
