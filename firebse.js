// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBo1mKX9t72bDKyCWvI8oQ8K_G9kcWkdMw",
  authDomain: "visions-60dd7.firebaseapp.com",
  projectId: "visions-60dd7",
  storageBucket: "visions-60dd7.appspot.com",
  messagingSenderId: "852217132081",
  appId: "1:852217132081:web:b863f89dc7a5814bba9110",
  measurementId: "G-97GNLFRSF4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
