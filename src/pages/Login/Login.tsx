import styles from './Login.module.css'
import loginSvg from '../../assets/images/login.svg'
import Button from '../../common/components/Button/Button'
import React, { useState } from 'react'



const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');


  const handleLogin = () => {
    console.log('Login butonuna tıklandı');
  };

  return (
    <div className={styles.login}>
      <h1 className={styles.title}>TIK TAK ADMIN</h1>
      <div className={styles.container}>
        <img className={styles.image} src={loginSvg} alt="" />
      </div>
      <div className={styles.divider}></div>
      <div className={styles.form}>
        <h2 className={styles.subtitle}>Admin Panel</h2>
        <div className={styles.inputContainer}>
          <label>Telefon</label>
          <input
            className={styles.input}
            type="text"
            placeholder="Telefon"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />

        </div>
        <div className={styles.inputContainer}>
          <label >Parol</label>
          <input
            className={styles.input}
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button size="medium" onClick={handleLogin}>Daxil ol</Button>
      </div>
    </div>
  )
}

export default Login