import { z } from "zod";

export const fruitTypeSchema = z.object({
  name: z
    .string()
    .min(3, "Nama jenis buah minimal 3 karakter")
    .max(100, "Nama jenis buah maksimal 100 karakter"),
  slug: z
    .string()
    .min(1, "Slug harus diisi")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug harus lowercase dan menggunakan tanda hubung"
    ),
  description: z.string().optional(),
  image: z.string().min(1, "Gambar harus diisi"),
  productId: z.string().min(1, "Product ID harus diisi"),
});

export const createFruitTypeSchema = fruitTypeSchema;
export const updateFruitTypeSchema = fruitTypeSchema.partial().extend({
  productId: z.string().min(1, "Product ID harus diisi"),
});

export type FruitType = z.infer<typeof fruitTypeSchema>;
export type CreateFruitType = z.infer<typeof createFruitTypeSchema>;
export type UpdateFruitType = z.infer<typeof updateFruitTypeSchema>;

// Utility function to generate slug from name
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
