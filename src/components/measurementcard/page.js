'use client'
import React from 'react';
import styles from './styles.module.css'
import { FiX } from 'react-icons/fi';
import Image from 'next/image';
// import { useRouter } from 'next/navigation';

const MeasurementCard = ({ record, closeMeasurementCard }) => {

    if (!record) return <div>No record selected.</div>;

    return (

        <div className={styles.parentdiv}>
            <div className={styles.headerdiv}>
                <div>
                    <FiX size={30} onClick={closeMeasurementCard} style={{ cursor: 'pointer' }} />
                </div>
            </div>
            <div className={styles.datadiv}>
                {/* child Div  */}
                <div className={styles.childdiv}>
                    <div className={styles.TopDiv}>
                        <div className={styles.ImageDiv}>
                            <Image
                                src={record.image}
                                layout="responsive"
                                width={50}
                                height={50}
                                alt="person"
                                style={{
                                    width: "50%",
                                    height: "auto",
                                    maxWidth: "60px",
                                    maxHeight: "60px",

                                }}
                            />
                        </div>
                    </div>
                    <div className={styles.InfoDiv}>
                        <h1>{record.name}</h1>
                        <p>Code: {record.code}</p>
                        <p>Status: {record.status}</p>
                        <p>Receive Date: {record.receive}</p>
                        <p>Delivery Date: {record.delever}</p>
                    </div>
                    <div className={styles.DetailParentDiv}>
                        <div className={styles.DetailDiv}>
                            <p>Length / لمبائی </p>
                            <p>Chest / چھاتی </p>
                            <p>Waist / کمر </p>
                            <p>Shoulder / تیرہ </p>
                            <p>Arm / بازو </p>
                            <p>Neck / گلہ </p>
                            <p>Hem / گھیرا </p>
                            <p>Trouser Length / شلوار لمبائی </p>
                            <p>Trouser Cuff / پانچہ</p>
                            <p>Trouser Hem / شلوار گھیرا </p>
                            <p>Side Pocket / سائیڈ پاکٹ </p>
                            <p>Front Pocket / فرنٹ پاکٹ </p>
                            <p>Trouser Pocket / شلوار پاکٹ </p>
                            <p>Cuff length / کف لمبائی </p>
                            <p>Hem / گھیرا</p>
                            <p>Collar / کالر </p>
                            <p>Stitching / سلائی </p>
                        </div>
                        <div className={styles.DetailDiv}>
                            <p>34.5</p>
                            <p>12</p>
                            <p>25.5</p>
                            <p>15</p>
                            <p>55</p>
                            <p>3726</p>
                            <p>4238</p>
                            <p>26</p>
                            <p>256</p>
                            <p>85</p>
                            <p>65</p>
                            <p>26.5</p>
                            <p>10.</p>
                            <p>26</p>
                            <p>Square /چورس</p>
                            <p>Bain /بین</p>
                            <p>Square /چورس</p>
                        </div>
                    </div>
                    <div className={styles.DescriptionParentDiv}>
                        <div className={styles.DescriptionDiv}>
                            <p>Description</p>
                        </div>
                        <div className={styles.DescriptionDiv}><p>A suit is a classic and sophisticated garment, typically consisting of a jacket and trousers made from matching fabric. Tailors craft suits with precision to ensure a perfect fit, enhancing both comfort and style. The jacket is often designed with structured shoulders, a tailored waist, and a variety of lapel styles, while trousers are tailored to complement the jacket’s silhouette. </p></div>
                    </div>
                </div>

                {/* child Div  */}
            </div>
        </div>
    );
}

export { MeasurementCard };
