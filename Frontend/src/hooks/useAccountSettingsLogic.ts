import { useState, useEffect, useCallback } from "react";
import { auth as firebaseAuth } from "../config/firebaseConfig";
import { updateProfile, updateEmail, updatePassword, User } from "firebase/auth";

interface AccountSettingsLogic {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  successMessage: string | null;
  errorMessage: string | null;
  loading: boolean;
  handleSaveChanges: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  currentUser: User | null;
}


/**
 * @module useAccountSettingsLogic
 * @description Custom hook to manage user account settings logic, including fetching
 * current user data and handling updates to profile information (name, email, password)
 * using Firebase Authentication.
 *
 * @returns {AccountSettingsLogic} An object containing state variables for user details
 * (firstName, lastName, email, password), their respective setter functions,
 * loading status, success/error messages, the current Firebase user object,
 * and a function `handleSaveChanges` to persist changes.
 */
export const useAccountSettingsLogic = (): AccountSettingsLogic => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(firebaseAuth.currentUser);

  useEffect(() => {
    const user = firebaseAuth.currentUser;
    if (user) {
      setCurrentUser(user);
      const nameParts = user.displayName?.split(" ") || ["", ""];
      setFirstName(nameParts[0] || "");
      setLastName(nameParts.slice(1).join(" ") || ""); // Handle names with more than two parts
      setEmail(user.email || "");
    }
    // Listen for auth state changes to update user info if needed
    const unsubscribe = firebaseAuth.onAuthStateChanged(user => {
        if (user) {
            setCurrentUser(user);
            const nameParts = user.displayName?.split(" ") || ["", ""];
            setFirstName(nameParts[0] || "");
            setLastName(nameParts.slice(1).join(" ") || "");
            setEmail(user.email || "");
        } else {
            setCurrentUser(null);
        }
    });
    return () => unsubscribe();
  }, []);

  const handleSaveChanges = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const user = firebaseAuth.currentUser;
      if (!user) {
        throw new Error("No user logged in.");
      }

      let messages: string[] = [];


      const currentDisplayName = user.displayName || "";
      const newDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim();
      if (newDisplayName && newDisplayName !== currentDisplayName) {
        await updateProfile(user, { displayName: newDisplayName });
        messages.push("Name updated successfully.");
      }

    
      if (email && email !== user.email) {
        await updateEmail(user, email);
        messages.push("Email updated successfully. Please verify your new email address.");
      }

      if (password) {
        await updatePassword(user, password);
        messages.push("Password updated successfully.");
      }

      if (messages.length > 0) {
        setSuccessMessage(messages.join(" "));
      } else {
        setSuccessMessage("No changes were made.");
      }

    } catch (error: any) {
      console.error("Error updating profile:", error);
      setErrorMessage(error.message || "Failed to update profile.");
    } finally {
      setLoading(false);
      setPassword(""); 
    }
  }, [firstName, lastName, email, password]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    successMessage,
    errorMessage,
    loading,
    handleSaveChanges,
    currentUser,
  };
};