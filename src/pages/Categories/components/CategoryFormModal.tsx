import { useState } from "react";
import Button from "../../../common/components/Button/Button";
import styles from "./CategoryFormModal.module.css";

interface CategoryFormValues {
  name: string;
  description: string;
  img_url: string;
}

interface Props {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  initialValues?: Partial<CategoryFormValues>;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: CategoryFormValues) => Promise<void> | void;
}

const emptyValues: CategoryFormValues = {
  name: "",
  description: "",
  img_url: "",
};

export default function CategoryFormModal({
  isOpen,
  title,
  submitLabel,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<CategoryFormValues>(() => ({
    name: initialValues?.name ?? emptyValues.name,
    description: initialValues?.description ?? emptyValues.description,
    img_url: initialValues?.img_url ?? emptyValues.img_url,
  }));

  if (!isOpen) {
    return null;
  }

  const handleChange =
    (field: keyof CategoryFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setValues((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!values.name.trim()) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      img_url: values.img_url.trim(),
    });
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <h3 className={styles.title}>{title}</h3>

        <form className={styles.form} onSubmit={handleSubmit}>
          <label className={styles.label}>
            Ad
            <input
              className={styles.input}
              value={values.name}
              onChange={handleChange("name")}
              placeholder="Kateqoriya adı"
              required
            />
          </label>

          <label className={styles.label}>
            Açıqlama
            <textarea
              className={styles.textarea}
              value={values.description}
              onChange={handleChange("description")}
              placeholder="Açıqlama"
              rows={3}
            />
          </label>

          <label className={styles.label}>
            Şəkil URL
            <input
              className={styles.input}
              value={values.img_url}
              onChange={handleChange("img_url")}
              placeholder="https://..."
            />
          </label>

          <div className={styles.actions}>
            <button type="button" className={styles.cancel} onClick={onClose}>
              Ləğv et
            </button>
            <Button type="submit" className={styles.submit} disabled={isSubmitting}>
              {isSubmitting ? "Yüklənir..." : submitLabel}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
