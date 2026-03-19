
import Layout from '../../common/components/Layout/Layout'
import React from 'react'
import styles from './Users.module.css'
import Pagination from '../../common/components/Pagination/Pagination'
import UsersModal from './UsersModal'
import {getUsers}  from '../../services/usersApi'
import { useState, useEffect } from 'react'
import { useUserStore } from '../../common/store/useUserStore'
const Users = () => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [users,setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
const itemsPerPage = 5;

// pagination logic
const startIndex = (currentPage - 1) * itemsPerPage;
const paginatedData = users.slice(startIndex, startIndex + itemsPerPage);
useEffect(() => {
  setCurrentPage(1);
}, [users]);
useEffect(()=>{

const fetchUsers = async ()=>{

const data = await getUsers();

setUsers(data);

};

fetchUsers();

},[]);

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
{paginatedData.map((user, index)=>(
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
  totalItems={users.length}
  itemsPerPage={itemsPerPage}
  onPageChange={setCurrentPage}/>
<UsersModal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  user={selectedUser}
/>


    </Layout>
  )
}

export default Users