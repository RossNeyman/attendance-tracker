import React, { useState } from 'react';
import {
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface RoomCardProps {
  room: {
    id: string;
    room_name: string;
  };
  onRoomClick: (roomId: string) => void;
  onArchive: (roomId: string) => void;
  onDelete: (roomId: string) => void;
  onNameChange: (oldName: string, newName: string) => void;
}

const RoomCard: React.FC<RoomCardProps> = ({
  room,
  onRoomClick,
  onArchive,
  onDelete,
  onNameChange,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [roomName, setRoomName] = useState(room.room_name);

  const handleNameChange = () => {
    if (roomName !== room.room_name) {
      onNameChange(room.room_name, roomName);
    }
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleNameChange();
    }
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: 200,
        height: 220,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 6,
        },
      }}
    >
      {/* Header with room icon and clickable area */}
      <Box
        sx={{
          height: '50%',
          bgcolor: 'primary.main',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => onRoomClick(room.id)}
      >
        <MeetingRoomIcon sx={{ fontSize: 60, color: 'white' }} />
      </Box>

      {/* Room content */}
      <Box sx={{ p: 1.5, position: 'relative' }}>
        {isEditing ? (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <TextField
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              size="small"
              fullWidth
              autoFocus
              onBlur={handleNameChange}
              onKeyDown={handleKeyDown}
            />
          </Box>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                flex: 1,
              }}
            >
              {room.room_name}
            </Typography>
            <Tooltip title="Edit name">
              <IconButton size="small" onClick={() => setIsEditing(true)}>
                <EditIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        )}

        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
          <Tooltip title="Archive room">
            <IconButton
              size="small"
              color="warning"
              onClick={() => onArchive(room.id)}
            >
              <ArchiveIcon />
            </IconButton>
          </Tooltip>

          <Button
            variant="contained"
            size="small"
            color="primary"
            onClick={() => onRoomClick(room.id)}
            sx={{ mx: 1, flex: 1 }}
          >
            View Logs
          </Button>

          <Tooltip title="Delete room">
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete(room.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default RoomCard;