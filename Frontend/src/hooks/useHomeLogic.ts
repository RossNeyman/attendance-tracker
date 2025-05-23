import { useState, useEffect, useCallback } from 'react';
import { onAuthStateChanged, Auth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth as firebaseAuth } from '../config/firebaseConfig'; 
import {
  useCreateRoomMutation,
  useChangeRoomNameMutation,
  useDeleteRoomMutation,
  useArchiveRoomMutation,
  useUnarchiveRoomMutation,
} from '../features/roomsSlice'; 

interface UseHomeLogicProps {
  newRoomName: string;
  setNewRoomName: React.Dispatch<React.SetStateAction<string>>;
  refetchActiveRooms: () => void;
  refetchArchivedRooms: () => void;
  setVisibleArchivedCount: React.Dispatch<React.SetStateAction<number>>;
  setOperationError: React.Dispatch<React.SetStateAction<Error | null>>;
  authInstance?: Auth; 
}

/**
 * @module useHomeLogic
 * @description Custom hook to manage the logic for the home page, including user authentication,
 * room creation, modification, deletion, archiving, unarchiving, and navigation.
 * It integrates with Firebase for authentication and uses RTK Query mutations for room operations.
 *
 * @param {UseHomeLogicProps} props - The properties required by the hook, including state setters
 * for new room name, operation errors, visible archived count, and refetch functions for active and archived rooms.
 *
 * @returns {object} An object containing:
 *  - `userId`: The current authenticated user's ID, or null if not authenticated.
 *  - `handleAddRoom`: Function to create a new room.
 *  - `handleRoomClick`: Function to navigate to a specific room's logs.
 *  - `handleRoomNameChange`: Function to update the name of an existing room.
 *  - `handleSeeMoreArchived`: Function to load more archived rooms.
 *  - `handleArchiveRoom`: Function to archive an active room.
 *  - `handleUnarchiveRoom`: Function to unarchive a room.
 *  - `handleDeleteRoom`: Function to delete a room.
 */
export const useHomeLogic = ({
  newRoomName,
  setNewRoomName,
  refetchActiveRooms,
  refetchArchivedRooms,
  setVisibleArchivedCount,
  setOperationError,
  authInstance = firebaseAuth,
}: UseHomeLogicProps) => {
  const [userId, setUserId] = useState<string | null>(null);
  const navigate = useNavigate();

  const [createRoom] = useCreateRoomMutation();
  const [changeRoomName] = useChangeRoomNameMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [archiveRoom] = useArchiveRoomMutation();
  const [unarchiveRoom] = useUnarchiveRoomMutation();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(authInstance, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
        navigate('/login'); 
      }
    });
    return () => unsubscribe();
  }, [authInstance, navigate]);

  const handleAddRoom = useCallback(async () => {
    if (userId && newRoomName.trim()) {
      try {
        await createRoom({ userId, roomName: newRoomName.trim() }).unwrap();
        setNewRoomName('');
        refetchActiveRooms();
      } catch (error) {
        console.error('Error creating room:', error);
        setOperationError(error as Error);
      }
    }
  }, [userId, newRoomName, createRoom, setNewRoomName, refetchActiveRooms, setOperationError]);

  const handleRoomClick = useCallback((roomId: string) => {
    if (!userId) return;
    navigate(`/logs/${roomId}/${userId}`);
  }, [userId, navigate]);

  const handleRoomNameChange = useCallback(async (oldRoomName: string, newRoomNameValue: string) => {
    if (userId && newRoomNameValue.trim()) {
      try {
        await changeRoomName({ userId, roomName: oldRoomName, newRoomName: newRoomNameValue.trim() }).unwrap();
        refetchActiveRooms();
      } catch (error) {
        console.error('Error changing room name:', error);
        setOperationError(error as Error);
      }
    }
  }, [userId, changeRoomName, refetchActiveRooms, setOperationError]);

  const handleSeeMoreArchived = useCallback(() => {
    setVisibleArchivedCount((prev: number) => prev + 3);
  }, [setVisibleArchivedCount]);

  const handleArchiveRoom = useCallback(async (roomId: string) => {
    if (userId) {
      try {
        await archiveRoom({ userId, roomId }).unwrap();
        await Promise.all([refetchActiveRooms(), refetchArchivedRooms()]);
      } catch (error) {
        console.error('Error archiving room:', error);
        setOperationError(error as Error);
      }
    }
  }, [userId, archiveRoom, refetchActiveRooms, refetchArchivedRooms, setOperationError]);

  const handleUnarchiveRoom = useCallback(async (roomId: string) => {
    if (userId) {
      try {
        await unarchiveRoom({ userId, roomId }).unwrap();
        await Promise.all([refetchActiveRooms(), refetchArchivedRooms()]);
      } catch (error) {
        console.error('Error unarchiving room:', error);
        setOperationError(error as Error);
      }
    }
  }, [userId, unarchiveRoom, refetchActiveRooms, refetchArchivedRooms, setOperationError]);

  const handleDeleteRoom = useCallback(async (roomId: string) => {
    if (userId) {
      try {
        await deleteRoom({ userId, roomId }).unwrap();
        refetchActiveRooms(); 
      } catch (error) {
        console.error('Error deleting room:', error);
        setOperationError(error as Error);
      }
    }
  }, [userId, deleteRoom, refetchActiveRooms, setOperationError]);

  return {
    userId,
    handleAddRoom,
    handleRoomClick,
    handleRoomNameChange,
    handleSeeMoreArchived,
    handleArchiveRoom,
    handleUnarchiveRoom,
    handleDeleteRoom,
  };
};