// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-RBu6CuLTUGLRHeO11HlTrfX43EHl7v8",
  authDomain: "csc430-final-project.firebaseapp.com",
  projectId: "csc430-final-project",
  storageBucket: "csc430-final-project.firebasestorage.app",
  messagingSenderId: "554935985107",
  appId: "1:554935985107:web:bf52ee96e7a5a49ceac526",
  measurementId: "G-ZBW93W0ZRG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);