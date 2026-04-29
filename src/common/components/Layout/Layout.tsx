import { useState } from 'react'
import Header from '../Header/Header'
import SideBar from '../SideBar/SideBar'
import styles from './Layout.module.css'
import { type ReactNode } from 'react'

interface LayoutProps {
  children?: ReactNode
}

const Layout = ({ children }: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="flex-col h-screen bg-[#F6F5FB]">
      <div className={styles.headerContainer}>
        <Header onMenuToggle={() => setSidebarOpen(v => !v)} />
      </div>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />
      )}
      <div className={styles.mainContainer}>
        <SideBar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <main className={styles.main}>
          {children}
        </main>
      </div>
    </div>
  )
}

export default Layout