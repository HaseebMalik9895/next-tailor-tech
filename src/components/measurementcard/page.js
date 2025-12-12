"use client";
import React from "react";
import styles from "./styles.module.css";
import { FiX } from "react-icons/fi";
import Image from "next/image";

const MeasurementCard = ({ record, closeMeasurementCard }) => {
  if (!record) return <div>No record selected.</div>;

  const {
    customerName,
    code,
    receivingDate,
    deliveredDate,
    image,
    description,
    measurements = {},
    radios = {},
    garmentType = 'Suit'
  } = record;

  const status = record.status || (deliveredDate ? "Delivered" : "Pending");

  // Different measurement inputs for different garment types with Urdu translations
  const measurementInputs = {
    Suit: [
      'Length', 'Chest', 'Waist', 'Shoulder', 'Arm',
      'Neck', 'Hem', 'Trouser Length', 'Trouser Cuff',
      'Trouser Hem', 'Side Pocket', 'Front Pocket',
      'Trouser Pocket', 'Cuff length'
    ],
    Coat: [
      'Coat Length', 'Chest', 'Waist', 'Shoulder', 'Arm Length',
      'Neck', 'Coat Bottom', 'Sleeve Opening', 'Back Width',
      'Front Width', 'Collar Size', 'Lapel Width'
    ],
    Shirt: [
      'Shirt Length', 'Chest', 'Waist', 'Shoulder', 'Arm Length',
      'Neck', 'Cuff', 'Sleeve Length', 'Back Length',
      'Front Length', 'Collar Band', 'Yoke'
    ],
    Trouser: [
      'Trouser Length', 'Waist', 'Hip', 'Thigh', 'Knee',
      'Bottom', 'Crotch', 'Rise', 'Inseam', 'Outseam',
      'Pocket Depth', 'Belt Loop'
    ]
  };

  // Complete map of keys to labels (English + Urdu)
  const measurementLabels = {
    // General measurements
    'Length': "Length / لمبائی",
    'Chest': "Chest / چھاتی",
    'Waist': "Waist / کمر",
    'Shoulder': "Shoulder / کندھا",
    'Arm': "Arm / بازو",
    'Neck': "Neck / گلہ",
    'Hem': "Hem / گھیرا",
    
    // Suit specific
    'Trouser Length': "Trouser Length / شلوار لمبائی",
    'Trouser Cuff': "Trouser Cuff / پانچہ",
    'Trouser Hem': "Trouser Hem / شلوار گھیرا",
    'Side Pocket': "Side Pocket / سائیڈ پاکٹ",
    'Front Pocket': "Front Pocket / فرنٹ پاکٹ",
    'Trouser Pocket': "Trouser Pocket / شلوار پاکٹ",
    'Cuff length': "Cuff length / کف لمبائی",
    
    // Coat specific
    'Coat Length': "Coat Length / کوٹ لمبائی",
    'Arm Length': "Arm Length / بازو لمبائی",
    'Coat Bottom': "Coat Bottom / کوٹ نیچے",
    'Sleeve Opening': "Sleeve Opening / آستین کھلنا",
    'Back Width': "Back Width / پیٹھ چوڑائی",
    'Front Width': "Front Width / سامنے چوڑائی",
    'Collar Size': "Collar Size / کالر سائز",
    'Lapel Width': "Lapel Width / لیپل چوڑائی",
    
    // Shirt specific
    'Shirt Length': "Shirt Length / قمیض لمبائی",
    'Cuff': "Cuff / کف",
    'Sleeve Length': "Sleeve Length / آستین لمبائی",
    'Back Length': "Back Length / پیٹھ لمبائی",
    'Front Length': "Front Length / سامنے لمبائی",
    'Collar Band': "Collar Band / کالر بینڈ",
    'Yoke': "Yoke / یوک",
    
    // Trouser specific
    'Hip': "Hip / کولہے",
    'Thigh': "Thigh / ران",
    'Knee': "Knee / گھٹنا",
    'Bottom': "Bottom / نیچے",
    'Crotch': "Crotch / کروچ",
    'Rise': "Rise / اٹھنا",
    'Inseam': "Inseam / اندرونی سیم",
    'Outseam': "Outseam / بیرونی سیم",
    'Pocket Depth': "Pocket Depth / پاکٹ گہرائی",
    'Belt Loop': "Belt Loop / بیلٹ لوپ"
  };

  // Get measurements for current garment type
  const currentMeasurements = measurementInputs[garmentType] || measurementInputs.Suit;

  const radioLabels = {
    hem: "Hem / گھیرا",
    collar: "Collar / کالر",
    stitching: "Stitching / سلائی",
  };

  return (
    <div className={styles.parentdiv}>
      <div className={styles.headerdiv}>
        <FiX
          size={30}
          onClick={closeMeasurementCard}
          style={{ cursor: "pointer" }}
        />
      </div>

      <div className={styles.datadiv}>
        <div className={styles.childdiv}>
          {/* Top image */}
          <div className={styles.TopDiv}>
            <div className={styles.ImageDiv}>
              <Image
                src={image || "/person1.png"}
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

          {/* Basic Info */}
          <div className={styles.InfoDiv}>
            <h1>{customerName}</h1>
            <p>Code: {code}</p>
            <p>Garment Type: {garmentType}</p>
            <p>Status: {status}</p>
            <p>Receive Date: {receivingDate}</p>
            <p>Delivery Date: {deliveredDate}</p>
          </div>

          {/* Measurements */}
          <div className={styles.DetailParentDiv}>
            <div className={styles.DetailDiv}>
              {currentMeasurements.map((key, idx) => (
                <p key={idx}>{measurementLabels[key] || key}</p>
              ))}
              {Object.keys(radioLabels).map((key, idx) => (
                <p key={idx}>{radioLabels[key]}</p>
              ))}
            </div>

            <div className={styles.DetailDiv}>
              {currentMeasurements.map((key, idx) => (
                <p key={idx}>{measurements[key] || "-"}</p>
              ))}
              {Object.keys(radioLabels).map((key, idx) => (
                <p key={idx}>{radios[key] || "-"}</p>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={styles.DescriptionParentDiv}>
            <div className={styles.DescriptionDiv}>
              <p>Description</p>
            </div>
            <div className={styles.DescriptionDiv}>
              <p>{description || "No description provided."}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export { MeasurementCard };
