"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
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
});

type FruitTypeFormData = z.infer<typeof fruitTypeSchema>;

export default function EditFruitTypePage() {
  const router = useRouter();
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [productName, setProductName] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
  } = useForm<FruitTypeFormData>({
    resolver: zodResolver(fruitTypeSchema),
  });

  useEffect(() => {
    fetchFruitType();
  }, [params.id]);

  const fetchFruitType = async () => {
    try {
      setFetching(true);
      const response = await fetch(`/api/fruit-types/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch fruit type");

      const data = await response.json();
      reset({
        name: data.name,
        slug: data.slug,
        description: data.description,
      });
      setCurrentImage(data.image);
      setProductName(data.product?.name || "");
    } catch (error) {
      console.error("Error fetching fruit type:", error);
      toast.error("Gagal memuat data fruit type");
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data: FruitTypeFormData) => {
    try {
      setLoading(true);

      let imageUrl = currentImage;

      // Upload new image if provided
      if (imageFile) {
        imageUrl = await storage.uploadFile(
          imageFile,
          "tastyfruit-uploads",
          `fruit-types/${params.id}-${imageFile.name}`
        );
      }

      const response = await fetch(`/api/fruit-types/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          image: imageUrl,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to update fruit type");
      }

      toast.success("Fruit type berhasil diupdate");
      router.push("/produk");
    } catch (error: any) {
      console.error("Error updating fruit type:", error);
      toast.error(error.message || "Gagal mengupdate fruit type");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Memuat data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Edit Fruit Type</h1>
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
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gambar
          </label>
          {currentImage && !imageFile && (
            <div className="mb-4">
              <img
                src={currentImage}
                alt="Current"
                className="w-32 h-32 object-cover rounded-lg"
              />
              <p className="text-sm text-gray-500 mt-2">Gambar saat ini</p>
            </div>
          )}
          <FileUpload
            onFileSelect={setImageFile}
            accept="image/*"
            maxSize={5 * 1024 * 1024}
          />
          <p className="mt-1 text-sm text-gray-500">
            Upload gambar baru untuk mengganti gambar saat ini
          </p>
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
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Update Fruit Type"}
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
