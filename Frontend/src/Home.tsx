import { useState } from 'react';
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

export function Home() {
  const theme = useTheme();
  const [rooms, setRooms] = useState([
    { id: 1, name: 'Room A' },
    { id: 2, name: 'Room B' },
    { id: 3, name: 'Room C' },
  ]);

  const [archivedRooms, _setArchivedRooms] = useState([
    { id: 4, name: 'Archived A' },
    { id: 5, name: 'Archived B' },
    { id: 6, name: 'Archived C' },
    { id: 7, name: 'Archived D' },
    { id: 8, name: 'Archived E' },
  ]);

  const [showArchived, setShowArchived] = useState(false);
  const [visibleArchivedCount, setVisibleArchivedCount] = useState(3);
  const [newRoomName, setNewRoomName] = useState('');

  const handleAddRoom = () => {
    if (newRoomName.trim() === '') return;
    const newRoom = { id: Date.now(), name: newRoomName.trim() };
    setRooms([...rooms, newRoom]);
    setNewRoomName('');
  };

  const handleRoomNameChange = (id: number, newName: string) => {
    setRooms((prevRooms: { id: number; name: string; }[]) =>
      prevRooms.map((room) => (room.id === id ? { ...room, name: newName } : room))
    );
  };

  const handleSeeMoreArchived = () => {
    setVisibleArchivedCount((prev: number) => prev + 3);
  };

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
          <Grid>
            <Paper sx={{ p: 2, width: 150, height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <TextField
                value={newRoomName}
                onChange={(e: { target: { value: any; }; }) => setNewRoomName(e.target.value)}
                placeholder="New Room Name"
                size="small"
                fullWidth
                sx={{ mb: 1 }}
              />
              <IconButton color="primary" onClick={handleAddRoom}>
                <AddIcon />
              </IconButton>
            </Paper>
          </Grid>

          {/* Render rooms */}
          {rooms.map((room: { name: any; id: number; }) => (
            <Grid>
              <Paper sx={{ p: 2, width: 150, height: 150, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                <MeetingRoomIcon color="primary" fontSize="large" />
                <TextField
                  value={room.name}
                  onChange={(e: { target: { value: string; }; }) => handleRoomNameChange(room.id, e.target.value)}
                  size="small"
                  variant="standard"
                  sx={{ mt: 1, textAlign: 'center' }}
                />
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
            <Grid container spacing={2} justifyContent="center">
              {archivedRooms.slice(0, visibleArchivedCount).map((room: { name: any; }) => (
                <Grid>
                  <Paper sx={{ p: 2, width: 120, height: 120, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <MeetingRoomIcon color="action" fontSize="large" />
                    <Typography variant="body2" mt={1}>{room.name}</Typography>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            {archivedRooms.length > visibleArchivedCount && (
              <Button onClick={handleSeeMoreArchived} sx={{ mt: 3 }} variant="outlined">
                See More Rooms
              </Button>
            )}
          </Box>
        )}
      </Box>
    </>
  );
}