import { useState } from 'react';
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
import { 
  useGetActiveRoomsQuery, 
  useGetArchivedRoomsQuery 
} from '../features/roomsSlice';
import { skipToken } from '@reduxjs/toolkit/query/react';
import RoomCard from '../components/rooms/RoomCard';
import ArchivedRoomCard from '../components/rooms/ArchivedRoomCard';
import DogError from '../components/DogError';
import { useHomeLogic } from '../hooks/useHomeLogic';

export function Home() {
  const theme = useTheme();
  const [newRoomName, setNewRoomName] = useState('');
  const [operationError, setOperationError] = useState<Error | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [visibleArchivedCount, setVisibleArchivedCount] = useState(3);

  const {
    userId,
    handleAddRoom,
    handleRoomClick,
    handleRoomNameChange,
    handleSeeMoreArchived,
    handleArchiveRoom,
    handleUnarchiveRoom,
    handleDeleteRoom,
  } = useHomeLogic({
    newRoomName,
    setNewRoomName,
    refetchActiveRooms: () => refetchActiveRooms(),
    refetchArchivedRooms: () => refetchArchivedRooms(),
    setVisibleArchivedCount,
    setOperationError,
  });

  const { data: rooms = [], error: activeRoomsError, refetch: refetchActiveRooms, isLoading: isActiveLoading } = useGetActiveRoomsQuery(userId || skipToken);
  const { data: archivedRooms = [], error: archivedRoomsError, refetch: refetchArchivedRooms, isLoading: isArchivedLoading } = useGetArchivedRoomsQuery(userId || skipToken);

  if (userId === null && !isActiveLoading && !isArchivedLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Authenticating user...</Typography>
      </Box>
    );
  }

  if (activeRoomsError || archivedRoomsError || operationError) {
    return <DogError />;
  }

  if (isActiveLoading && userId) {
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

        <Grid container spacing={3} justifyContent="center" sx={{ maxWidth: 1200, mb: 4 }}>
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

          {rooms && rooms.map((room: { id: any; room_name?: string; }) => (
            <Grid key={room.id}>
              <RoomCard
                room={{
                  id: String(room.id),
                  room_name: room.room_name || 'Unnamed Room'
                }}
                onRoomClick={() => handleRoomClick(String(room.id))}
                onArchive={() => handleArchiveRoom(String(room.id))}
                onDelete={() => handleDeleteRoom(String(room.id))}
                onNameChange={(oldName, newName) => handleRoomNameChange(oldName, newName)}
              />
            </Grid>
          ))}
        </Grid>

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
            {isArchivedLoading && userId ? (
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
                      <Grid key={room.id}>
                        <ArchivedRoomCard
                          room={{
                            id: String(room.id),
                            room_name: room.room_name || 'Unnamed Room'
                          }}
                          onRoomClick={() => handleRoomClick(String(room.id))}
                          onUnarchive={() => handleUnarchiveRoom(String(room.id))}
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