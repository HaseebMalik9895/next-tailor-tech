"use client";
import React, { useState } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import { FiMoreVertical } from 'react-icons/fi';
import { FiPrinter } from 'react-icons/fi';
// import { MdEdit, MdDelete } from 'react-icons/md';
import { MeasurementCard } from "../../components/measurementcard/page";
import { NewEntry } from '../../components/NewEntry/page'
import {Setting} from '../../components/Setting/page'
import { MdKeyboardArrowDown } from "react-icons/md";
import { MdKeyboardArrowUp } from "react-icons/md";
// import { useRouter } from "next/navigation";
// import { Time } from '../../components/Time/page'

const records = [
    { id: 1, code: "1836", name: "Ahmed Ali Khan", status: "Deleverd", image: "/person1.png", receive: "20/09/2024", delever: "30/09/2024" },
    { id: 2, code: "87367", name: "Fatima Zahra", status: "Pending", image: "/person1.png", receive: "20/09/2024", delever: "30/09/2024" },
    { id: 3, code: "87367", name: "Ali Raza", status: "Deleverd", image: "/person1.png", receive: "20/09/2024", delever: "30/09/2024" },
    { id: 4, code: "33556", name: "Saira Bibi", status: "Pending", image: "/person1.png", receive: "21/09/2024", delever: "01/10/2024" },
    { id: 5, code: "23534", name: "Muhammad Usman", status: "Deleverd", image: "/person1.png", receive: "22/09/2024", delever: "05/10/2024" },
    { id: 6, code: "34334", name: "Ayesha Khan", status: "Pending", image: "/person1.png", receive: "20/09/2024", delever: "30/09/2024" },
    { id: 7, code: "997820", name: "Bilal Ahmed", status: "Deleverd", image: "/person1.png", receive: "19/09/2024", delever: "25/09/2024" },
    { id: 8, code: "4455", name: "Mariam Noor", status: "Pending", image: "/person1.png", receive: "23/09/2024", delever: "02/10/2024" },
    { id: 9, code: "332", name: "Omer Farooq", status: "Deleverd", image: "/person1.png", receive: "20/09/2024", delever: "30/09/2024" },
    { id: 10, code: "193633", name: "Zainab Iqbal", status: "Pending", image: "/person1.png", receive: "21/09/2024", delever: "01/10/2024" },
    { id: 11, code: "33556", name: "Shahzad Khan", status: "Deleverd", image: "/person1.png", receive: "20/09/2024", delever: "30/09/2024" },
    { id: 12, code: "33556", name: "Saira Bibi", status: "Pending", image: "/person1.png", receive: "21/09/2024", delever: "01/10/2024" },
    { id: 13, code: "23534", name: "Muhammad Usman", status: "Deleverd", image: "/person1.png", receive: "22/09/2024", delever: "05/10/2024" },
    { id: 14, code: "34334", name: "Ayesha Khan", status: "Pending", image: "/person1.png", receive: "20/09/2024", delever: "30/09/2024" },
    { id: 15, code: "997820", name: "Bilal Ahmed", status: "Deleverd", image: "/person1.png", receive: "19/09/2024", delever: "25/09/2024" },
    { id: 16, code: "4455", name: "Mariam Noor", status: "Pending", image: "/person1.png", receive: "23/09/2024", delever: "02/10/2024" },
];


