import { useEffect, useState } from "react";
import { useCategoriesStore , Category } from "../../common/store/useCategoriesStore";
import ConfirmDeleteModal from "../../common/components/ConfirmDeleteModal";
import styles from "./categories.module.css";

export default function Categories() {
  const { categories, fetchCategories, removeCategory, loading } =
    useCategoriesStore();

  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const filtered: Category[] = categories.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentCategories = filtered.slice(firstIndex, lastIndex);

  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2>Kateqoriyalar</h2>

          <div className={styles.actions}>
            <input
              className={styles.search}
              placeholder="Axtar..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <button className={styles.addBtn}>
              + Yeni Kateqoriya
            </button>
          </div>
        </div>

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
                <td colSpan={6}>Yüklənir...</td>
              </tr>
            ) : (
              currentCategories.map((cat, index) => (
                <tr key={cat.id}>
                  <td>{firstIndex + index + 1}</td>

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

        {/* PAGINATION */}
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={
                currentPage === i + 1 ? styles.activePage : ""
              }
              onClick={() => setCurrentPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
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
    </div>
  );
}