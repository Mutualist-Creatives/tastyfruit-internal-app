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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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
    defaultValues: {
      name: "",
      description: "",
      category: "",
      imageUrl: "",
      isActive: true,
    },
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
          category: product.category,
          imageUrl: product.imageUrl || "",
          isActive: product.isActive ?? true,
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
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <Link
          href="/produk"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800 min-h-[44px]"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
          Edit Produk
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-4 sm:p-6">
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nama Produk */}
            <div>
              <Label htmlFor="name" className="mb-2">
                Nama Produk *
              </Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-red-300" : ""}
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
              <Label htmlFor="category" className="mb-2">
                Kategori *
              </Label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger
                      className={errors.category ? "border-red-300" : ""}
                    >
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Apel">Apel</SelectItem>
                      <SelectItem value="Jeruk">Jeruk</SelectItem>
                      <SelectItem value="Mangga">Mangga</SelectItem>
                      <SelectItem value="Pisang">Pisang</SelectItem>
                      <SelectItem value="Anggur">Anggur</SelectItem>
                      <SelectItem value="Strawberry">Strawberry</SelectItem>
                      <SelectItem value="Melon">Melon</SelectItem>
                      <SelectItem value="Semangka">Semangka</SelectItem>
                      <SelectItem value="Pepaya">Pepaya</SelectItem>
                      <SelectItem value="Nanas">Nanas</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <Label htmlFor="image" className="mb-2">
              Gambar Produk
            </Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              currentImageUrl={currentImageUrl}
              className="mb-4"
            />

            {/* Alternative URL Input */}
            <div className="mt-4">
              <Label htmlFor="imageUrl" className="mb-2">
                Atau masukkan URL Gambar
              </Label>
              <Input
                type="url"
                id="imageUrl"
                {...register("imageUrl")}
                className={errors.imageUrl ? "border-red-300" : ""}
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
            <Label htmlFor="description" className="mb-2">
              Deskripsi
            </Label>
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
          <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
            <Button
              variant="ghost"
              asChild
              className="min-h-[44px] w-full sm:w-auto"
            >
              <Link href="/produk">Batal</Link>
            </Button>
            <Button
              type="submit"
              disabled={loading || uploadLoading}
              className="min-h-[44px] w-full sm:w-auto"
            >
              {uploadLoading
                ? "Mengupload..."
                : loading
                ? "Menyimpan..."
                : "Update Produk"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
