import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit") || "10");

    if (!query || query.trim().length === 0) {
      return NextResponse.json([]);
    }

    // Search across all content types
    const [products, recipes, publications] = await Promise.all([
      prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        select: {
          id: true,
          name: true,
          imageUrl: true,
          isActive: true,
        },
      }),
      prisma.recipe.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          isPublished: true,
        },
      }),
      prisma.publication.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
          ],
        },
        take: limit,
        select: {
          id: true,
          title: true,
          imageUrl: true,
          isPublished: true,
        },
      }),
    ]);

    // Combine and format results
    const results = [
      ...products.map((p) => ({
        id: p.id,
        title: p.name,
        type: "product" as const,
        thumbnail: p.imageUrl,
        url: `/produk/edit/${p.id}`,
      })),
      ...recipes.map((r) => ({
        id: r.id,
        title: r.title,
        type: "recipe" as const,
        thumbnail: r.imageUrl,
        url: `/resep/edit/${r.id}`,
      })),
      ...publications.map((p) => ({
        id: p.id,
        title: p.title,
        type: "publication" as const,
        thumbnail: p.imageUrl,
        url: `/publikasi/edit/${p.id}`,
      })),
    ];

    return NextResponse.json(results.slice(0, limit));
  } catch (error) {
    console.error("Failed to search content:", error);
    return NextResponse.json(
      { error: "Failed to search content" },
      { status: 500 }
    );
  }
}
