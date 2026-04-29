import { useState, type ChangeEvent, type FormEvent } from "react";
import Button from "../../../common/components/Button/Button";
import styles from "./ProductFormModal.module.css";

interface CategoryOption {
  id: number;
  name: string;
}

interface ProductFormValues {
  name: string;
  description: string;
  price: number | "";
  img_url: string;
  category_id: string;
  type: string;
}

const TYPE_OPTIONS = [
  "kg",
  "gr",
  "litre",
  "ml",
  "meter",
  "cm",
  "mm",
  "piece",
  "packet",
];

interface ProductSubmitPayload {
  name: string;
  description: string;
  price: number;
  img_url?: string;
  category_id: number;
  type?: string;
}

interface ProductInitialValues {
  name?: string;
  description?: string;
  price?: number | string | null;
  img_url?: string;
  category_id?: number | string | null;
  type?: string;
}

interface Props {
  isOpen: boolean;
  title: string;
  submitLabel: string;
  categories: CategoryOption[];
  initialValues?: ProductInitialValues;
  isSubmitting?: boolean;
  onClose: () => void;
  onSubmit: (values: ProductSubmitPayload) => Promise<void> | void;
}

const getInitialValues = (initialValues?: ProductInitialValues): ProductFormValues => ({
  name: initialValues?.name ?? "",
  description: initialValues?.description ?? "",
  price:
    typeof initialValues?.price === "number" && Number.isFinite(initialValues.price)
      ? initialValues.price
      : typeof initialValues?.price === "string" && initialValues.price.trim() && Number.isFinite(Number(initialValues.price))
      ? Number(initialValues.price)
      : "",
  img_url: initialValues?.img_url ?? "",
  category_id:
    typeof initialValues?.category_id === "number" ||
    typeof initialValues?.category_id === "string"
      ? String(initialValues.category_id)
      : "",
  type: initialValues?.type ?? "",
});

export default function ProductFormModal({
  isOpen,
  title,
  submitLabel,
  categories,
  initialValues,
  isSubmitting = false,
  onClose,
  onSubmit,
}: Props) {
  const [values, setValues] = useState<ProductFormValues>(() => getInitialValues(initialValues));

  if (!isOpen) {
    return null;
  }

  const handleChange =
    (field: keyof ProductFormValues) =>
    (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]:
          field === "price"
            ? ((event.target as HTMLInputElement).value === ""
                ? ""
                : Number((event.target as HTMLInputElement).value))
            : event.target.value,
      }));
    };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const parsedPrice = Number(values.price);
    const parsedCategoryId = Number(values.category_id);

    if (!values.name.trim()) {
      return;
    }

    if (values.price === "" || !Number.isFinite(parsedPrice) || parsedPrice < 0) {
      return;
    }

    if (!Number.isInteger(parsedCategoryId) || parsedCategoryId <= 0) {
      return;
    }

    await onSubmit({
      name: values.name.trim(),
      description: values.description.trim(),
      price: parsedPrice,
      ...(values.img_url.trim() ? { img_url: values.img_url.trim() } : {}),
      category_id: parsedCategoryId,
      ...(values.type.trim() ? { type: values.type.trim() } : {}),
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
              placeholder="Məhsul adı"
              required
            />
          </label>

          <label className={styles.label}>
            Açıqlama
            <textarea
              className={styles.textarea}
              value={values.description}
              onChange={handleChange("description")}
              rows={3}
              placeholder="Məhsul açıqlaması"
            />
          </label>

          <div className={styles.row}>
            <label className={styles.label}>
              Qiymət
              <input
                className={styles.input}
                value={values.price}
                onChange={handleChange("price")}
                type="number"
                min="0"
                step="0.01"
                placeholder="0.00"
                required
              />
            </label>

            <label className={styles.label}>
              Kateqoriya
              <select
                className={styles.select}
                value={values.category_id}
                onChange={handleChange("category_id")}
                required
              >
                <option value="">Seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className={styles.row}>
            <label className={styles.label}>
              Növ
              <select
                className={styles.select}
                value={values.type}
                onChange={handleChange("type")}
                required
              >
                <option value="">Seçin</option>
                {TYPE_OPTIONS.map((typeOption) => (
                  <option key={typeOption} value={typeOption}>
                    {typeOption}
                  </option>
                ))}
              </select>
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
          </div>

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
