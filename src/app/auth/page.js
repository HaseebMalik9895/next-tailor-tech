"use client";
import { useState } from "react";
import styles from "./styles.module.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Loading from "../../components/Loading/Loading";

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
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);

  const router = useRouter();

  const toggleForm = () => setIsSignupVisible(!isSignupVisible);

  // 🔐 Login Function
  const handleLogin = async () => {
    setIsLoginLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, name, password);
      router.push("/dashboard");
    } catch {
      setError("Please enter Email and Password");
    } finally {
      setIsLoginLoading(false);
    }
  };

  // 📝 Signup Function
  const handleSignup = async () => {
    setIsSignupLoading(true);
    setError("");
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
    } finally {
      setIsSignupLoading(false);
    }
  };

  // Show full screen loading during login/signup
  if (isLoginLoading) {
    return (
      <Loading 
        fullScreen={true} 
        title="Logging In..." 
        subtitle="Please wait while we authenticate you"
      />
    );
  }

  if (isSignupLoading) {
    return (
      <Loading 
        fullScreen={true} 
        title="Creating Account..." 
        subtitle="Setting up your Tailor Tech account"
      />
    );
  }

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
            <h1 className={styles.logintext} style={{alignSelf:'center'}}>Login</h1>
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
              <div className={styles.passwordContainer}>
                <input
                  className={styles.nameinput}
                  placeholder="Enter your password"
                  type={showLoginPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                >
                  {showLoginPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>
            <div className={styles.buttondiv}>
              <button 
                className={styles.loginButton} 
                onClick={handleLogin}
                disabled={isLoginLoading}
              >
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
            <h1 className={styles.logintext} style={{alignSelf:'center'}}>Signup</h1>
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
              <div className={styles.passwordContainer}>
                <input
                  className={styles.nameinput}
                  placeholder="Enter your password"
                  type={showSignupPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className={styles.eyeButton}
                  onClick={() => setShowSignupPassword(!showSignupPassword)}
                >
                  {showSignupPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <p>Phone number</p>
              <input
                className={styles.nameinput}
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <button 
              className={styles.signupButton} 
              onClick={handleSignup}
              disabled={isSignupLoading}
            >
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
