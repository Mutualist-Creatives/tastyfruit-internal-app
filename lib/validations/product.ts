import { z } from "zod";

export const productSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk harus diisi")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z.string().optional(),
  category: z.string().min(1, "Kategori harus dipilih"),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const createProductSchema = z.object({
  name: z
    .string()
    .min(1, "Nama produk harus diisi")
    .max(100, "Nama produk maksimal 100 karakter"),
  description: z.string().optional(),
  category: z.string().min(1, "Kategori harus dipilih"),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  isActive: z.boolean().default(true),
});
export const updateProductSchema = productSchema.partial();

export type Product = z.infer<typeof productSchema>;
export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;
