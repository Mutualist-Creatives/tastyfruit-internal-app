import { z } from "zod";

export const nutritionSchema = z.object({
  energi: z.string().optional(),
  lemak: z.string().optional(),
  kolesterol: z.string().optional(),
  serat: z.string().optional(),
  karbo: z.string().optional(),
  protein: z.string().optional(),
  natrium: z.string().optional(),
  magnesium: z.string().optional(),
  kalium: z.string().optional(),
});

export const variationSchema = z.object({
  id: z.string().optional(), // Optional for new variations
  name: z.string().min(1, "Nama variasi wajib diisi"),
  image: z.string().min(1, "Gambar variasi wajib diisi"),
  description: z.string().optional(),
  slug: z.string().optional(), // Generated on server if missing
});

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk harus diisi")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  // New fields
  nutrition: nutritionSchema.optional(),
  variations: z.array(variationSchema).optional(),
});

export const createProductSchema = productSchema;
export const updateProductSchema = productSchema.partial();

export type ProductFormData = z.infer<typeof productSchema>;
export type NutritionFormData = z.infer<typeof nutritionSchema>;
export type VariationFormData = z.infer<typeof variationSchema>;
