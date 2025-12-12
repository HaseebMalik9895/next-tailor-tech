'use client';
import React, { useEffect, useState } from 'react';
import styles from './page.module.css';
import Image from 'next/image';
import { 
    FaCamera, 
    FaRulerVertical, 
    FaExpand, 
    FaArrowsAltH, 
    FaArrowsAltV,
    FaCircle,
    FaRegSquare,
    FaArrowDown
} from 'react-icons/fa';
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
    const [garmentType, setGarmentType] = useState('Suit');
    const [showGarmentDropdown, setShowGarmentDropdown] = useState(false);

    const options = ['Pending', 'Delivered'];
    const garmentOptions = ['Suit', 'Coat', 'Shirt', 'Trouser'];

    // Different measurement inputs for different garment types
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

    const inputNames = measurementInputs[garmentType];

    // Function to get icon for measurement type
    const getMeasurementIcon = (measurementName) => {
        const iconMap = {
            // General measurements
            'Length': <FaRulerVertical />,
            'Chest': <FaExpand />,
            'Waist': <FaArrowsAltH />,
            'Shoulder': <FaArrowsAltH />,
            'Arm': <FaArrowsAltV />,
            'Neck': <FaCircle />,
            'Hem': <FaArrowsAltH />,
            
            // Suit specific
            'Trouser Length': <FaRulerVertical />,
            'Trouser Cuff': <FaArrowsAltH />,
            'Trouser Hem': <FaArrowsAltH />,
            'Side Pocket': <FaRegSquare />,
            'Front Pocket': <FaRegSquare />,
            'Trouser Pocket': <FaRegSquare />,
            'Cuff length': <FaArrowsAltH />,
            
            // Coat specific
            'Coat Length': <FaRulerVertical />,
            'Arm Length': <FaArrowsAltV />,
            'Coat Bottom': <FaArrowsAltH />,
            'Sleeve Opening': <FaCircle />,
            'Back Width': <FaArrowsAltH />,
            'Front Width': <FaArrowsAltH />,
            'Collar Size': <FaCircle />,
            'Lapel Width': <FaArrowsAltH />,
            
            // Shirt specific
            'Shirt Length': <FaRulerVertical />,
            'Cuff': <FaArrowsAltH />,
            'Sleeve Length': <FaArrowsAltV />,
            'Back Length': <FaRulerVertical />,
            'Front Length': <FaRulerVertical />,
            'Collar Band': <FaArrowsAltH />,
            'Yoke': <FaArrowsAltH />,
            
            // Trouser specific
            'Hip': <FaArrowsAltH />,
            'Thigh': <FaArrowsAltH />,
            'Knee': <FaArrowsAltH />,
            'Bottom': <FaArrowsAltH />,
            'Crotch': <FaRulerVertical />,
            'Rise': <FaRulerVertical />,
            'Inseam': <FaRulerVertical />,
            'Outseam': <FaRulerVertical />,
            'Pocket Depth': <FaArrowDown />,
            'Belt Loop': <FaCircle />
        };
        
        return iconMap[measurementName] || <FaRulerVertical />;
    };

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
                setGarmentType(recordToEdit.garmentType || 'Suit');
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
                setGarmentType(recordToEdit.garmentType || 'Suit');
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

    const handleGarmentSelect = (garment) => {
        setGarmentType(garment);
        setShowGarmentDropdown(false);
        // Clear measurements when changing garment type
        setMeasurements({});
    };

    const validateForm = () => {
        const newErrors = {};

        // Check required fields
        if (!customerName.trim()) {
            newErrors.customerName = 'Customer Name is required';
        }
        if (!deliveredDate.trim()) {
            newErrors.deliveredDate = 'Delivered Date is required';
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
        garmentType,
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
        <div >
          <div style={{flexDirection:'row',display:'flex'}}>
            <label className={styles.label}>Receiving Date: </label>
            <input
              type="date"
              className={styles.DateInputs}
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
            />
            {errors.currentDate && <span className={styles.errorText}>{errors.currentDate}</span>}
          </div>
          <div style={{display:'flex'}}>
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

        <div style={{width:'25%'}}>
          <div style={{flexDirection:'row',display:'flex'}}>
          <label className={styles.label}>Delivered Date: </label>
          <input
            type="date"
            className={styles.DateInputs}
            value={deliveredDate}
            onChange={(e) => setDeliveredDate(e.target.value)}
          />
           {errors.deliveredDate && <span className={styles.errorText}>{errors.deliveredDate}</span>}
           </div>
          {/* Delivered Status Dropdown */}
          <div className={styles.deliveryStatusDiv}>
            <label className={styles.deliveryLabel}>Delivery Status:</label>
            <div className={styles.deliveryDropdownContainer}>
              <input
                type="text"
                value={status}
                readOnly
                onClick={() => setShowDropdown(!showDropdown)}
                placeholder="Select status"
                className={styles.deliveryInput}
              />
              {showDropdown && (
                <div className={styles.deliveryDropdown}>
                  {options.map((option) => (
                    <div
                      key={option}
                      onClick={() => handleSelect(option)}
                      className={styles.deliveryOption}
                    >
                      {option}
                    </div>
                  ))}
                </div>
              )}
            </div>
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

        {/* Divider for Measurements */}
        <div className={styles.measurementDivider}>
          <h3>Measurements</h3>
        </div>

        {/* Garment Type Selection */}
        <div className={styles.garmentTypeDiv}>
          <label className={styles.garmentLabel}>Garment Type:</label>
          <div className={styles.garmentDropdownContainer}>
            <input
              type="text"
              value={garmentType}
              readOnly
              onClick={() => setShowGarmentDropdown(!showGarmentDropdown)}
              placeholder="Select garment type"
              className={styles.garmentInput}
            />
            {showGarmentDropdown && (
              <div className={styles.garmentDropdown}>
                {garmentOptions.map((garment) => (
                  <div
                    key={garment}
                    onClick={() => handleGarmentSelect(garment)}
                    className={styles.garmentOption}
                  >
                    {garment}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Measurements */}
        <div className={styles.BottomDiv}>
          <div className={styles.gridcontainer}>
            {inputNames.map((name, idx) => (
              <div key={idx} className={styles.griditem}>
                <label className={styles.label}>
                  <span className={styles.measurementIcon}>
                    {getMeasurementIcon(name)}
                  </span>
                  {name}:
                </label>
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
                        <div style={{ width: '100%' ,paddingLeft:'10px'}}>
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
