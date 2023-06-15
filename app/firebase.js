// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";


// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBMiWEZKhreI8DPpACqGi2duBN68KI4t9Q",
    authDomain: "expense-tracker-2d2bd.firebaseapp.com",
    projectId: "expense-tracker-2d2bd",
    storageBucket: "expense-tracker-2d2bd.appspot.com",
    messagingSenderId: "370597835791",
    appId: "1:370597835791:web:57a3a6b1dcf33b21809f7a"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);