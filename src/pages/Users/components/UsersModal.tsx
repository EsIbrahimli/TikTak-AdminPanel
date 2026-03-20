import styles from './UsersModal.module.css'
import { FiUser, FiPhone, FiMapPin, FiShield, FiX } from 'react-icons/fi'

interface UserModalData {
  id: number;
  full_name: string;
  phone: string;
  address?: string;
  role: string;
  img_url?: string;
}

interface UsersModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserModalData | null;
}

const UsersModal = ({ isOpen, onClose, user }: UsersModalProps) => {
  if (!isOpen || !user) return null; 

  const avatarFallback = user.full_name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((item) => item[0]?.toUpperCase() ?? '')
    .join('');

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(event) => event.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.modalTitle}>İstifadəçi məlumatları</h2>
        </div>

        <div className={styles.profileRow}>
          {user.img_url ? (
            <img src={user.img_url} alt={user.full_name} className={styles.avatar} />
          ) : (
            <div className={styles.avatar}>{avatarFallback || 'U'}</div>
          )}
          <div className={styles.profileInfo}>
            <p className={styles.userName}>{user.full_name}</p>
            <p className={styles.userMeta}>ID: {user.id}</p>
          </div>
        </div>

        <div className={styles.modalContent}>
          <div className={styles.row}>
            <div className={styles.labelWrap}>
              <FiUser className={styles.icon} />
              <span>Ad Soyad</span>
            </div>
            <p>{user.full_name}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.labelWrap}>
              <FiPhone className={styles.icon} />
              <span>Telefon</span>
            </div>
            <p>{user.phone}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.labelWrap}>
              <FiMapPin className={styles.icon} />
              <span>Ünvan</span>
            </div>
            <p>{user.address || 'Qeyd olunmayıb'}</p>
          </div>

          <div className={styles.row}>
            <div className={styles.labelWrap}>
              <FiShield className={styles.icon} />
              <span>Rol</span>
            </div>
            <p className={styles.role}>{user.role}</p>
          </div>
        </div>

        <button type="button" className={styles.closeBtn} onClick={onClose}>
          Bağla
        </button>
      </div>
    </div>
  )
}

export default UsersModal