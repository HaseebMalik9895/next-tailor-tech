'use client';
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { FiMoreVertical, FiPrinter, FiEye } from 'react-icons/fi';
import { MdEdit, MdDelete, MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { MeasurementCard } from "../../components/measurementcard/page";
import { NewEntry } from '../../components/NewEntry/page';
import { Setting } from '../../components/Setting/page';
import { db } from "../../firebase/firebase";
import { ref, onValue } from "firebase/database";

const Main = () => {
    const [dashboardbutton, setDashboardbutton] = useState("Records");
    const [searchTerm, setSearchTerm] = useState("");
    const [showMeasurementCard, setShowMeasurementCard] = useState(false);
    const [selectedRecord, setSelectedRecord] = useState(null);
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [more, setMore] = useState(false);

    const [records, setRecords] = useState([]);
    const menuRef = useRef(null);

    // Fetch records from Firebase
    useEffect(() => {
        const entriesRef = ref(db, 'entries');
        const unsubscribe = onValue(entriesRef, snapshot => {
            const data = snapshot.val();
            if (data) {
                const recordsArray = Object.keys(data).map(key => ({
                    id: key,
                    ...data[key]
                }));
                setRecords(recordsArray.reverse()); // show latest first
            } else {
                setRecords([]);
            }
        });
        return () => unsubscribe();
    }, []);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setActiveMenu(null);
            }
        };
        if (activeMenu !== null) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [activeMenu]);

    const filteredRecords = records.filter(
        (record) =>
            record.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.code.includes(searchTerm)
    );

    const handleMeasurementClick = (record) => {
        setSelectedRecord(record);
        setShowMeasurementCard(true);
    };

    const closeMeasurementCard = () => {
        setShowMeasurementCard(false);
        setSelectedRecord(null);
    };

    const handleMenuClick = (id) => {
        setActiveMenu(prevId => (prevId === id ? null : id));
    };

    const handleEdit = (record) => {
        console.log('Edit:', record);
        setActiveMenu(null);
    };

    const handleDelete = (record) => {
        console.log('Delete:', record);
        setActiveMenu(null);
    };

    const handleView = (record) => {
        setActiveMenu(null);
        handleMeasurementClick(record);
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
                            className={dashboardbutton === "Records" ? styles.activebutton : styles.button}
                            onClick={() => { setDashboardbutton("Records"); setMore(false); setShowNewEntry(false); }}
                        >
                            <h3>Records</h3>
                        </button>
                        <button
                            className={dashboardbutton === "New entry" ? styles.activebutton : styles.button}
                            onClick={() => { setDashboardbutton("New entry"); setMore(false); setShowNewEntry(true); }}
                        >
                            <h3>New entry</h3>
                        </button>
                        <div style={{ position: 'relative', width: '100%' }}>
                            <button
                                className={more ? styles.activebutton : styles.button}
                                onClick={() => setMore(prev => !prev)}
                            >
                                <h3>More</h3>
                                {more ? <MdKeyboardArrowDown size={24} color="#fb8500" /> :
                                    <MdKeyboardArrowUp size={24} color="#023047" />}
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
                                    style={{ height: "auto", maxWidth: "40px", maxHeight: "40px" }}
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
                            {filteredRecords.map(record => {
                                const status = record.deliveredDate ? "Delivered" : "Pending";
                                return (
                                    <div key={record.id} className={`${styles.listdiv} ${activeMenu === record.id ? styles.menuOpen : ''}`}>
                                        <div className={styles.leftlistdiv}>
                                            <Image
                                                src={record.image || "/person1.png"}
                                                layout="responsive"
                                                width={50}
                                                height={50}
                                                alt="person"
                                                style={{ width: "50%", height: "auto", maxWidth: "40px", maxHeight: "40px" }}
                                            />
                                            <div className={styles.codediv}><h7>{record.code}</h7></div>
                                            <div className={styles.namediv} onClick={() => handleMeasurementClick(record)}><h3>{record.customerName}</h3></div>
                                            <div className={styles.statusdiv}><span style={{ color: status === "Pending" ? "red" : "green" }}>{status}</span></div>
                                            <div className={styles.receivediv}><span>{record.receivingDate}</span></div>
                                            <div className={styles.deleverdiv}><span>{record.deliveredDate}</span></div>
                                        </div>

                                        <div className={styles.Rightlistdiv}>
                                            <FiPrinter size={24} color="black" />
                                            <div className={styles.menuContainer} ref={menuRef}>
                                                <FiMoreVertical
                                                    size={24}
                                                    className={styles.moreIcon}
                                                    onClick={() => handleMenuClick(record.id)}
                                                />
                                                {activeMenu === record.id && (
                                                    <div className={styles.menuDiv}>
                                                        <div className={styles.MenuTextDiv} onClick={() => handleEdit(record)}>
                                                            <MdEdit size={20} color="#4CAF50" /> <p>Edit</p>
                                                        </div>
                                                        <div className={styles.MenuTextDiv} onClick={() => handleView(record)}>
                                                            <FiEye size={20} color="#2196F3" /> <p>View</p>
                                                        </div>
                                                        <div className={styles.MenuTextDivDelete} onClick={() => handleDelete(record)}>
                                                            <MdDelete size={20} color="#f44336" /> <p>Delete</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {showMeasurementCard && (
                            <MeasurementCard record={selectedRecord} closeMeasurementCard={closeMeasurementCard} />
                        )}
                    </div>
                )}

                {/* NEW ENTRY */}
                {dashboardbutton === "New entry" && showNewEntry && (
                    <div className={styles.NewEntryDiv}>
                        <NewEntry />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Main;
