import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get basic counts
    const [
      totalProducts,
      totalRecipes,
      totalPublications,
      activeProducts,
      publishedRecipes,
      publishedPublications,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.recipe.count(),
      prisma.publication.count(),
      prisma.product.count({ where: { isActive: true } }),
      prisma.recipe.count({ where: { isPublished: true } }),
      prisma.publication.count({ where: { isPublished: true } }),
    ]);

    // Get products by category
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

    // Get recent activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentActivity = await Promise.all([
      prisma.product.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.recipe.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
      prisma.publication.count({
        where: {
          createdAt: {
            gte: sevenDaysAgo,
          },
        },
      }),
    ]);

    // Get monthly data for charts (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyProducts = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*)::int as count
      FROM products
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    const monthlyRecipes = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', "createdAt") as month,
        COUNT(*)::int as count
      FROM recipes
      WHERE "createdAt" >= ${sixMonthsAgo}
      GROUP BY DATE_TRUNC('month', "createdAt")
      ORDER BY month ASC
    `;

    return NextResponse.json({
      overview: {
        totalProducts,
        totalRecipes,
        totalPublications,
        activeProducts,
        publishedRecipes,
        publishedPublications,
      },
      productsByCategory: productsByCategory.map((item) => ({
        category: item.category,
        count: item._count.id,
      })),
      recentActivity: {
        newProducts: recentActivity[0],
        newRecipes: recentActivity[1],
        newPublications: recentActivity[2],
      },
      monthlyData: {
        products: monthlyProducts,
        recipes: monthlyRecipes,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard stats:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard stats" },
      { status: 500 }
    );
  }
}
