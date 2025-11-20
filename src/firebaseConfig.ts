import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de Firebase para el proyecto offgridrd-5eb69
const firebaseConfig = {
  apiKey: "AIzaSyBT4olB7w-Hit2QJZGGvfdc3JZbycA-7fY",
  authDomain: "offgridrd-5eb69.firebaseapp.com",
  projectId: "offgridrd-5eb69",
  storageBucket: "offgridrd-5eb69.firebasestorage.app",
  messagingSenderId: "617717961656",
  appId: "1:617717961656:web:69a9fa3f1646ef2e56754d",
  measurementId: "G-5JQ81PS81Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
