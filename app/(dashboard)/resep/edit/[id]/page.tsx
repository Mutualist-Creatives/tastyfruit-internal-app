"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";

interface Ingredient {
  name: string;
  amount: string;
  note?: string;
}

interface InstructionStep {
  title: string;
  description: string;
}

export default function EditResepPage() {
  const router = useRouter();
  const params = useParams();
  const recipeId = params.id as string;

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);
  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    servings: "",
    cookingTime: "",
    author: "",
    difficulty: "Easy",
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", note: "" },
  ]);

  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { title: "", description: "" },
  ]);

  useEffect(() => {
    fetchRecipe();
  }, [recipeId]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`/api/recipes/${recipeId}`);
      if (response.ok) {
        const recipe = await response.json();
        setFormData({
          title: recipe.title,
          description: recipe.description || "",
          imageUrl: recipe.imageUrl || "",
          servings: recipe.servings || "",
          cookingTime: recipe.cookingTime || "",
          author: recipe.author,
          difficulty: recipe.difficulty,
        });
        setCurrentImageUrl(recipe.imageUrl || "");

        // Parse JSON ingredients and instructions
        if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
          setIngredients(
            recipe.ingredients.length > 0
              ? recipe.ingredients
              : [{ name: "", amount: "", note: "" }]
          );
        }
        if (recipe.instructions && Array.isArray(recipe.instructions)) {
          setInstructions(
            recipe.instructions.length > 0
              ? recipe.instructions
              : [{ title: "", description: "" }]
          );
        }
      } else {
        setApiError("Resep tidak ditemukan");
      }
    } catch (error) {
      console.error("Error:", error);
      setApiError("Gagal memuat data resep");
    } finally {
      setFetchLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: "", amount: "", note: "" }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (
    index: number,
    field: keyof Ingredient,
    value: string
  ) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, { title: "", description: "" }]);
  };

  const removeInstruction = (index: number) => {
    setInstructions(instructions.filter((_, i) => i !== index));
  };

  const updateInstruction = (
    index: number,
    field: keyof InstructionStep,
    value: string
  ) => {
    const updated = [...instructions];
    updated[index][field] = value;
    setInstructions(updated);
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
          imageUrl = await storage.uploadRecipeImage(uploadedFile, recipeId);
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          setApiError("Gagal mengupload gambar");
          return;
        } finally {
          setUploadLoading(false);
        }
      }

      // Filter out empty ingredients and instructions
      const validIngredients = ingredients.filter(
        (ing) => ing.name && ing.amount
      );
      const validInstructions = instructions.filter(
        (inst) => inst.title && inst.description
      );

      const response = await fetch(`/api/recipes/${recipeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
          ingredients: validIngredients,
          instructions: validInstructions,
        }),
      });

      if (response.ok) {
        router.push("/resep");
      } else {
        const errorData = await response.json();
        setApiError(errorData.error || "Gagal mengupdate resep");
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
          href="/resep"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Edit Resep
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
                Judul Resep *
              </label>
              <input
                type="text"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Masukkan judul resep"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Porsi
              </label>
              <input
                type="text"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 4-6 orang"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Waktu Memasak
              </label>
              <input
                type="text"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., 30 menit"
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
                Tingkat Kesulitan
              </label>
              <select
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deskripsi
            </label>
            <TiptapEditor
              content={formData.description}
              onChange={(html) =>
                setFormData({ ...formData, description: html })
              }
              placeholder="Tulis deskripsi resep..."
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Gambar Resep
            </label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
              currentImageUrl={currentImageUrl}
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700">
                Bahan-bahan *
              </label>
              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-1 text-sm text-primary hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Tambah Bahan
              </button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Nama bahan"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, "name", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Jumlah"
                    value={ingredient.amount}
                    onChange={(e) =>
                      updateIngredient(index, "amount", e.target.value)
                    }
                    className="w-32 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <input
                    type="text"
                    placeholder="Catatan (optional)"
                    value={ingredient.note || ""}
                    onChange={(e) =>
                      updateIngredient(index, "note", e.target.value)
                    }
                    className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  {ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="block text-sm font-medium text-slate-700">
                Langkah-langkah *
              </label>
              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center gap-1 text-sm text-primary hover:text-blue-700"
              >
                <Plus className="h-4 w-4" />
                Tambah Langkah
              </button>
            </div>
            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div
                  key={index}
                  className="border border-slate-200 rounded-lg p-4"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-slate-700">
                      Langkah {index + 1}
                    </span>
                    {instructions.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeInstruction(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="Judul langkah"
                    value={instruction.title}
                    onChange={(e) =>
                      updateInstruction(index, "title", e.target.value)
                    }
                    className="w-full px-3 py-2 mb-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <textarea
                    placeholder="Deskripsi langkah"
                    rows={2}
                    value={instruction.description}
                    onChange={(e) =>
                      updateInstruction(index, "description", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4">
            <Link
              href="/resep"
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
                : "Update Resep"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
