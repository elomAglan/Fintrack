// src/config/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; 
import { getFirestore } from "firebase/firestore"; // Importer Firestore
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBg0KPMY8YXloYtGwFu5jNt226ZL-HLlUo",
  authDomain: "gestion-de-projet-b94d9.firebaseapp.com",
  projectId: "gestion-de-projet-b94d9",
  storageBucket: "gestion-de-projet-b94d9.appspot.com",
  messagingSenderId: "508599517527",
  appId: "1:508599517527:web:34edf4c705086606a77e12",
  measurementId: "G-WZ7GQC04VP"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); // Initialiser Analytics
const auth = getAuth(app); // Initialiser Authentication
const db = getFirestore(app); // Initialiser Firestore

export { auth, db }; // Exporter auth et db pour les utiliser dans d'autres fichiers
