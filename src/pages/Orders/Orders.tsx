
import React, { useState } from "react";
import Layout from "../../common/components/Layout/Layout";
import styles from "./Orders.module.css";
import { BsCart3 } from "react-icons/bs";
import { BsClock } from "react-icons/bs";
import { BsCurrencyDollar } from "react-icons/bs";
import { AiFillCloseCircle } from "react-icons/ai";


 


const Orders = () => {
  
  return (
    <Layout>
   
  <h2 className={styles.title}>Sifarişlər</h2>

  <div className={styles.stats}>
    <div className={styles.statBox}>
      <p>Ümumi sifariş</p>
      <BsCart3 className={styles.icon} size={15}  />
      <span>92</span>
    </div>

    <div className={styles.statBox}>
      <p>Ümumi gəlir</p>
      <BsCurrencyDollar className={styles.money} size={15}  />
      <span>64.5 ₼</span>
    </div>

    <div className={styles.statBox}>
      <p>Gözləyən</p>
      <BsClock className={styles.oclock} size={15}  />
      <span>53</span>
    </div>

    <div className={styles.statBox}>
      <p>Hazırlanır</p>
        <BsClock className={styles.oclock} size={15}  />
      <span>6</span>
    </div>

    <div className={styles.statBox}>
      <p>Çatdırılan</p>
      <BsClock className={styles.oclock} size={15}  />
      <span>10</span>
    </div>

    <div className={styles.statBox}>
      <p>Ləğv edilən</p>
      <AiFillCloseCircle className={styles.close} size={15}  />
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
