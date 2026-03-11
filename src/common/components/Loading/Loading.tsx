import styles from './Loading.module.css'

const Loading = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinnerWrapper}>
        <div className={styles.outerRing}></div>
        <div className={styles.spinnerRing1}></div>
        <div className={styles.spinnerRing2}></div>
      </div>
    </div>
  )
}

export default Loading



