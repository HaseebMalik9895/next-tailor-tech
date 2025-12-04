// /firebase/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCeN39fk9UcZ_rvKCJjJnxahngRSIr1OYc",
  authDomain: "react-tailor-tech.firebaseapp.com",
  projectId: "react-tailor-tech",
  storageBucket: "react-tailor-tech.appspot.com",
  messagingSenderId: "456340054490",
  appId: "1:456340054490:web:6db8f77ce5390322b5a0e3",
  measurementId: "G-7MLFLWYRSE",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

export { app, auth, db };
