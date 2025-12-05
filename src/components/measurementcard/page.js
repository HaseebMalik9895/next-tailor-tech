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
  } = record;

  const status = record.status || (deliveredDate ? "Delivered" : "Pending");

  // Map of keys to labels (English + Urdu)
  const measurementLabels = {
    Length: "Length / لمبائی",
    Chest: "Chest / چھاتی",
    Waist: "Waist / کمر",
    Shoulder: "Shoulder / کندھا",
    Arm: "Arm / بازو",
    Neck: "Neck / گلہ",
    Hem: "Hem / گھیرا",
    "Trouser Length": "Trouser Length / شلوار لمبائی",
    "Trouser Cuff": "Trouser Cuff / پانچہ",
    "Trouser Hem": "Trouser Hem / شلوار گھیرا",
    "Side Pocket": "Side Pocket / سائیڈ پاکٹ",
    "Front Pocket": "Front Pocket / فرنٹ پاکٹ",
    "Trouser Pocket": "Trouser Pocket / شلوار پاکٹ",
    "Cuff length": "Cuff length / کف لمبائی",
  };

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
            <p>Status: {status}</p>
            <p>Receive Date: {receivingDate}</p>
            <p>Delivery Date: {deliveredDate}</p>
          </div>

          {/* Measurements */}
          <div className={styles.DetailParentDiv}>
            <div className={styles.DetailDiv}>
              {Object.keys(measurementLabels).map((key, idx) => (
                <p key={idx}>{measurementLabels[key]}</p>
              ))}
              {Object.keys(radioLabels).map((key, idx) => (
                <p key={idx}>{radioLabels[key]}</p>
              ))}
            </div>

            <div className={styles.DetailDiv}>
              {Object.keys(measurementLabels).map((key, idx) => (
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
