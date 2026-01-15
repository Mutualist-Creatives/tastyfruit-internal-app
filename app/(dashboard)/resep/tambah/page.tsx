"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/ui/file-upload";
import { uploadApi } from "@/lib/api-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import TiptapEditor from "@/components/ui/tiptap-editor";
import PreviewModal from "@/components/ui/preview-modal";
import RecipePreview from "@/components/preview/recipe-preview";
import { useCreateRecipe } from "@/lib/hooks";
import { toast } from "sonner";

interface Ingredient {
  name: string;
  amount: string;
  note?: string;
}

interface InstructionStep {
  title: string;
  description: string;
}

export default function TambahResepPage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const createRecipe = useCreateRecipe();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    servings: "",
    cookingTime: "",
    author: "",
  });

  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", amount: "", note: "" },
  ]);

  const [instructions, setInstructions] = useState<InstructionStep[]>([
    { title: "", description: "" },
  ]);

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
    setFormData({ ...formData, imageUrl: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = formData.imageUrl;

      // Upload file if selected
      if (uploadedFile) {
        setUploadLoading(true);
        try {
          const result = await uploadApi.uploadImage(uploadedFile, "recipe");
          imageUrl = result.data.url;
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Gagal mengupload gambar");
          setUploadLoading(false);
          return;
        }
        setUploadLoading(false);
      }

      // Filter out empty ingredients and instructions
      const validIngredients = ingredients.filter(
        (ing) => ing.name && ing.amount
      );
      const validInstructions = instructions.filter(
        (inst) => inst.title && inst.description
      );

      await createRecipe.mutateAsync({
        ...formData,
        imageUrl,
        ingredients: validIngredients,
        instructions: validInstructions,
      });

      toast.success("Resep berhasil dibuat");
      router.push("/resep");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Gagal membuat resep");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link
          href="/resep"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="h-6 w-6" />
          <span className="font-medium">Kembali</span>
        </Link>
        <div className="w-px h-10 bg-slate-300 mx-2"></div>
        <div>
          <h1 className="text-3xl font-bold text-slate-900">
            Tambah Resep Baru
          </h1>
          <p className="text-slate-600 mt-1">Buat resep baru</p>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Judul Resep *
              </label>
              <Input
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Masukkan judul resep"
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
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="mb-2">
              Deskripsi
            </Label>
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
            <Label htmlFor="image" className="mb-2">
              Gambar Resep
            </Label>
            <FileUpload
              onFileSelect={handleFileSelect}
              onFileRemove={handleFileRemove}
            />
          </div>

          {/* Ingredients */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="mb-2">Bahan-bahan *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addIngredient}
              >
                <Plus className="h-4 w-4" />
                Tambah Bahan
              </Button>
            </div>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    placeholder="Nama bahan"
                    value={ingredient.name}
                    onChange={(e) =>
                      updateIngredient(index, "name", e.target.value)
                    }
                    className="flex-1"
                  />
                  <Input
                    placeholder="Jumlah"
                    value={ingredient.amount}
                    onChange={(e) =>
                      updateIngredient(index, "amount", e.target.value)
                    }
                    className="w-32"
                  />
                  <Input
                    placeholder="Catatan (optional)"
                    value={ingredient.note}
                    onChange={(e) =>
                      updateIngredient(index, "note", e.target.value)
                    }
                    className="flex-1"
                  />
                  {ingredients.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeIngredient(index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Instructions */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="mb-2">Langkah-langkah *</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={addInstruction}
              >
                <Plus className="h-4 w-4" />
                Tambah Langkah
              </Button>
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
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => removeInstruction(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                  <Input
                    placeholder="Judul langkah"
                    value={instruction.title}
                    onChange={(e) =>
                      updateInstruction(index, "title", e.target.value)
                    }
                    className="mb-2"
                  />
                  <Textarea
                    placeholder="Deskripsi langkah"
                    rows={2}
                    value={instruction.description}
                    onChange={(e) =>
                      updateInstruction(index, "description", e.target.value)
                    }
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
              disabled={createRecipe.isPending || uploadLoading}
              className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {uploadLoading
                ? "Mengupload..."
                : createRecipe.isPending
                ? "Menyimpan..."
                : "Simpan Resep"}
            </button>
          </div>
        </form>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={showPreview}
        onClose={() => setShowPreview(false)}
        title={formData.title || "Resep Baru"}
      >
        <RecipePreview
          recipe={{
            ...formData,
            imageUrl: uploadedFile
              ? URL.createObjectURL(uploadedFile)
              : formData.imageUrl,
            ingredients: ingredients.filter((ing) => ing.name && ing.amount),
            instructions: instructions.filter(
              (inst) => inst.title && inst.description
            ),
            isPublished: false,
            difficulty: "Medium",
          }}
        />
      </PreviewModal>
    </div>
  );
}
