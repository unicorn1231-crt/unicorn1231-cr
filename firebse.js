// Firebaseの設定を初期化
const firebaseConfig = {
  apiKey: "AIzaSyBo1mKX9t72bDKyCWvI8oQ8K_G9kcWkdMw",
  authDomain: "visions-60dd7.firebaseapp.com",
  projectId: "visions-60dd7",
  storageBucket: "visions-60dd7.appspot.com",
  messagingSenderId: "852217132081",
  appId: "1:852217132081:web:b863f89dc7a5814bba9110",
  measurementId: "G-97GNLFRSF4"
};

// Firebaseの初期化
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

const auth = firebase.auth();
const db = firebase.database();
