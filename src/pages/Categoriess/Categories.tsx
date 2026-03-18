import { useEffect, useState } from "react";
import { useCategoriesStore } from "../../common/store/useCategoriesStore";
import ConfirmDeleteModal from "../../common/components/ConfirmDeleteModal";
import styles from "./categories.module.css";
import Layout from "../../common/components/Layout/Layout";
import Button from "../../common/components/Button/Button";
import Pagination from "../../common/components/Pagination/Pagination";
import Loading from "../../common/components/Loading/Loading";


export default function Categories() {
  const { categories, fetchCategories, removeCategory, loading } = useCategoriesStore();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = categories.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCategories = categories.slice(startIndex, startIndex + itemsPerPage);
  const visibleFrom = totalItems === 0 ? 0 : startIndex + 1;
  const visibleTo = totalItems === 0 ? 0 : Math.min(startIndex + itemsPerPage, totalItems);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  return (
    <Layout>
      <div className={styles.page}>
        <div className={styles.header}>
          <h2 className={styles.title}>Kateqoriyalar</h2>

          <div className={styles.actions}>
            <Button size="small" onClick={() => alert("Bu funksiya hələ hazırlanır")}>
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
              ) : categories.length === 0 ? (
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
                      <button className={styles.edit}>
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
            currentPage={currentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={setCurrentPage}
          />

        </div>
      </div>

      {deleteId !== null && (
        <ConfirmDeleteModal
          onConfirm={() => {
            removeCategory(deleteId);
            setDeleteId(null);
          }}
          onCancel={() => setDeleteId(null)}
        />
      )}

    </Layout>
  );
}