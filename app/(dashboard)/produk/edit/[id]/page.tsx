"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { productSchema, type ProductFormData } from "@/lib/validations/product";
import FileUpload from "@/components/ui/file-upload";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { Trash, Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { use } from "react";
import { useProduct, useUpdateProduct } from "@/lib/hooks";
import { uploadApi } from "@/lib/api-client";
import { useAuth } from "@/components/auth/auth-provider";

export default function EditProdukPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);
  const { user } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  if (user && user.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const { data, isLoading, error } = useProduct(id);
  const updateProduct = useUpdateProduct();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      imageUrl: "",
      nutrition: {},
      variations: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variations",
  });

  // Populate form when data loads
  useEffect(() => {
    if (data?.data) {
      const product = data.data;
      reset({
        name: product.name,
        description: product.description || "",
        imageUrl: product.imageUrl || "",
        nutrition: (product.nutrition as Record<string, string>) || {},
        variations:
          product.fruitTypes?.map((ft) => ({
            id: ft.id,
            name: ft.name,
            image: ft.image,
            description: ft.description,
            slug: ft.slug,
          })) || [],
      });
    }
  }, [data, reset]);

  const handleImageUpload = async (file: File) => {
    try {
      const result = await uploadApi.uploadImage(file);
      setValue("imageUrl", result.data.url);
      toast.success("Gambar berhasil diupload");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengupload gambar");
    }
  };

  const handleVariationImageUpload = async (file: File, index: number) => {
    try {
      const result = await uploadApi.uploadImage(file);
      setValue(`variations.${index}.image`, result.data.url);
      toast.success("Gambar variasi berhasil diupload");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Gagal mengupload gambar variasi");
    }
  };

  const onSubmit = async (formData: ProductFormData) => {
    try {
      setSubmitting(true);
      await updateProduct.mutateAsync({ id, data: formData });
      toast.success("Produk berhasil diperbarui");
      router.push("/produk");
    } catch (error: unknown) {
      console.error("Error updating product:", error);
      const message =
        error instanceof Error ? error.message : "Gagal memperbarui produk";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  const nutritionFields = [
    { name: "energi", label: "Energi" },
    { name: "lemak", label: "Lemak" },
    { name: "kolesterol", label: "Kolesterol" },
    { name: "serat", label: "Serat" },
    { name: "karbo", label: "Karbohidrat" },
    { name: "protein", label: "Protein" },
    { name: "natrium", label: "Natrium" },
    { name: "magnesium", label: "Magnesium" },
    { name: "kalium", label: "Kalium" },
  ] as const;

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Produk tidak ditemukan</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 pb-20">
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/produk"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="font-medium">Kembali</span>
        </Link>
        <div className="w-px h-10 bg-slate-300 mx-2"></div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Edit Produk</h1>
          <p className="text-slate-600 mt-1">
            Perbarui informasi produk dan variasi
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Informasi Dasar
          </h2>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Nama Produk *
            </label>
            <input
              type="text"
              {...register("name")}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
              placeholder="Contoh: Apel Malang"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.name?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-900 mb-2">
              Deskripsi
            </label>
            <TiptapEditor
              content={watch("description") || ""}
              onChange={(html) => setValue("description", html)}
              placeholder="Deskripsi singkat produk..."
            />
          </div>
        </div>

        {/* Variations Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-slate-900">
              Variasi Produk
            </h2>
            <button
              type="button"
              onClick={() => append({ name: "", image: "", description: "" })}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100"
            >
              <Plus className="h-4 w-4" />
              Tambah Variasi
            </button>
          </div>

          {fields.map((field, index) => (
            <div
              key={field.id}
              className="bg-white rounded-lg shadow p-6 relative border border-gray-100"
            >
              <button
                type="button"
                onClick={() => remove(index)}
                className="absolute top-4 right-4 text-red-500 hover:bg-red-50 p-2 rounded-full"
              >
                <Trash className="h-4 w-4" />
              </button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">
                      Nama Variasi *
                    </label>
                    <input
                      type="text"
                      {...register(`variations.${index}.name` as const)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
                      placeholder="Contoh: Merah, Hijau, Besar"
                    />
                    {errors.variations?.[index]?.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.variations[index]?.name?.message}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-900 mb-1">
                      Deskripsi Variasi
                    </label>
                    <TiptapEditor
                      content={
                        watch(`variations.${index}.description` as const) || ""
                      }
                      onChange={(html) =>
                        setValue(
                          `variations.${index}.description` as const,
                          html
                        )
                      }
                      placeholder="Deskripsi variasi..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 mb-2">
                    Gambar Variasi *
                  </label>
                  <FileUpload
                    onFileSelect={(file) =>
                      file && handleVariationImageUpload(file, index)
                    }
                    onFileRemove={() =>
                      setValue(`variations.${index}.image`, "")
                    }
                    currentImageUrl={watch(`variations.${index}.image`)}
                    maxSize={5}
                  />
                  <input
                    type="hidden"
                    {...register(`variations.${index}.image` as const)}
                  />
                  {errors.variations?.[index]?.image && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.variations[index]?.image?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {fields.length === 0 && (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
              <p className="text-slate-500">Belum ada variasi ditambahkan</p>
            </div>
          )}
        </div>

        {/* Nutrition Section */}
        <div className="bg-white rounded-lg shadow p-6 space-y-6">
          <h2 className="text-xl font-semibold mb-4 text-slate-900">
            Kandungan Nutrisi (per 100g)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nutritionFields.map((field) => (
              <div key={field.name}>
                <label className="block text-sm font-medium text-slate-900 mb-1 capitalize">
                  {field.label}
                </label>
                <input
                  type="text"
                  {...register(`nutrition.${field.name}`)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-slate-900"
                  placeholder="e.g. 50 kcal"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-primary text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Menyimpan..." : "Simpan Perubahan"}
          </button>
          <Link
            href="/produk"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium text-center text-slate-700"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
