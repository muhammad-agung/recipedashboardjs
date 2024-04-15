import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB6fdL5k0xRPmoJgW83uEqW-PinL8irIYY",
  authDomain: "recipe-server-f97e9.firebaseapp.com",
  databaseURL: "https://recipe-server-f97e9-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "recipe-server-f97e9",
  storageBucket: "recipe-server-f97e9.appspot.com",
  messagingSenderId: "180254957444",
  appId: "1:180254957444:web:0005ba5c96b6f43f4487d1",
  measurementId: "G-6LH3MWM22X"
};

const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);
const auth = getAuth(firebase);

export {firebase, db, firebaseConfig, auth}
