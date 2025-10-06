"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { GridSkeleton } from "@/components/skeletons/list-skeleton";
import { useCrudApi } from "@/hooks/use-api";

// Mock data untuk sementara
const mockPublications = [
  {
    id: "1",
    title: "Manfaat Buah Naga untuk Kesehatan",
    excerpt:
      "Buah naga kaya akan antioksidan dan vitamin C yang baik untuk sistem imun tubuh.",
    author: "Admin TastyFruit",
    category: "Kesehatan",
    isPublished: true,
    publishedAt: "2024-01-15",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Tips Memilih Buah Segar di Pasar",
    excerpt:
      "Panduan lengkap untuk memilih buah-buahan segar dengan kualitas terbaik.",
    author: "Admin TastyFruit",
    category: "Tips",
    isPublished: false,
    publishedAt: null,
    createdAt: "2024-01-14",
  },
];

export default function PublikasiPage() {
  const [publications, setPublications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPublications();
  }, []);

  const fetchPublications = async () => {
    try {
      const response = await fetch("/api/publications");
      if (response.ok) {
        const data = await response.json();
        setPublications(data);
      }
    } catch (error) {
      console.error("Failed to fetch publications:", error);
    } finally {
      setLoading(false);
    }
  };

  const { delete: deleteApi } = useCrudApi();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus publikasi "${title}"?`)) {
      return;
    }

    await deleteApi.execute(
      () =>
        fetch(`/api/publications/${id}`, { method: "DELETE" }).then((res) => {
          if (!res.ok) throw new Error("Failed to delete publication");
          return true;
        }),
      {
        successMessage: `Publikasi "${title}" berhasil dihapus`,
        onSuccess: () => {
          setPublications(publications.filter((p) => p.id !== id));
        },
      }
    );
  };

  const filteredPublications = publications.filter(
    (pub) =>
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-9 w-64 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Search Skeleton */}
        <div className="h-10 w-80 bg-gray-200 rounded animate-pulse"></div>

        {/* Grid Skeleton */}
        <GridSkeleton items={6} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Manajemen Publikasi
        </h1>
        <Link
          href="/publikasi/tambah"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Publikasi
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Cari publikasi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full max-w-md border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Publications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPublications.map((publication) => (
          <div
            key={publication.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                  {publication.category}
                </span>
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    publication.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {publication.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                {publication.title}
              </h3>

              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                {publication.excerpt}
              </p>

              <div className="text-xs text-slate-500 mb-4">
                <p>Oleh: {publication.author}</p>
                <p>
                  {publication.isPublished
                    ? `Dipublikasi: ${new Date(
                        publication.publishedAt!
                      ).toLocaleDateString("id-ID")}`
                    : `Dibuat: ${new Date(
                        publication.createdAt
                      ).toLocaleDateString("id-ID")}`}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="text-slate-600 hover:text-slate-800">
                    <Eye className="h-4 w-4" />
                  </button>
                  <Link
                    href={`/publikasi/edit/${publication.id}`}
                    className="text-primary hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() =>
                      handleDelete(publication.id, publication.title)
                    }
                    className="text-red-600 hover:text-red-800"
                    disabled={deleteApi.loading}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredPublications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500">
            {searchTerm
              ? "Tidak ada publikasi yang ditemukan"
              : "Belum ada publikasi"}
          </div>
        </div>
      )}
    </div>
  );
}
