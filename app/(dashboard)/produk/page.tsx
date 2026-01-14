"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Edit, Trash2 } from "lucide-react";
import Link from "next/link";
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

  const filterOptions = [
    {
      label: "Kategori",
      key: "category",
      options: [
        { label: "Buah Segar", value: "Buah Segar" },
        { label: "Buah Kering", value: "Buah Kering" },
        { label: "Jus Buah", value: "Jus Buah" },
        { label: "Salad Buah", value: "Salad Buah" },
        { label: "Smoothie", value: "Smoothie" },
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
                : "Belum ada produk"}
            </div>
          </div>
        )}
      </div>

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
