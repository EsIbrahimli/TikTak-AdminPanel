
import React, { useState, useEffect } from "react";
import Layout from "../../common/components/Layout/Layout";
import styles from "./Orders.module.css";
import { BsCart3 } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
import { BsCurrencyDollar } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import Pagination from "../../common/components/Pagination/Pagination";
import OrderModal from "../../common/components/OrderModal/OrderModal";
import { FaSort } from "react-icons/fa";
import { AiFillFilter } from "react-icons/ai";
import { useOrderStore } from "../../common/store/useOrderStore"; 
import { fetchOrders, fetchOrdersStats } from "../../services/ordersApi"; 
 

 


const Orders = () => {

  const [openModal, setOpenModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
const ordersPerPage = 5;

  const { orders, setOrders, totalSales, totalOrders, pending, preparing, delivered, canceled, getOrdersAndStats, loading, error, } =
    useOrderStore();
useEffect(() => {
  getOrdersAndStats(); // store içində hər şeyi çəkir və set edir
}, [getOrdersAndStats]);
const indexOfLastOrder = currentPage * ordersPerPage;
const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

if (loading) return <p>Yüklənir...</p>;
if (error) return <p>Xəta: {error}</p>;
console.log(localStorage.getItem("token"))
 

 

      // Dashboard üçün
      
  
  return (
    <Layout>
   
  <h2 className={styles.title}>Sifarişlər</h2>

  <div className={styles.stats}>
    <div className={styles.statBox}>
      <p>Ümumi sifariş {totalOrders}</p>
      <BsCart3 className={styles.icon} size={15}  />
      <span>{totalOrders}</span>
    </div>

    <div className={styles.statBox}>
      <p>Ümumi gəlir</p>
      <BsCurrencyDollar className={styles.money} size={15}  />
      <span>{totalSales} ₼</span>
    </div>

    <div className={styles.statBox}>
      <p>Gözləyən</p>
      <BsClock className={styles.oclock} size={15}  />
      <span>{pending}</span>
    </div>

    <div className={styles.statBox}>
      <p>Hazırlanır</p>
        <BsClock className={styles.oclock} size={15}  />
      <span>{preparing}</span>
    </div>

    <div className={styles.statBox}>
      <p>Çatdırılan</p>
      <BsClock className={styles.oclock} size={15}  />
      <span>{delivered}</span>
    </div>

    <div className={styles.statBox}>
      <p>Ləğv edilən</p>
      <AiFillCloseCircle className={styles.close} size={15}  />
      <span>{canceled}</span>
    </div>
  </div>
<div className={styles.tableContainer}>
  <table className={styles.table}>
    <thead>
      <tr>
        
        <th>No<FaSort className={styles.sort} size={12} />
         <AiFillFilter className={styles.filter} size={12} /></th>
        <th>Tarix<FaSort className={styles.sort} size={12} />
         <AiFillFilter className={styles.filter} size={12} /></th>
        <th>Çatdırılma ünvanı<FaSort className={styles.sort} size={12} />
         <AiFillFilter className={styles.filter} size={12} /></th>
        <th>Məhsul sayı<FaSort className={styles.sort} size={12} />
         <AiFillFilter className={styles.filter} size={12} /></th>
        <th>Subtotal<FaSort className={styles.sort} size={12} />
         <AiFillFilter className={styles.filter} size={12} /></th>
        <th>Status<FaSort className={styles.sort} size={12} />
         <AiFillFilter className={styles.filter} size={12} /></th>
        <th>Əməliyyat</th>
      </tr>
    </thead>

    <tbody>
      {currentOrders.map((order) => (
      <tr key={order.id}>
        <td>{order.orderNumber}</td>
        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
        <td>{order.address}</td>
        <td>{order.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
        <td>{order.total} ₼</td>
        <td><span  className={
            order.status === "PENDING"
              ? styles.waiting
              : order.status === "PREPARING"
              ? styles.preparing
              : order.status === "DELIVERED"
              ? styles.delivery
              : styles.canceled
          }>{order.status}</span></td>
       
        <td className={styles.action} onClick={() => setOpenModal(true)}>
          <button>Göstər</button>
        </td>
      </tr>))}

     

     
      
    </tbody>
  </table>
  </div>

 
  <Pagination
    currentPage={currentPage}
  totalItems={orders.length}
  itemsPerPage={ordersPerPage}
  onPageChange={setCurrentPage}/>

    
    <OrderModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
/>   
           
                   

       
      
    </Layout>
  )};
;
export default Orders
