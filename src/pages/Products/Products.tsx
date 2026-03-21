import { useCallback, useEffect, useState } from "react";
import { useProductsStore } from "../../common/store/useProductStore";
import { useCategoriesStore } from "../../common/store/useCategoriesStore";
import type { Product, ProductPayload } from "../../services/productsApi";
import Layout from "../../common/components/Layout/Layout";
import Button from "../../common/components/Button/Button";
import Pagination from "../../common/components/Pagination/Pagination";
import Loading from "../../common/components/Loading/Loading";
import ProductFormModal from "./components/ProductFormModal";
import DeleteProductModal from "./components/DeleteProductModal";
import styles from "./Products.module.css";
import { toast } from "react-toastify";

const ITEMS_PER_PAGE = 5;

export default function Products() {
  const { products,
    loading,
    error,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct } =
    useProductsStore();
    
  const { categories, fetchCategories } = useCategoriesStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
  const page = Math.min(currentPage, totalPages);
  const start = (page - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(start, start + ITEMS_PER_PAGE);

  const editingProduct = products.find((p) => p.id === editingId) ?? null;
  const deletingProduct = products.find((p) => p.id === deleteId) ?? null;

  const getCategoryName = useCallback((product: Product) => {
    if (product.category?.name) return product.category.name;
    const categoryId = Number(product.category_id ?? product.category?.id);
    return categories.find((c) => Number(c.id) === categoryId)?.name || "-";
  }, [categories]);

  const handleCreate = useCallback(async (payload: ProductPayload) => {
    const success = await addProduct(payload);
    if (success) {
      setIsCreateOpen(false);
      fetchProducts();
      toast.success("Məhsul uğurla yaradıldı.");
      return;
    }
    toast.error("Məhsul yaradılarkən xəta baş verdi.");
  }, [addProduct, fetchProducts]);

  const handleEdit = useCallback(async (payload: ProductPayload) => {
    if (!editingId) return;
    const success = await editProduct(editingId, payload);
    if (success) {
      setEditingId(null);
      fetchProducts();
      toast.success("Məhsul uğurla yeniləndi.");
      return;
    }
    toast.error("Məhsul yenilənərkən xəta baş verdi.");
  }, [editProduct, editingId, fetchProducts]);

  const handleDelete = useCallback(async () => {
    if (!deleteId) return;
    const success = await removeProduct(deleteId);
    if (success) {
      setDeleteId(null);
      fetchProducts();
      toast.success("Məhsul uğurla silindi.");
      return;
    }
    toast.error("Məhsul silinərkən xəta baş verdi.");
  }, [removeProduct, deleteId, fetchProducts]);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Məhsullar</h2>

          <Button size="small" onClick={() => setIsCreateOpen(true)}>
            + Yeni Məhsul
          </Button>
        </div>

        <div className={styles.content}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Sıra</th>
                <th>Şəkil</th>
                <th>Ad</th>
                <th>Açıqlama</th>
                <th>Qiymət</th>
                <th>Kateqoriya</th>
                <th>Növ</th>
                <th>Tarix</th>
                <th>Əməliyyat</th>
              </tr>
            </thead>
            <tbody>
              {error ? (
                <tr>
                  <td colSpan={9} style={{ color: "red", textAlign: "center" }}>
                    Xəta: {error}
                  </td>
                </tr>
              ) : loading ? (
                <tr>
                  <td colSpan={9}>
                    <Loading />
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={9}>Məhsul tapılmadı.</td>
                </tr>
              ) : (
                paginatedProducts.map((product, i) => (
                  <tr key={product.id}>
                    <td>{start + i + 1}</td>
                    <td>
                      <img
                        src={product.img_url || "/placeholder.png"}
                        className={styles.image}
                        alt={product.name}
                      />
                    </td>
                    <td>{product.name}</td>
                    <td className={styles.desc}>{product.description}</td>
                    <td>{(+product.price).toFixed(2)} ₼</td>
                    <td>{getCategoryName(product)}</td>
                    <td>
                      <span className={styles.badge}>{product.type || "—"}</span>
                    </td>
                    <td>{new Date(product.created_at).toLocaleDateString("az-AZ")}</td>
                    <td className={styles.buttons}>
                      <button
                        className={styles.edit}
                        onClick={() => setEditingId(product.id)}
                      >
                        Düzəlt
                      </button>
                      <button
                        className={styles.delete}
                        onClick={() => setDeleteId(product.id)}
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
            currentPage={page}
            totalItems={products.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {isCreateOpen && (
        <ProductFormModal
          isOpen
          title="Yeni məhsul"
          submitLabel="Yarat"
          categories={categories}
          isSubmitting={loading}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingProduct && (
        <ProductFormModal
          isOpen
          title="Məhsulu düzəlt"
          submitLabel="Yadda saxla"
          categories={categories}
          initialValues={editingProduct}
          isSubmitting={loading}
          onClose={() => setEditingId(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingProduct && (
        <DeleteProductModal
          isOpen
          productName={deletingProduct.name}
          isSubmitting={loading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  );
}