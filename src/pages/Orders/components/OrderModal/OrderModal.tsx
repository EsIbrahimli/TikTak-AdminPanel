import { type Order } from "../../../../common/store/useOrderStore";
import styles from "./OrderModal.module.css";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

const OrderModal = ({ isOpen, onClose, order }: OrderModalProps) => {
  if (!isOpen || !order) return null;

  const totalQuantity = order.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <div className={styles.orderInfo}>
            <div className={styles.circle}>{totalQuantity}</div>
            <h5>{order.orderNumber}</h5>
          </div>

          <div className={styles.right}>
            <div>
              <span>Status</span>
              <select className={styles.select} value={order.status}>
                <option value="PENDING">Gözləyir</option>
                <option value="PREPARING">Hazırlanır</option>
                <option value="DELIVERED">Çatdırılan</option>
                <option value="CANCELED">Ləğv edilən</option>
              </select>
            </div>

            <div className={styles.price}>{order.total} ₼</div>

            <button onClick={onClose} className={styles.close}>×</button>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Sifariş Məlumatları</h4>

          <p><b>Tarix:</b>  {new Date(order.createdAt).toLocaleDateString()}</p>
          <p><b>Çatdırılma Ünvanı:</b> {order.address}</p>
          <p><b>Telefon:</b> {order.phone}</p>
          <p><b>Ödəmə Metodu:</b> {order.paymentMethod}</p>
        </div>

        <div className={styles.section}>
          <h4>Məhsullar ({totalQuantity})</h4>
          {order.items.map((item, index) => (
            <div key={item.id ?? `${order.id}-${index}`} className={styles.product}>
              <div className={styles.productLeft}>
              <img
                src={item.image || "/placeholder.png"}
                alt={item.name || "Məhsul"}
              />

                <div>
                <p className={styles.productTitle}>{item.name || "Məhsul adı yoxdur"}</p>
                <span>
                  {[item.category, item.weight, `Say: ${item.quantity}`]
                    .filter(Boolean)
                    .join(" • ")}
                </span>
              </div>
              </div>
              <div className={styles.productPrice}>
                {`${item.price}.00`} ₼
                <span>{item.pricePerKg ? `${item.pricePerKg} ₼/kg` : ""}</span>
              </div>
            </div>
          ))}
          <p className={styles.delivery}>Çatdırılma: {order.deliveryPrice ? `${order.deliveryPrice} ₼` : "Pulsuz"}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;