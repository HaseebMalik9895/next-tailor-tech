"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

const Auth = () => {
    const [isSignupVisible, setIsSignupVisible] = useState(false); // State to manage visibility of signup form
    const router = useRouter();

    const toggleForm = () => {
        setIsSignupVisible(!isSignupVisible); // Toggle between login and signup
    };

    return (
        <div className={`${styles.maindev} ${isSignupVisible ? styles["signup-active"] : ""}`}>
            {/* Left Div - Logo */}
            <div className={styles.leftdiv}>
                <div className={styles.logodiv}>
                    <Image
                        src="/logo.png"
                        layout="responsive"
                        width={500}
                        height={300}
                        alt="Logo"
                    />
                </div>
            </div>

            {/* Right Div - Show Login or Signup based on state */}
            <div className={styles.rightdiv}>
                {/* Login Form */}
                {!isSignupVisible && (
                    <div className={styles.loginDiv}>
                        <h1 className={styles.logintext}>Login</h1>
                        <div className={styles.inputdiv}>
                            <p>Name</p>
                            <input className={styles.nameinput} placeholder="Enter your name" />
                            <p>Password</p>
                            <input className={styles.nameinput} placeholder="Enter your password" type="password" />
                        </div>
                        <div className={styles.buttondiv}>
                            <button className={styles.loginButton} onClick={() => router.push("/dashboard")}>
                                Login
                            </button>
                            <span className={styles.text} onClick={toggleForm}>
                                {"Don't have an account?"}
                            </span>
                        </div>
                    </div>
                )}

                {/* Signup Form */}
                {isSignupVisible && (
                    <div className={styles.signUpDiv}>
                        <h1 className={styles.logintext}>Signup</h1>
                        <div className={styles.signupinputdiv}>
                            <p>Name</p>
                            <input className={styles.nameinput} placeholder="Enter your name" />
                            <p>Password</p>
                            <input className={styles.nameinput} placeholder="Enter your password" type="password" />
                            <p>Phone number</p>
                            <input className={styles.nameinput} placeholder="Enter your phone number" />
                        </div>
                        <button className={styles.signupButton}>
                            Signup
                        </button>
                        <span className={styles.text} 
                        onClick={toggleForm}
                        >
                            {"Already have an account? Login"}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Auth;
