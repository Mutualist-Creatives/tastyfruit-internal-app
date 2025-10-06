import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "5");

    // Fetch recent content from all types
    const [products, recipes, publications] = await Promise.all([
      prisma.product.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          name: true,
          imageUrl: true,
          isActive: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
      prisma.recipe.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          isPublished: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
      prisma.publication.findMany({
        take: limit,
        orderBy: { updatedAt: "desc" },
        select: {
          id: true,
          title: true,
          imageUrl: true,
          isPublished: true,
          updatedAt: true,
          createdAt: true,
        },
      }),
    ]);

    // Combine and format all content
    const allContent = [
      ...products.map((p) => ({
        id: p.id,
        title: p.name,
        type: "product" as const,
        status: p.isActive ? ("published" as const) : ("draft" as const),
        thumbnail: p.imageUrl,
        lastModified: p.updatedAt,
      })),
      ...recipes.map((r) => ({
        id: r.id,
        title: r.title,
        type: "recipe" as const,
        status: r.isPublished ? ("published" as const) : ("draft" as const),
        thumbnail: r.imageUrl,
        lastModified: r.updatedAt,
      })),
      ...publications.map((p) => ({
        id: p.id,
        title: p.title,
        type: "publication" as const,
        status: p.isPublished ? ("published" as const) : ("draft" as const),
        thumbnail: p.imageUrl,
        lastModified: p.updatedAt,
      })),
    ];

    // Sort by lastModified and take top N
    const recentContent = allContent
      .sort((a, b) => b.lastModified.getTime() - a.lastModified.getTime())
      .slice(0, limit);

    return NextResponse.json(recentContent);
  } catch (error) {
    console.error("Failed to fetch recent content:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent content" },
      { status: 500 }
    );
  }
}
