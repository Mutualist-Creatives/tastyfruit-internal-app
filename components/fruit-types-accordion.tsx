"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2, Plus } from "lucide-react";
import { toast } from "sonner";

interface FruitType {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  description: string | null;
}

interface FruitTypesAccordionProps {
  productId: string;
  productName: string;
  fruitTypes: FruitType[];
  onUpdate: () => void;
}

export default function FruitTypesAccordion({
  productId,
  productName,
  fruitTypes,
  onUpdate,
}: FruitTypesAccordionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleDelete = async (fruitTypeId: string, fruitTypeName: string) => {
    if (!confirm(`Hapus fruit type "${fruitTypeName}"?`)) return;

    try {
      setDeleting(fruitTypeId);
      const response = await fetch(`/api/fruit-types/${fruitTypeId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete");
      }

      toast.success("Fruit type berhasil dihapus");
      onUpdate();
    } catch (error: any) {
      console.error("Error deleting fruit type:", error);
      toast.error(error.message || "Gagal menghapus fruit type");
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      {/* Accordion Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronDown className="h-4 w-4 text-slate-600" />
          ) : (
            <ChevronRight className="h-4 w-4 text-slate-600" />
          )}
          <span className="font-medium text-slate-700">
            Fruit Types ({fruitTypes.length})
          </span>
        </div>
        <span className="text-xs text-slate-500">{productName}</span>
      </button>

      {/* Accordion Content */}
      {isOpen && (
        <div className="p-4 bg-white">
          {fruitTypes.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>Belum ada fruit type</p>
              <p className="text-sm mt-1">
                Tambahkan fruit type untuk produk ini
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {fruitTypes.map((fruitType) => (
                <div
                  key={fruitType.id}
                  className="flex items-start gap-4 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                >
                  {/* Image */}
                  <div className="flex-shrink-0">
                    {fruitType.image ? (
                      <img
                        src={fruitType.image}
                        alt={fruitType.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-slate-200 rounded-lg flex items-center justify-center">
                        <span className="text-xs text-slate-500">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-slate-900">
                      {fruitType.name}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Slug: {fruitType.slug}
                    </p>
                    {fruitType.description && (
                      <p
                        className="text-sm text-slate-600 mt-2 line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: fruitType.description,
                        }}
                      />
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <a
                      href={`/produk/fruit-types/edit/${fruitType.id}`}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit"
                    >
                      <Edit className="h-4 w-4" />
                    </a>
                    <button
                      onClick={() => handleDelete(fruitType.id, fruitType.name)}
                      disabled={deleting === fruitType.id}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Add Button */}
          <div className="mt-4 pt-4 border-t">
            <a
              href={`/produk/fruit-types/tambah?productId=${productId}`}
              className="flex items-center justify-center gap-2 w-full px-4 py-2 border-2 border-dashed border-slate-300 rounded-lg text-slate-600 hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Tambah Fruit Type
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
