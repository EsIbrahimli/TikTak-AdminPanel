import styles from "./OrderModal.module.css";

const OrderModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>

        <div className={styles.header}>
          <div className={styles.orderInfo}>
            <div className={styles.circle}>0</div>
            <h5>ORD-20260211-040</h5>
          </div>

          <div className={styles.right}>
            <div>
              <span>Status</span>
              <select className={styles.select}>
                <option>Gözləyir</option>
              </select>
            </div>

            <div className={styles.price}>11.99 ₼</div>

            <button onClick={onClose} className={styles.close}>×</button>
          </div>
        </div>

        <div className={styles.section}>
          <h4>Sifariş Məlumatları</h4>

          <p><b>Tarix:</b> 2026-02-11</p>
          <p><b>Çatdırılma Ünvanı:</b> Xətai rayonu</p>
          <p><b>Telefon:</b> +994517044018</p>
          <p><b>Ödəmə Metodu:</b> Kart</p>
        </div>

        <div className={styles.section}>
          <h4>Məhsullar (1)</h4>

          <div className={styles.product}>
            <img
              src="https://via.placeholder.com/50"
              alt="product"
            />

            <div>
              <p className={styles.productTitle}>Təbii Xiyar</p>
              <span>Meyvələr və tərəvəzlər - 5 kg</span>
            </div>

            <div className={styles.productPrice}>
              6.00 ₼
              <span>1.20 ₼/kg</span>
            </div>
          </div>

          <p className={styles.delivery}>Çatdırılma: Pulsuz</p>
        </div>

      </div>
    </div>
  );
};

export default OrderModal;