import styles from './UsersModal.module.css'

const UsersModal = ({ isOpen, onClose, user }) => {
  if (!isOpen || !user) return null; 
  return (
    <div className={styles.modalOverlay}>
  <div className={styles.modal}>

    <h2 className={styles.modalTitle}>İstifadəçi məlumatları</h2>

    <div className={styles.modalContent}>

      <div className={styles.row}>
        <span>Ad Soyad:</span>
        <p>{user.full_name}</p>
      </div>

      <div className={styles.row}>
        <span>Telefon:</span>
        <p>{user.phone}</p>
      </div>

      <div className={styles.row}>
        <span>Ünvan:</span>
        <p>{user.address || 'Qeyd olunmayıb'}</p>
      </div>

      <div className={styles.row}>
        <span>Rol:</span>
        <p className={styles.role}>{user.role}</p>
      </div>

    </div>

    <button className={styles.closeBtn} onClick={onClose}>
      Bağla
    </button>

  </div>
</div>
  )
}

export default UsersModal