import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PageLoader from "@/components/shared/page-loader";
import { useAuth } from "@/contexts/AuthContext";
import {
  createAdminService,
  deleteAdminService,
  getAllAdminsService,
  type StoreAdmin,
} from "@/api/services/adminService";

export default function StoreAccountsPage() {
  const { adminRoleId, user } = useAuth();
  const [admins, setAdmins] = useState<StoreAdmin[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  // Add Store Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [storeName, setStoreName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // Fetch All Store Admins
  const fetchAdmins = async () => {
    setLoading(true);
    try {
      const data = await getAllAdminsService();
      setAdmins(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to fetch store accounts!");
      } else {
        toast.error("Something went wrong while loading data.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  // Create Store Account
  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await createAdminService({
        storeName,
        email,
        password,
        roleId: adminRoleId,
      });
      toast.success(res?.message || "Store account created successfully!");
      setIsModalOpen(false);
      setStoreName("");
      setEmail("");
      setPassword("");
      await fetchAdmins();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to create store account!");
      } else {
        toast.error("Error creating store account.");
      }
      setLoading(false);
    }
  };

  // Delete Store Account
  const handleDelete = async (id: string, targetEmail: string) => {
    if (user?._id === id) {
      toast.warning("You cannot delete your own logged-in account!");
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete store account (${targetEmail})?`,
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await deleteAdminService(id);
      toast.success(res?.message || "Store account deleted successfully!");
      setAdmins((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to delete store account!");
      } else {
        toast.error("Error deleting store account.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageLoader loading={loading} />

      <div className="space-y-6">
        {/* Top Bar: Page Heading & Add Store Button */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-outfit text-2xl font-semibold text-gray-900 dark:text-white">
              Store Accounts
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage all PillsBag pharmacy store admin accounts.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
          >
            <svg
              className="size-4"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add Store
          </button>
        </div>

        {/* Table Card */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                  <th className="px-6 py-4">#</th>
                  <th className="px-6 py-4">Store Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-800">
                {admins.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No store accounts found.
                    </td>
                  </tr>
                ) : (
                  admins.map((admin, index) => (
                    <tr
                      key={admin._id}
                      className="transition hover:bg-gray-50/70 dark:hover:bg-white/2"
                    >
                      <td className="px-6 py-4 font-medium text-gray-600 dark:text-gray-400">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                        {admin.storeName ? (
                          <span className="inline-flex items-center gap-2">
                            <span className="size-2 rounded-full bg-brand-500" />
                            {admin.storeName}
                          </span>
                        ) : (
                          <span className="text-xs italic text-gray-400">
                            Main Admin (No Store)
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-4 text-gray-700 dark:text-gray-300">
                        {admin.email}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-md border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-medium capitalize text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-400">
                          {admin.roleId?.value || "admin"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500 dark:text-gray-400">
                        {admin.createdAt
                          ? new Date(admin.createdAt).toLocaleDateString("en-IN", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "—"}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(admin._id, admin.email)}
                          title="Delete Store Account"
                          className="inline-flex size-9 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
                        >
                          <svg
                            className="size-4"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M3 6h18" />
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                            <line x1="10" x2="10" y1="11" y2="17" />
                            <line x1="14" x2="14" y1="11" y2="17" />
                          </svg>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Store Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-outfit text-lg font-semibold text-gray-900 dark:text-white">
                Add New Store Account
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleAddStore} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  placeholder="e.g. Delhi Bypass Rohtak"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="store@pillsbag.com"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter store password"
                  className="h-11 w-full rounded-lg border border-gray-300 bg-transparent px-4 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-70"
                >
                  Create Store
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}