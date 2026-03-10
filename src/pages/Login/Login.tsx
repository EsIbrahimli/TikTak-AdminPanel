import styles from './Login.module.css'
import loginSvg from '../../assets/images/login.svg'
import Button from '../../common/components/Button/Button'
import React from 'react'


const Login = () => {
  const handleLogin = () => {
    console.log('Login butonuna tıklandı');
  };

  return (
    <div className={styles.login}>
      <div className={styles.container}>
        <h1 className={styles.title}>TIK TAK ADMIN</h1>
        <img className={styles.image} src={loginSvg}alt="" />
      </div>
       <div className={styles.form}>
          <h2 className={styles.subtitle}>Admin Panel</h2>
          <div>
            <label htmlFor="">Telefon</label>
            <input className={styles.input} type="text" placeholder='Telefon' />
          </div>
          <div>
            <label htmlFor="">Parol</label>
            <input className={styles.input} type="password" placeholder='Password' />
          </div>
          <Button size="medium" onClick={handleLogin}>Daxil ol</Button>
       </div>
    </div>
  )
}

export default Login