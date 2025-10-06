"use client";

import RecipeDetail from "../web-clients/article/recipe-detail";
import { RecipeData } from "../web-clients/types";

interface RecipePreviewProps {
  recipe: {
    title: string;
    description?: string;
    imageUrl?: string;
    servings?: string;
    cookingTime?: string;
    author: string;
    difficulty: string;
    ingredients: Array<{
      name: string;
      amount: string;
      note?: string;
    }>;
    instructions: Array<{
      title: string;
      description: string;
    }>;
    isPublished: boolean;
  };
  viewMode?: "desktop" | "mobile";
}

export default function RecipePreview({
  recipe,
  viewMode = "desktop",
}: RecipePreviewProps) {
  // Convert recipe data to match web client format
  const recipeData: RecipeData = {
    id: recipe.title.toLowerCase().replace(/\s+/g, "-"),
    name: recipe.title,
    image: recipe.imageUrl || "/assets/default-recipe.jpg",
    author: recipe.author,
    servings: recipe.servings || "4 servings",
    time: recipe.cookingTime || "30 minutes",
    ingredients: recipe.ingredients,
    instructions: recipe.instructions,
    difficulty: recipe.difficulty,
    isPublished: recipe.isPublished,
    createdAt: new Date().toISOString(),
  };

  return <RecipeDetail recipe={recipeData} viewMode={viewMode} />;
}
