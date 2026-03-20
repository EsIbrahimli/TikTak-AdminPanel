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

const VALID_PRODUCT_TYPES = new Set([
  "kg",
  "gr",
  "litre",
  "ml",
  "meter",
  "cm",
  "mm",
  "piece",
  "packet",
]);

const toBackendPayload = (payload: Partial<ProductPayload>) => {
  const mappedType =
    typeof payload.type === "string" && VALID_PRODUCT_TYPES.has(payload.type)
      ? payload.type
      : "piece";

  return {
    ...(payload.name !== undefined ? { title: payload.name } : {}),
    ...(payload.description !== undefined ? { description: payload.description } : {}),
    ...(payload.price !== undefined ? { price: String(payload.price) } : {}),
    ...(payload.category_id !== undefined ? { category_id: payload.category_id } : {}),
    ...(payload.img_url !== undefined ? { img_url: payload.img_url } : {}),
    type: mappedType,
  };
};

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
    const res = await axiosInstance.post("admin/product", toBackendPayload(payload));
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
    const res = await axiosInstance.put(`admin/products/${id}`, toBackendPayload(payload));
    console.log(`✓ updateProduct ${id} success:`, res.data);
    return res.data;
  } catch (err) {
    console.error(`✗ updateProduct ${id} error:`, err instanceof Error ? err.message : err);
    throw err;
  }
};

export const deleteProduct = async (id: number): Promise<void> => {
  try {
   const res = await axiosInstance.delete(`admin/products/${id}`);
    return res.data;
  } catch (err) {
    console.error(`✗ deleteProduct ${id} error:`, err instanceof Error ? err.message : err);
    throw err;
  }
};