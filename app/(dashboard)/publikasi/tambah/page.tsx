"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { useCrudApi } from "@/hooks/use-api";
import PreviewModal from "@/components/ui/preview-modal";
import PublicationPreview from "@/components/preview/publication-preview";
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

export default function TambahPublikasiPage() {
  const router = useRouter();
  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { create } = useCrudApi();

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    imageUrl: "",
    isPublished: false,
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const value =
      e.target.type === "checkbox"
        ? (e.target as HTMLInputElement).checked
        : e.target.value;

    setFormData({
      ...formData,
      [e.target.name]: value,
    });
  };

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleFileRemove = () => {
    setUploadedFile(null);
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError("");

    try {
      let imageUrl = formData.imageUrl;

      // Upload file if selected
      if (uploadedFile) {
        setUploadLoading(true);
        try {
          const tempId = Date.now().toString();
          imageUrl = await storage.uploadPublicationImage(uploadedFile, tempId);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setApiError("Gagal mengupload gambar");
          return;
        } finally {
          setUploadLoading(false);
        }
      }

      await create.execute(
        () =>
          fetch("/api/publications", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              imageUrl,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Gagal menambah publikasi");
            }
            return res.json();
          }),
        {
          successMessage: `Publikasi "${formData.title}" berhasil ditambahkan`,
          onSuccess: () => {
            setTimeout(() => {
              router.push("/publikasi");
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
      <div className="flex items-center gap-4">
        <Link
          href="/publikasi"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Tambah Publikasi Baru
        </h1>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        {apiError && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <Label htmlFor="title" className="mb-2">
                Judul Publikasi *
              </Label>
              <Input
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Masukkan judul publikasi"
              />
            </div>

            <div>
              <Label htmlFor="author" className="mb-2">
                Author *
              </Label>
              <Input
                id="author"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="Nama author"
              />
            </div>

            <div>
              <Label htmlFor="category" className="mb-2">
                Kategori *
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, category: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Aktivitas">Aktivitas</SelectItem>
                  <SelectItem value="Produk">Produk</SelectItem>
                  <SelectItem value="Informasi">Informasi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <Label htmlFor="excerpt" className="mb-2">
              Excerpt (Ringkasan)
            </Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              placeholder="Ringkasan singkat publikasi (max 500 karakter)"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-slate-500">
              {formData.excerpt.length}/500 karakter
            </p>
          </div>

          {/* Content */}
          <div>
            <Label htmlFor="content" className="mb-2">
              Konten *
            </Label>
            <TiptapEditor
              content={formData.content}
              onChange={(html) => setFormData({ ...formData, content: html })}
              placeholder="Tulis konten publikasi..."
            />
            <p className="mt-1 text-xs text-slate-500">
              Gunakan toolbar untuk formatting teks
            </p>
          </div>

          {/* Image Upload */}
          <div>
            <Label htmlFor="image" className="mb-2">
              Gambar Cover
            </Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />
          </div>

          {/* Publish Status */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isPublished"
              name="isPublished"
              checked={formData.isPublished}
              onChange={handleChange}
              className="w-4 h-4 text-primary border-slate-300 rounded focus:ring-primary"
            />
            <label htmlFor="isPublished" className="text-sm text-slate-700">
              Publikasikan sekarang
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Button variant="ghost" asChild>
              <Link href="/publikasi">Batal</Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowPreview(true)}
            >
              <Eye className="h-4 w-4" />
              Preview
            </Button>
            <Button type="submit" disabled={create.loading || uploadLoading}>
              {uploadLoading
                ? "Mengupload..."
                : create.loading
                ? "Menyimpan..."
                : "Simpan Publikasi"}
            </Button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.title || "Publikasi Baru"}
      >
        <PublicationPreview
          publication={{
            ...formData,
            imageUrl: uploadedFile
              ? URL.createObjectURL(uploadedFile)
              : formData.imageUrl,
            createdAt: new Date().toISOString(),
          }}
        />
      </PreviewModal>
    </div>
  );
}
