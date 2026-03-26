import Header from '../Header/Header'
import SideBar from '../SideBar/SideBar'
import styles from './Layout.module.css'
import { type ReactNode } from 'react'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex-col h-screen bg-[#F6F5FB]">
      <div className={styles.headerContainer}>
        <Header />
      </div>
      <div className={styles.mainContainer}>
        <SideBar />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout