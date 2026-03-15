import styles from "./Pagination.module.css";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className={styles.paginationContainer}>
      <nav className={styles.pagination}>

        <button
          className={styles.button}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {pages.map((page) => (
          <button
            key={page}
            className={`${styles.button} ${currentPage === page ? styles.active : ""}`}
            onClick={() => onPageChange(page)}
          >
            {page}
          </button>
        ))}

        <button
          className={styles.button}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>

      </nav>
    </div>
  );
};

export default Pagination;