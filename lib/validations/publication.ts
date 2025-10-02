import { z } from "zod";

export const publicationSchema = z.object({
  title: z
    .string()
    .min(1, "Judul publikasi harus diisi")
    .max(200, "Judul maksimal 200 karakter"),
  content: z.string().min(1, "Konten harus diisi"),
  excerpt: z.string().max(500, "Excerpt maksimal 500 karakter").optional(),
  author: z.string().min(1, "Nama author harus diisi"),
  category: z.string().min(1, "Kategori harus dipilih"),
  imageUrl: z
    .string()
    .url("URL gambar tidak valid")
    .optional()
    .or(z.literal("")),
  isPublished: z.boolean().default(false),
  publishedAt: z.date().optional(),
});

export const createPublicationSchema = publicationSchema.omit({
  isPublished: true,
  publishedAt: true,
});
export const updatePublicationSchema = publicationSchema.partial();

export type Publication = z.infer<typeof publicationSchema>;
export type CreatePublication = z.infer<typeof createPublicationSchema>;
export type UpdatePublication = z.infer<typeof updatePublicationSchema>;
