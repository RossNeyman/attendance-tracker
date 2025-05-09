import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import NavBar from '../components/NavBar';
import {
  Box,
  Typography,
  Divider,
  useTheme,
  Grid,
  IconButton,
  Paper,
  TextField,
  CircularProgress
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { auth } from '../config/firebaseConfig';
import { 
  useGetActiveRoomsQuery, 
  useGetArchivedRoomsQuery, 
  useCreateRoomMutation, 
  useChangeRoomNameMutation, 
  useDeleteRoomMutation, 
  useArchiveRoomMutation,
  useUnarchiveRoomMutation 
} from '../features/roomsSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import { useNavigate } from 'react-router-dom';
import RoomCard from '../components/rooms/RoomCard';
import ArchivedRoomCard from '../components/rooms/ArchivedRoomCard';
import DogError from '../components/dogError';

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
  const [unarchiveRoom] = useUnarchiveRoomMutation();
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

  const handleAddRoom = async () => {
    if (userId && newRoomName.trim()) {
      try {
        await createRoom({ userId: userId, roomName: newRoomName }).unwrap();
        setNewRoomName('');
        await setRooms();
      } catch (error) {
        console.error('Error creating room:', error);
      }
    }
  };

  const handleRoomClick = (roomId: string) => {
    if (!userId) return;
    navigate(`/logs/${roomId}/${userId}`);
  };

  const handleRoomNameChange = async (oldRoomName: string, newRoomName: string) => {
    if (userId && newRoomName.trim()) {
      try {
        await changeRoomName({ userId: userId, roomName: oldRoomName, newRoomName: newRoomName }).unwrap();
        await setRooms();
      } catch (error) {
        console.error('Error changing room name:', error);
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
  };

  const handleUnarchiveRoom = async (roomId: string) => {
    if (userId) {
      try {
        await unarchiveRoom({ userId: userId, roomId: roomId }).unwrap();
        await Promise.all([setRooms(), setArchivedRooms()]);
      } catch (error) {
        console.error('Error unarchiving room:', error);
      }
    }
  };

  const handleDeleteRoom = async (roomId: string) => {
    if (userId) {
      try {
        await deleteRoom({ userId: userId, roomId: roomId }).unwrap();
        await setRooms();
      } catch (error) {
        console.error('Error deleting room:', error);
        setOperationError(error as Error);
      }
    }
  };

  if (userId === null) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading user information...</Typography>
      </Box>
    );
  }

  if (error || isArchivedError || operationError) {
    return <DogError />;
  }

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading rooms...</Typography>
      </Box>
    );
  }

  return (
    <>
      <NavBar />
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 4, px: 3 }}>
        <Typography variant="h4" gutterBottom fontWeight="bold">
          Your Rooms
        </Typography>
        <Divider sx={{ my: 2, bgcolor: theme.palette.primary.main, height: '3px', width: '80%', maxWidth: '800px' }} />

        {/* Room grid */}
        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 1200, mb: 4 }}>
          {/* Create new room card */}
          <Grid>
            <Paper
              elevation={3}
              sx={{
                width: 200,
                height: 220,
                borderRadius: 2,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                p: 2,
                border: '2px dashed',
                borderColor: 'primary.light',
              }}
            >
              <Typography variant="h6" sx={{ mb: 2, color: 'primary.main' }}>Create New Room</Typography>
              <TextField
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
                placeholder="Room Name"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
                onKeyDown={(e) => e.key === 'Enter' && handleAddRoom()}
              />
              <IconButton
                color="primary"
                onClick={handleAddRoom}
                sx={{ bgcolor: 'primary.light', '&:hover': { bgcolor: 'primary.main', color: 'white' } }}
              >
                <AddIcon />
              </IconButton>
            </Paper>
          </Grid>

          {/* Render active rooms */}
          {rooms && rooms.map((room: { id: any; room_name?: string; }) => (
            <Grid>
              <RoomCard
                room={{
                  id: String(room.id),
                  room_name: room.room_name || 'Unnamed Room'
                }}
                onRoomClick={handleRoomClick}
                onArchive={handleArchiveRoom}
                onDelete={handleDeleteRoom}
                onNameChange={handleRoomNameChange}
              />
            </Grid>
          ))}
        </Grid>

        {/* Archived Rooms Section */}
        <Box 
          sx={{ 
            width: '100%', 
            backgroundColor: 'grey.100', 
            p: 3, 
            borderRadius: 2,
            maxWidth: 1200,
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: 'grey.200',
            }
          }}
          onClick={() => setShowArchived(!showArchived)}
        >
          <Typography variant="h5" sx={{ textAlign: 'center', color: 'grey.700' }}>
            {showArchived ? 'Hide Archived Rooms' : 'Show Archived Rooms'} 
            ({archivedRooms?.length || 0})
          </Typography>
        </Box>

        {showArchived && (
          <Box sx={{ mt: 3, width: '100%', maxWidth: 1200 }}>
            {isArchivedLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress size={30} />
                <Typography sx={{ ml: 2 }}>Loading archived rooms...</Typography>
              </Box>
            ) : archivedRooms?.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', p: 3, color: 'grey.600' }}>
                No archived rooms found.
              </Typography>
            ) : (
              <>
                <Grid container spacing={3} justifyContent="center">
                  {archivedRooms.slice(0, visibleArchivedCount).map((room: { id: any; room_name?: string; }) => (
                      <Grid>
                        <ArchivedRoomCard
                          room={{
                            id: String(room.id),
                            room_name: room.room_name || 'Unnamed Room'
                          }}
                          onRoomClick={handleRoomClick}
                          onUnarchive={handleUnarchiveRoom}
                        />
                      </Grid>
                    ))}
                </Grid>
                {archivedRooms.length > visibleArchivedCount && (
                  <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <IconButton
                      onClick={handleSeeMoreArchived}
                      sx={{ 
                        bgcolor: 'grey.300', 
                        '&:hover': { bgcolor: 'grey.400' },
                        p: 1
                      }}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                )}
              </>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}