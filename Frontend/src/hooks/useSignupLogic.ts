import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateUserMutation, user as UserType } from '../features/logsSlice'; 
import { signup } from '../services/auth/login'; 
import { setPersistence, browserSessionPersistence, browserLocalPersistence } from 'firebase/auth';
import { auth as firebaseAuth } from '../config/firebaseConfig'; 

interface SignupLogicReturn {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string;
  setPassword: React.Dispatch<React.SetStateAction<string>>;
  confirmPassword: string;
  setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
  stayLoggedIn: boolean;
  setStayLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  signupError: string | null;
  handleSignup: (event: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleLoginLinkClick: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const useSignupLogic = (): SignupLogicReturn => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [stayLoggedIn, setStayLoggedIn] = useState<boolean>(false);
  const [signupError, setSignupError] = useState<string | null>(null);
  const [createUser] = useCreateUserMutation();

  const handleSignup = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSignupError(null);

    if (password !== confirmPassword) {
      setSignupError('Passwords do not match!');
      return;
    }
    if (password.length < 6) {
      setSignupError('Password should be at least 6 characters long.');
      return;
    }

    try {
    
      const persistenceType = stayLoggedIn ? browserLocalPersistence : browserSessionPersistence;
      await setPersistence(firebaseAuth, persistenceType);

      const userCredential = await signup(email, password); 
      
      const newUser: UserType = { 
        userId: userCredential.uid,
        first_name: firstName,
        last_name: lastName,
        email: email,
      };
      await createUser({ user: newUser }).unwrap(); 

      navigate('/home'); 
    } catch (error: any) {
      console.error('Signup failed:', error);
      
      if (error.code === 'auth/email-already-in-use') {
        setSignupError('This email address is already in use.');
      } else {
        setSignupError(error.message || 'Signup failed. Please try again.');
      }
    }
  }, [
    email, 
    password, 
    confirmPassword, 
    firstName, 
    lastName, 
    stayLoggedIn, 
    createUser, 
    navigate
  ]);

  const handleLoginLinkClick = useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    navigate('/');
  }, [navigate]);

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    stayLoggedIn,
    setStayLoggedIn,
    signupError,
    handleSignup,
    handleLoginLinkClick,
  };
};