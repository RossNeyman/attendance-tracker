import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/auth/login'; 
import { setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth as firebaseAuth } from '../config/firebaseConfig'; 

interface LoginLogic {
  showPassword: boolean;
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  stayLoggedIn: boolean;
  loginError: string | null;
  handleTogglePasswordVisibility: () => void;
  handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
  handleForgotLinkClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  handleCreateAccountClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
  handleStayLoggedInChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleLogin: () => Promise<void>;
}

export const useLoginLogic = (): LoginLogic => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const handleTogglePasswordVisibility = useCallback((): void => {
    setShowPassword((prev) => !prev);
  }, []);

  const handleMouseDownPassword = useCallback((event: React.MouseEvent<HTMLButtonElement>): void => {
    event.preventDefault();
  }, []);

  const handleForgotLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    navigate('/forgot-password');
  }, [navigate]);

  const handleCreateAccountClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>): void => {
    event.preventDefault();
    navigate('/signup');
  }, [navigate]);

  const handleStayLoggedInChange = useCallback((event: React.ChangeEvent<HTMLInputElement>): void => {
    setStayLoggedIn(event.target.checked);
  }, []);

  const handleLogin = useCallback(async (): Promise<void> => {
    setLoginError(null);
    try {
      // Set persistence based on "Stay Logged-In" checkbox
      const persistenceType = stayLoggedIn ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(firebaseAuth, persistenceType);
      
      const user = await login(username, password); // login service likely uses firebaseAuth internally
      console.log('Logged in user:', user);
      // alert('Login successful!'); // Consider removing alerts for better UX, use loginError state
      navigate('/home');
    } catch (error: any) {
      console.error('Login failed:', error);
      setLoginError(error.message || 'Login failed. Please check your credentials and try again.');
      // alert('Login failed. Please try again.' + error); // Replaced by loginError state
    }
  }, [username, password, navigate, stayLoggedIn]);

  return {
    showPassword,
    username,
    setUsername,
    password,
    setPassword,
    stayLoggedIn,
    loginError,
    handleTogglePasswordVisibility,
    handleMouseDownPassword,
    handleForgotLinkClick,
    handleCreateAccountClick,
    handleStayLoggedInChange,
    handleLogin,
  };
};