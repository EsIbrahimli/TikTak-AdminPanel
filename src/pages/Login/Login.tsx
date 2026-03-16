import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './Login.module.css'
import loginSvg from '../../assets/images/login.svg'
import Button from '../../common/components/Button/Button'
import Loading from '../../common/components/Loading/Loading'
import { useAuthStore } from '../../common/store/useAuthStore'
import { ROUTES } from '../../common/constant/router'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, token } = useAuthStore()

  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)

  // Token varsa yönləndir
  useEffect(() => {
    if (token) {
      navigate(ROUTES.ORDERS)
    }
  }, [token, navigate])

    useEffect(() => {
      if (error) {
        const timer = setTimeout(() => setError(false), 3000)
        return () => clearTimeout(timer)
      }
    }, [error])

  const handleLoginClick = async () => {
    if (!phone || !password) {
      setError(true)
      return
    }

    try {
      await login(phone, password);
       navigate(ROUTES.ORDERS);
  
    } catch (err: unknown) {
      console.error(err)
      setError(true)
    }
  }

  if (loading) return <Loading />

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <img className={styles.image} src={loginSvg} alt="Login" />
        <h1 className={styles.title}>TIK TAK ADMIN</h1>
      </div>

      <div className={styles.form}>
      <h1>Admin Panel</h1>
        <div className={styles.inputContainer}>
          <label>Telefon</label>
          <input
            className={`${styles.input} ${error ? styles.error : ''}`}
            type="tel"
            inputMode="tel"
            placeholder="+994501234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label>Parol</label>
          <input
            className={`${styles.input} ${error ? styles.error : ''}`}
            type="password"
            placeholder="Parol"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button
          size="medium"
          onClick={handleLoginClick}
          disabled={loading}
        >
          Daxil ol
        </Button>
      </div>
    </div>
  )
}

export default Login