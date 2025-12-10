'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { FaCamera } from 'react-icons/fa';
import { db } from "../../firebase/firebase";
import { ref, push, set, get } from "firebase/database";
import Loading from "../Loading/Loading";

const NewEntry = ({ recordToEdit, isNewOrder, onSaveSuccess }) => {
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
    const [status, setStatus] = useState('Pending');
    const [showDropdown, setShowDropdown] = useState(false);
    const [numberOfSuits, setNumberOfSuits] = useState('');
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);

    const options = ['Pending', 'Delivered'];

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
            if (isNewOrder) {
                // New order: prefill customer data but reset dates and status
                setCustomerName(recordToEdit.customerName || '');
                setPhone(recordToEdit.phone || '');
                setCode(recordToEdit.code || ''); // Keep same code for customer
                setDescription(recordToEdit.description || '');
                setMeasurements(recordToEdit.measurements || {});
                setRadios(recordToEdit.radios || { hem: '', collar: '', stitching: '' });
                setSelectedImage(recordToEdit.image || null);
                setCurrentDate(today.toISOString().split('T')[0]); // New date
                setDeliveredDate(''); // Reset delivered date
                setStatus('Pending'); // Reset to pending
                setNumberOfSuits('');
            } else {
                // Edit existing: prefill all fields
                setCustomerName(recordToEdit.customerName || '');
                setPhone(recordToEdit.phone || '');
                setCode(recordToEdit.code || '');
                setDescription(recordToEdit.description || '');
                setMeasurements(recordToEdit.measurements || {});
                setRadios(recordToEdit.radios || { hem: '', collar: '', stitching: '' });
                setCurrentDate(recordToEdit.receivingDate || today.toISOString().split('T')[0]);
                setDeliveredDate(recordToEdit.deliveredDate || '');
                setSelectedImage(recordToEdit.image || null);
                setStatus(recordToEdit.status || 'Pending');
                setNumberOfSuits(recordToEdit.numberOfSuits || '');
            }
        } else {
            // Auto-generate code for new entry
            const fetchLastCode = async () => {
                const entriesRef = ref(db, "entries");
                const snapshot = await get(entriesRef);
                
                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const codes = Object.values(data).map(entry => parseInt(entry.code) || 0);
                    const maxCode = Math.max(...codes, 999); // Start from 1000 if no entries
                    setCode(String(maxCode + 1));
                } else {
                    setCode("1000"); // First entry starts at 1000
                }
            };
            
            fetchLastCode();
        }
    }, [recordToEdit, isNewOrder]);

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

    const handleSelect = (option) => {
        setStatus(option);
        setShowDropdown(false);
    };

    const validateForm = () => {
        const newErrors = {};

        // Check required fields
        if (!customerName.trim()) {
            newErrors.customerName = 'Customer Name is required';
        }
        if (!deliveredDate.trim()) {
            newErrors.customerName = 'deliveredDate is required';
        }
        if (!phone.trim()) {
            newErrors.phone = 'Phone Number is required';
        }
        if (!code.trim()) {
            newErrors.code = 'Code is required';
        }
        if (!currentDate) {
            newErrors.currentDate = 'Receiving Date is required';
        }
        if (!numberOfSuits.trim()) {
            newErrors.numberOfSuits = 'Number of Suits is required';
        }

        // Check all measurements are filled
        for (let name of inputNames) {
            if (!measurements[name] || measurements[name].trim() === '') {
                newErrors[name] = 'Required';
            }
        }

        // Check all radio buttons are selected
        if (!radios.hem) {
            newErrors.hem = 'Please select an option';
        }
        if (!radios.collar) {
            newErrors.collar = 'Please select an option';
        }
        if (!radios.stitching) {
            newErrors.stitching = 'Please select an option';
        }

        if (!description.trim()) {
            newErrors.description = 'Description is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSaveClick = () => {
        if (validateForm()) {
            setModal(true);
        }
    };

  const confirmSave = async () => {
    setIsSaving(true);
    setModal(false); // Close modal first
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
        status,
        numberOfSuits,
        image: selectedImage || null,
      };

      if (recordToEdit && !isNewOrder) {
        // Update existing record
        const recordRef = ref(db, `entries/${recordToEdit.id}`);
        await set(recordRef, entryData);
      } else {
        // Create new entry (either completely new or new order for existing customer)
        const entryRef = ref(db, "entries");
        const newEntryRef = push(entryRef);
        await set(newEntryRef, entryData);
      }



      // Reset form and generate next code
      setCustomerName("");
      setPhone("");
      setMeasurements({});
      setRadios({ hem: "", collar: "", stitching: "" });
      setDescription("");
      setSelectedImage(null);
      setDeliveredDate("");
      setStatus("Pending");
      setNumberOfSuits("");
      
      // Generate next code
      const entriesRef = ref(db, "entries");
      const snapshot = await get(entriesRef);
      
      if (snapshot.exists()) {
        const data = snapshot.val();
        const codes = Object.values(data).map(entry => parseInt(entry.code) || 0);
        const maxCode = Math.max(...codes, 999);
        setCode(String(maxCode + 1));
      } else {
        setCode("1000");
      }

      // Navigate to Records screen after save
      if (onSaveSuccess) {
        onSaveSuccess();
      }
    } catch (err) {
      alert("Error saving entry: " + err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Show full screen loading during save
  if (isSaving) {
    return (
      <Loading 
        fullScreen={true} 
        title={recordToEdit && !isNewOrder ? "Updating Entry..." : "Saving Entry..."} 
        subtitle="Please wait while we save your data"
      />
    );
  }

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
          <div>
            <label className={styles.label}>No. of Suits: </label>
            <input
              // type="number"
              className={styles.Suit}
              value={numberOfSuits}
              onChange={(e) => setNumberOfSuits(e.target.value)}
              // placeholder="0"
            />
            {errors.numberOfSuits && <span className={styles.errorText}>{errors.numberOfSuits}</span>}
          </div>
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
           {errors.customerName && <span className={styles.errorText}>{errors.customerName}</span>}
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
            {errors.customerName && <span className={styles.errorText}>{errors.customerName}</span>}
          </div>
          <div className={styles.PHDiv}>
            <p>Phone Number</p>
            <input
  className={styles.nameinput}
  placeholder="Phone Number"
  value={phone}
  type="tel"
  maxLength={11}
  onChange={(e) => {
    const value = e.target.value;

    // Sirf digits allow
    if (/^[0-9]*$/.test(value)) {
      setPhone(value);
    }
  }}
/>

            {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
          </div>
          <div className={styles.CodeDiv}>
            <p>Code</p>
            <input
              className={styles.nameinput}
              placeholder="Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              readOnly={!recordToEdit && !isNewOrder}
              style={{
                backgroundColor: (!recordToEdit && !isNewOrder) ? "#023047" : "white",
              }}
            />
            {errors.code && <span className={styles.errorText}>{errors.code}</span>}
          </div>
        </div>

        {/* Measurements */}
        <div className={styles.BottomDiv}>
          <div className={styles.gridcontainer}>
            {inputNames.map((name, idx) => (
              <div key={idx} className={styles.griditem}>
                <label className={styles.label}>{name}:</label>
                <div >
                  <input
                    type="number"
                    step="0.1"
                    className={styles.Inputs}
                    value={measurements[name] || ""}
                    onChange={(e) => handleMeasurementChange(name, e.target.value)}
                  />
                  {errors[name] && <span className={styles.errorText}>{errors[name]}</span>}
                </div>
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
              {errors.hem && <span className={styles.errorText}>{errors.hem}</span>}
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
              {errors.collar && <span className={styles.errorText}>{errors.collar}</span>}
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
              {errors.stitching && <span className={styles.errorText}>{errors.stitching}</span>}
            </div>
          </div>

                    {/* Description */}
                    <div className={styles.DetailInputDiv}>
                        <h3>Description </h3>
                        <div style={{ width: '80%' ,paddingLeft:'10px'}}>
                          <textarea placeholder="Enter details here..." value={description} onChange={(e) => setDescription(e.target.value)} />
                          {errors.description && <span className={styles.errorText}>{errors.description}</span>}
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div className={styles.SaveButtonDiv}>
                    <button className={styles.SaveButton} onClick={handleSaveClick}>
                  {recordToEdit && !isNewOrder ? "Update" : "Save"}
                </button>
                </div>

                {/* Confirmation Modal */}
                {modal && (
                    <div className={styles.congratulationMaindiv}>
                        <div className={styles.congratulationparentdiv}>
                            <div className={styles.congTextDiv}>
                                <h3>Are You Sure To {recordToEdit && !isNewOrder ? "Update" : "Save"} <br /> The Entry?</h3>
                            </div>
                            <div className={styles.congButtonDiv}>
                                <button 
                                  className={styles.CongButton} 
                                  onClick={confirmSave}
                                  disabled={isSaving}
                                >
                                  {recordToEdit && !isNewOrder ? "Update" : "Save"}
                                </button>
                                <button 
                                  className={styles.CongButton} 
                                  onClick={() => setModal(false)}
                                  disabled={isSaving}
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
