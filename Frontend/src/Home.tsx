import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import NavBar from './components/NavBar';
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Grid,
  IconButton,
  Button,
  Paper,
  TextField
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import { auth } from './config/firebaseConfig';
import { useGetActiveRoomsQuery, useGetArchivedRoomsQuery, useCreateRoomMutation, useChangeRoomNameMutation, useDeleteRoomMutation, useArchiveRoomMutation } from './features/roomsSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useNavigate } from 'react-router-dom';
import DogError from './components/dogError';

export function Home() {
  const theme = useTheme();
  const [userId, setUserId] = useState<string | null>(null);
  const { data: rooms = [], error, refetch: setRooms, isLoading } = useGetActiveRoomsQuery(userId || skipToken);
  const { data: archivedRooms, error: isArchivedError, refetch: setArchivedRooms, isLoading: isArchivedLoading } = useGetArchivedRoomsQuery(userId || skipToken);
  const [showArchived, setShowArchived] = useState(false);
  const [visibleArchivedCount, setVisibleArchivedCount] = useState(3);
  const [newRoomName, setNewRoomName] = useState('');
  const [createRoom] = useCreateRoomMutation();
  const [changeRoomName] = useChangeRoomNameMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [archiveRoom] = useArchiveRoomMutation();
  const [operationError, setOperationError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        setUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (rooms && rooms.length > 0) {
      setRooms();
    }
    if (archivedRooms)
      setArchivedRooms();
  }, [rooms, archivedRooms])

  const handleAddRoom = async () => {
    if (userId) {
      try {
        await createRoom({ userId: userId, roomName: newRoomName }).unwrap();
        setNewRoomName('');
        await setRooms();
      } catch (error) {
        console.error('Error creating room:', error);
        setOperationError(error as Error);
      }
    }
  };

  const handleRoomClick = (roomId: string) => {
    if (!userId) return;
    navigate(`/logs/${roomId}/${userId}`);
  }

  const handleRoomNameChange = async (oldRoomName: string, newRoomName: string) => {
    if (userId) {
      try {
        await changeRoomName({ userId: userId, roomName: oldRoomName, newRoomName: newRoomName }).unwrap();
        await setRooms();
      } catch (error) {
        console.error('Error changing room name:', error);
        setOperationError(error as Error);
      }
    }
  };

  const handleSeeMoreArchived = () => {
    setVisibleArchivedCount((prev: number) => prev + 3);
  };

  const handleArchiveRoom = async (roomId: string) => {
    if (userId) {
      try {
        await archiveRoom({ userId: userId, roomId: roomId }).unwrap();
        console.log(`Archiving room with ID: ${roomId}`);
        await Promise.all([setRooms(), setArchivedRooms()]);
      } catch (error) {
        console.error('Error archiving room:', error);
        setOperationError(error as Error);
      }
    }
  }

  const handleDeleteRoom = async (roomId: string) => {
    if (userId) {
      try {
        await deleteRoom({ userId: userId, roomId: roomId }).unwrap();
        console.log(`Deleting room with ID: ${roomId}`);
        await setRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        setOperationError(error as Error);
      }
    }
  }

  if (userId === null) {
    return <Typography>Loading user information...</Typography>;
  }

  if (error || isArchivedError || operationError) {
    return <DogError />;
  }

  if (isLoading) {
    return <Typography>Loading rooms...</Typography>;
  }

  return (
    <>
      <NavBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Your Rooms
        </Typography>
        <Divider sx={{ my: 2, bgcolor: theme.palette.primary.main, height: '2px', width: '80%' }} />

        {/* Room grid */}
        <Grid container spacing={2} justifyContent="center">
          {/* First Room Card with create option */}
          <Grid key="add-room">
            <Paper sx={{ p: 2, width: 150, height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <TextField
                value={newRoomName}
                onChange={(e: { target: { value: any; }; }) => setNewRoomName(e.target.value)}
                placeholder="New Room Name"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
              />
              <IconButton color="primary" onClick={handleAddRoom}>
                <AddIcon />
              </IconButton>
            </Paper>
          </Grid>

          {/* Render rooms */}
          {rooms && rooms.map((room: { room_name: string, id: string }) => (
            <Grid key={room.id}>
              <Paper sx={{ p: 2, width: 150, height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <MeetingRoomIcon color="primary" fontSize="large" />
                <TextField
                  value={room.room_name}
                  onChange={(e: { target: { value: string; }; }) => handleRoomNameChange(room.room_name, e.target.value)}
                  size="small"
                  variant="standard"
                  sx={{ mt: 1, textAlign: 'center' }}
                />
                <Button onClick={() => handleRoomClick(room.id)} variant="outlined" sx={{ mt: 1 }}>
                  View Logs
                </Button>
                <Button
                  onClick={() => handleArchiveRoom(room.id)}
                  variant="contained"
                  color="warning"
                  sx={{ mt: 1 }}
                >
                  Archive
                </Button>
                <Button
                  onClick={() => handleDeleteRoom(room.id)}
                  variant="contained"
                  color="error"
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Archived Rooms Toggle */}
        <Button onClick={() => setShowArchived(!showArchived)} sx={{ mt: 3 }} variant="contained">
          Archived Rooms
        </Button>

        {showArchived && (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
            {isArchivedLoading ? (
              <Typography>Loading archived rooms...</Typography>
            ) : archivedRooms && archivedRooms.length === 0 ? (
              <Typography>No archived rooms found.</Typography>
            ) : (
              <>
                <Grid container spacing={2} justifyContent="center">
                  {archivedRooms.slice(0, visibleArchivedCount).map((room: { room_name: any; id: string }) => (
                    <Grid key={room.id || room.room_name}>
                      <Paper sx={{ p: 2, width: 120, height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <MeetingRoomIcon color="action" fontSize="large" />
                        <Typography variant="body2" mt={1}>{room.room_name}</Typography>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
                {archivedRooms.length > visibleArchivedCount && (
                  <Button onClick={handleSeeMoreArchived} sx={{ mt: 3 }} variant="outlined">
                    See More Rooms
                  </Button>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}