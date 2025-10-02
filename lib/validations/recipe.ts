import { z } from "zod";

export const recipeSchema = z.object({
  title: z
    .string()
    .min(1, "Judul resep harus diisi")
    .max(200, "Judul maksimal 200 karakter"),
  description: z.string().optional(),
  ingredients: z
    .array(z.string().min(1, "Bahan tidak boleh kosong"))
    .min(1, "Minimal 1 bahan diperlukan"),
  instructions: z.string().min(1, "Instruksi harus diisi"),
  cookingTime: z
    .number()
    .int()
    .min(1, "Waktu memasak minimal 1 menit")
    .optional(),
  servings: z.number().int().min(1, "Porsi minimal 1").optional(),
  difficulty: z.enum(["Easy", "Medium", "Hard"]).default("Easy"),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().default(false),
});

export const createRecipeSchema = recipeSchema.omit({ isPublished: true });
export const updateRecipeSchema = recipeSchema.partial();

export type Recipe = z.infer<typeof recipeSchema>;
export type CreateRecipe = z.infer<typeof createRecipeSchema>;
export type UpdateRecipe = z.infer<typeof updateRecipeSchema>;
