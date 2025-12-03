'use client'
import React, { useState, useEffect } from 'react';
import styles from '../calculator/styles.module.css';
import { AiOutlineClose, AiOutlineMinus } from 'react-icons/ai';
import { IoBackspaceSharp } from 'react-icons/io5';
import Image from 'next/image';


const Calculator = ({setCalculator}) => {
    const [input, setInput] = useState('');
    const [minimize , setMinimize]=useState(true)

    // Function to handle keyboard input
    const handleKeyPress = (e) => {
        if (e.key >= '0' && e.key <= '9') {
            setInput((prevInput) => prevInput + e.key); // Append numbers
        } else if (e.key === '+') {
            setInput((prevInput) => prevInput + '+'); // Append +
        } else if (e.key === '-') {
            setInput((prevInput) => prevInput + '-'); // Append -
        } else if (e.key === '*') {
            setInput((prevInput) => prevInput + '*'); // Append *
        } else if (e.key === '/') {
            setInput((prevInput) => prevInput + '/'); // Append /
        } else if (e.key === '.') {
            setInput((prevInput) => prevInput + '.'); // Append .
        } else if (e.key === 'Enter') {
            handleEvaluate(); // Evaluate the expression when Enter is pressed
        } else if (e.key === 'Backspace') {
            setInput((prevInput) => prevInput.slice(0, -1)); // Remove last character
        } else if (e.key === 'Escape') {
            handleClear(); // Clear input when Escape is pressed
        }
    }

    // Evaluate the expression
    const handleEvaluate = () => {
        try {
            setInput(eval(input).toString()); // Evaluate the expression
        } catch {
            setInput('Error'); // Show error if the expression is invalid
        }
    };

    // Clear the input
    const handleClear = () => {
        setInput('');
    };

    // Cut the last entered number or character
    const handleCut = () => {
        setInput((prevInput) => prevInput.slice(0, -1)); // Remove last character (mimicking a cut)
    };

    // Set up keyboard event listener
    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress); // Add event listener

        return () => {
            window.removeEventListener('keydown', handleKeyPress); // Clean up event listener
        };
    }, [handleKeyPress]);

    return (
        <div className={minimize === true ? styles.parentDiv : styles.parentMinimizeDiv}>
            {minimize === true ? (
                <div>
                    <div className={styles.headerDiv}>
                        <AiOutlineMinus size={24} color="white" onClick={() => setMinimize()} // Hide calculator on close
                        />
                        <AiOutlineClose
                            className={styles.crossIcon}
                            size={24}
                            color="#fb8500"
                        onClick={()=>setCalculator(false)}
                        />
                    </div>
                    <div className={styles.inputDiv}>
                        <textarea value={input} readOnly />
                    </div>
                    <div className={styles.buttonDiv}>
                        {/* Calculator buttons */}
                        <button onClick={() => setInput(input + '7')}>7</button>
                        <button onClick={() => setInput(input + '8')}>8</button>
                        <button onClick={() => setInput(input + '9')}>9</button>
                        <button onClick={() => setInput(input + '/')}>/</button>
                        <button onClick={() => setInput(input + '4')}>4</button>
                        <button onClick={() => setInput(input + '5')}>5</button>
                        <button onClick={() => setInput(input + '6')}>6</button>
                        <button onClick={() => setInput(input + '*')}>*</button>
                        <button onClick={() => setInput(input + '1')}>1</button>
                        <button onClick={() => setInput(input + '2')}>2</button>
                        <button onClick={() => setInput(input + '3')}>3</button>
                        <button onClick={() => setInput(input + '-')}>-</button>
                        <button onClick={() => setInput(input + '0')}>0</button>
                        <button onClick={() => setInput(input + '.')}>.</button>
                        <button onClick={handleEvaluate}>=</button>
                        <button onClick={() => setInput(input + '+')}>+</button>
                        <button onClick={handleClear}>C</button>
                        <button onClick={handleCut}>
                            <IoBackspaceSharp size={24} />
                        </button>
                    </div>
                </div>
            ) : (
                <div>

                    {/* <AiOutlineMinus size={24} color="white" onClick={() => setMinimize(!minimize)} /> */}
                    <Image src="/calculatorImage.png"
                        layout="responsive"
                        width={100}
                        height={100}
                        alt="Logo"
                        onClick={() => setMinimize(!minimize)}
                        />
                </div>)}
        </div>

    );
};

export { Calculator };
