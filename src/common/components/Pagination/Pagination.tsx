import styles from "./Pagination.module.css";

const Pagination = () => {
  return (
    <div className={styles.paginationContainer}>
      <nav className={styles.pagination}>
        <button className={styles.button}>Prev</button>

        <button className={`${styles.button} ${styles.active}`}>1</button>

        <button className={styles.button}>2</button>

        <button className={styles.button}>3</button>

        <button className={styles.button}>Next</button>
      </nav>
    </div>
  );
};

export default Pagination;