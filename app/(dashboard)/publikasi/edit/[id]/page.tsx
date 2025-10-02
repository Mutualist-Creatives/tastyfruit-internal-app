"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";

export default function EditPublikasiPage() {
  const router = useRouter();
  const params = useParams();
  const publicationId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    author: "",
    category: "",
    imageUrl: "",
    isPublished: false,
  });

  useEffect(() => {
    fetchPublication();
  }, [publicationId]);

  const fetchPublication = async () => {
    try {
      const response = await fetch(`/api/publications/${publicationId}`);
      if (response.ok) {
        const publication = await response.json();
        setFormData({
          title: publication.title,
          content: publication.content,
          excerpt: publication.excerpt || "",
          author: publication.author,
          category: publication.category,
          imageUrl: publication.imageUrl || "",
          isPublished: publication.isPublished,
        });
        setCurrentImageUrl(publication.imageUrl || "");
      } else {
        setApiError("Publikasi tidak ditemukan");
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("Gagal memuat data publikasi");
    } finally {
      setFetchLoading(false);
    }
  };

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
    setFormData({ ...formData, imageUrl: currentImageUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setApiError("");

    try {
      let imageUrl = formData.imageUrl;

      // Upload file if selected
      if (uploadedFile) {
        setUploadLoading(true);
        try {
          imageUrl = await storage.uploadPublicationImage(
            uploadedFile,
            publicationId
          );
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setApiError("Gagal mengupload gambar");
          return;
        } finally {
          setUploadLoading(false);
        }
      }

      const response = await fetch(`/api/publications/${publicationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      });

      if (response.ok) {
        router.push("/publikasi");
      } else {
        const errorData = await response.json();
        setApiError(errorData.error || "Gagal mengupdate publikasi");
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
          href="/publikasi"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Edit Publikasi
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
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Judul Publikasi *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Masukkan judul publikasi"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Author *
              </label>
              <input
                type="text"
                name="author"
                required
                value={formData.author}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Nama author"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Kategori *
              </label>
              <select
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">Pilih kategori</option>
                <option value="Event">Event</option>
                <option value="Aktivitas">Aktivitas</option>
                <option value="Produk">Produk</option>
                <option value="Informasi">Informasi</option>
              </select>
            </div>
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Excerpt (Ringkasan)
            </label>
            <textarea
              name="excerpt"
              rows={2}
              value={formData.excerpt}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Ringkasan singkat publikasi (max 500 karakter)"
              maxLength={500}
            />
            <p className="mt-1 text-xs text-slate-500">
              {formData.excerpt.length}/500 karakter
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Konten *
            </label>
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
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gambar Cover
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              currentImageUrl={currentImageUrl}
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
              Publikasikan
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/publikasi"
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
                : "Update Publikasi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
