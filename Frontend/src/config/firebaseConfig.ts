import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

//note: this api key is not secret, it is public
// it is used to identify the project and is not a security risk, as Firebase protects the project with security rules
const firebaseConfig = {
  apiKey: "AIzaSyC-RBu6CuLTUGLRHeO11HlTrfX43EHl7v8",
  authDomain: "csc430-final-project.firebaseapp.com",
  projectId: "csc430-final-project",
  storageBucket: "csc430-final-project.firebasestorage.app",
  messagingSenderId: "554935985107",
  appId: "1:554935985107:web:bf52ee96e7a5a49ceac526",
  measurementId: "G-ZBW93W0ZRG"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);