const Main = () => {
    // const [listbutton, setListbutton] = useState("List");
    const [dashboardbutton, setDashboardbutton] = useState("Records");
    const [searchTerm, setSearchTerm] = useState(""); // State to store the search term
    const [showMeasurementCard, setShowMeasurementCard] = useState(false); // State for showing MeasurementCard
    const [selectedRecord, setSelectedRecord] = useState(null); // State for selected record to pass to MeasurementCard
    const [showNewEntry, setShowNewEntry] = useState(false);
    const [activeMenu, setActiveMenu] = useState(null);
    const [more , setMore] = useState('')
    // const router = useRouter();

    
    // Filter records based on search term
    const filteredRecords = records.filter(
        (record) =>
            record.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            record.code.includes(searchTerm)
    );

    // Function to handle showing the MeasurementCard and passing selected record
    const handleMeasurementClick = (record) => {
        setSelectedRecord(record); // Set the selected record
        setShowMeasurementCard((prevState) => !prevState); // Toggle MeasurementCard visibility
    };
    // Function to close the MeasurementCard
    const closeMeasurementCard = () => {
        setShowMeasurementCard(false); // Hide MeasurementCard
        setSelectedRecord(null); // Clear selected record
    };
    const handleMenuClick = (id) => {
        setActiveMenu((prevId) => (prevId === id ? null : id));
    };

    return (
        <div className={styles.perentdiv}>
            <div className={styles.leftdiv}>
                <div className={styles.leftheader}>
                    <Image
                        src="/logo.png"
                        layout="responsive"
                        width={100}
                        height={100}
                        alt="Logo"
                        style={{
                            height: "auto",
                            maxWidth: "50px",
                            maxHeight: "50px"
                        }}
                    />
                    <h2>Tailor Tech</h2>
                </div>
                <div className={styles.leftDashPlusAdminDiv}>
                <div className={styles.dashboard}>
                    <button
                        className={dashboardbutton === "Records" ? styles.activebutton : styles.button}
                        onClick={() => {setDashboardbutton("Records");setMore(false)
                            console.log('dashboardddd recor', dashboardbutton)}}
                    >
                        <h3>Records</h3>
                    </button>
                    <button
                        className={dashboardbutton === "New entry" ? styles.activebutton : styles.button}
                        onClick={() => {setDashboardbutton("New entry");setMore(false)
                            console.log('dashboardddd entry', dashboardbutton)}}
                    >
                        <h3>New entry</h3>
                    </button>
                    <button
                        className={more === true ? styles.activebutton : styles.button}
                        onClick={() => {setMore((prevMore) => !prevMore);;
                            console.log('dashboardddd', dashboardbutton);
                            console.log('more', more);
                          }}
                        
                    >
                        <h3>More</h3>
                        {more===true ?(
                            <MdKeyboardArrowDown size={24} color="#fb8500" />
                        ):(<MdKeyboardArrowUp size={24} color="#023047" />)}
                    </button>
                    
                {more===true&&(
                    <Setting/>
                )} 
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
                                    maxHeight: "40px"
                                }}
                            />
                        </div>
                        <div className={styles.admintext} >
                            <h3>Admin</h3>
                            <p>Welcome to tailor tech</p>
                        </div>
                    </button>
                </div>
                </div>
               
            </div>

            <div className={styles.rightdiv}>
                <div className={styles.rightheader}>
                    <h2>{dashboardbutton}</h2>
                </div>
                {dashboardbutton === "Records" && (
                    <div className={styles.rightchilddiv}>
                        <div className={styles.searchdiv}>
                            <div className={styles.rightheaderinputdiv}>
                                <input
                                    className={styles.inputstyle}
                                    placeholder="Search"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)} // Update search term on input change
                                />
                            </div>
                            
                        </div>

                        <div className={styles.recordlist}>
                        {filteredRecords.map((record) => (
                                <div key={record.id} className={styles.listdiv}>
                                    <div className={styles.leftlistdiv}>
                                        <Image
                                            src={record.image}
                                            layout="responsive"
                                            width={50}
                                            height={50}
                                            alt="person"
                                            style={{
                                                width: "50%",
                                                height: "auto",
                                                maxWidth: "40px",
                                                maxHeight: "40px",
                                                border: "10px",
                                                borderColor: "red",
                                            }}
                                        />
                                        <div className={styles.codediv}><h7>{record.code}</h7></div>
                                        <div className={styles.namediv} onClick={() => handleMeasurementClick(record)}><h3>{record.name}</h3></div>
                                        <div className={styles.statusdiv}>
                                            <span
                                                style={{
                                                    color: record.status === "Pending" ? "red" : record.status === "Deleverd" ? "green" : "black",
                                                }}
                                            >
                                                {record.status}
                                            </span>
                                        </div>
                                        <div className={styles.receivediv}><span>{record.receive}</span></div>
                                        <div className={styles.deleverdiv}><span>{record.delever}</span></div>
                                    </div>
                                    <div className={styles.Rightlistdiv}>
                                        <FiPrinter size={24} color="black" />
                                        <FiMoreVertical
                                            size={24}
                                            style={{ color: 'gray' }}
                                            onClick={() => handleMenuClick(record.id)} // Pass the record ID to the handler
                                        />
                                    {activeMenu === record.id && (
                                        <div className={styles.menuDiv}>
                                            <ul>
                                                <li>
                                                   <text> edit</text>
                                                </li>
                                                <li>
                                                   <text> edit</text>
                                                </li>
                                                <li>
                                                   <text> edit</text>
                                                </li>
                                                <li>
                                                   <text> edit</text>
                                                </li>
                                            </ul>
                                        </div>
                                    )}
                                    </div>
                                </div>
                            ))}
                            
                        </div>
                            {showMeasurementCard && (
                                <MeasurementCard
                                    record={selectedRecord}
                                    closeMeasurementCard={closeMeasurementCard} // Pass close function to MeasurementCard
                                    />
                                )}


                    </div>
                )}
                {dashboardbutton === "New entry" && (
                    <div className={styles.NewEntryDiv}>
                        {!showNewEntry ? (
                            // Show the button and the text if showNewEntry is false
                            <div className={styles.buttondiv}>
                                <button className={styles.plusdiv} onClick={() => setShowNewEntry(true)}>
                                    <h1>+</h1>
                                </button>
                                <h3>ADD NEW ENTRY</h3>
                            </div>
                        ) : (
                            // Show NewEntry component if showNewEntry is true
                            <NewEntry />
                        )}
                    </div>
                )}
                
            </div>
        </div>
    );
};



export default Main;




// <div className={styles.MenuDiv}>
//                                                 <div className={styles.MenuTextDiv}>
//                                                     <MdEdit
//                                                         size={24}
//                                                         color={"green"}
                                                   
//                                                     /><p>Edit</p></div>
//                                                 <div className={styles.MenuTextDiv}>
//                                                     <MdEdit
//                                                         size={24}
//                                                         color={"green"}
                                                   
//                                                     /><p>Edit</p></div>
//                                                 <div className={styles.MenuTextDiv}>
//                                                     <MdEdit
//                                                         size={24}
//                                                         color={"green"}
                                                   
//                                                     /><p>Edit</p></div>
//                                                 <div className={styles.MenuTextDiv}>
//                                                     <MdEdit
//                                                         size={24}
//                                                         color={"green"}
                                                   
//                                                     /><p>Edit</p></div>
//                                                 <div className={styles.MenuTextDiv}>
//                                                     <MdEdit
//                                                         size={24}
//                                                         color={"green"}
                                                   
//                                                     /><p>Edit</p></div>
//                                             </div>