import { useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface QrScannerPageLogicReturn {
  firstName: string;
  setFirstName: React.Dispatch<React.SetStateAction<string>>;
  lastName: string;
  setLastName: React.Dispatch<React.SetStateAction<string>>;
  csiEmail: string;
  setCsiEmail: React.Dispatch<React.SetStateAction<string>>;
  roomId: string | undefined;
  userId: string | undefined;
  handleExit: () => void;
  handleGenerateQrCode: (event: React.FormEvent<HTMLFormElement>) => Promise<void>; 
}

/**
 * @module useQrScannerPageLogic
 * @description Custom hook to manage the logic for the QR scanner page.
 * It handles state for user details (first name, last name, email) and provides
 * functions to exit the page and generate a QR code.
 *
 * @returns {QrScannerPageLogicReturn} An object containing state variables (firstName,
 * lastName, csiEmail), their respective setter functions, roomId, userId,
 * and handler functions for exiting the page and generating a QR code.
 */
export const useQrScannerPageLogic = (): QrScannerPageLogicReturn => {
  const navigate = useNavigate();
  const { roomId, userId } = useParams<{ roomId: string; userId: string }>();
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [csiEmail, setCsiEmail] = useState<string>('');

  const handleExit = useCallback(() => {
    navigate('/'); 
  }, [navigate]);

  const handleGenerateQrCode = useCallback(async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log('Attempting to generate QR Code for:', { firstName, lastName, csiEmail, roomId, userId });
    alert(`A new QR code would be sent to ${csiEmail} (Implementation needed for actual QR generation and email service).`);
  }, [firstName, lastName, csiEmail]); 

  return {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    csiEmail,
    setCsiEmail,
    roomId,
    userId,
    handleExit,
    handleGenerateQrCode,
  };
};