"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "../../../firebase/firebase";
import { ref, get, update } from "firebase/database";

const StatusRecord = () => {
  const params = useParams();
  const { id } = params; // record ID from URL
  const [record, setRecord] = useState(null);

  useEffect(() => {
    const recordRef = ref(db, `entries/${id}`);
    get(recordRef).then((snapshot) => {
      if (snapshot.exists()) setRecord(snapshot.val());
    });
  }, [id]);

  const handleStatusChange = (newStatus) => {
    const deliveredDate = newStatus === "Delivered" ? new Date().toLocaleDateString() : "";
    update(ref(db, `entries/${id}`), { deliveredDate })
      .then(() => setRecord((prev) => ({ ...prev, deliveredDate })));
  };

  if (!record) return <div>Loading...</div>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Status Details</h2>
      <p><strong>Name:</strong> {record.customerName}</p>
      <p><strong>Code:</strong> {record.code}</p>
      <p><strong>Phone:</strong> {record.phoneNumber || "N/A"}</p>
      <p><strong>Status:</strong> {record.deliveredDate ? "Delivered" : "Pending"}</p>
      <p><strong>Receiving Date:</strong> {record.receivingDate}</p>
      <p><strong>Delivered Date:</strong> {record.deliveredDate || "-"}</p>

      <div style={{ marginTop: "20px" }}>
        <button
          style={{ marginRight: "10px", backgroundColor: !record.deliveredDate ? "red" : "#ccc" }}
          onClick={() => handleStatusChange("Pending")}
        >
          Pending
        </button>
        <button
          style={{ backgroundColor: record.deliveredDate ? "green" : "#ccc" }}
          onClick={() => handleStatusChange("Delivered")}
        >
          Delivered
        </button>
      </div>
    </div>
  );
};

export default StatusRecord ;
