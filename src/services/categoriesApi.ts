import { axiosInstance } from "./axiosInstance"

export interface Category {
	id: number
	name: string
	img_url: string
	description: string
	created_at: string
	updated_at?: string
}

export interface CategoryPayload {
	name: string
	description: string
	img_url?: string
}


export const getCategories = async (): Promise<Category[]> => {
	const res = await axiosInstance.get("admin/categories")
	return res.data
}

export const getCategoryById = async (id: number | string): Promise<Category> => {
	const res = await axiosInstance.get(`admin/categories/${id}`)
	return res.data
}

export const createCategory = async (payload: CategoryPayload): Promise<Category> => {
	const res = await axiosInstance.post("admin/category", payload)
	return res.data
}

export const updateCategory = async (
	id: number | string,
	payload: Partial<CategoryPayload>
): Promise<Category> => {
	const res = await axiosInstance.put(`admin/categories/${id}`, payload)
	return res.data
}

export const deleteCategory = async (id: number | string): Promise<void> => {
	const res= await axiosInstance.delete(`admin/categories/${id}`)
  return res.data
}
