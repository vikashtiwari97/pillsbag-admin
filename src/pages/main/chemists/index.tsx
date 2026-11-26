import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import PageLoader from "@/components/shared/page-loader";
import {
  createChemistService,
  deleteChemistService,
  getAllChemistsService,
  getChemistByIdService,
  updateChemistService,
  type Chemist,
  type ChemistPayload,
} from "@/api/services/chemistService";

interface FormState {
  shopName: string;
  ownerName: string;
  email: string;
  password: string;
  phoneNumber: string;
  shopType: string;
  dlNumber: string;
  gstin: string;
  fasiNumber: string;
  shopAddress: string;
  areaLandmark: string;
  city: string;
  state: string;
  pincode: string;
  latitude: string;
  logitude: string;
}

const initialFormState: FormState = {
  shopName: "",
  ownerName: "",
  email: "",
  password: "",
  phoneNumber: "",
  shopType: "Retail",
  dlNumber: "",
  gstin: "",
  fasiNumber: "",
  shopAddress: "",
  areaLandmark: "",
  city: "Rohtak",
  state: "Haryana",
  pincode: "",
  latitude: "28.8955",
  logitude: "76.6066",
};

export default function ChemistsPage() {
  const [chemists, setChemists] = useState<Chemist[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Add / Edit Modal States
  const [isFormModalOpen, setIsFormModalOpen] = useState<boolean>(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  // View Details Modal State
  const [viewChemist, setViewChemist] = useState<Chemist | null>(null);

  // Debounce search input for backend query
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch All Chemists with Pagination & Search
  const fetchChemists = async () => {
    setLoading(true);
    try {
      const res = await getAllChemistsService({
        page,
        limit,
        search: debouncedSearch || undefined,
      });
      setChemists(Array.isArray(res?.chemists) ? res.chemists : []);
      setTotal(res?.total ?? 0);
      setTotalPages(res?.totalPages ?? 1);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to load chemists!");
      } else {
        toast.error("Something went wrong while fetching chemists.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChemists();
  }, [page, debouncedSearch]);

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData(initialFormState);
    setIsFormModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = async (id: string) => {
    setLoading(true);
    try {
      const data = await getChemistByIdService(id);
      setEditingId(id);
      setFormData({
        shopName: data.shopName || "",
        ownerName: data.ownerName || "",
        email: data.email || "",
        password: "",
        phoneNumber: data.phoneNumber || "",
        shopType: data.shopType || "Retail",
        dlNumber: data.dlNumber || "",
        gstin: data.gstin || "",
        fasiNumber: data.fasiNumber || "",
        shopAddress: data.shopAddress || "",
        areaLandmark: data.areaLandmark || "",
        city: data.city || "",
        state: data.state || "",
        pincode: data.pincode || "",
        latitude: String(data.location?.latitude ?? "28.8955"),
        logitude: String(data.location?.logitude ?? "76.6066"),
      });
      setIsFormModalOpen(true);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(
          err.response?.data?.message || "Failed to fetch chemist details!",
        );
      } else {
        toast.error("Error loading chemist details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // View Full Details
  const handleViewDetails = async (id: string) => {
    setLoading(true);
    try {
      const data = await getChemistByIdService(id);
      setViewChemist(data);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to load details!");
      } else {
        toast.error("Error fetching details.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Submit Create or Update Form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload: ChemistPayload = {
      shopName: formData.shopName,
      ownerName: formData.ownerName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      shopType: formData.shopType,
      dlNumber: formData.dlNumber,
      gstin: formData.gstin || undefined,
      fasiNumber: formData.fasiNumber || undefined,
      shopAddress: formData.shopAddress,
      areaLandmark: formData.areaLandmark,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode,
      location: {
        latitude: Number(formData.latitude) || 0,
        logitude: Number(formData.logitude) || 0,
      },
    };

    if (!editingId) {
      payload.password = formData.password;
    } else if (formData.password.trim()) {
      payload.password = formData.password;
    }

    try {
      if (editingId) {
        const res = await updateChemistService(editingId, payload);
        toast.success(res?.message || "Chemist updated successfully!");
      } else {
        const res = await createChemistService(payload);
        toast.success(res?.message || "Chemist added successfully!");
      }
      setIsFormModalOpen(false);
      await fetchChemists();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Operation failed!");
      } else {
        toast.error("Something went wrong.");
      }
      setLoading(false);
    }
  };

  // Delete Chemist
  const handleDelete = async (id: string, shopName: string) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${shopName}"?`,
    );
    if (!confirmed) return;

    setLoading(true);
    try {
      const res = await deleteChemistService(id);
      toast.success(res?.message || "Chemist deleted successfully!");
      await fetchChemists();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        toast.error(err.response?.data?.message || "Failed to delete chemist!");
      } else {
        toast.error("Error deleting chemist.");
      }
      setLoading(false);
    }
  };

  return (
    <>
      <PageLoader loading={loading} />

      <div className="space-y-6">
        {/* Top Header & Actions */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-outfit text-2xl font-semibold text-gray-900 dark:text-white">
              Chemists Management
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Manage partner medical stores, licenses, and shop locations.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shop, owner, phone, city..."
              className="h-10.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-800 placeholder:text-gray-400 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden sm:w-64 dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
            />

            <button
              type="button"
              onClick={handleOpenCreate}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600"
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
              Add Chemist
            </button>
          </div>
        </div>

        {/* Chemists Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/3">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/80 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:border-gray-800 dark:bg-gray-900/50 dark:text-gray-400">
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Shop Name</th>
                  <th className="px-5 py-4">Owner & Contact</th>
                  <th className="px-5 py-4">License / GST</th>
                  <th className="px-5 py-4">Address & City</th>
                  <th className="px-5 py-4">Type</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-200 text-sm dark:divide-gray-800">
                {chemists.length === 0 && !loading ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-6 py-10 text-center text-gray-500 dark:text-gray-400"
                    >
                      No chemists found.
                    </td>
                  </tr>
                ) : (
                  chemists.map((chemist, index) => (
                    <tr
                      key={chemist._id}
                      className="transition hover:bg-gray-50/70 dark:hover:bg-white/2"
                    >
                      <td className="px-5 py-4 font-medium text-gray-600 dark:text-gray-400">
                        {(page - 1) * limit + index + 1}
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {chemist.shopName}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {chemist.email}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="font-medium text-gray-800 dark:text-gray-200">
                          {chemist.ownerName}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          +91 {chemist.phoneNumber}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="text-xs font-medium text-gray-800 dark:text-gray-200">
                          DL: {chemist.dlNumber || "—"}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          GST: {chemist.gstin || "—"}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="max-w-xs truncate text-gray-700 dark:text-gray-300">
                          {chemist.shopAddress}
                        </div>
                        <div className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                          {chemist.areaLandmark ? `${chemist.areaLandmark}, ` : ""}
                          {chemist.city} - {chemist.pincode}
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-md border border-brand-200 bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-400">
                          {chemist.shopType}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center justify-end gap-2">
                          {/* View Icon */}
                          <button
                            type="button"
                            onClick={() => handleViewDetails(chemist._id)}
                            title="View Details"
                            className="inline-flex size-8.5 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 text-gray-600 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
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
                              <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                              <circle cx="12" cy="12" r="3" />
                            </svg>
                          </button>

                          {/* Edit Icon */}
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(chemist._id)}
                            title="Edit Chemist"
                            className="inline-flex size-8.5 items-center justify-center rounded-lg border border-brand-200 bg-brand-50 text-brand-600 transition hover:bg-brand-100 dark:border-brand-500/30 dark:bg-brand-500/10 dark:text-brand-400 dark:hover:bg-brand-500/20"
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
                              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                              <path d="m15 5 4 4" />
                            </svg>
                          </button>

                          {/* Delete Icon */}
                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(chemist._id, chemist.shopName)
                            }
                            title="Delete Chemist"
                            className="inline-flex size-8.5 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 transition hover:bg-red-100 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400 dark:hover:bg-red-500/20"
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
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          <div className="flex flex-col items-center justify-between gap-3 border-t border-gray-200 px-5 py-3.5 text-sm sm:flex-row dark:border-gray-800">
            <span className="text-gray-500 dark:text-gray-400">
              Showing{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {chemists.length}
              </span>{" "}
              of{" "}
              <span className="font-medium text-gray-800 dark:text-white">
                {total}
              </span>{" "}
              chemists (Page {page} of {totalPages})
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-lg border border-gray-300 px-3.5 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add / Edit Chemist Modal */}
      {isFormModalOpen && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center overflow-y-auto bg-black/50 p-4 backdrop-blur-xs">
          <div className="my-8 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-5 flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-800">
              <h2 className="font-outfit text-lg font-semibold text-gray-900 dark:text-white">
                {editingId ? "Update Chemist Details" : "Add New Chemist"}
              </h2>
              <button
                type="button"
                onClick={() => setIsFormModalOpen(false)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Shop Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shopName}
                    onChange={(e) =>
                      setFormData({ ...formData, shopName: e.target.value })
                    }
                    placeholder="Pillsbag Medical Store"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Owner Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.ownerName}
                    onChange={(e) =>
                      setFormData({ ...formData, ownerName: e.target.value })
                    }
                    placeholder="Ramesh Kumar"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="chemist@pillsbag.com"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password{" "}
                    {editingId ? (
                      <span className="text-xs font-normal text-gray-400">
                        (Optional)
                      </span>
                    ) : (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="password"
                    required={!editingId}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    placeholder={
                      editingId ? "Leave blank to keep same" : "Enter password"
                    }
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phoneNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, phoneNumber: e.target.value })
                    }
                    placeholder="9896927060"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Shop Type <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.shopType}
                    onChange={(e) =>
                      setFormData({ ...formData, shopType: e.target.value })
                    }
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-white px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:bg-gray-900 dark:text-white/90"
                  >
                    <option value="Retail">Retail</option>
                    <option value="Wholesale">Wholesale</option>
                    <option value="Both">Both</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Drug License (DL Number){" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.dlNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, dlNumber: e.target.value })
                    }
                    placeholder="HR-RTK-20B-12345"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={formData.gstin}
                    onChange={(e) =>
                      setFormData({ ...formData, gstin: e.target.value })
                    }
                    placeholder="06AABCU9603R1ZM"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    FSSAI Number
                  </label>
                  <input
                    type="text"
                    value={formData.fasiNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, fasiNumber: e.target.value })
                    }
                    placeholder="10824005001234"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Shop Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.shopAddress}
                    onChange={(e) =>
                      setFormData({ ...formData, shopAddress: e.target.value })
                    }
                    placeholder="Shop 12, Sector 14 Market"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Area / Landmark <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.areaLandmark}
                    onChange={(e) =>
                      setFormData({ ...formData, areaLandmark: e.target.value })
                    }
                    placeholder="Near Civil Hospital"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                    placeholder="Rohtak"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    State <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.state}
                    onChange={(e) =>
                      setFormData({ ...formData, state: e.target.value })
                    }
                    placeholder="Haryana"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Pincode <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.pincode}
                    onChange={(e) =>
                      setFormData({ ...formData, pincode: e.target.value })
                    }
                    placeholder="124001"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) =>
                      setFormData({ ...formData, latitude: e.target.value })
                    }
                    placeholder="28.8955"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.logitude}
                    onChange={(e) =>
                      setFormData({ ...formData, logitude: e.target.value })
                    }
                    placeholder="76.6066"
                    className="h-10.5 w-full rounded-lg border border-gray-300 bg-transparent px-3.5 text-sm text-gray-800 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/12 focus:outline-hidden dark:border-gray-700 dark:text-white/90"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-gray-200 pt-4 dark:border-gray-800">
                <button
                  type="button"
                  onClick={() => setIsFormModalOpen(false)}
                  className="rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-medium text-white shadow-theme-xs transition hover:bg-brand-600 disabled:opacity-70"
                >
                  {editingId ? "Save Changes" : "Add Chemist"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Chemist Details Modal */}
      {viewChemist && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white p-6 shadow-xl dark:border-gray-800 dark:bg-gray-900">
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3 dark:border-gray-800">
              <h2 className="font-outfit text-lg font-semibold text-gray-900 dark:text-white">
                {viewChemist.shopName}
              </h2>
              <button
                type="button"
                onClick={() => setViewChemist(null)}
                className="rounded-lg p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Owner Name:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {viewChemist.ownerName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Email:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {viewChemist.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {viewChemist.phoneNumber}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shop Type:</span>
                <span className="font-medium text-brand-600 dark:text-brand-400">
                  {viewChemist.shopType}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">DL Number:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {viewChemist.dlNumber || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">GSTIN:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {viewChemist.gstin || "—"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">FSSAI Number:</span>
                <span className="font-medium text-gray-900 dark:text-white">
                  {viewChemist.fasiNumber || "—"}
                </span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="shrink-0 text-gray-500">Address:</span>
                <span className="text-right font-medium text-gray-900 dark:text-white">
                  {viewChemist.shopAddress}, {viewChemist.areaLandmark},{" "}
                  {viewChemist.city}, {viewChemist.state} -{" "}
                  {viewChemist.pincode}
                </span>
              </div>
              {viewChemist.location && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Coordinates:</span>
                  <span className="font-medium text-gray-900 dark:text-white">
                    {viewChemist.location.latitude},{" "}
                    {viewChemist.location.logitude}
                  </span>
                </div>
              )}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setViewChemist(null)}
                className="rounded-lg bg-brand-500 px-4 py-2 text-sm font-medium text-white hover:bg-brand-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}