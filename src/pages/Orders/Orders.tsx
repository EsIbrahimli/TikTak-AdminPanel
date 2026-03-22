
import { useState, useEffect } from "react";
import { useOrderStore } from "../../common/store/useOrderStore";
import { useAuthStore } from "../../common/store/useAuthStore";
import { FaSort } from "react-icons/fa";
import { AiFillFilter } from "react-icons/ai";
import Layout from "../../common/components/Layout/Layout";
import styles from "./Orders.module.css";
import { BsCart3 } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
import { BsCurrencyDollar } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";
import { PiEyeLight } from "react-icons/pi";
import Pagination from "../../common/components/Pagination/Pagination";
import OrderModal from "./components/OrderModal/OrderModal";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../common/constant/router";
import { toast } from "react-toastify";
import Loading from "../../common/components/Loading/Loading";


const Orders = () => {
  const navigate = useNavigate();
  const token = useAuthStore((state) => state.token);

  const [openModal, setOpenModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null }); // direction: "asc" | "desc" | null
  const ordersPerPage = 5;

  const { orders, totalSales, totalOrders, pending, preparing, delivered, canceled, getOrdersAndStats, loading, error } =
    useOrderStore();

  useEffect(() => {
    if (!token) {
      navigate(ROUTES.LOGIN, { replace: true });
      return;
    }

    void getOrdersAndStats();
  }, [token, navigate, getOrdersAndStats]);

  useEffect(() => {
    if (error) {
      toast.error(`Sifarişlər yüklənmədi: ${error}`);
    }
  }, [error]);

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;

  const safeOrders = Array.isArray(orders) ? orders : [];


  if (!token) return null;

  if (loading) {
    return (
      <Layout>
        <Loading />
      </Layout>
    );
  }
  if (error) return <p>Xəta: {error}</p>;
  const statusMap = {
  PENDING: "Gözləyir",
  PREPARING: "Hazırlanır",
  DELIVERED: "Çatdırılıb",
  CANCELED: "Ləğv edilib"
};
const handleSort = (key, direction) => {
  setSortConfig({ key, direction });
};
const sortedOrders = [...safeOrders].sort((a, b) => {
  if (!sortConfig.key) return 0;

  let aValue;
  let bValue;

  switch (sortConfig.key) {
    case "orderNumber":
      aValue = a.orderNumber;
      bValue = b.orderNumber;
      break;
    case "createdAt":
      aValue = new Date(a.createdAt);
      bValue = new Date(b.createdAt);
      break;
    case "address":
      aValue = a.address;
      bValue = b.address;
      break;
    case "itemCount":
      aValue = a.items.reduce((sum, i) => sum + i.quantity, 0);
      bValue = b.items.reduce((sum, i) => sum + i.quantity, 0);
      break;
    case "total":
      aValue = a.total;
      bValue = b.total;
      break;
    default:
      return 0;
  }

  if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
  if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
  return 0;
});
const currentOrders = sortedOrders.slice(indexOfFirstOrder, indexOfLastOrder);
// 1. sort edilmiş sifarişlər


  return (
    <Layout>

      <h2 className={styles.title}>Sifarişlər</h2>

      <div className={styles.stats}>
        <div className={styles.statBox}>
          <p>Ümumi sifarişlər</p>
          <BsCart3 className={styles.icon} size={15} />
          <span>{totalOrders}</span>
        </div>

        <div className={styles.statBox}>
          <p>Ümumi gəlir</p>
          <BsCurrencyDollar className={styles.money} size={15} />
          <span>{totalSales} ₼</span>
        </div>

        <div className={styles.statBox}>
          <p>Gözləyən</p>
          <BsClock className={styles.oclock} size={15} />
          <span>{pending}</span>
        </div>

        <div className={styles.statBox}>
          <p>Hazırlanır</p>
          <BsClock className={styles.oclock} size={15} />
          <span>{preparing}</span>
        </div>

        <div className={styles.statBox}>
          <p>Çatdırılan</p>
          <PiEyeLight className={styles.oclock} size={15} />
          <span>{delivered}</span>
        </div>

        <div className={styles.statBox}>
          <p>Ləğv edilən</p>
          <AiFillCloseCircle className={styles.close} size={15} />
          <span>{canceled}</span>
        </div>
      </div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>

              <th>No<FaSort className={styles.sort} size={12} 
            
              onClick={() =>
      handleSort(
        "orderNumber",
        sortConfig.direction === "asc" ? "desc" : "asc"
      )
    }
     style={{
        color: sortConfig.key === "orderNumber" ? "blue" : "gray"
   
  }} />
                <AiFillFilter className={styles.filter} size={12} /></th>
 
              <th>Tarix<FaSort className={styles.sort} size={12}   onClick={() =>
      handleSort(
        "createdAt",
        sortConfig.direction === "asc" ? "desc" : "asc"
      )
    } />
                <AiFillFilter className={styles.filter} size={12} /></th>
              <th>Çatdırılma ünvanı<FaSort className={styles.sort} size={12}   onClick={() =>
      handleSort(
        "address",
        sortConfig.direction === "asc" ? "desc" : "asc"
      )
    } />
                <AiFillFilter className={styles.filter} size={12} /></th>
              <th>Məhsul sayı<FaSort className={styles.sort} size={12}   onClick={() =>
      handleSort(
        "itemCount",
        sortConfig.direction === "asc" ? "desc" : "asc"
      )
    } />
                <AiFillFilter className={styles.filter} size={12} /></th>
              <th>Subtotal<FaSort className={styles.sort} size={12}   onClick={() =>
      handleSort(
        "total",
        sortConfig.direction === "asc" ? "desc" : "asc"
      )
    } m/>
                <AiFillFilter className={styles.filter} size={12} /></th>
              <th>Status<FaSort className={styles.sort} size={12}   onClick={() =>
      handleSort(
        "status",
        sortConfig.direction === "asc" ? "desc" : "asc"
      )
    } />
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
                <td><span className={
                  order.status === "PENDING"
                    ? styles.waiting
                    : order.status === "PREPARING"
                      ? styles.preparing
                      : order.status === "DELIVERED"
                        ? styles.delivery
                        : styles.canceled
                }>{statusMap[order.status]}</span></td>

    <td className={styles.action}>
  <button onClick={() => {
    setSelectedOrder(order); // hansı order seçildiyini saxlayır
    setOpenModal(true);      // modal açır
  }}><PiEyeLight size={13} />
    Göstər
  </button>
</td>
              </tr>))}
          </tbody>
        </table>
      </div>

      <Pagination
        currentPage={currentPage}
        totalItems={safeOrders.length}
        itemsPerPage={ordersPerPage}
        onPageChange={setCurrentPage} />


     <OrderModal
  isOpen={openModal}
  onClose={() => setOpenModal(false)}
  order={selectedOrder}
/>

    </Layout>
  )
};
;
export default Orders
