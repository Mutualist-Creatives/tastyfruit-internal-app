"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { ChevronLeft, Loader2 } from "lucide-react";
import { usersApi } from "@/lib/api-client";
import { useAuth } from "@/components/auth/auth-provider";

const createUserSchema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  role: z.enum(["admin", "user", "editor"]),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;

export default function AddUserPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      role: "user",
    },
  });

  // Redirect if not admin
  if (user && user.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const onSubmit = async (data: CreateUserFormData) => {
    try {
      setLoading(true);
      await usersApi.create(data);
      toast.success("User berhasil ditambahkan");
      router.push("/users");
    } catch (error: any) {
      console.error("Error creating user:", error);
      toast.error(error.message || "Gagal menambahkan user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/users"
          className="rounded-full p-2 hover:bg-slate-100 transition-colors"
        >
          <ChevronLeft className="h-6 w-6 text-slate-600" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tambah User</h1>
          <p className="text-slate-600">Buat akun pengguna baru</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                {...register("name")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                {...register("email")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="nama@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                {...register("password")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Minimal 6 karakter"
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Role
              </label>
              <select
                {...register("role")}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white"
              >
                <option value="admin">Admin</option>
                <option value="editor">Editor</option>
              </select>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.role.message}
                </p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
            <Link
              href="/users"
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Menyimpan..." : "Simpan User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
