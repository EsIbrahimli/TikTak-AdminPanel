
import Layout from '../../common/components/Layout/Layout'
import styles from './Users.module.css'
import Pagination from '../../common/components/Pagination/Pagination'
import UsersModal from './components/UsersModal'
import { useState, useEffect } from 'react'
import Loading from '../../common/components/Loading/Loading'
import { useUserStore } from '../../common/store/useUserStore'
import { toast } from 'react-toastify'

interface UserItem {
  id: number;
  full_name: string;
  phone: string;
  address?: string;
  role: string;
  img_url?: string;
}

const Users = () => {
  const { users, loading, error, fetchUsers } = useUserStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;
const safeUsers = Array.isArray(users) ? (users as UserItem[]) : [];

// pagination logic
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedData = safeUsers.slice(startIndex, startIndex + itemsPerPage);
useEffect(() => {
  setCurrentPage(1);
}, [safeUsers.length]);

useEffect(() => {
  fetchUsers();
}, [fetchUsers]);

useEffect(() => {
  if (error) {
    toast.error(`İstifadəçilər yüklənmədi: ${error}`)
  }
}, [error])

  return (
    <Layout>
       

<h2 className={styles.title}>İstifadəçilər</h2>

<table className={styles.table}>

<thead>
<tr>
<th>Sıra</th>
<th>Avatar</th>
<th>Ad Soyad</th>
<th>Telefon</th>
<th>Ünvan</th>
<th>Rol</th>
<th>Əməliyyat</th>
</tr>
</thead>

<tbody>
{loading ? (
  <tr>
    <td colSpan={7} className={styles.stateRow}>
      <Loading />
    </td>
  </tr>
) : error ? (
  <tr>
    <td colSpan={7} className={`${styles.stateRow} ${styles.errorText}`}>
      {error}
    </td>
  </tr>
) : paginatedData.length === 0 ? (
  <tr>
    <td colSpan={7} className={styles.stateRow}>
      İstifadəçi tapılmadı.
    </td>
  </tr>
) : paginatedData.map((user, index)=>(
<tr key={user.id}>
<td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

<td>
  {user.img_url ? (
    <img src={user.img_url} className={styles.avatar} />
  ) : (
    <div className={styles.avatar}>
      {user.full_name.charAt(0)}
    </div>
  )}
</td>

<td>{user.full_name}</td>

<td>{user.phone}</td>

<td className={styles.address}>{user.address || 'Qeyd olunmayıb'}</td>

<td>
<span className={styles.role}>{user.role}</span>
</td>

<td>
<button className={styles.actionBtn} onClick={() => {
  setSelectedUser(user);
  setIsModalOpen(true);
}}>Göstər</button>
</td>

</tr>
))}
</tbody>

</table>
<Pagination 
currentPage={currentPage}
  totalItems={safeUsers.length}
  itemsPerPage={itemsPerPage}
  onPageChange={setCurrentPage}/>
<UsersModal
  isOpen={isModalOpen}
  onClose={() => {
    setIsModalOpen(false)
    setSelectedUser(null)
  }}
  user={selectedUser}
/>


    </Layout>
  )
}

export default Users