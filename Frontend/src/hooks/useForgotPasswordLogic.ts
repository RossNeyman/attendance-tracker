import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';

interface ForgotPasswordLogic {
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleBackToLogin: () => void;
}


/**
 * @module useForgotPasswordLogic
 * @description Custom hook to manage the logic for the forgot password feature.
 * It handles user input for email, sends a password reset email using Firebase
 * Authentication, and manages feedback messages (success or error).
 *
 * @returns {ForgotPasswordLogic} An object containing state variables for the email,
 * success message, error message, their respective setter functions,
 * a `handleSubmit` function to initiate the password reset process,
 * and a `handleBackToLogin` function to navigate back to the login page.
 */
export const useForgotPasswordLogic = (): ForgotPasswordLogic => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    setMessage('');
    setError('');

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('A password reset link has been sent to your email.');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset link. Please try again.');
    }
  }, [email]);

  const handleBackToLogin = useCallback(() => {
    navigate('/');
  }, [navigate]);

  return {
    email,
    setEmail,
    message,
    setMessage,
    error,
    setError,
    handleSubmit,
    handleBackToLogin,
  };
};