// Import Firebase services
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"; // Import Firestore

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyABIXbMXhb6Dm_OjW1SyEt7nYfeg0J22uY",
  authDomain: "taskease-541d9.firebaseapp.com",
  projectId: "taskease-541d9",
  storageBucket: "taskease-541d9.appspot.com", // FIXED HERE
  messagingSenderId: "213370070254",
  appId: "1:213370070254:web:e6a9f1b3b5aa710be2bfff",
  measurementId: "G-GJR834E7JF"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // Initialize Firestore

export { db };
