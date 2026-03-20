import { useEffect, useState } from "react";
import { useProductsStore } from "../../common/store/useProductStore";
import { useCategoriesStore } from "../../common/store/useCategoriesStore";
import type { ProductPayload } from "../../services/productsApi";
import Layout from "../../common/components/Layout/Layout";
import Button from "../../common/components/Button/Button";
import Pagination from "../../common/components/Pagination/Pagination";
import Loading from "../../common/components/Loading/Loading";
import ProductFormModal from "./components/ProductFormModal";
import DeleteProductModal from "./components/DeleteProductModal";
import styles from "./products.module.css";

export default function Products() {
  const {
    products,
    fetchProducts,
    addProduct,
    editProduct,
    removeProduct,
    loading,
  } = useProductsStore();
  const { categories, fetchCategories } = useCategoriesStore();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;
  const safeProducts = Array.isArray(products) ? products : [];

  const totalItems = safeProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * itemsPerPage;

  const paginatedProducts = safeProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );
  const safeCategories = Array.isArray(categories) ? categories : [];
  const editingProduct =
    editingProductId === null
      ? null
      : safeProducts.find((product) => product.id === editingProductId) ?? null;
  const deletingProduct =
    deleteId === null
      ? null
      : safeProducts.find((product) => product.id === deleteId) ?? null;

  const formatPrice = (price: number | string | null | undefined) => {
    const parsed = typeof price === "number" ? price : Number(price);
    return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00";
  };

  const getCategoryName = (id: number) => {
    return safeCategories.find((c) => c.id === id)?.name || "-";
  };

  const handleCreate = async (payload: ProductPayload) => {
    const normalizedPayload: ProductPayload = {
      ...payload,
      ...(payload.img_url ? { img_url: payload.img_url } : {}),
      ...(payload.type ? { type: payload.type } : {}),
    };

    await addProduct(normalizedPayload);
    await fetchProducts();
    setIsCreateOpen(false);
  };

  const handleEdit = async (payload: ProductPayload) => {
    if (editingProductId === null) {
      return;
    }

    const normalizedPayload: ProductPayload = {
      ...payload,
      ...(payload.img_url ? { img_url: payload.img_url } : {}),
      ...(payload.type ? { type: payload.type } : {}),
    };

    await editProduct(editingProductId, normalizedPayload);
    await fetchProducts();
    setEditingProductId(null);
  };

  const handleDelete = async () => {
    if (deleteId === null) {
      return;
    }

    await removeProduct(deleteId);
    await fetchProducts();
    setDeleteId(null);
  };

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
              {loading ? (
                <tr>
                  <td colSpan={9}>
                    <Loading />
                  </td>
                </tr>
              ) : safeProducts.length === 0 ? (
                <tr>
                  <td colSpan={9}>Məhsul tapılmadı.</td>
                </tr>
              ) : (
                paginatedProducts.map((product, index) => (
                  <tr key={product.id}>
                    <td>{startIndex + index + 1}</td>

                    <td>
                      <img
                        src={product.img_url || "/placeholder.png"}
                        className={styles.image}
                      />
                    </td>

                    <td>{product.name}</td>

                    <td className={styles.desc}>
                      {product.description}
                    </td>

                    <td>{formatPrice(product.price)} ₼</td>

                    <td>{getCategoryName(product.category_id)}</td>

                    <td>
                      <span className={styles.badge}>
                        {product.type || "—"}
                      </span>
                    </td>

                    <td>
                      {new Date(product.created_at).toLocaleDateString("az-AZ")}
                    </td>

                    <td className={styles.buttons}>
                      <button
                        className={styles.edit}
                        onClick={() => setEditingProductId(product.id)}
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
            currentPage={safeCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {isCreateOpen && (
        <ProductFormModal
          key="create-product"
          isOpen={true}
          title="Yeni məhsul"
          submitLabel="Yarat"
          categories={safeCategories}
          isSubmitting={loading}
          onClose={() => setIsCreateOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {editingProduct !== null && (
        <ProductFormModal
          key={`edit-product-${editingProduct.id}`}
          isOpen={true}
          title="Məhsulu düzəlt"
          submitLabel="Yadda saxla"
          categories={safeCategories}
          initialValues={editingProduct}
          isSubmitting={loading}
          onClose={() => setEditingProductId(null)}
          onSubmit={handleEdit}
        />
      )}

      {deletingProduct !== null && (
        <DeleteProductModal
          isOpen={true}
          productName={deletingProduct.name}
          isSubmitting={loading}
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  );
}