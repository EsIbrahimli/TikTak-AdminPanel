import { NavLink } from 'react-router-dom'
import { FiX } from 'react-icons/fi'
import { ROUTES } from '../../constant/router'
import styles from './SideBar.module.css'

interface SideBarProps {
    isOpen?: boolean
    onClose?: () => void
}

const SideBar = ({ isOpen, onClose }: SideBarProps) => {
    const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <button className={styles.closeBtn} onClick={onClose} aria-label="Menyunu bağla">
                <FiX size={20} />
            </button>
            <nav className={styles.nav}>
                <ul>
                    <li><NavLink to={ROUTES.ORDERS} className={getNavLinkClassName} onClick={onClose}>Sifarişlər</NavLink></li>
                    <li><NavLink to={ROUTES.CAMPAIGNS} className={getNavLinkClassName} onClick={onClose}>Kampaniyalar</NavLink></li>
                    <li><NavLink to={ROUTES.CATEGORIES} className={getNavLinkClassName} onClick={onClose}>Kateqoriyalar</NavLink></li>
                    <li><NavLink to={ROUTES.PRODUCTS} className={getNavLinkClassName} onClick={onClose}>Məhsullar</NavLink></li>
                    <li><NavLink to={ROUTES.USERS} className={getNavLinkClassName} onClick={onClose}>İstifadəçilər</NavLink></li>
                    <li><NavLink to={ROUTES.LOGOUT} className={getNavLinkClassName} onClick={onClose}>Çıxış</NavLink></li>
                </ul>
            </nav>
        </aside>
    )
}

export default SideBar
