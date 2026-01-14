"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SearchFilter from "@/components/ui/search-filter";
import Pagination from "@/components/ui/pagination";
import { useProducts, useDeleteProduct } from "@/lib/hooks";
import { toast } from "sonner";
import AlertDialog from "@/components/ui/alert-dialog";
import { useAuth } from "@/components/auth/auth-provider";

interface FruitType {
  id: string;
  slug: string;
  name: string;
  image: string | null;
  description: string | null;
  order?: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fruitTypes?: FruitType[];
}

export default function ProdukPage() {
  const router = useRouter();
  const { user } = useAuth();

  if (user && user.role !== "admin") {
    router.push("/dashboard");
    return null;
  }

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    category: "",
    isActive: "",
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set()
  );
  const [deleteDialog, setDeleteDialog] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
  });
  const [fruitTypeDeleteDialog, setFruitTypeDeleteDialog] = useState<{
    isOpen: boolean;
    fruitTypeId: string;
    fruitTypeName: string;
  }>({
    isOpen: false,
    fruitTypeId: "",
    fruitTypeName: "",
  });
  const [selectedFruitType, setSelectedFruitType] = useState<FruitType | null>(
    null
  );
  const [activeProductId, setActiveProductId] = useState<string | null>(null);

  const {
    data: fetchedProducts,
    loading,
    error,
    fetch: fetchProducts,
  } = useFetch<Product[]>([]);
  const { delete: deleteApi, update: updateApi } = useCrudApi();
  const [products, setProducts] = useState<Product[]>([]);

  /**
   * Setup drag and drop sensors with touch support
   *
   * PointerSensor: Handles mouse and touch drag events
   * - activationConstraint.distance: Requires 8px movement before drag starts
   *   This prevents accidental drags on touch devices and when clicking buttons
   *
   * KeyboardSensor: Enables keyboard-based drag and drop for accessibility
   * - Users can use arrow keys to reorder items
   * - Provides accessible alternative to mouse/touch dragging
   */
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Sync fetched products with local state
  useEffect(() => {
    if (fetchedProducts) {
      setProducts(fetchedProducts);
    }
  }, [fetchedProducts]);

  const { data, isLoading, error } = useProducts({
    page: currentPage,
    limit: 10,
    search: searchTerm,
  });

  const deleteProduct = useDeleteProduct();

  const products = (data?.data || []) as unknown as Product[];
  const pagination = data?.pagination;

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (itemToDelete) {
      try {
        await deleteProduct.mutateAsync(itemToDelete);
        toast.success("Produk berhasil dihapus");
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      } catch {
        toast.error("Gagal menghapus produk");
      }
    }
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleClearFilters = () => {
    setFilters({ category: "", isActive: "" });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Handle drag start event for products
   * Stores the active product ID to show drag overlay
   */
  const handleProductDragStart = (event: DragStartEvent) => {
    setActiveProductId(event.active.id as string);
  };

  /**
   * Handle drag end event for products
   *
   * Implements optimistic UI updates:
   * 1. Immediately updates the UI with new order
   * 2. Sends API request to persist the change
   * 3. Rolls back on error (handled by API hook)
   *
   * This provides instant feedback to users while ensuring data consistency
   */
  const handleProductDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    setActiveProductId(null);

    // No change if dropped in same position or invalid drop
    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = products.findIndex((p) => p.id === active.id);
    const newIndex = products.findIndex((p) => p.id === over.id);

    // Optimistic update: Update UI immediately before API call
    const newProducts = arrayMove(products, oldIndex, newIndex);
    setProducts(newProducts);

    // Update order in database
    try {
      const response = await fetch(`/api/products/${active.id}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newOrder: newIndex }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Show success toast
      const { toast } = await import("sonner");
      toast.success("Urutan berhasil diperbarui");
    } catch (error) {
      // Rollback on error
      setProducts(products);
      const { toast } = await import("sonner");
      toast.error("Gagal memperbarui urutan");
    }
  };

  const handleFruitTypeReorder = async (
    fruitTypeId: string,
    newOrder: number
  ) => {
    // Find the product that contains this fruit type
    const productIndex = products.findIndex((p) =>
      p.fruitTypes?.some((ft) => ft.id === fruitTypeId)
    );

    if (productIndex === -1) return;

    const product = products[productIndex];
    const fruitTypes = product.fruitTypes || [];

    const oldIndex = fruitTypes.findIndex((ft) => ft.id === fruitTypeId);
    if (oldIndex === -1) return;

    // Optimistic update
    const newFruitTypes = arrayMove(fruitTypes, oldIndex, newOrder);
    const newProducts = [...products];
    newProducts[productIndex] = {
      ...product,
      fruitTypes: newFruitTypes,
    };
    setProducts(newProducts);

    // Update order in database
    try {
      const response = await fetch(`/api/fruit-types/${fruitTypeId}/order`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newOrder }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order");
      }

      // Show success toast
      const { toast } = await import("sonner");
      toast.success("Urutan berhasil diperbarui");
    } catch (error) {
      // Rollback on error
      setProducts(products);
      const { toast } = await import("sonner");
      toast.error("Gagal memperbarui urutan");
    }
  };

  const filterOptions = [
    {
      label: "Kategori",
      key: "category",
      options: [
        { label: "Apel", value: "Apel" },
        { label: "Jeruk", value: "Jeruk" },
        { label: "Mangga", value: "Mangga" },
        { label: "Pisang", value: "Pisang" },
        { label: "Anggur", value: "Anggur" },
        { label: "Strawberry", value: "Strawberry" },
        { label: "Melon", value: "Melon" },
        { label: "Semangka", value: "Semangka" },
        { label: "Pepaya", value: "Pepaya" },
        { label: "Nanas", value: "Nanas" },
      ],
    },
    {
      label: "Status",
      key: "isActive",
      options: [
        { label: "Aktif", value: "true" },
        { label: "Nonaktif", value: "false" },
      ],
    },
  ];

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-red-600">Error loading products</div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-heading text-3xl font-bold text-slate-800">
          Manajemen Produk
        </h1>
        {user?.role === "admin" && (
          <Link
            href="/produk/tambah"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        )}
      </div>

        {/* Search & Filter */}
        <SearchFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          filters={filterOptions}
          activeFilters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          placeholder="Cari produk..."
        />

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Produk
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 flex-shrink-0">
                      {product.imageUrl ? (
                        <img
                          className="h-10 w-10 rounded-lg object-cover"
                          src={product.imageUrl}
                          alt={product.name}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-slate-200 flex items-center justify-center">
                          <span className="text-slate-500 text-xs">
                            No Image
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-slate-900">
                        {product.name}
                      </div>
                      <div className="text-sm text-slate-500">
                        {product.description}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      product.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {product.isActive ? "Aktif" : "Nonaktif"}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/produk/edit/${product.id}`}
                      className="text-primary hover:text-blue-700"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(product.id)}
                      className="text-red-600 hover:text-red-800"
                      disabled={deleteProduct.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {products.length === 0 && !isLoading && (
          <div className="text-center py-12">
            <div className="text-slate-500">
              {searchTerm || Object.values(filters).some((f) => f)
                ? "Tidak ada produk yang ditemukan"
                : "Belum ada produk"
            }
            description={
              searchTerm || Object.values(filters).some((f) => f)
                ? "Coba ubah kata kunci pencarian atau filter Anda"
                : "Mulai dengan menambahkan produk pertama Anda"
            }
            action={
              !searchTerm && !Object.values(filters).some((f) => f)
                ? {
                    label: "Tambah Produk Pertama",
                    onClick: () => router.push("/produk/tambah"),
                    icon: <Plus className="size-4 mr-2" />,
                  }
                : undefined
            }
          />
        )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          totalItems={pagination.totalCount}
          itemsPerPage={pagination.limit}
        />
      )}

      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Hapus Produk"
        description="Apakah Anda yakin ingin menghapus produk ini? Data yang dihapus tidak dapat dikembalikan."
        confirmLabel="Hapus"
        isDestructive={true}
        isLoading={deleteProduct.isPending}
      />
    </div>
  );
}
