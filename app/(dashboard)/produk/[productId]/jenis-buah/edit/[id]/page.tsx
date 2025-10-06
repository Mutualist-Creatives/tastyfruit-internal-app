"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateFruitTypeSchema,
  generateSlug,
} from "@/lib/validations/fruit-type";
import { useState, useEffect } from "react";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { useCrudApi } from "@/hooks/use-api";
import PreviewModal from "@/components/ui/preview-modal";
import FruitTypePreview from "@/components/preview/fruit-type-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function EditJenisBuahPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;
  const fruitTypeId = params.id as string;

  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [productName, setProductName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { update } = useCrudApi();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(updateFruitTypeSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: "",
      productId: productId,
    },
  });

  // Watch form data for preview and slug generation
  const formData = watch();
  const nameValue = watch("name");

  // Fetch existing fruit type data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch fruit type data
        const fruitTypeResponse = await fetch(
          `/api/fruit-types/${fruitTypeId}`
        );
        if (fruitTypeResponse.ok) {
          const fruitTypeData = await fruitTypeResponse.json();

          // Pre-fill form with existing data
          reset({
            name: fruitTypeData.name,
            slug: fruitTypeData.slug,
            description: fruitTypeData.description || "",
            image: fruitTypeData.image || "",
            productId: productId,
          });

          // Set product name from the fruit type data
          if (fruitTypeData.product) {
            setProductName(fruitTypeData.product.name);
          }
        } else {
          setApiError("Gagal memuat data jenis buah");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setApiError("Terjadi kesalahan saat memuat data");
      } finally {
        setLoading(false);
      }
    };

    if (fruitTypeId && productId) {
      fetchData();
    }
  }, [fruitTypeId, productId, reset]);

  // Auto-generate slug from name when name changes
  useEffect(() => {
    if (nameValue) {
      const slug = generateSlug(nameValue);
      setValue("slug", slug);
    }
  }, [nameValue, setValue]);

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setValue("image", "");
  };

  const onSubmit = async (data: any) => {
    setApiError("");

    try {
      let imageUrl = data.image;

      // Upload file if selected
      if (uploadedFile) {
        setUploadLoading(true);
        try {
          imageUrl = await storage.uploadProductImage(
            uploadedFile,
            fruitTypeId
          );
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

      if (!imageUrl) {
        setApiError("Gambar harus diisi");
        return;
      }

      await update.execute(
        () =>
          fetch(`/api/fruit-types/${fruitTypeId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              image: imageUrl,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Gagal mengupdate jenis buah");
            }
            return res.json();
          }),
        {
          successMessage: `Jenis buah "${data.name}" berhasil diupdate`,
          onSuccess: () => {
            setTimeout(() => {
              router.push(`/produk?expand=${productId}`);
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-slate-200 rounded w-1/3 mb-4"></div>
          <div className="h-12 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 overflow-x-auto">
        <Link href="/produk" className="hover:text-slate-800 whitespace-nowrap">
          Produk
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[150px] sm:max-w-none">
          {productName || "..."}
        </span>
        <span>/</span>
        <span className="text-slate-800 font-medium whitespace-nowrap">
          Edit Jenis Buah
        </span>
      </nav>

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
          Edit Jenis Buah
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
            {/* Nama Jenis Buah */}
            <div>
              <Label htmlFor="name" className="mb-2">
                Nama Jenis Buah *
              </Label>
              <Input
                id="name"
                {...register("name")}
                className={errors.name ? "border-red-300" : ""}
                placeholder="Masukkan nama jenis buah"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Slug */}
            <div>
              <Label htmlFor="slug" className="mb-2">
                Slug *
              </Label>
              <Input
                id="slug"
                {...register("slug")}
                className={errors.slug ? "border-red-300" : ""}
                placeholder="slug-otomatis-dari-nama"
              />
              <p className="mt-1 text-xs text-slate-500">
                Slug akan dibuat otomatis dari nama, tapi bisa diedit
              </p>
              {errors.slug && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          {/* Upload Gambar */}
          <div>
            <Label htmlFor="image" className="mb-2">
              Gambar Jenis Buah *
            </Label>

            {/* Show current image if exists */}
            {formData.image && !uploadedFile && (
              <div className="mb-4">
                <p className="text-sm text-slate-600 mb-2">Gambar saat ini:</p>
                <img
                  src={formData.image}
                  alt="Current"
                  className="w-32 h-32 object-cover rounded-lg border"
                />
              </div>
            )}

            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              className="mb-4"
            />

            {/* Alternative URL Input */}
            <div className="mt-4">
              <Label htmlFor="image" className="mb-2">
                Atau masukkan URL Gambar
              </Label>
              <Input
                type="url"
                id="image"
                {...register("image")}
                className={errors.image ? "border-red-300" : ""}
                placeholder="https://example.com/image.jpg"
                disabled={!!uploadedFile}
              />
              {errors.image && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.image.message}
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
                  placeholder="Tulis deskripsi jenis buah..."
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
              disabled={update.loading || uploadLoading}
              className="min-h-[44px] w-full sm:w-auto"
            >
              {uploadLoading
                ? "Mengupload..."
                : update.loading
                ? "Menyimpan..."
                : "Update Jenis Buah"}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.name || "Jenis Buah"}
      >
        <FruitTypePreview
          fruitType={{
            name: formData.name || "",
            slug: formData.slug || "",
            description: formData.description,
            image: uploadedFile
              ? URL.createObjectURL(uploadedFile)
              : formData.image || "",
          }}
        />
      </PreviewModal>
    </div>
  );
}
