"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { userSchema, type UserFormData } from "@/lib/validations/user";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function TambahUserPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      role: "editor",
    },
  });

  const onSubmit = async (data: UserFormData) => {
    try {
      setLoading(true);

      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create user");
      }

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
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah User Baru</h1>
        <p className="text-gray-600 mt-1">Buat akun admin atau editor baru</p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <div>
          <Label htmlFor="name" className="mb-2">
            Nama Lengkap *
          </Label>
          <Input
            id="name"
            type="text"
            {...register("name")}
            placeholder="John Doe"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="email" className="mb-2">
            Email *
          </Label>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@tastyfruit.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="mb-2">
            Password *
          </Label>
          <Input
            id="password"
            type="password"
            {...register("password")}
            placeholder="Minimal 8 karakter"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">
              {errors.password.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Password harus minimal 8 karakter
          </p>
        </div>

        <div>
          <Label htmlFor="role" className="mb-2">
            Role *
          </Label>
          <Controller
            name="role"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin - Full access</SelectItem>
                  <SelectItem value="editor">
                    Editor - Can create & edit
                  </SelectItem>
                  <SelectItem value="viewer">Viewer - Read only</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-medium text-blue-900 mb-2">Role Permissions:</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>
              • <strong>Admin:</strong> Full access - manage users, products,
              recipes, publications
            </li>
            <li>
              • <strong>Editor:</strong> Can create and edit content, cannot
              manage users
            </li>
            <li>
              • <strong>Viewer:</strong> Read-only access, cannot create or edit
            </li>
          </ul>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? "Menyimpan..." : "Simpan User"}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Batal
          </Button>
        </div>
      </form>
    </div>
  );
}
