"use client";

import { useState, useEffect } from "react";
import { Plus, Search, Edit, Trash2, Clock, Users } from "lucide-react";
import Link from "next/link";
import { GridSkeleton } from "@/components/skeletons/list-skeleton";
import { useCrudApi } from "@/hooks/use-api";

// Mock data untuk sementara
const mockRecipes = [
  {
    id: "1",
    title: "Smoothie Bowl Mangga Naga",
    description:
      "Smoothie bowl segar dengan kombinasi mangga dan buah naga yang kaya nutrisi.",
    cookingTime: 15,
    servings: 2,
    difficulty: "Easy",
    imageUrl: null,
    isPublished: true,
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Salad Buah Tropis",
    description: "Salad buah segar dengan dressing madu dan jeruk nipis.",
    cookingTime: 20,
    servings: 4,
    difficulty: "Easy",
    imageUrl: null,
    isPublished: false,
    createdAt: "2024-01-14",
  },
  {
    id: "3",
    title: "Jus Detox Hijau",
    description: "Jus sehat dengan kombinasi sayuran hijau dan buah-buahan.",
    cookingTime: 10,
    servings: 1,
    difficulty: "Medium",
    imageUrl: null,
    isPublished: true,
    createdAt: "2024-01-13",
  },
];

export default function ResepPage() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch("/api/recipes");
      if (response.ok) {
        const data = await response.json();
        setRecipes(data);
      }
    } catch (error) {
      console.error("Failed to fetch recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const { delete: deleteApi } = useCrudApi();

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus resep "${title}"?`)) {
      return;
    }

    await deleteApi.execute(
      () =>
        fetch(`/api/recipes/${id}`, { method: "DELETE" }).then((res) => {
          if (!res.ok) throw new Error("Failed to delete recipe");
          return true;
        }),
      {
        successMessage: `Resep "${title}" berhasil dihapus`,
        onSuccess: () => {
          setRecipes(recipes.filter((r) => r.id !== id));
        },
      }
    );
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipe.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

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
        {filteredRecipes.map((recipe) => (
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
                  className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getDifficultyColor(
                    recipe.difficulty
                  )}`}
                >
                  {recipe.difficulty}
                </span>
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
                  <span>{recipe.cookingTime} menit</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3" />
                  <span>{recipe.servings} porsi</span>
                </div>
              </div>

              <div className="text-xs text-slate-500 mb-4">
                <p>
                  Dibuat:{" "}
                  {new Date(recipe.createdAt).toLocaleDateString("id-ID")}
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Link
                    href={`/resep/edit/${recipe.id}`}
                    className="text-primary hover:text-blue-700"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => handleDelete(recipe.id, recipe.title)}
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

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <div className="text-slate-500">
            {searchTerm ? "Tidak ada resep yang ditemukan" : "Belum ada resep"}
          </div>
        </div>
      )}
    </div>
  );
}
