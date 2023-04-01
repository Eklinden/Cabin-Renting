// Import the functions you need from the SDKs you need
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, onSnapshot } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBwhZS_gBFbe5dx_vIKj3cYypt8sDZbKFM",
  authDomain: "astromstuga.firebaseapp.com",
  projectId: "astromstuga",
  storageBucket: "astromstuga.appspot.com",
  messagingSenderId: "135751370712",
  appId: "1:135751370712:web:811c83fab77c86a80294ad",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const colRef = collection(db, "rentings");
