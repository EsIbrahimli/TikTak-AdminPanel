const BASE_URL = "http://localhost:3000";

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/api/tiktak/admin/categories`);
  const data = await res.json();

  if (data.result) {
    return data.data.categories;
  }

  return [];
};

export const deleteCategory = async (id: number) => {
  await fetch(`${BASE_URL}/api/tiktak/admin/categories/${id}`, {
    method: "DELETE",
  });
};