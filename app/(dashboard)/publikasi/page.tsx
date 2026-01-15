"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  usePublications,
  useDeletePublication,
  useUpdatePublication,
} from "@/lib/hooks";
import { toast } from "sonner";
import AlertDialog from "@/components/ui/alert-dialog";
import Switch from "@/components/ui/switch";
import { PublikasiPageSkeleton } from "@/components/publikasi-page-skeleton";

export default function PublikasiPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, _setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = usePublications({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  });

  const deletePublication = useDeletePublication();
  const updatePublication = useUpdatePublication();

  const publications = data?.data || [];

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deletePublication.mutateAsync(itemToDelete);
        toast.success("Publikasi berhasil dihapus");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch {
        toast.error("Gagal menghapus publikasi");
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updatePublication.mutateAsync({
        id,
        data: { isPublished: currentStatus },
      });
      toast.success(
        `Publikasi berhasil ${currentStatus ? "dipublikasikan" : "diarsipkan"}`
      );
    } catch {
      toast.error("Gagal mengubah status publikasi");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading publications</div>
      </div>
    );
  }

  if (isLoading) {
    return <PublikasiPageSkeleton />;
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
        {publications.map((publication) => (
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
                  {publication.isPublished && publication.publishedAt
                    ? `Dipublikasi: ${new Date(
                        publication.publishedAt
                      ).toLocaleDateString("id-ID")}`
                    : `Dibuat: ${new Date(
                        publication.createdAt
                      ).toLocaleDateString("id-ID")}`}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <Switch
                  checked={publication.isPublished}
                  onChange={(checked) =>
                    handleTogglePublish(publication.id, checked)
                  }
                  label={publication.isPublished ? "Published" : "Draft"}
                  disabled={updatePublication.isPending}
                />

                <div className="flex items-center gap-2">
                  <Link
                    href={`/publikasi/edit/${publication.id}`}
                    className="text-primary hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(publication.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={deletePublication.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {publications.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500">
            {searchTerm
              ? "Tidak ada publikasi yang ditemukan"
              : "Belum ada publikasi"}
          </div>
        </div>
      )}

      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Publikasi"
        description="Apakah Anda yakin ingin menghapus publikasi ini? Data yang dihapus tidak dapat dikembalikan."
        confirmLabel="Hapus"
        isDestructive={true}
        isLoading={deletePublication.isPending}
      />
    </div>
  );
}
