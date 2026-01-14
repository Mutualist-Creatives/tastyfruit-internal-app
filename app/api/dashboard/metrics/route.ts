import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const fromDate = from
      ? new Date(from)
      : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();

    // Calculate previous period for comparison
    const periodDuration = toDate.getTime() - fromDate.getTime();
    const previousFromDate = new Date(fromDate.getTime() - periodDuration);
    const previousToDate = new Date(fromDate.getTime());

    // Current period metrics
    const [currentProducts, currentRecipes, currentPublications] =
      await Promise.all([
        prisma.product.count({
          where: {
            createdAt: {
              gte: fromDate,
              lte: toDate,
            },
          },
        }),
        prisma.recipe.count({
          where: {
            createdAt: {
              gte: fromDate,
              lte: toDate,
            },
          },
        }),
        prisma.publication.count({
          where: {
            createdAt: {
              gte: fromDate,
              lte: toDate,
            },
          },
        }),
      ]);

    // Previous period metrics
    const [previousProducts, previousRecipes, previousPublications] =
      await Promise.all([
        prisma.product.count({
          where: {
            createdAt: {
              gte: previousFromDate,
              lte: previousToDate,
            },
          },
        }),
        prisma.recipe.count({
          where: {
            createdAt: {
              gte: previousFromDate,
              lte: previousToDate,
            },
          },
        }),
        prisma.publication.count({
          where: {
            createdAt: {
              gte: previousFromDate,
              lte: previousToDate,
            },
          },
        }),
      ]);

    // Active content (published)
    const [activeProducts, activeRecipes, activePublications] =
      await Promise.all([
        prisma.product.count({
          where: { isActive: true },
        }),
        prisma.recipe.count({
          where: { isPublished: true },
        }),
        prisma.publication.count({
          where: { isPublished: true },
        }),
      ]);

    // Previous period active content
    const [
      previousActiveProducts,
      previousActiveRecipes,
      previousActivePublications,
    ] = await Promise.all([
      prisma.product.count({
        where: {
          isActive: true,
          createdAt: {
            lte: previousToDate,
          },
        },
      }),
      prisma.recipe.count({
        where: {
          isPublished: true,
          createdAt: {
            lte: previousToDate,
          },
        },
      }),
      prisma.publication.count({
        where: {
          isPublished: true,
          createdAt: {
            lte: previousToDate,
          },
        },
      }),
    ]);

    // Content created this week (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);

    const [thisWeekProducts, thisWeekRecipes, thisWeekPublications] =
      await Promise.all([
        prisma.product.count({
          where: {
            createdAt: {
              gte: weekAgo,
            },
          },
        }),
        prisma.recipe.count({
          where: {
            createdAt: {
              gte: weekAgo,
            },
          },
        }),
        prisma.publication.count({
          where: {
            createdAt: {
              gte: weekAgo,
            },
          },
        }),
      ]);

    const [lastWeekProducts, lastWeekRecipes, lastWeekPublications] =
      await Promise.all([
        prisma.product.count({
          where: {
            createdAt: {
              gte: twoWeeksAgo,
              lt: weekAgo,
            },
          },
        }),
        prisma.recipe.count({
          where: {
            createdAt: {
              gte: twoWeeksAgo,
              lt: weekAgo,
            },
          },
        }),
        prisma.publication.count({
          where: {
            createdAt: {
              gte: twoWeeksAgo,
              lt: weekAgo,
            },
          },
        }),
      ]);

    const totalContent = currentProducts + currentRecipes + currentPublications;
    const previousTotalContent =
      previousProducts + previousRecipes + previousPublications;
    const activeContent = activeProducts + activeRecipes + activePublications;
    const previousActiveContent =
      previousActiveProducts +
      previousActiveRecipes +
      previousActivePublications;
    const contentThisWeek =
      thisWeekProducts + thisWeekRecipes + thisWeekPublications;
    const contentLastWeek =
      lastWeekProducts + lastWeekRecipes + lastWeekPublications;

    // Calculate trends
    const calculateTrend = (current: number, previous: number) => {
      if (previous === 0) return { value: 0, direction: "neutral" as const };
      const change = ((current - previous) / previous) * 100;
      return {
        value: Math.abs(Math.round(change)),
        direction:
          change > 0
            ? ("up" as const)
            : change < 0
            ? ("down" as const)
            : ("neutral" as const),
      };
    };

    return NextResponse.json({
      totalContent,
      activeContent,
      contentThisWeek,
      trends: {
        totalContent: {
          ...calculateTrend(totalContent, previousTotalContent),
          label: "vs periode sebelumnya",
        },
        activeContent: {
          ...calculateTrend(activeContent, previousActiveContent),
          label: "vs periode sebelumnya",
        },
        contentThisWeek: {
          ...calculateTrend(contentThisWeek, contentLastWeek),
          label: "vs minggu lalu",
        },
      },
      breakdown: {
        products: currentProducts,
        recipes: currentRecipes,
        publications: currentPublications,
      },
    });
  } catch (error) {
    console.error("Failed to fetch dashboard metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard metrics" },
      { status: 500 }
    );
  }
}
