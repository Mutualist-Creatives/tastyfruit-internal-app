"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
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
import { ProductSection } from "@/components/product-section";
import { FruitTypeGrid } from "@/components/fruit-type-grid";
import { FruitTypeDetailModal } from "@/components/fruit-type-detail-modal";
import { ErrorState } from "@/components/error-states";
import { EmptyState } from "@/components/empty-state";
import ErrorBoundary from "@/components/error-boundary";
import { useFetch, useCrudApi } from "@/hooks/use-api";
import { ConfirmDialog } from "@/components/confirm-dialog";
import { ProductSectionSkeletonList } from "@/components/skeletons/product-section-skeleton";

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
  category: string;
  imageUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  fruitTypes?: FruitType[];
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export default function ProdukPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
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

  useEffect(() => {
    loadProducts();
  }, [currentPage, searchTerm, filters]);

  // Handle expand query parameter and default expansion
  useEffect(() => {
    const expandParam = searchParams.get("expand");

    if (expandParam && products && products.length > 0) {
      // Expand the section specified in the query parameter
      setExpandedSections(new Set([expandParam]));

      // Clear the query parameter from URL
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete("expand");
      window.history.replaceState({}, "", newUrl.toString());
    } else if (products && products.length > 0 && expandedSections.size === 0) {
      // Expand first section by default on initial load
      setExpandedSections(new Set([products[0].id]));
    }
  }, [products, searchParams]);

  const loadProducts = async () => {
    const params = new URLSearchParams({
      page: currentPage.toString(),
      limit: "10",
      search: searchTerm,
      category: filters.category,
      isActive: filters.isActive,
    });

    await fetchProducts(
      () =>
        fetch(`/api/products?${params}`).then(async (res) => {
          if (!res.ok) throw new Error("Failed to fetch products");
          const data = await res.json();
          setPagination(data.pagination);
          return data.products;
        }),
      {
        errorMessage: "Gagal memuat data produk",
        showErrorToast: false,
      }
    );
  };

  const handleDeleteClick = (id: string, name: string) => {
    setDeleteDialog({
      isOpen: true,
      productId: id,
      productName: name,
    });
  };

  const handleConfirmDelete = async () => {
    const { productId, productName } = deleteDialog;

    await deleteApi.execute(
      () =>
        fetch(`/api/products/${productId}`, { method: "DELETE" }).then(
          (res) => {
            if (!res.ok) throw new Error("Failed to delete product");
            return true;
          }
        ),
      {
        successMessage: `Produk "${productName}" berhasil dihapus`,
        onSuccess: () => {
          setDeleteDialog({ isOpen: false, productId: "", productName: "" });
          loadProducts();
        },
      }
    );
  };

  const handleToggleStatus = async (id: string, currentStatus: boolean) => {
    await updateApi.execute(
      () =>
        fetch(`/api/products/${id}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ isActive: !currentStatus }),
        }).then((res) => {
          if (!res.ok) throw new Error("Failed to update status");
          return res.json();
        }),
      {
        successMessage: `Status produk berhasil diubah`,
        onSuccess: () => {
          loadProducts();
        },
      }
    );
  };

  const handleToggleSection = (productId: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const handleViewFruitType = (fruitTypeId: string) => {
    // Find the fruit type from all products
    const fruitType = products
      ?.flatMap((p) => p.fruitTypes || [])
      .find((ft) => ft.id === fruitTypeId);

    if (fruitType) {
      setSelectedFruitType(fruitType);
    }
  };

  const handleEditFruitType = (fruitTypeId: string) => {
    // Find the product that contains this fruit type
    const product = products?.find((p) =>
      p.fruitTypes?.some((ft) => ft.id === fruitTypeId)
    );

    if (product) {
      router.push(`/produk/${product.id}/jenis-buah/edit/${fruitTypeId}`);
    }
  };

  const handleDeleteFruitTypeClick = (id: string, name: string) => {
    setFruitTypeDeleteDialog({
      isOpen: true,
      fruitTypeId: id,
      fruitTypeName: name,
    });
  };

  const handleConfirmDeleteFruitType = async () => {
    const { fruitTypeId, fruitTypeName } = fruitTypeDeleteDialog;

    await deleteApi.execute(
      () =>
        fetch(`/api/fruit-types/${fruitTypeId}`, { method: "DELETE" }).then(
          (res) => {
            if (!res.ok) throw new Error("Failed to delete fruit type");
            return true;
          }
        ),
      {
        successMessage: `Jenis buah "${fruitTypeName}" berhasil dihapus`,
        onSuccess: () => {
          setFruitTypeDeleteDialog({
            isOpen: false,
            fruitTypeId: "",
            fruitTypeName: "",
          });
          setSelectedFruitType(null);
          loadProducts();
        },
      }
    );
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
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

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center">
          <div className="h-9 w-64 bg-muted rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
        </div>

        {/* Search Filter Skeleton */}
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="h-10 flex-1 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
            <div className="h-10 w-32 bg-muted rounded animate-pulse"></div>
          </div>
        </div>

        {/* ProductSection Skeleton */}
        <ProductSectionSkeletonList count={3} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="font-heading text-3xl font-bold text-slate-800">
            Manajemen Produk
          </h1>
          <Link
            href="/produk/tambah"
            className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
        </div>

        <ErrorState
          title="Gagal Memuat Produk"
          message="Tidak dapat memuat data produk. Silakan coba lagi."
          onRetry={loadProducts}
        />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div id="main-content" className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-slate-800">
            Manajemen Produk
          </h1>
          <Link
            href="/produk/tambah"
            className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors min-h-[44px] w-full sm:w-auto"
          >
            <Plus className="h-4 w-4" />
            Tambah Produk
          </Link>
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

        {/* Products Card Sections */}
        {products && products.length > 0 ? (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleProductDragStart}
            onDragEnd={handleProductDragEnd}
          >
            <SortableContext
              items={products.map((p) => p.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {products.map((product) => (
                  <ProductSection
                    key={product.id}
                    product={{
                      id: product.id,
                      name: product.name,
                      category: product.category,
                      description: product.description || undefined,
                      imageUrl: product.imageUrl || undefined,
                      isActive: product.isActive,
                      order: 0, // Will be updated when drag and drop is implemented
                    }}
                    isExpanded={expandedSections.has(product.id)}
                    onToggle={() => handleToggleSection(product.id)}
                    onEdit={(id) => router.push(`/produk/edit/${id}`)}
                    onDelete={handleDeleteClick}
                    onToggleStatus={handleToggleStatus}
                  >
                    <FruitTypeGrid
                      productId={product.id}
                      fruitTypes={
                        product.fruitTypes?.map((ft) => ({
                          id: ft.id,
                          name: ft.name,
                          slug: ft.slug,
                          description: ft.description ?? undefined,
                          image: ft.image ?? "",
                          order: ft.order ?? 0,
                        })) || []
                      }
                      onView={handleViewFruitType}
                      onEdit={handleEditFruitType}
                      onDelete={handleDeleteFruitTypeClick}
                      onReorder={handleFruitTypeReorder}
                    />
                  </ProductSection>
                ))}
              </div>
            </SortableContext>
            <DragOverlay>
              {activeProductId ? (
                <div className="opacity-80 bg-white rounded-lg shadow-2xl p-4 border-2 border-primary">
                  <div className="font-semibold">
                    {products.find((p) => p.id === activeProductId)?.name}
                  </div>
                </div>
              ) : null}
            </DragOverlay>
          </DndContext>
        ) : (
          <EmptyState
            variant={
              searchTerm || Object.values(filters).some((f) => f)
                ? "no-results"
                : "no-data"
            }
            title={
              searchTerm || Object.values(filters).some((f) => f)
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

        {/* Delete Product Confirmation Dialog */}
        <ConfirmDialog
          isOpen={deleteDialog.isOpen}
          onClose={() =>
            setDeleteDialog({ isOpen: false, productId: "", productName: "" })
          }
          onConfirm={handleConfirmDelete}
          title="Hapus Produk?"
          description={`Produk "${deleteDialog.productName}" dan semua jenis buahnya akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          variant="destructive"
          isLoading={deleteApi.loading}
        />

        {/* Delete Fruit Type Confirmation Dialog */}
        <ConfirmDialog
          isOpen={fruitTypeDeleteDialog.isOpen}
          onClose={() =>
            setFruitTypeDeleteDialog({
              isOpen: false,
              fruitTypeId: "",
              fruitTypeName: "",
            })
          }
          onConfirm={handleConfirmDeleteFruitType}
          title="Hapus Jenis Buah?"
          description={`Jenis buah "${fruitTypeDeleteDialog.fruitTypeName}" akan dihapus permanen. Tindakan ini tidak dapat dibatalkan.`}
          confirmText="Hapus"
          cancelText="Batal"
          variant="destructive"
          isLoading={deleteApi.loading}
        />

        {/* Fruit Type Detail Modal */}
        {selectedFruitType && (
          <FruitTypeDetailModal
            fruitType={{
              id: selectedFruitType.id,
              name: selectedFruitType.name,
              slug: selectedFruitType.slug,
              description: selectedFruitType.description ?? undefined,
              image: selectedFruitType.image ?? "",
              order: selectedFruitType.order ?? 0,
            }}
            isOpen={!!selectedFruitType}
            onClose={() => setSelectedFruitType(null)}
            onEdit={handleEditFruitType}
            onDelete={handleDeleteFruitTypeClick}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}
