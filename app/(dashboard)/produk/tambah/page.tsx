"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProductSchema } from "@/lib/validations/product";
import { useState } from "react";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { useCrudApi } from "@/hooks/use-api";
import { showToast } from "@/lib/toast";
import PreviewModal from "@/components/ui/preview-modal";
import ProductPreview from "@/components/preview/product-preview";
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
import { Textarea } from "@/components/ui/textarea";

export default function TambahProdukPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { create } = useCrudApi();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
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

  // Watch form data for preview
  const formData = watch();

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setValue("imageUrl", "");
  };

  const onSubmit = async (data: any) => {
    setApiError("");

    try {
      let imageUrl = data.imageUrl;

      // Upload file if selected
      if (uploadedFile) {
        setUploadLoading(true);
        try {
          // Generate temporary ID for file naming
          const tempId = Date.now().toString();
          imageUrl = await storage.uploadProductImage(uploadedFile, tempId);
        } catch (uploadError: any) {
          console.error("Upload error:", uploadError);
          if (uploadError.message?.includes("Bucket not found")) {
            setApiError(
              "Storage bucket belum dibuat. Silakan buat bucket 'images' di Supabase Storage atau gunakan URL gambar."
            );
          } else {
            setApiError(
              "Gagal mengupload gambar: " +
                (uploadError.message || "Unknown error")
            );
          }
          return;
        } finally {
          setUploadLoading(false);
        }
      }

      await create.execute(
        () =>
          fetch("/api/products", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              imageUrl,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Gagal menambah produk");
            }
            return res.json();
          }),
        {
          successMessage: `Produk "${data.name}" berhasil ditambahkan`,
          onSuccess: () => {
            // Delay navigation to allow toast to show
            setTimeout(() => {
              router.push("/produk");
            }, 1500);
          },
          onError: (error) => {
            setApiError(error.message || "Terjadi kesalahan");
          },
        }
      );
    } catch (error: any) {
      console.error("Error:", error);
      setApiError(error.message || "Terjadi kesalahan");
    }
  };

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
          Tambah Produk Baru
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
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
              className="min-h-[44px] w-full sm:w-auto"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              type="submit"
              disabled={create.loading || uploadLoading}
              className="min-h-[44px] w-full sm:w-auto"
            >
              {uploadLoading
                ? "Mengupload..."
                : create.loading
                ? "Menyimpan..."
                : "Simpan Produk"}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.name || "Produk Baru"}
      >
        <ProductPreview
          product={{
            ...formData,
            imageUrl: uploadedFile
              ? URL.createObjectURL(uploadedFile)
              : formData.imageUrl,
            isActive: formData.isActive ?? true,
          }}
        />
      </PreviewModal>
    </div>
  );
}
