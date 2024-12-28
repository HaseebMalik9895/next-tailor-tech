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
                        <div className={styles.DetailLeftDiv}>
                            <div className={styles.detailsDiv}><p>Length / لمبائی </p><p>34.5</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Chest / چھاتی </p><p>12</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Waist / کمر </p><p>25.5</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Shoulder / تیرہ </p><p>15</p></div>
                            <div className={styles.detailsDiv}><p>Arm / بازو </p><p>3726</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Neck / گلہ </p><p>4238</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Hem / گھیرا </p><p>26</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Trouser Length / شلوار لمبائی </p><p>256</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Trouser Cuff / پانچہ</p><p>85</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Trouser Hem / شلوار گھیرا </p><p>65</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Side Pocket / سائیڈ پاکٹ </p><p>26.5</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Front Pocket / فرنٹ پاکٹ </p><p>10.55</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Trouser Pocket / شلوار پاکٹ </p><p>26</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Cuff length / کف لمبائی </p><p>55</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Hem / گھیرا</p><p>Square /چورس</p>
                            </div>
                            <div className={styles.detailsDiv}><p>Collar / کالر </p><p>Bain /بین</p></div>
                            <div className={styles.detailsDiv}><p>Stitching / سلائی </p><p>Square /چورس</p></div>
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
        </div >
    );
}

export { MeasurementCard };
