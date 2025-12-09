"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { MdEdit, MdDelete } from "react-icons/md";
import { MeasurementCard } from "../../components/measurementcard/page";
import { NewEntry } from "../../components/NewEntry/page";
import { Setting } from "../../components/Setting/page";
import { db } from "../../firebase/firebase";
import { ref, onValue, remove } from "firebase/database";
import { useRouter } from "next/navigation";



const Main = () => {
  const [dashboardbutton, setDashboardbutton] = useState("Records");
  const [searchTerm, setSearchTerm] = useState("");
  const [showMeasurementCard, setShowMeasurementCard] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showNewEntry, setShowNewEntry] = useState(false);
  const [more, setMore] = useState(false);
  const [records, setRecords] = useState([]);
  const [isNewOrder, setIsNewOrder] = useState(false);



  // Modal state for delete
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const entriesRef = ref(db, "entries");
    const unsubscribe = onValue(entriesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recordsArray = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setRecords(recordsArray.reverse());
      } else {
        setRecords([]);
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle new order from customer profile
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const newOrderId = urlParams.get("newOrder");
    
    if (newOrderId) {
      const record = records.find((r) => r.id === newOrderId);
      if (record) {
        setSelectedRecord(record);
        setIsNewOrder(true);
        setDashboardbutton("New entry");
        setShowNewEntry(true);
        // Clear URL parameter
        window.history.replaceState({}, "", "/dashboard");
      }
    }
  }, [records]);

  // Prevent back navigation to login page
  useEffect(() => {
    const handlePopState = () => {
      // Stay on dashboard, don't go back
      window.history.pushState(null, "", window.location.href);
    };

    // Push initial state
    window.history.pushState(null, "", window.location.href);
    
    // Listen for back button
    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  // Filter records based on search and status
  const filteredRecords = records.filter(
    (record) =>
      record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.code.includes(searchTerm)
  );

  // Pending records for Records section
  const pendingRecords = filteredRecords.filter((record) => {
    const status = record.status || (record.deliveredDate ? "Delivered" : "Pending");
    return status === "Pending";
  });

  // Delivered records for History section
  const deliveredRecords = filteredRecords.filter((record) => {
    const status = record.status || (record.deliveredDate ? "Delivered" : "Pending");
    return status === "Delivered";
  });

  const handleMeasurementClick = (record) => {
    setSelectedRecord(record);
    setShowMeasurementCard(true);
  };

  const closeMeasurementCard = () => {
    setShowMeasurementCard(false);
    setSelectedRecord(null);
  };

  const handleEdit = (record) => {
    setSelectedRecord(record); // record to edit
    setDashboardbutton("New entry"); // switch to NewEntry screen
    setShowNewEntry(true);
  };

  const handleDeleteClick = (record) => {
    setRecordToDelete(record);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (recordToDelete) {
      remove(ref(db, `entries/${recordToDelete.id}`))
        .then(() => {
          console.log("Record deleted");
          setShowDeleteModal(false);
          setRecordToDelete(null);
        })
        .catch((err) => console.error(err));
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setRecordToDelete(null);
  };

  return (
    <div className={styles.perentdiv}>
      {/* LEFT SIDEBAR */}
      <div className={styles.leftdiv}>
        <div className={styles.leftheader}>
          <Image
            src="/logo.png"
            layout="responsive"
            width={100}
            height={100}
            alt="Logo"
            style={{ height: "auto", maxWidth: "50px", maxHeight: "50px" }}
          />
          <h2>Tailor Tech</h2>
        </div>

        <div className={styles.leftDashPlusAdminDiv}>
          <div className={styles.dashboard}>
            <button
              className={
                dashboardbutton === "Records"
                  ? styles.activebutton
                  : styles.button
              }
              onClick={() => {
                setDashboardbutton("Records");
                setMore(false);
                setShowNewEntry(false);
              }}
            >
              <h3>Records</h3>
            </button>
            <button
              className={
                dashboardbutton === "New entry"
                  ? styles.activebutton
                  : styles.button
              }
              onClick={() => {
                setDashboardbutton("New entry");
                setMore(false);
                setShowNewEntry(true);
                setSelectedRecord(null); // reset selected record
              }}
            >
              <h3>New entry</h3>
            </button>
             <button
              className={
                dashboardbutton === "History"
                  ? styles.activebutton
                  : styles.button
              }
              onClick={() => {
                setDashboardbutton("History");
                setMore(false);
                setShowNewEntry(false);
              }}
            >
              <h3>History</h3>
            </button>
            <div style={{ position: "relative", width: "100%" }}>
              <button
                className={more ? styles.activebutton : styles.button}
                onClick={() => setMore((prev) => !prev)}
              >
                <h3>More</h3>
              </button>
              {more && <Setting />}
            </div>
          </div>

          <div className={styles.admindiv}>
            <button className={styles.admin}>
              <div>
                <Image
                  src="/person.png"
                  layout="responsive"
                  width={50}
                  height={50}
                  alt="person"
                  style={{
                    height: "auto",
                    maxWidth: "40px",
                    maxHeight: "40px",
                  }}
                />
              </div>
              <div className={styles.admintext}>
                <h3>Admin</h3>
                <p>Welcome to Tailor Tech</p>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT MAIN */}
      <div className={styles.rightdiv}>
        <div className={styles.rightheader}>
          <h2>{dashboardbutton}</h2>
        </div>

        {/* RECORDS */}
        {dashboardbutton === "Records" && (
          <div className={styles.rightchilddiv}>
            <div className={styles.searchdiv}>
              <div className={styles.rightheaderinputdiv}>
                <input
                  className={styles.inputstyle}
                  placeholder="Search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.recordlist}>
              {pendingRecords.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  <p>No pending records found</p>
                </div>
              ) : (
                pendingRecords.map((record) => {
                  const status = record.status || (record.deliveredDate ? "Delivered" : "Pending");
                  return (
                    <div key={record.id} className={styles.listdiv}>
                    <div className={styles.leftlistdiv}>
                      <Image
                        src={record.image || "/person1.png"}
                        layout="responsive"
                        width={50}
                        height={50}
                        alt="person"
                        style={{
                          width: "50%",
                          height: "auto",
                          maxWidth: "40px",
                          maxHeight: "40px",
                        }}
                      />
                      <div className={styles.codediv}>
                        <h7>{record.code}</h7>
                      </div>
                      <div
                        className={styles.namediv}
                        onClick={() => handleMeasurementClick(record)}
                      >
                        <h3>{record.customerName}</h3>
                      </div>
                      <div
                        onClick={() => router.push("/statusRecord")}
                        className={styles.statusdiv}
                        style={{
                          backgroundColor:
                            status === "Pending" ? "#ffcdd2" : "#c8e6c9", // light red / light green
                          borderRadius: "5px",
                          padding: "2px 6px",
                          display: "inline-block",
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            color: status === "Pending" ? "red" : "green", // text color
                            fontWeight: "bold",
                          }}
                        >
                          {status}
                        </span>
                      </div>

                      <div className={styles.receivediv}>
                        <span>{record.receivingDate}</span>
                      </div>
                      <div className={styles.deleverdiv}>
                        <span>{record.deliveredDate || "-"}</span>
                      </div>
                    </div>

                    <div className={styles.Rightlistdiv}>
                      <button
                        className={styles.actionButton}
                        onClick={() => handleEdit(record)}
                      >
                        <MdEdit size={18} color="green" />
                      </button>

                      <button
                        className={styles.actionButtonDelete}
                        onClick={() => handleDeleteClick(record)}
                      >
                        <MdDelete size={18} color="red" />
                      </button>
                    </div>
                  </div>
                );
              })
              )}
            </div>

            {showMeasurementCard && (
              <MeasurementCard
                record={selectedRecord}
                closeMeasurementCard={closeMeasurementCard}
              />
            )}

            {/* DELETE CONFIRMATION MODAL */}
            {showDeleteModal && (
              <div className={styles.modalOverlay}>
                <div className={styles.modalContent}>
                  <h3>
                    Are you sure you want <br />
                    to delete this record?
                  </h3>

                  <div className={styles.modalButtons}>
                    <button
                      className={styles.cancelButton}
                      onClick={cancelDelete}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.confirmButton}
                      onClick={confirmDelete}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* NEW ENTRY */}
        {dashboardbutton === "New entry" && showNewEntry && (
          <div className={styles.NewEntryDiv}>
            <NewEntry 
              recordToEdit={selectedRecord}
              isNewOrder={isNewOrder}
              onSaveSuccess={() => {
                setDashboardbutton("Records");
                setShowNewEntry(false);
                setSelectedRecord(null);
                setIsNewOrder(false);
              }}
            />
          </div>
        )}

        {/* HISTORY */}
        {dashboardbutton === "History" && (
          <div className={styles.rightchilddiv}>
            <div className={styles.searchdiv}>
              <div className={styles.rightheaderinputdiv}>
                <input
                  className={styles.inputstyle}
                  placeholder="Search history"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.recordlist}>
              {deliveredRecords.length === 0 ? (
                <div style={{ padding: "20px", textAlign: "center", color: "#666" }}>
                  <p>No delivered records found</p>
                </div>
              ) : (
                deliveredRecords.map((record) => {
                  const status = record.status || (record.deliveredDate ? "Delivered" : "Pending");
                  return (
                    <div 
                      key={record.id} 
                      className={styles.listdiv}
                      onClick={() => router.push(`/customer/${record.id}`)}
                      style={{ cursor: "pointer" }}
                    >
                    <div className={styles.leftlistdiv}>
                      <Image
                        src={record.image || "/person1.png"}
                        layout="responsive"
                        width={50}
                        height={50}
                        alt="person"
                        style={{
                          width: "50%",
                          height: "auto",
                          maxWidth: "40px",
                          maxHeight: "40px",
                        }}
                      />
                      <div className={styles.codediv}>
                        <h7>{record.code}</h7>
                      </div>
                      <div className={styles.namediv}>
                        <h3>{record.customerName}</h3>
                      </div>
                      <div
                        className={styles.statusdiv}
                        style={{
                          backgroundColor:
                            status === "Pending" ? "#ffcdd2" : "#c8e6c9",
                          borderRadius: "5px",
                          padding: "2px 6px",
                          display: "inline-block",
                          minWidth: "60px",
                          textAlign: "center",
                        }}
                      >
                        <span
                          style={{
                            color: status === "Pending" ? "red" : "green",
                            fontWeight: "bold",
                          }}
                        >
                          {status}
                        </span>
                      </div>

                      <div className={styles.receivediv}>
                        <span>{record.receivingDate}</span>
                      </div>
                      <div className={styles.deleverdiv}>
                        <span>{record.deliveredDate || "-"}</span>
                      </div>
                    </div>
                  </div>
                );
              })
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Main;
