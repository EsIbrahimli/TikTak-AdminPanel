import { FiMenu } from 'react-icons/fi'
import styles from './Header.module.css'

interface HeaderProps {
  onMenuToggle?: () => void
}

const Header = ({ onMenuToggle }: HeaderProps) => {
  return (
    <header className={styles.header}>
      <button className={styles.menuBtn} onClick={onMenuToggle} aria-label="Menyunu aç">
        <FiMenu size={22} />
      </button>
      <h1 className={styles.logo}>TIK TAK ADMİN</h1>
      <input className={styles.input} type="text" placeholder="Axtarış" />
    </header>
  )
}

export default Header
