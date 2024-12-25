'use client'
import React, { useState } from 'react';
import styles from '../Setting/styles.module.css'
import { SlCalculator } from "react-icons/sl";
import { SlNotebook } from "react-icons/sl";
import { Calculator } from '../calculator/page'
// import { useRouter } from "next/navigation";


const Setting = () => {
    const [calculator, setCalculator] = useState('')
    // const router = useRouter();


    return (
        <>
            <div className={styles.parrentDiv}>
                <div className={styles.buttonDiv}>
                    <button className={styles.itemDiv} onClick={() => setCalculator(!calculator)}>
                        
                        <SlCalculator size={23} color="white" />
                        <text>Calculator</text>
                    </button>
                    
                </div>
                <div className={styles.buttonDiv}>
                    <button className={styles.itemDiv}>
                        <SlNotebook size={24} color="white" />
                        <text>Khata</text>
                    </button></div>
                <div className={styles.buttonDiv}>
                    <button className={styles.itemDiv}>
                        <SlCalculator size={23} color="white" />
                        <text>Calculator</text>
                    </button></div>
                <div className={styles.buttonDiv}>
                    <button className={styles.itemDiv}>
                        <SlCalculator size={23} color="white" />
                        <text>Calculator</text>
                    </button></div>

                    {calculator && (
                        <Calculator setCalculator={setCalculator} />
                    )}
            </div>
        </>
    );
}

export { Setting };
