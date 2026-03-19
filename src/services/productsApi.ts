import { axiosInstance } from "./axiosInstance";

export interface Product {
  id: number;
  name: string;
  price: number;
  img_url: string;
  description: string;
  category_id: number;
  type?: string;
  created_at: string;
}

export interface ProductPayload {
  name: string;
  price: number;
  description: string;
  img_url?: string;
  category_id: number;
  type?: string;
}

export const getProducts = async (): Promise<Product[]> => {
  const res = await axiosInstance.get("admin/products");
  return res.data;
};

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
  const res = await axiosInstance.post("admin/products", payload);
  return res.data;
};

export const updateProduct = async (
  id: number,
  payload: Partial<ProductPayload>
): Promise<Product> => {
  const res = await axiosInstance.put(`admin/products/${id}`, payload);
  return res.data;
};

export const deleteProduct = async (id: number): Promise<void> => {
  await axiosInstance.delete(`admin/products/${id}`);
};