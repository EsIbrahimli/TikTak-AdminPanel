import { useEffect, useState } from "react";
import { useCategoriesStore } from "../../common/store/useCategoriesStore";
import type { CategoryPayload } from "../../services/categoriesApi";
import styles from "./categories.module.css";
import Layout from "../../common/components/Layout/Layout";
import Button from "../../common/components/Button/Button";
import Pagination from "../../common/components/Pagination/Pagination";
import Loading from "../../common/components/Loading/Loading";
import CategoryFormModal from "./components/CategoryFormModal";
import DeleteCategoryModal from "./components/DeleteCategoryModal";
import { toast } from "react-toastify";


export default function Categories() {
  const {
    categories,
    fetchCategories,
    addCategory,
    editCategory,
    removeCategory,
    loading,
  } = useCategoriesStore();
  
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const safeCategories = Array.isArray(categories) ? categories : [];

  const totalItems = safeCategories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;
  const paginatedCategories = safeCategories.slice(startIndex, startIndex + itemsPerPage);
  const editingCategory =
    editingCategoryId === null
      ? null
      : safeCategories.find((category) => category.id === editingCategoryId) ?? null;
  const deletingCategory =
    deleteId === null
      ? null
      : safeCategories.find((category) => category.id === deleteId) ?? null;

  const handleCreate = async (payload: CategoryPayload) => {
    const { img_url, ...restPayload } = payload;
    const normalizedPayload: CategoryPayload = {
      ...restPayload,
      ...(img_url ? { img_url } : {}),
    };
    try {
      await addCategory(normalizedPayload);
      setIsCreateOpen(false);
      toast.success("Kateqoriya uğurla yaradıldı.");
    } catch {
      toast.error("Kateqoriya yaradılarkən xəta baş verdi.");
    }
  };

  const handleEdit = async (payload: CategoryPayload) => {
    if (editingCategoryId === null) {
      return;
    }

    const { img_url, ...restPayload } = payload;
    const normalizedPayload: CategoryPayload = {
      ...restPayload,
      ...(img_url ? { img_url } : {}),
    };

    try {
      await editCategory(editingCategoryId, normalizedPayload);
      setEditingCategoryId(null);
      toast.success("Kateqoriya uğurla yeniləndi.");
    } catch {
      toast.error("Kateqoriya yenilənərkən xəta baş verdi.");
    }
  };

  const handleDelete = async () => {
    if (deleteId === null) {
      return;
    }

    try {
      await removeCategory(deleteId);
      setDeleteId(null);
      toast.success("Kateqoriya uğurla silindi.");
    } catch {
      toast.error("Kateqoriya silinərkən xəta baş verdi.");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kateqoriyalar</h2>

          <div className={styles.actions}>
            <Button size="small" onClick={() => setIsCreateOpen(true)}>
              + Yeni Kateqoriya  
            </Button>
          </div>
        </div>

        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Şəkil</th>
                <th>Ad</th>
                <th>Açıqlama</th>
                <th>Tarix</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6}>
                    <Loading />
                  </td>
                </tr>
              ) : safeCategories.length === 0 ? (
                <tr>
                  <td colSpan={6}>Kateqoriya tapilmadi.</td>
                </tr>
              ) : (
                paginatedCategories.map((cat, index) => (
                  <tr key={cat.id}>
                    <td>{startIndex + index + 1}</td>
                    <td>
                      <img
                        src={cat.img_url}
                        alt={cat.name}
                        className={styles.image}
                      />
                    </td>
                    <td>{cat.name}</td>
                    <td className={styles.desc}>
                      {cat.description}
                    </td>
                    <td>
                      {new Date(cat.created_at).toLocaleDateString("az-AZ")}
                    </td>

                    <td className={styles.buttons}>
                      <button
                        className={styles.edit}
                        onClick={() => setEditingCategoryId(cat.id)}
                      >
                        Düzəlt
                      </button>

                      <button
                        className={styles.delete}
                        onClick={() => setDeleteId(cat.id)}
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.paginationRow}>
        
          <Pagination
            currentPage={safeCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />

        </div>
      </div>

      {isCreateOpen && (
        <CategoryFormModal
          isOpen={isCreateOpen}
          title="Yeni kateqoriya"
          submitLabel="Yarat"
          isSubmitting={loading}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingCategory !== null && (
        <CategoryFormModal
          isOpen={true}
          title="Kateqoriyanı düzəlt"
          submitLabel="Yadda saxla"
          initialValues={editingCategory}
          isSubmitting={loading}
          onClose={() => setEditingCategoryId(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingCategory !== null && (
        <DeleteCategoryModal
          isOpen={true}
          categoryName={deletingCategory.name}
          isSubmitting={loading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}

    </Layout>
  );
}