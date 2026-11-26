import api from "@/api/axios/axios";

export interface ChemistLocation {
  _id?: string;
  latitude: number;
  logitude: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ChemistRole {
  _id: string;
  value: string;
}

export interface Chemist {
  _id: string;
  email: string;
  shopName: string;
  phoneNumber: string;
  ownerName: string;
  shopAddress: string;
  city: string;
  state: string;
  pincode: string;
  areaLandmark: string;
  shopType: string;
  dlNumber?: string;
  gstin?: string;
  fasiNumber?: string;
  location?: ChemistLocation;
  roleId?: ChemistRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedChemistsResponse {
  chemists: Chemist[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ChemistPayload {
  email: string;
  password?: string;
  shopName: string;
  phoneNumber: string;
  ownerName: string;
  shopAddress: string;
  city: string;
  state: string;
  pincode: string;
  areaLandmark: string;
  shopType: string;
  dlNumber?: string;
  gstin?: string;
  fasiNumber?: string;
  location: {
    latitude: number;
    logitude: number;
  };
}

// 1. Get All Chemists (with Backend Search & Pagination)
export const getAllChemistsService = async (params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<PaginatedChemistsResponse> => {
  const response = await api.get<PaginatedChemistsResponse>(
    "/admin/getallchemists",
    { params },
  );
  return response.data;
};

// 2. Get Single Chemist By ID
export const getChemistByIdService = async (id: string): Promise<Chemist> => {
  const response = await api.get<Chemist>(`/admin/getchemists/${id}`);
  return response.data;
};

// 3. Create Chemist
export const createChemistService = async (payload: ChemistPayload) => {
  const response = await api.post("/admin/createchemists", payload);
  return response.data;
};

// 4. Update Chemist
export const updateChemistService = async (
  id: string,
  payload: Partial<ChemistPayload>,
) => {
  const response = await api.put(`/admin/updatechemists/${id}`, payload);
  return response.data;
};

// 5. Delete Chemist
export const deleteChemistService = async (id: string) => {
  const response = await api.delete(`/admin/deletechemists/${id}`);
  return response.data;
};