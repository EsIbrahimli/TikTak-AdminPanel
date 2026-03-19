import styles from "./OrderModal.module.css";

const OrderModal = ({ isOpen, onClose, order }) => {
  if (!isOpen || !order) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <div className={styles.orderInfo}>
            <div className={styles.circle}>{order.items.length}</div>
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
          <h4>Məhsullar ({order.items.length})</h4>
          {order.items.map((item) => (
            <div key={item.id} className={styles.product}>
              <img
                src={item.image || "https://via.placeholder.com/50"}
                alt="product"
              />

          

            <div>
                <p className={styles.productTitle}>{item.name}</p>
                <span>{item.category} - {item.weight}</span>
              </div>
              <div className={styles.productPrice}>
                {item.price} ₼
                <span>{item.pricePerKg} ₼/kg</span>
              </div>
            </div>
          ))}
          <p className={styles.delivery}>Çatdırılma: {order.deliveryPrice || "Pulsuz"}</p>
        </div>
      </div>
    </div>
  );
};

export default OrderModal;