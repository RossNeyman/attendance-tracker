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