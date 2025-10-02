import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createRecipeSchema } from "@/lib/validations/recipe";
import { ZodError } from "zod";

// GET /api/recipes
export async function GET() {
  try {
    const recipes = await prisma.recipe.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Failed to fetch recipes:", error);
    return NextResponse.json(
      { error: "Failed to fetch recipes" },
      { status: 500 }
    );
  }
}

// POST /api/recipes
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input data
    const validatedData = createRecipeSchema.parse({
      ...body,
      cookingTime: body.cookingTime ? parseInt(body.cookingTime) : undefined,
      servings: body.servings ? parseInt(body.servings) : undefined,
      ingredients: Array.isArray(body.ingredients) ? body.ingredients : [],
    });

    const recipe = await prisma.recipe.create({
      data: validatedData,
    });

    return NextResponse.json(recipe, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.issues.map((err: any) => ({
            field: err.path.join("."),
            message: err.message,
          })),
        },
        { status: 400 }
      );
    }

    console.error("Failed to create recipe:", error);
    return NextResponse.json(
      { error: "Failed to create recipe" },
      { status: 500 }
    );
  }
}
