import { NavLink } from 'react-router-dom'
import { ROUTES } from '../../constant/router'
import styles from './SideBar.module.css'

const SideBar = () => {
    const getNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
        isActive ? `${styles.navLink} ${styles.active}` : styles.navLink

    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <ul>
                    <li><NavLink to={ROUTES.ORDERS} className={getNavLinkClassName}>Sifarişlər</NavLink></li>
                    <li><NavLink to={ROUTES.CAMPAIGNS} className={getNavLinkClassName}>Kampaniyalar</NavLink></li>
                    <li><NavLink to={ROUTES.CATEGORIES} className={getNavLinkClassName}>Kateqoriyalar</NavLink></li>
                    <li><NavLink to={ROUTES.PRODUCTS} className={getNavLinkClassName}>Məhsullar</NavLink></li>
                    <li><NavLink to={ROUTES.USERS} className={getNavLinkClassName}>İstifadəçilər</NavLink></li>
                    <li><NavLink to={ROUTES.LOGOUT} className={getNavLinkClassName}>Çıxış</NavLink></li>

                </ul>
            </nav>
        </aside>
    )
}

export default SideBar
