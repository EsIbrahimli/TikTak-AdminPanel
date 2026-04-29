import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PiEyeLight, PiEyeSlashLight } from 'react-icons/pi'
import styles from './Login.module.css'
import loginSvg from '../../assets/images/login.svg'
import Button from '../../common/components/Button/Button'
import Loading from '../../common/components/Loading/Loading'
import { useAuthStore } from '../../common/store/useAuthStore'
import { ROUTES } from '../../common/constant/router'
import { toast } from 'react-toastify'

const Login = () => {
  const navigate = useNavigate()
  const { login, loading, token, savedPhone, savedPassword } = useAuthStore()

  const [phone, setPhone] = useState(() => savedPhone)
  const [password, setPassword] = useState('')
  const [error, setError] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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

  useEffect(() => {
    if (password && savedPassword && password === savedPassword && phone && !loading) {
      void handleLoginClick()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password])

  const handleLoginClick = async () => {
    if (loading) return
    if (!phone || !password) {
      setError(true)
      toast.error('Telefon və parol daxil edin.')
      return
    }

    try {
      await login(phone, password);
      toast.success('Giriş uğurla tamamlandı.');
      navigate(ROUTES.ORDERS);

    } catch (err: unknown) {
      console.error(err)
      setError(true)
      toast.error('Giriş zamanı xəta baş verdi.')
    }
  }

  if (loading) return <Loading />

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <img className={styles.image} src={loginSvg} alt="Login" />
        <h1 className={styles.title}>TIK TAK ADMiN</h1>
      </div>

      <div className={styles.divider} />

      <form
        className={styles.form}
        onSubmit={(e) => { e.preventDefault(); void handleLoginClick() }}
        autoComplete="on"
      >
        <h1 className={styles.formTitle}>Admin Panel</h1>
        <div className={styles.inputContainer}>
          <label htmlFor="phone">Telefon</label>
          <input
            id="phone"
            name="phone"
            autoComplete="phone"
            className={`${styles.input} ${error ? styles.error : ''}`}
            type="tel"
            inputMode="tel"
            placeholder="+994501234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div className={styles.inputContainer}>
          <label htmlFor="password">Parol</label>
          <div className={styles.passwordWrapper}>
            <input
              id="password"
              name="password"
              autoComplete="current-password"
              className={`${styles.input} ${error ? styles.error : ''}`}
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword(v => !v)}
              tabIndex={-1}
              aria-label={showPassword ? 'Parolu gizlə' : 'Parolu göstər'}
            >
              {showPassword ? <PiEyeSlashLight size={18} /> : <PiEyeLight size={18} />}
            </button>
          </div>
        </div>

        <Button
          type="submit"
          size="medium"
          disabled={loading}
        >
          Daxil ol
        </Button>
      </form>
    </div>
  )
}

export default Login