"use client";

import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createFruitTypeSchema,
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

export default function TambahJenisBuahPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.productId as string;

  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [productName, setProductName] = useState<string>("");
  const [loadingProduct, setLoadingProduct] = useState(true);
  const { create } = useCrudApi();

  const {
    register,
    handleSubmit,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createFruitTypeSchema),
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

  // Fetch product name for breadcrumb
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const data = await response.json();
          setProductName(data.name);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoadingProduct(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Auto-generate slug from name
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

      // Upload file if selected (required)
      if (uploadedFile) {
        setUploadLoading(true);
        try {
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

      if (!imageUrl) {
        setApiError("Gambar harus diisi");
        return;
      }

      await create.execute(
        () =>
          fetch("/api/fruit-types", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...data,
              image: imageUrl,
              productId: productId,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Gagal menambah jenis buah");
            }
            return res.json();
          }),
        {
          successMessage: `Jenis buah "${data.name}" berhasil ditambahkan`,
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

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs sm:text-sm text-slate-600 overflow-x-auto">
        <Link href="/produk" className="hover:text-slate-800 whitespace-nowrap">
          Produk
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate max-w-[150px] sm:max-w-none">
          {loadingProduct ? "..." : productName}
        </span>
        <span>/</span>
        <span className="text-slate-800 font-medium whitespace-nowrap">
          Tambah Jenis Buah
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
          Tambah Jenis Buah Baru
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
              disabled={create.loading || uploadLoading}
              className="min-h-[44px] w-full sm:w-auto"
            >
              {uploadLoading
                ? "Mengupload..."
                : create.loading
                ? "Menyimpan..."
                : "Simpan Jenis Buah"}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.name || "Jenis Buah Baru"}
      >
        <FruitTypePreview
          fruitType={{
            ...formData,
            image: uploadedFile
              ? URL.createObjectURL(uploadedFile)
              : formData.image,
          }}
        />
      </PreviewModal>
    </div>
  );
}
