"use client";
import React, { useEffect, useState } from "react";
import styles from "./page.module.css";
import Image from "next/image";
import { FaCamera } from "react-icons/fa";
import { db } from "../../firebase/firebase";
import { ref, push, set } from "firebase/database";

const NewEntry = ({ recordToEdit }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentDate, setCurrentDate] = useState("");
  const [deliveredDate, setDeliveredDate] = useState("");
  const [modal, setModal] = useState(false);

  const [customerName, setCustomerName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [measurements, setMeasurements] = useState({});
  const [radios, setRadios] = useState({ hem: "", collar: "", stitching: "" });
  const [showDropdown, setShowDropdown] = useState(false);
  const [status, setStatus] = useState("");

  const options = ["Pending", "Delivered"];

  const handleSelect = (option) => {
    setStatus(option);
    setShowDropdown(false);
  };

  const inputNames = [
    "Length", "Chest", "Waist", "Shoulder", "Arm", "Neck", "Hem",
    "Trouser Length", "Trouser Cuff", "Trouser Hem", "Side Pocket",
    "Front Pocket", "Trouser Pocket", "Cuff length"
  ];

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today.toISOString().split("T")[0]);

    if (recordToEdit) {
      setCustomerName(recordToEdit.customerName || "");
      setPhone(recordToEdit.phone || "");
      setCode(recordToEdit.code || "");
      setDescription(recordToEdit.description || "");
      setMeasurements(recordToEdit.measurements || {});
      setRadios(recordToEdit.radios || { hem: "", collar: "", stitching: "" });
      setCurrentDate(recordToEdit.receivingDate || today.toISOString().split("T")[0]);
      setDeliveredDate(recordToEdit.deliveredDate || "");
      setSelectedImage(recordToEdit.image || null);
      setStatus(recordToEdit.status || ""); // ✅ prefill status
    }
  }, [recordToEdit]);

  const handleMeasurementChange = (name, value) => {
    setMeasurements((prev) => ({ ...prev, [name]: value }));
  };

  const handleRadioChange = (name, value) => {
    setRadios((prev) => ({ ...prev, [name]: value }));
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
      const entryData = {
        customerName,
        phone,
        code,
        measurements,
        radios,
        description,
        receivingDate: currentDate,
        deliveredDate,
        status, // ✅ include delivered status
        image: selectedImage || null,
      };

      if (recordToEdit) {
        const recordRef = ref(db, `entries/${recordToEdit.id}`);
        await set(recordRef, entryData);
      } else {
        const entryRef = ref(db, "entries");
        const newEntryRef = push(entryRef);
        await set(newEntryRef, entryData);
      }

      setModal(false);

      // Reset form
      setCustomerName("");
      setPhone("");
      setCode("");
      setMeasurements({});
      setRadios({ hem: "", collar: "", stitching: "" });
      setDescription("");
      setSelectedImage(null);
      setDeliveredDate("");
      setStatus(""); // ✅ reset status
    } catch (err) {
      alert("Error saving entry: " + err.message);
    }
  };

  return (
    <div className={styles.ParentDiv}>
      {/* Top Section: Dates + Image */}
      <div className={styles.TopDiv}>
        <div>
          <label className={styles.label}>Receiving Date: </label>
          <input
            type="date"
            className={styles.DateInputs}
            value={currentDate}
            onChange={(e) => setCurrentDate(e.target.value)}
          />
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
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImageChange}
            />
          </label>
        </div>

        <div>
          <label className={styles.label}>Delivered Date: </label>
          <input
            type="date"
            className={styles.DateInputs}
            value={deliveredDate}
            onChange={(e) => setDeliveredDate(e.target.value)}
          />
          {/* Delivered Status Dropdown */}
          <div
            style={{
              marginTop: "10px",
              position: "relative",
              width: "350px",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <label
              style={{ color: "black", fontWeight: "600", fontSize: "14px" }}
            >
              Delivered Status:
            </label>
            <input
              type="text"
              value={status}
              readOnly
              onClick={() => setShowDropdown(!showDropdown)}
              placeholder="Select status"
              style={{
                background: "linear-gradient(to bottom, #fb8500, #ffb703)",
                padding: "8px",
                cursor: "pointer",
                width: "150px",
                border: "none",
                borderRadius: "5px",
                fontSize: "18px",
                color: "white",
              }}
            />
            {showDropdown && (
              <div
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "125px",
                  width: "150px",
                  zIndex: 1000,
                  color: "black",
                  border: "none",
                }}
              >
                {options.map((option) => (
                  <div
                    key={option}
                    onClick={() => handleSelect(option)}
                    style={{
                      padding: "8px",
                      cursor: "pointer",
                      background: "white",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background =
                        "linear-gradient(to right, #fb8500, #ffb703)";
                      e.currentTarget.style.fontWeight = "700";
                      e.currentTarget.style.fontSize = "18px";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "white";
                      e.currentTarget.style.fontWeight = "400";
                      e.currentTarget.style.fontSize = "16px";
                      e.currentTarget.style.color = "black";
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Middle Section: Customer Info */}
      <div className={styles.MidDiv}>
        <div className={styles.MidFirstDiv}>
          <div className={styles.NameDiv}>
            <p>Customer Name</p>
            <input
              className={styles.nameinput}
              placeholder="Customer Name"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>
          <div className={styles.PHDiv}>
            <p>Phone Number</p>
            <input
              type="search"
              className={styles.nameinput}
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className={styles.CodeDiv}>
            <p>Code</p>
            <input
              className={styles.nameinput}
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
        </div>

        {/* Measurements */}
        <div className={styles.BottomDiv}>
          <div className={styles.gridcontainer}>
            {inputNames.map((name, idx) => (
              <div key={idx} className={styles.griditem}>
                <label className={styles.label}>{name}:</label>
                <input
                  type="text"
                  className={styles.Inputs}
                  value={measurements[name] || ""}
                  onChange={(e) => handleMeasurementChange(name, e.target.value)}
                />
              </div>
            ))}
          </div>

          {/* Radio Buttons */}
          <div className={styles.CheckBoxDiv}>
            {/* Hem */}
            <div className={styles.HimDiv}>
              <h3>Hem / گھیرا</h3>
              {["round", "square"].map((val) => (
                <div className={styles.HimInput} key={val}>
                  <input
                    type="radio"
                    name="hem"
                    value={val}
                    id={val}
                    className={styles.CustomRadio}
                    checked={radios.hem === val}
                    onChange={(e) => handleRadioChange("hem", e.target.value)}
                  />
                  <label htmlFor={val}>{val.charAt(0).toUpperCase() + val.slice(1)}</label>
                </div>
              ))}
            </div>

            {/* Collar */}
            <div className={styles.HimDiv}>
              <h3>Collar / کالر </h3>
              {["Collar", "Bain"].map((val) => (
                <div className={styles.HimInput} key={val}>
                  <input
                    type="radio"
                    name="Collar"
                    value={val}
                    id={val}
                    className={styles.CustomRadio}
                    checked={radios.collar === val}
                    onChange={(e) => handleRadioChange("collar", e.target.value)}
                  />
                  <label htmlFor={val}>{val}</label>
                </div>
              ))}
            </div>

            {/* Stitching */}
            <div className={styles.HimDiv}>
              <h3>Stitching / سلائی </h3>
              {["Single", "Double"].map((val) => (
                <div className={styles.HimInput} key={val}>
                  <input
                    type="radio"
                    name="Stitching"
                    value={val}
                    id={val}
                    className={styles.CustomRadio}
                    checked={radios.stitching === val}
                    onChange={(e) => handleRadioChange("stitching", e.target.value)}
                  />
                  <label htmlFor={val}>{val}</label>
                </div>
              ))}
            </div>
          </div>

          {/* Description */}
          <div className={styles.DetailInputDiv}>
            <h3>Description </h3>
            <textarea
              placeholder="Enter details here..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>

        {/* Save Button */}
        <div className={styles.SaveButtonDiv}>
          <button className={styles.SaveButton} onClick={handleSaveClick}>
            {recordToEdit ? "Update" : "Save"}
          </button>
        </div>

        {/* Confirmation Modal */}
        {modal && (
          <div className={styles.congratulationMaindiv}>
            <div className={styles.congratulationparentdiv}>
              <div className={styles.congTextDiv}>
                <h3>
                  Are You Sure To {recordToEdit ? "Update" : "Save"} <br /> The
                  Entry?
                </h3>
              </div>
              <div className={styles.congButtonDiv}>
                <button className={styles.CongButton} onClick={confirmSave}>
                  {recordToEdit ? "Update" : "Save"}
                </button>
                <button
                  className={styles.CongButton}
                  onClick={() => setModal(false)}
                >
                  Cancel
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
