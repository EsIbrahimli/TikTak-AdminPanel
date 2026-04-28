import styles from './Header.module.css'
import { useSearchStore } from '../../store/useSearchStore';


  const Header = () => {
  const { query, results, setQuery, searchProducts } = useSearchStore();
  return (
    <header className={styles.header}>
        <h1 className={styles.logo} >TIK TAK ADMİN</h1>
        <input
          className={styles.input}
          type="text"
          placeholder="Axtarış"
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            setQuery(value);
            searchProducts(value);
          }}
        />
         <ul>
        {results.map((item) => (
          <li key={item.id}>
            {item.name} - {item.price}
          </li>
        ))}
      </ul>
    </header>
  )
}

export default Header
