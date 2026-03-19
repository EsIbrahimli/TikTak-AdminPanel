import { useEffect, useState } from "react";
import { useProductsStore } from "../../common/store/useProductStore";
import { useCategoriesStore } from "../../common/store/useCategoriesStore";
import ConfirmDeleteModal from "../../common/components/ConfirmDeleteModal";
import Layout from "../../common/components/Layout/Layout";
import Button from "../../common/components/Button/Button";
import Pagination from "../../common/components/Pagination/Pagination";
import Loading from "../../common/components/Loading/Loading";
import styles from "./products.module.css";

export default function Products() {
  const { products, fetchProducts, removeProduct, loading } = useProductsStore();
  const { categories, fetchCategories } = useCategoriesStore();

  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  const totalItems = products.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedProducts = products.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const getCategoryName = (id: number) => {
    return categories.find((c) => c.id === id)?.name || "-";
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Məhsullar</h2>

          <Button size="small">
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
              ) : products.length === 0 ? (
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

                    <td>{product.price.toFixed(2)} ₼</td>

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
                      <button className={styles.edit}>Düzəlt</button>

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
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>

      {deleteId !== null && (
        <ConfirmDeleteModal
          onConfirm={async () => {
            await removeProduct(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}
    </Layout>
  );
}