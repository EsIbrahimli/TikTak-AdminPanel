import styles from "./DeleteProductModal.module.css";

interface Props {
  isOpen: boolean;
  productName?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteProductModal({
  isOpen,
  productName,
  isSubmitting = false,
  onCancel,
  onConfirm,
}: Props) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className={styles.overlay} onClick={onCancel}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <h3 className={styles.title}>Məhsul silinsin?</h3>
        <p className={styles.text}>
          {productName ? `"${productName}" məhsulu silinəcək.` : "Bu məhsul silinəcək."}
        </p>

        <div className={styles.actions}>
          <button className={styles.cancel} type="button" onClick={onCancel}>
            Ləğv et
          </button>
          <button
            className={styles.delete}
            type="button"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Silinir..." : "Sil"}
          </button>
        </div>
      </div>
    </div>
  );
}
