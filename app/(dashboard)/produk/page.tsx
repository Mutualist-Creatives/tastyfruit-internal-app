"use client"; // Tambahkan ini di baris paling atas

import { useState } from "react";
import { PlusCircle, FilePenLine, Trash2 } from "lucide-react";
import ProductFormModal from "@/components/product-form-modal";

const dummyProducts = [
  // ... (data dummy produk Anda tetap sama)
  {
    id: "PROD-001",
    name: "Apel Fuji Premium",
    category: "Buah Segar",
    price: "Rp 25.000",
    stock: 150,
  },
  {
    id: "PROD-002",
    name: "Jus Mangga Asli 500ml",
    category: "Minuman",
    price: "Rp 15.000",
    stock: 80,
  },
  {
    id: "PROD-003",
    name: "Salad Buah Komplit",
    category: "Makanan Siap Saji",
    price: "Rp 35.000",
    stock: 45,
  },
  {
    id: "PROD-004",
    name: "Pisang Cavendish",
    category: "Buah Segar",
    price: "Rp 22.000",
    stock: 210,
  },
];

export default function ProdukPage() {
  // STATE untuk mengontrol visibilitas modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Nanti kita akan tambah state lagi untuk edit & delete

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div>
      {/* Header Halaman */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-slate-800">Manajemen Produk</h1>
        {/* MODIFIKASI: Tambahkan onClick */}
        <button
          onClick={openModal}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-blue-700"
        >
          <PlusCircle className="h-5 w-5" />
          <span>Tambah Produk</span>
        </button>
      </div>

      {/* Tabel Data Produk */}
      <div className="overflow-x-auto rounded-lg border bg-white shadow-sm">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase text-slate-700">
            {/* ... (konten thead tetap sama) ... */}
            <tr>
              <th scope="col" className="px-6 py-3">
                Nama Produk
              </th>
              <th scope="col" className="px-6 py-3">
                Kategori
              </th>
              <th scope="col" className="px-6 py-3">
                Harga
              </th>
              <th scope="col" className="px-6 py-3">
                Stok
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyProducts.map((product) => (
              <tr
                key={product.id}
                className="border-b bg-white hover:bg-slate-50"
              >
                <th
                  scope="row"
                  className="whitespace-nowrap px-6 py-4 font-medium text-slate-900"
                >
                  {product.name}
                </th>
                <td className="px-6 py-4">{product.category}</td>
                <td className="px-6 py-4">{product.price}</td>
                <td className="px-6 py-4">{product.stock}</td>
                <td className="flex items-center justify-center gap-2 px-6 py-4">
                  {/* MODIFIKASI: Tambahkan onClick */}
                  <button
                    onClick={openModal}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <FilePenLine className="h-5 w-5" />
                  </button>
                  <button className="text-red-600 hover:text-red-800">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* RENDER MODAL: Letakkan di luar elemen utama */}
      <ProductFormModal
        isOpen={isModalOpen}
        onClose={closeModal}
        title="Tambah Produk Baru"
      />
    </div>
  );
}
