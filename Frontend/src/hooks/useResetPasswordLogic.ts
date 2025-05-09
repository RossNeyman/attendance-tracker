import { useState, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getAuth, confirmPasswordReset } from 'firebase/auth';

interface ResetPasswordLogicReturn {
  newPassword: string;
  setNewPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  message: string;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  error: string;
  setError: React.Dispatch<React.SetStateAction<string>>;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export const useResetPasswordLogic = (): ResetPasswordLogicReturn => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [newPassword, setNewPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const auth = getAuth();
    const oobCode = searchParams.get('oobCode');

    setMessage('');
    setError('');

    if (!oobCode) {
      setError('Invalid or missing reset code.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (newPassword.length < 6) {
      setError('Password should be at least 6 characters long.');
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode, newPassword);
      setMessage('Your password has been successfully reset. Redirecting to login...');
      setTimeout(() => navigate('/'), 3000); // Redirect to login page after 3 seconds
    } catch (err: any) {
      setError(err.message || 'Failed to reset password. The link may have expired or already been used. Please try requesting a new reset link.');
    }
  }, [navigate, searchParams, newPassword, confirmPassword]);

  return {
    newPassword,
    setNewPassword,
    confirmPassword,
    setConfirmPassword,
    message,
    setMessage,
    error,
    setError,
    handleSubmit,
  };
};