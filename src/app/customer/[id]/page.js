"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { db } from "../../../firebase/firebase";
import { ref, get } from "firebase/database";
import styles from "./styles.module.css";
import Image from "next/image";

const CustomerProfile = () => {
  const params = useParams();
  const router = useRouter();
  const { id } = params;
  const [customer, setCustomer] = useState(null);
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    if (!id) return;

    // Fetch customer data
    const customerRef = ref(db, `entries/${id}`);
    get(customerRef).then((snapshot) => {
      if (snapshot.exists()) {
        setCustomer({ id, ...snapshot.val() });
      }
    });

    // Fetch order history for this customer
    const entriesRef = ref(db, "entries");
    get(entriesRef).then((snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const orders = Object.keys(data)
          .map((key) => ({ id: key, ...data[key] }))
          .filter((entry) => entry.code === snapshot.val()[id]?.code)
          .sort((a, b) => new Date(b.receivingDate) - new Date(a.receivingDate));
        setOrderHistory(orders);
      }
    });
  }, [id]);

  const handleNewOrder = () => {
    // Navigate to dashboard with customer data for new order
    router.push(`/dashboard?newOrder=${id}`);
  };

  if (!customer) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button className={styles.backButton} onClick={() => router.back()}>
          ← Back
        </button>
        <h1>Customer Profile</h1>
      </div>

      <div className={styles.profileSection}>
        <div className={styles.imageSection}>
          <Image
            src={customer.image || "/person1.png"}
            alt={customer.customerName}
            width={150}
            height={150}
            className={styles.profileImage}
          />
        </div>

        <div className={styles.infoSection}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Name:</span>
            <span className={styles.value}>{customer.customerName}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Code:</span>
            <span className={styles.value}>{customer.code}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.label}>Phone:</span>
            <span className={styles.value}>{customer.phone || "N/A"}</span>
          </div>
        </div>
      </div>

      <div className={styles.measurementsSection}>
        <h2>Measurements</h2>
        <div className={styles.measurementsGrid}>
          {Object.entries(customer.measurements || {}).map(([key, value]) => (
            <div key={key} className={styles.measurementItem}>
              <span className={styles.measurementLabel}>{key}:</span>
              <span className={styles.measurementValue}>{value}</span>
            </div>
          ))}
        </div>

        <div className={styles.radiosSection}>
          <div className={styles.radioItem}>
            <span className={styles.label}>Hem:</span>
            <span className={styles.value}>{customer.radios?.hem || "N/A"}</span>
          </div>
          <div className={styles.radioItem}>
            <span className={styles.label}>Collar:</span>
            <span className={styles.value}>{customer.radios?.collar || "N/A"}</span>
          </div>
          <div className={styles.radioItem}>
            <span className={styles.label}>Stitching:</span>
            <span className={styles.value}>{customer.radios?.stitching || "N/A"}</span>
          </div>
        </div>

        {customer.description && (
          <div className={styles.descriptionSection}>
            <h3>Description:</h3>
            <p>{customer.description}</p>
          </div>
        )}
      </div>

      <div className={styles.orderHistorySection}>
        <h2>Order History</h2>
        {orderHistory.length > 0 ? (
          <div className={styles.historyList}>
            {orderHistory.map((order) => (
              <div key={order.id} className={styles.historyItem}>
                <div className={styles.historyInfo}>
                  <span>Receiving Date: {order.receivingDate}</span>
                  <span>Delivered Date: {order.deliveredDate || "Pending"}</span>
                  <span className={order.status === "Delivered" ? styles.delivered : styles.pending}>
                    {order.status || "Pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No order history found</p>
        )}
      </div>

      <div className={styles.actionSection}>
        <button className={styles.newOrderButton} onClick={handleNewOrder}>
          New Order
        </button>
      </div>
    </div>
  );
};

export default CustomerProfile;
