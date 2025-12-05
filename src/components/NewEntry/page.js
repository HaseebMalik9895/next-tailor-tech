'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';
import { db } from "../../firebase/firebase";
import { ref, push, set } from "firebase/database";

const NewEntry = ({ recordToEdit }) => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentDate, setCurrentDate] = useState('');
    const [deliveredDate, setDeliveredDate] = useState('');
    const [modal, setModal] = useState(false);

    const [customerName, setCustomerName] = useState('');
    const [phone, setPhone] = useState('');
    const [code, setCode] = useState('');
    const [description, setDescription] = useState('');
    const [measurements, setMeasurements] = useState({});
    const [radios, setRadios] = useState({ hem: '', collar: '', stitching: '' });

    const inputNames = [
        'Length', 'Chest', 'Waist', 'Shoulder', 'Arm',
        'Neck', 'Hem', 'Trouser Length', 'Trouser Cuff',
        'Trouser Hem', 'Side Pocket', 'Front Pocket',
        'Trouser Pocket', 'Cuff length'
    ];

    useEffect(() => {
        const today = new Date();
        setCurrentDate(today.toISOString().split('T')[0]);

        if (recordToEdit) {
            // Prefill form fields for editing
            setCustomerName(recordToEdit.customerName || '');
            setPhone(recordToEdit.phone || '');
            setCode(recordToEdit.code || '');
            setDescription(recordToEdit.description || '');
            setMeasurements(recordToEdit.measurements || {});
            setRadios(recordToEdit.radios || { hem: '', collar: '', stitching: '' });
            setCurrentDate(recordToEdit.receivingDate || today.toISOString().split('T')[0]);
            setDeliveredDate(recordToEdit.deliveredDate || '');
            setSelectedImage(recordToEdit.image || null);
        }
    }, [recordToEdit]);

    const handleMeasurementChange = (name, value) => {
        setMeasurements(prev => ({ ...prev, [name]: value }));
    };

    const handleRadioChange = (name, value) => {
        setRadios(prev => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const handleSaveClick = () => setModal(true);

    const confirmSave = async () => {
        try {
            if (recordToEdit) {
                // Update existing record
                const recordRef = ref(db, `entries/${recordToEdit.id}`);
                await set(recordRef, {
                    customerName,
                    phone,
                    code,
                    measurements,
                    radios,
                    description,
                    receivingDate: currentDate,
                    deliveredDate,
                    image: selectedImage || null
                });
                // alert('Entry updated successfully!');
            } else {
                // Create new entry
                const entryRef = ref(db, 'entries');
                const newEntryRef = push(entryRef);
                await set(newEntryRef, {
                    customerName,
                    phone,
                    code,
                    measurements,
                    radios,
                    description,
                    receivingDate: currentDate,
                    deliveredDate,
                    image: selectedImage || null
                });
                // alert('Entry saved successfully!');
            }

            setModal(false);

            // Reset form
            setCustomerName('');
            setPhone('');
            setCode('');
            setMeasurements({});
            setRadios({ hem: '', collar: '', stitching: '' });
            setDescription('');
            setSelectedImage(null);
            setDeliveredDate('');
        } catch (err) {
            alert('Error saving entry: ' + err.message);
        }
    };

    return (
        <div className={styles.ParentDiv}>
            {/* Top Section: Dates + Image */}
            <div className={styles.TopDiv}>
                <div>
                    <label className={styles.label}>Receiving Date: </label>
                    <input type="date" className={styles.DateInputs} value={currentDate} onChange={(e) => setCurrentDate(e.target.value)} />
                </div>
                <div className={styles.MainImageDiv}>
                    <div className={styles.ImageDiv}>
                        <Image
                            className={styles.SelectedImage}
                            src={selectedImage || "/person1.png"}
                            alt="Circular Image"
                            width={150}
                            height={150}
                        />
                    </div>
                    <label className={styles.CameraButton}>
                        <FaCamera size={20} color="black" />
                        <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImageChange} />
                    </label>
                </div>
                <div>
                    <label className={styles.label}>Delivered Date: </label>
                    <input type="date" className={styles.DateInputs} value={deliveredDate} onChange={(e) => setDeliveredDate(e.target.value)} />
                </div>
            </div>

            {/* Middle Section: Customer Info */}
            <div className={styles.MidDiv}>
                <div className={styles.MidFirstDiv}>
                    <div className={styles.NameDiv}>
                        <p>Customer Name</p>
                        <input className={styles.nameinput} placeholder="Customer Name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                    </div>
                    <div className={styles.PHDiv}>
                        <p>Phone Number</p>
                        <input type="search" className={styles.nameinput} placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
                    </div>
                    <div className={styles.CodeDiv}>
                        <p>Code</p>
                        <input className={styles.nameinput} placeholder="Code" value={code} onChange={(e) => setCode(e.target.value)} />
                    </div>
                </div>

                {/* Measurements */}
                <div className={styles.BottomDiv}>
                    <div className={styles.gridcontainer}>
                        {inputNames.map((name, idx) => (
                            <div key={idx} className={styles.griditem}>
                                <label className={styles.label}>{name}:</label>
                                <input type="text" className={styles.Inputs} value={measurements[name] || ''} onChange={(e) => handleMeasurementChange(name, e.target.value)} />
                            </div>
                        ))}
                    </div>

                    {/* Radio Buttons */}
                    <div className={styles.CheckBoxDiv}>
                        <div className={styles.HimDiv}>
                            <h3>Hem / گھیرا</h3>
                            <div className={styles.HimInput}>
                                <input type="radio" name="hem" value="round" id="round" className={styles.CustomRadio} checked={radios.hem === 'round'} onChange={(e) => handleRadioChange('hem', e.target.value)} />
                                <label htmlFor="round">Round / گول</label>
                            </div>
                            <div className={styles.HimInput}>
                                <input type="radio" name="hem" value="square" id="square" className={styles.CustomRadio} checked={radios.hem === 'square'} onChange={(e) => handleRadioChange('hem', e.target.value)} />
                                <label htmlFor="square">Square /چورس</label>
                            </div>
                        </div>

                        <div className={styles.HimDiv}>
                            <h3>Collar / کالر </h3>
                            <div className={styles.HimInput}>
                                <input type="radio" name="Collar" value="Collar" id="Collar" className={styles.CustomRadio} checked={radios.collar === 'Collar'} onChange={(e) => handleRadioChange('collar', e.target.value)} />
                                <label htmlFor="Collar">Collar /  کالر</label>
                            </div>
                            <div className={styles.HimInput}>
                                <input type="radio" name="Collar" value="Bain" id="Bain" className={styles.CustomRadio} checked={radios.collar === 'Bain'} onChange={(e) => handleRadioChange('collar', e.target.value)} />
                                <label htmlFor="Bain">Bain /بین</label>
                            </div>
                        </div>

                        <div className={styles.HimDiv}>
                            <h3>Stitching / سلائی </h3>
                            <div className={styles.HimInput}>
                                <input type="radio" name="Stitching" value="Single" id="Single" className={styles.CustomRadio} checked={radios.stitching === 'Single'} onChange={(e) => handleRadioChange('stitching', e.target.value)} />
                                <label htmlFor="Single">Single / سنگل</label>
                            </div>
                            <div className={styles.HimInput}>
                                <input type="radio" name="Stitching" value="Double" id="Double" className={styles.CustomRadio} checked={radios.stitching === 'Double'} onChange={(e) => handleRadioChange('stitching', e.target.value)} />
                                <label htmlFor="Double">Double /ڈبل</label>
                            </div>
                        </div>
                    </div>

                    {/* Description */}
                    <div className={styles.DetailInputDiv}>
                        <h3>Description </h3>
                        <textarea placeholder="Enter details here..." value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>
                </div>

                {/* Save Button */}
                <div className={styles.SaveButtonDiv}>
                    <button className={styles.SaveButton} onClick={handleSaveClick}>{recordToEdit ? "Update" : "Save"}</button>
                </div>

                {/* Confirmation Modal */}
                {modal && (
                    <div className={styles.congratulationMaindiv}>
                        <div className={styles.congratulationparentdiv}>
                            <div className={styles.congTextDiv}>
                                <h3>Are You Sure To {recordToEdit ? "Update" : "Save"} <br /> The Entry?</h3>
                            </div>
                            <div className={styles.congButtonDiv}>
                                <button className={styles.CongButton} onClick={confirmSave}>{recordToEdit ? "Update" : "Save"}</button>
                                <button className={styles.CongButton} onClick={() => setModal(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export { NewEntry };
