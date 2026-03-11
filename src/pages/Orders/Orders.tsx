
import React, { useState } from "react";
import Layout from "../../common/components/Layout/Layout";
import styles from "./Orders.module.css";


 


const Orders = () => {
  
  return (
    <Layout>
   
  <h2 className={styles.title}>Sifarişlər</h2>

  <div className={styles.stats}>
    <div className={styles.statBox}>
      <p>Ümumi sifariş</p>
      <span>92</span>
    </div>

    <div className={styles.statBox}>
      <p>Ümumi gəlir</p>
      <span>6234.35 ₼</span>
    </div>

    <div className={styles.statBox}>
      <p>Məhsullar</p>
      <span>53</span>
    </div>

    <div className={styles.statBox}>
      <p>Müştəri</p>
      <span>6</span>
    </div>

    <div className={styles.statBox}>
      <p>Çatdırılan</p>
      <span>10</span>
    </div>

    <div className={styles.statBox}>
      <p>Ləğv edilən</p>
      <span>0</span>
    </div>
  </div>

  <table className={styles.table}>
    <thead>
      <tr>
        <th>No</th>
        <th>Tarix</th>
        <th>Çatdırılma ünvanı</th>
        <th>Məhsul sayı</th>
        <th>Subtotal</th>
        <th>Status</th>
        <th>Əməliyyat</th>
      </tr>
    </thead>

    <tbody>
      <tr>
        <td>ORD-20</td>
        <td>11-02</td>
        <td>Xətai rayonu</td>
        <td>5</td>
        <td>11.99 ₼</td>
        <td><span className={styles.pending}>Gözləyir</span></td>
        <td className={styles.action}>Göstər</td>
      </tr>

      <tr>
        <td>ORD-21</td>
        <td>11-02</td>
        <td>Xətai rayonu</td>
        <td>8</td>
        <td>21.99 ₼</td>
        <td><span className={styles.delivery}>Çatdırılır</span></td>
        <td className={styles.action}>Göstər</td>
      </tr>

      <tr>
        <td>ORD-22</td>
        <td>11-02</td>
        <td>Əcəmi</td>
        <td>3</td>
        <td>15.20 ₼</td>
        <td><span className={styles.waiting}>Gözləyir</span></td>
        <td className={styles.action}>Göstər</td>
      </tr>
    </tbody>
  </table>

  <div className={styles.pagination}>
    <span>1</span>
    <span>2</span>
    <span>3</span>
    <span>4</span>
  </div>

    
       
           
                   

       
      
    </Layout>
  );
};
export default Orders
