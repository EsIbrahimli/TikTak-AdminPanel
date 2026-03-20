import { axiosInstance } from "./axiosInstance";

export interface Product {
  id: number;
  name: string;
  price: number;
  img_url: string;
  description: string;
  category_id: number | string | null;
  category?: {
    id: number | string;
    name: string;
  };
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
  try {
    const res = await axiosInstance.get("admin/products");
    console.log("✓ getProducts success:", res.data);
    return res.data;
  } catch (err) {
    console.error("✗ getProducts error:", err instanceof Error ? err.message : err);
    throw err;
  }
};

export const createProduct = async (payload: ProductPayload): Promise<Product> => {
  try {
    console.log("► createProduct request:", payload);
    const res = await axiosInstance.post("admin/products", payload);
    console.log("✓ createProduct success:", res.data);
    return res.data;
  } catch (err) {
    console.error("✗ createProduct error:", err instanceof Error ? err.message : err);
    throw err;
  }
};

export const updateProduct = async (
  id: number,
  payload: Partial<ProductPayload>
): Promise<Product> => {
  try {
    console.log(`► updateProduct ${id} request:`, payload);
    const res = await axiosInstance.put(`admin/products/${id}`, payload);
    console.log(`✓ updateProduct ${id} success:`, res.data);
    return res.data;
  } catch (err) {
    console.error(`✗ updateProduct ${id} error:`, err instanceof Error ? err.message : err);
    throw err;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
    console.log(`► deleteProduct ${id} request`);
    await axiosInstance.delete(`admin/products/${id}`);
    console.log(`✓ deleteProduct ${id} success`);
  } catch (err) {
    console.error(`✗ deleteProduct ${id} error:`, err instanceof Error ? err.message : err);
    throw err;
  }
};