import styles from "./DeleteCategoryModal.module.css";

interface Props {
  isOpen: boolean;
  categoryName?: string;
  isSubmitting?: boolean;
  onCancel: () => void;
  onConfirm: () => Promise<void> | void;
}

export default function DeleteCategoryModal({
  isOpen,
  categoryName,
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
        <h3 className={styles.title}>Kateqoriya silinsin?</h3>
        <p className={styles.text}>
          {categoryName
            ? `"${categoryName}" kateqoriyası silinəcək.`
            : "Bu kateqoriya silinəcək."}
        </p>

        <div className={styles.actions}>
          <button type="button" className={styles.cancel} onClick={onCancel}>
            Ləğv et
          </button>
          <button
            type="button"
            className={styles.delete}
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
