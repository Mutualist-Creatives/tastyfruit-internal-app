"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Plus, X, Eye } from "lucide-react";
import Link from "next/link";
import FileUpload from "@/components/ui/file-upload";
import { storage } from "@/lib/supabase/storage";
import TiptapEditor from "@/components/ui/tiptap-editor";
import { useCrudApi } from "@/hooks/use-api";
import PreviewModal from "@/components/ui/preview-modal";
import RecipePreview from "@/components/preview/recipe-preview";
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
  const [apiError, setApiError] = useState<string>("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const { create } = useCrudApi();

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
    setApiError("");

    try {
      let imageUrl = formData.imageUrl;

      // Upload file if selected
      if (uploadedFile) {
        setUploadLoading(true);
        try {
          const tempId = Date.now().toString();
          imageUrl = await storage.uploadRecipeImage(uploadedFile, tempId);
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

      await create.execute(
        () =>
          fetch("/api/recipes", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...formData,
              imageUrl,
              ingredients: validIngredients,
              instructions: validInstructions,
            }),
          }).then(async (res) => {
            if (!res.ok) {
              const errorData = await res.json();
              throw new Error(errorData.error || "Gagal menambah resep");
            }
            return res.json();
          }),
        {
          successMessage: `Resep "${formData.title}" berhasil ditambahkan`,
          onSuccess: () => {
            setTimeout(() => {
              router.push("/resep");
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
          href="/resep"
          className="flex items-center gap-2 text-slate-600 hover:text-slate-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Link>
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Tambah Resep Baru
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
                Judul Resep *
              </Label>
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
              <Label htmlFor="servings" className="mb-2">
                Porsi
              </Label>
              <Input
                id="servings"
                name="servings"
                value={formData.servings}
                onChange={handleChange}
                placeholder="e.g., 4-6 orang"
              />
            </div>

            <div>
              <Label htmlFor="cookingTime" className="mb-2">
                Waktu Memasak
              </Label>
              <Input
                id="cookingTime"
                name="cookingTime"
                value={formData.cookingTime}
                onChange={handleChange}
                placeholder="e.g., 30 menit"
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
              <Label htmlFor="difficulty" className="mb-2">
                Tingkat Kesulitan
              </Label>
              <Select
                value={formData.difficulty}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, difficulty: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih tingkat kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
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
            <Button variant="ghost" asChild>
              <Link href="/resep">Batal</Link>
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
                : "Simpan Resep"}
            </Button>
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
          }}
        />
      </PreviewModal>
    </div>
  );
}
