import api from "@/api/axios/axios";

export interface RoleInfo {
  _id: string;
  name?: string;
  value: string;
}

export interface StoreAdmin {
  _id: string;
  email: string;
  storeName: string | null;
  fcmToken: string | null;
  roleId: RoleInfo;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateStorePayload {
  email: string;
  password: string;
  storeName: string;
  roleId: string;
}

// 1. Get All Store Admins
export const getAllAdminsService = async (): Promise<StoreAdmin[]> => {
  const response = await api.get<StoreAdmin[]>("/admin/getalladmins");
  return response.data;
};

// 2. Create New Store Admin (endpoint agar alag ho to yahan update kar lein)
export const createAdminService = async (payload: CreateStorePayload) => {
  const response = await api.post("/admin/createadmin", payload);
  return response.data;
};

// 3. Delete Store Admin (endpoint agar alag ho to yahan update kar lein)
export const deleteAdminService = async (id: string) => {
  const response = await api.delete(`/admin/deleteadmins/${id}`);
  return response.data;
};