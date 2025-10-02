"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { z } from "zod";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";

const fruitTypeSchema = z.object({
  slug: z.string().min(1, "Slug wajib diisi"),
  name: z.string().min(1, "Nama wajib diisi"),
  description: z.string().nullable().optional(),
  productId: z.string().min(1, "Product ID wajib diisi"),
});

type FruitTypeFormData = z.infer<typeof fruitTypeSchema>;

function TambahFruitTypeForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [productName, setProductName] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FruitTypeFormData>({
    resolver: zodResolver(fruitTypeSchema),
    defaultValues: {
      productId: productId || "",
    },
  });

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
      setValue("productId", productId);
    }
  }, [productId, setValue]);

  const fetchProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`);
      if (response.ok) {
        const data = await response.json();
        setProductName(data.name);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const onSubmit = async (data: FruitTypeFormData) => {
    try {
      setLoading(true);

      let imageUrl = null;

      // Upload image if provided
      if (imageFile) {
        const fruitTypeId = `ft-${Date.now()}`;
        imageUrl = await storage.uploadFile(
          imageFile,
          "tastyfruit-uploads",
          `fruit-types/${fruitTypeId}-${imageFile.name}`
        );
      }

      const response = await fetch("/api/fruit-types", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to create fruit type");
      }

      toast.success("Fruit type berhasil ditambahkan");
      router.push("/produk");
    } catch (error: any) {
      console.error("Error creating fruit type:", error);
      toast.error(error.message || "Gagal menambahkan fruit type");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Tambah Fruit Type</h1>
        {productName && (
          <p className="text-gray-600 mt-1">Untuk produk: {productName}</p>
        )}
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-lg shadow p-6 space-y-6"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Fruit Type *
          </label>
          <input
            type="text"
            {...register("name")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            placeholder="Tasty Fruit Volcana"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Slug *
          </label>
          <input
            type="text"
            {...register("slug")}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-gray-900"
            placeholder="tasty-fruit-volcana"
          />
          {errors.slug && (
            <p className="mt-1 text-sm text-red-600">{errors.slug.message}</p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            URL-friendly identifier (lowercase, no spaces)
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar
          </label>
          <FileUpload
            onFileSelect={setImageFile}
            accept="image/*"
            maxSize={5 * 1024 * 1024}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Deskripsi
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TiptapEditor
                content={field.value || ""}
                onChange={field.onChange}
                placeholder="Tulis deskripsi fruit type..."
              />
            )}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
          <p className="mt-1 text-sm text-gray-500">
            Gunakan toolbar untuk formatting teks
          </p>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Simpan Fruit Type"}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

export default function TambahFruitTypePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TambahFruitTypeForm />
    </Suspense>
  );
}
