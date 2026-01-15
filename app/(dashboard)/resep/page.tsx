"use client";

import { useState } from "react";
import { Plus, Search, Edit, Trash2, Clock, Users } from "lucide-react";
import Link from "next/link";
import { useRecipes, useDeleteRecipe, useUpdateRecipe } from "@/lib/hooks";
import { toast } from "sonner";
import AlertDialog from "@/components/ui/alert-dialog";
import Switch from "@/components/ui/switch";
import { ResepPageSkeleton } from "@/components/resep-page-skeleton";

export default function ResepPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, _setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  const { data, isLoading, error } = useRecipes({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  });

  const deleteRecipe = useDeleteRecipe();
  const updateRecipe = useUpdateRecipe();

  const recipes = data?.data || [];

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteRecipe.mutateAsync(itemToDelete);
        toast.success("Resep berhasil dihapus");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch {
        toast.error("Gagal menghapus resep");
      }
    }
  };

  const handleTogglePublish = async (id: string, currentStatus: boolean) => {
    try {
      await updateRecipe.mutateAsync({
        id,
        data: { isPublished: currentStatus },
      });
      toast.success(
        `Resep berhasil ${currentStatus ? "dipublikasikan" : "diarsipkan"}`
      );
    } catch {
      toast.error("Gagal mengubah status resep");
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading recipes</div>
      </div>
    );
  }

  if (isLoading) {
    return <ResepPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Manajemen Resep
        </h1>
        <Link
          href="/resep/tambah"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Tambah Resep
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
        <input
          type="text"
          placeholder="Cari resep..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 pr-4 py-2 w-full max-w-md border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recipes.map((recipe) => (
          <div
            key={recipe.id}
            className="bg-white rounded-lg shadow-sm border overflow-hidden"
          >
            {/* Image placeholder */}
            <div className="h-48 bg-slate-200 flex items-center justify-center">
              {recipe.imageUrl ? (
                <img
                  src={recipe.imageUrl}
                  alt={recipe.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-slate-500">No Image</span>
              )}
            </div>

            <div className="p-6">
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    recipe.isPublished
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {recipe.isPublished ? "Published" : "Draft"}
                </span>
              </div>

              <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                {recipe.title}
              </h3>

              <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                {recipe.description}
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  <span>{recipe.cookingTime || "-"}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{recipe.servings || "-"} porsi</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-4">
                <p>
                  Dibuat:{" "}
                  {new Date(recipe.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <Switch
                  checked={recipe.isPublished}
                  onChange={(checked) =>
                    handleTogglePublish(recipe.id, checked)
                  }
                  label={recipe.isPublished ? "Published" : "Draft"}
                  disabled={updateRecipe.isPending}
                />

                <div className="flex items-center gap-2">
                  <Link
                    href={`/resep/edit/${recipe.id}`}
                    className="text-primary hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(recipe.id)}
                    className="text-red-600 hover:text-red-800"
                    disabled={deleteRecipe.isPending}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {recipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500">
            {searchTerm ? "Tidak ada resep yang ditemukan" : "Belum ada resep"}
          </div>
        </div>
      )}

      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Resep"
        description="Apakah Anda yakin ingin menghapus resep ini? Data yang dihapus tidak dapat dikembalikan."
        confirmLabel="Hapus"
        isDestructive={true}
        isLoading={deleteRecipe.isPending}
      />
    </div>
  );
}
