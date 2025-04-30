import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { auth } from "../src/config/firebaseConfig";

describe("Firebase Configuration", () => {
  it("should initialize Firebase app correctly", () => {
    // Reinitialize Firebase app to ensure it works
    const firebaseConfig = {
      apiKey: "AIzaSyC-RBu6CuLTUGLRHeO11HlTrfX43EHl7v8",
      authDomain: "csc430-final-project.firebaseapp.com",
      projectId: "csc430-final-project",
      storageBucket: "csc430-final-project.firebasestorage.app",
      messagingSenderId: "554935985107",
      appId: "1:554935985107:web:bf52ee96e7a5a49ceac526",
      measurementId: "G-ZBW93W0ZRG",
    };

    const app = initializeApp(firebaseConfig);
    expect(app).toBeTruthy(); // Ensure the app initializes
  });

  it("should provide a valid auth instance", () => {
    expect(auth).toBeTruthy(); // Ensure the auth object is initialized
    expect(typeof getAuth).toBe("function"); // Ensure getAuth is a function
  });
});