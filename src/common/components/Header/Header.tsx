import styles from './Header.module.css'

const Header = () => {
  return (
    <header className={styles.header}>
        <h1 className={styles.logo} >TIK TAK ADMİN</h1>
        <input className={styles.input} type="text" placeholder="Axtarış"></input>
    </header>
  )
}

export default Header
