'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
// import { useRouter } from "next/navigation";
import { FaCamera } from 'react-icons/fa';
// import { FiX } from 'react-icons/fi';

const NewEntry = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [currentDate, setCurrentDate] = useState('');
    const [modal, setModal] = useState('');
    // const router = useRouter();

    useEffect(() => {
        // Get today's date in YYYY-MM-DD format
        const today = new Date();
        console.log('today', today.toISOString())
        const formattedDate = today.toISOString().split('T')[0];
        setCurrentDate(formattedDate);
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedImage(URL.createObjectURL(file));
        }
    };

    const inputNames = [
        'Length / لمبائی ', 'Chest / چھاتی ', 'Waist / کمر ', 'Shoulder / تیرہ ',
        'Arm / بازو ', 'Neck / گلہ ', 'Hem / گھیرا ', 'Trouser Length / شلوار لمبائی ', 'Trouser Cuff / پانچہ',
        'Trouser Hem / شلوار گھیرا ', 'Side Pocket / سائیڈ پاکٹ  ', 'Front Pocket / فرنٹ پاکٹ ',
        'Trouser Pocket / شلوار پاکٹ ', 'Cuff length / کف لمبائی ',
    ];

    const inputs = inputNames.map((name, index) => (
        <div key={index} className={styles.griditem}>
            <label className={styles.label}>{name}:</label>
            <input
                type="text"
                className={styles.Inputs}
            />
        </div>
    ));

    const handleMeasurementClick = () => {
        setModal(!modal); // Toggle MeasurementCard visibility
    };



    return (
        <div className={styles.ParentDiv}>
            <div className={styles.TopDiv}>
                <div>
                    <label className={styles.label}>Receiving Date: </label>
                    <input
                        type="date"
                        id="date"
                        className={styles.DateInputs}
                        value={currentDate} // Set the default value
                        onChange={(e) => setCurrentDate(e.target.value)} // Handle changes if needed
                    />
                </div>
                <div className={styles.MainImageDiv}>
                    <div className={styles.ImageDiv}>
                        {selectedImage ? (
                            <Image className={styles.SelectedImage}
                                src={selectedImage}
                                alt="Circular Image"
                                width={150} // Desired size
                                height={150}

                            // style={{ maxWidth: '165px', maxHeight: '165px',borderRadius:"20px" }}
                            />
                        ) : (
                            <Image
                                className={styles.SelectedImage}
                                src="/person1.png"
                                alt="Circular Image"
                                width={150} // Desired size
                                height={150}

                            // style={{ maxWidth: '165px', maxHeight: '165px' }}
                            />
                        )}
                    </div>
                    <label className={styles.CameraButton}>
                        <FaCamera size={20} color="black" />
                        <input
                            type="file"
                            accept="image/*"
                            style={{ display: 'none' }}
                            onChange={handleImageChange}
                        />
                    </label>
                </div>
                <div>
                    <label className={styles.label}>Delivered Date: </label>
                    <input
                        type="date"
                        className={styles.DateInputs}
                    />
                </div>
            </div>

            <div className={styles.MidDiv}>
                <div className={styles.MidFirstDiv}>
                    <div className={styles.NameDiv}>
                        <p>Customer Name</p>
                        <input className={styles.nameinput} placeholder="Customer Name" />
                    </div>
                    <div className={styles.PHDiv}>
                        <p>Phone Number</p>
                        <input type="search" className={styles.nameinput} placeholder="Phone Number" />
                    </div>
                    <div className={styles.CodeDiv}>
                        <p>Code</p>
                        <input className={styles.nameinput} placeholder="Code" />
                    </div>
                </div>
                <div className={styles.BottomDiv}>
                    <div className={styles.gridcontainer}>{inputs}</div>
                    <div className={styles.CheckBoxDiv}>
                        <div className={styles.HimDiv}>
                            <h3>Hem / گھیرا</h3>

                            <div className={styles.HimInput}>
                                <input
                                    type="radio"
                                    name="hem"
                                    value="round"
                                    id="round"
                                    className={styles.CustomRadio}
                                />
                                <label htmlFor="round">Round / گول</label>
                            </div>

                            <div className={styles.HimInput}>
                                <input
                                    type="radio"
                                    name="hem"
                                    value="square"
                                    id="square"
                                    className={styles.CustomRadio}
                                />
                                <label htmlFor="square">Square /چورس</label>
                            </div>
                        </div>
                        <div className={styles.HimDiv}>
                            <h3>Collar / کالر </h3>

                            <div className={styles.HimInput}>
                                <input
                                    type="radio"
                                    name="Collar"
                                    value="Collar"
                                    id="Collar"
                                    className={styles.CustomRadio}
                                />
                                <label htmlFor="Collar">Collar /  کالر</label>
                            </div>

                            <div className={styles.HimInput}>
                                <input
                                    type="radio"
                                    name="Collar"
                                    value="Bain"
                                    id="Bain"
                                    className={styles.CustomRadio}
                                />
                                <label htmlFor="Bain">Bain /بین</label>
                            </div>
                        </div>
                        <div className={styles.HimDiv}>
                            <h3>Stitching / سلائی </h3>

                            <div className={styles.HimInput}>
                                <input
                                    type="radio"
                                    name="Stitching"
                                    value="Single"
                                    id="Single"
                                    className={styles.CustomRadio}
                                />
                                <label htmlFor="Single">Single / سنگل</label>
                            </div>

                            <div className={styles.HimInput}>
                                <input
                                    type="radio"
                                    name="Stitching"
                                    value="Double"
                                    id="Double"
                                    className={styles.CustomRadio}
                                />
                                <label htmlFor="Double">Double /ڈبل</label>
                            </div>
                        </div>
                    </div>


                    <div className={styles.DetailInputDiv}>
                        <h3>Description </h3>
                        <textarea placeholder="Enter details here..."></textarea>
                    </div>
                </div>
                <div className={styles.SaveButtonDiv}>
                    <button className={styles.SaveButton} onClick={() => handleMeasurementClick()}>Save</button>
                </div>

                {modal && (
                    <div className={styles.congratulationMaindiv}>

                        <div className={styles.congratulationparentdiv}>
                            <div className={styles.congTextDiv}>
                                <h3>Are You Sure To Save <br /> The Entry?</h3></div>
                            <div className={styles.congButtonDiv}>
                                <button
                                    className={styles.CongButton}
                                    // onClick={() => router.push('')}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export { NewEntry };


// <FiX size={30} style={{ cursor: 'pointer' }}
// // onClick={() => router.push("/dashboard")}
// />