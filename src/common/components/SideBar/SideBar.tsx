import { Link } from 'react-router-dom'
import { ROUTES } from '../../constant/router'
import styles from './SideBar.module.css'

const SideBar = () => {
    return (
        <aside className={styles.sidebar}>
            <nav className={styles.nav}>
                <ul>
                    <li><Link to={ROUTES.ORDERS} className={styles.orders}>Sifarişlər</Link></li>
                    <li><Link to={ROUTES.CAMPAIGNS} className={styles.campaigns}>Kampaniyalar</Link></li>
                    <li><Link to={ROUTES.CATEGORIES} className={styles.categories}>Kateqoriyalar</Link></li>
                    <li><Link to={ROUTES.PRODUCTS} className={styles.products}>Məhsullar</Link></li>
                    <li><Link to={ROUTES.USERS} className={styles.users}>İstifadəçilər</Link></li>
                    <li><Link to={ROUTES.LOGOUT} className={styles.login}>Çıxış</Link></li>

                </ul>
            </nav>
        </aside>
    )
}

export default SideBar
