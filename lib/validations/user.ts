import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(8, "Password minimal 8 karakter"),
  role: z.enum(["admin", "editor", "viewer"]).default("editor"),
});

export const updateUserSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter").optional(),
  email: z.string().email("Email tidak valid").optional(),
  password: z.string().min(8, "Password minimal 8 karakter").optional(),
  role: z.enum(["admin", "editor", "viewer"]).optional(),
});

export type UserFormData = z.infer<typeof userSchema>;
export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
