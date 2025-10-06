import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    // Build date filter if provided
    const dateFilter =
      from && to
        ? {
            createdAt: {
              gte: new Date(from),
              lte: new Date(to),
            },
          }
        : {};

    // Get publish status counts for each content type
    const [
      publishedProducts,
      draftProducts,
      publishedRecipes,
      draftRecipes,
      publishedPublications,
      draftPublications,
    ] = await Promise.all([
      // Products - isActive: true means published
      prisma.product.count({
        where: {
          isActive: true,
          ...dateFilter,
        },
      }),
      // Products - isActive: false means draft
      prisma.product.count({
        where: {
          isActive: false,
          ...dateFilter,
        },
      }),
      // Recipes - isPublished: true means published
      prisma.recipe.count({
        where: {
          isPublished: true,
          ...dateFilter,
        },
      }),
      // Recipes - isPublished: false means draft
      prisma.recipe.count({
        where: {
          isPublished: false,
          ...dateFilter,
        },
      }),
      // Publications - isPublished: true means published
      prisma.publication.count({
        where: {
          isPublished: true,
          ...dateFilter,
        },
      }),
      // Publications - isPublished: false means draft
      prisma.publication.count({
        where: {
          isPublished: false,
          ...dateFilter,
        },
      }),
    ]);

    return NextResponse.json({
      products: {
        published: publishedProducts,
        draft: draftProducts,
      },
      recipes: {
        published: publishedRecipes,
        draft: draftRecipes,
      },
      publications: {
        published: publishedPublications,
        draft: draftPublications,
      },
    });
  } catch (error) {
    console.error("Failed to fetch publish status data:", error);
    return NextResponse.json(
      { error: "Failed to fetch publish status data" },
      { status: 500 }
    );
  }
}
