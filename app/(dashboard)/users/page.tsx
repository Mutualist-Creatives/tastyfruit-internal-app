"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Search, Edit, Trash } from "lucide-react";
import { toast } from "sonner";
import { usersApi, User } from "@/lib/api-client";
import { useAuth } from "@/components/auth/auth-provider";
import AlertDialog from "@/components/ui/alert-dialog";
import { UsersPageSkeleton } from "@/components/users-page-skeleton";

export default function UsersPage() {
  const { user: currentUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });

  // Delete dialog state
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);

  useEffect(() => {
    // Redirect if not admin
    if (currentUser && currentUser.role !== "admin") {
      router.push("/dashboard");
      toast.error("Anda tidak memiliki akses ke halaman ini");
    }
  }, [currentUser, router]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getAll({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm,
      });
      if (response.success) {
        setUsers(response.data);
        setPagination({
          page: response.pagination.page,
          limit: response.pagination.limit,
          total: response.pagination.totalCount,
          totalPages: response.pagination.totalPages,
        });
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      toast.error("Gagal memuat data user");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.role === "admin") {
      fetchUsers();
    }
  }, [pagination.page, searchTerm, currentUser]); // Debounce search in real app

  const confirmDelete = (id: string) => {
    setUserToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await usersApi.delete(userToDelete);
      toast.success("User berhasil dihapus");
      fetchUsers(); // Refresh list
    } catch (error: any) {
      console.error("Failed to delete user:", error);
      toast.error(error.message || "Gagal menghapus user");
    } finally {
      setDeleteDialogOpen(false);
      setUserToDelete(null);
    }
  };

  if (!currentUser || currentUser.role !== "admin") {
    return null; // Don't render anything while redirecting
  }

  if (loading) {
    return <UsersPageSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Users</h1>
          <p className="mt-2 text-slate-600">Kelola data pengguna aplikasi</p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/users/tambah"
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            <Plus className="h-4 w-4" />
            Tambah User
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 bg-white p-4 rounded-lg border shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari user..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border-slate-300 pl-10 focus:border-primary focus:ring-primary sm:text-sm py-2 border"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  Nama
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  Role
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-slate-500"
                >
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center">
                    <p className="text-slate-500">Belum ada data user</p>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-slate-900">
                        {user.name || "-"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-slate-500">
                      {user.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/users/edit/${user.id}`}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => confirmDelete(user.id)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-600"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleDelete}
        title="Hapus User"
        description="Apakah Anda yakin ingin menghapus user ini? Tindakan ini tidak dapat dibatalkan."
        confirmLabel="Hapus"
        cancelLabel="Batal"
        isDestructive={true}
      />
    </div>
  );
}
