"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";

// Firebase
import { auth } from "../../firebase/firebase"; // <-- adjust path based on your file location
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

const Auth = () => {
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const toggleForm = () => setIsSignupVisible(!isSignupVisible);

  // 🔐 Login Function
  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, name, password);
      router.push("/dashboard");
    } catch {
      setError("Invalid login credentials!");
    }
  };

  // 📝 Signup Function
  const handleSignup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, name, password);
      alert("Signup Successful!");
      setIsSignupVisible(false); // back to login form
      setError("");
      setName("");
      setPassword("");
      setPhone("");
    } catch {
      setError("Registration failed. Try again.");
    }
  };

  return (
    <div
      className={`${styles.maindev} ${
        isSignupVisible ? styles["signup-active"] : ""
      }`}
    >
      {/* Left Div */}
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

      {/* Right Div */}
      <div className={styles.rightdiv}>
        {/* Login Form */}
        {!isSignupVisible && (
          <div className={styles.loginDiv}>
            <h1 className={styles.logintext}>Login</h1>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className={styles.inputdiv}>
              <p>Email</p>
              <input
                className={styles.nameinput}
                placeholder="Enter your email"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p>Password</p>
              <input
                className={styles.nameinput}
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className={styles.buttondiv}>
              <button className={styles.loginButton} onClick={handleLogin}>
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
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div className={styles.signupinputdiv}>
              <p>Email</p>
              <input
                className={styles.nameinput}
                placeholder="Enter your email"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <p>Password</p>
              <input
                className={styles.nameinput}
                placeholder="Enter your password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <p>Phone number</p>
              <input
                className={styles.nameinput}
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button className={styles.signupButton} onClick={handleSignup}>
              Signup
            </button>
            <span className={styles.text} onClick={toggleForm}>
              {"Already have an account? Login"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
