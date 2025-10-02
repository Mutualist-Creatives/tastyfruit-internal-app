"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "@/lib/validations/product";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";

export default function EditProdukPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(createProductSchema),
  });

  useEffect(() => {
    fetchProduct();
  }, [productId]);

  const fetchProduct = async () => {
    try {
      const response = await fetch(`/api/products/${productId}`);
      if (response.ok) {
        const product = await response.json();
        reset({
          name: product.name,
          description: product.description || "",
          price: product.price,
          category: product.category,
          imageUrl: product.imageUrl || "",
          stock: product.stock,
        });
        setCurrentImageUrl(product.imageUrl || "");
      } else {
        setApiError("Produk tidak ditemukan");
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("Gagal memuat data produk");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setValue("imageUrl", currentImageUrl);
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    setApiError("");

    try {
      let imageUrl = data.imageUrl;

      // Upload file if selected
      if (uploadedFile) {
        setUploadLoading(true);
        try {
          imageUrl = await storage.uploadProductImage(uploadedFile, productId);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setApiError("Gagal mengupload gambar");
          return;
        } finally {
          setUploadLoading(false);
        }
      }

      const response = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          imageUrl,
        }),
      });

      if (response.ok) {
        router.push("/produk");
      } else {
        const errorData = await response.json();
        setApiError(errorData.error || "Gagal mengupdate produk");
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/produk"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Edit Produk
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Produk */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Nama Produk *
              </label>
              <input
                type="text"
                id="name"
                {...register("name")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.name ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="Masukkan nama produk"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Kategori */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Kategori *
              </label>
              <select
                id="category"
                {...register("category")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.category ? "border-red-300" : "border-slate-300"
                }`}
              >
                <option value="">Pilih kategori</option>
                <option value="Buah Segar">Buah Segar</option>
                <option value="Buah Kering">Buah Kering</option>
                <option value="Jus Buah">Jus Buah</option>
                <option value="Salad Buah">Salad Buah</option>
                <option value="Smoothie">Smoothie</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Harga */}
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Harga (Rp) *
              </label>
              <input
                type="number"
                id="price"
                min="0"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.price ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="0"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Stok */}
            <div>
              <label
                htmlFor="stock"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Stok
              </label>
              <input
                type="number"
                id="stock"
                min="0"
                {...register("stock", { valueAsNumber: true })}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.stock ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="0"
              />
              {errors.stock && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.stock.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gambar Produk
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              currentImageUrl={currentImageUrl}
              className="mb-4"
            />

            {/* Alternative URL Input */}
            <div className="mt-4">
              <label
                htmlFor="imageUrl"
                className="block text-sm font-medium text-slate-700 mb-2"
              >
                Atau masukkan URL Gambar
              </label>
              <input
                type="url"
                id="imageUrl"
                {...register("imageUrl")}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.imageUrl ? "border-red-300" : "border-slate-300"
                }`}
                placeholder="https://example.com/image.jpg"
                disabled={!!uploadedFile}
              />
              {errors.imageUrl && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.imageUrl.message}
                </p>
              )}
            </div>
          </div>

          {/* Deskripsi */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deskripsi
            </label>
            <Controller
              name="description"
              control={control}
              render={({ field }) => (
                <TiptapEditor
                  content={field.value || ""}
                  onChange={field.onChange}
                  placeholder="Tulis deskripsi produk..."
                />
              )}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/produk"
              className="px-4 py-2 text-slate-600 hover:text-slate-800"
            >
              Batal
            </Link>
            <button
              type="submit"
              disabled={loading || uploadLoading}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadLoading
                ? "Mengupload..."
                : loading
                ? "Menyimpan..."
                : "Update Produk"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
