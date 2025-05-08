import React from 'react';
import {
  Paper,
  Typography,
  IconButton,
  Box,
  Tooltip,
} from '@mui/material';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import UnarchiveIcon from '@mui/icons-material/Unarchive';

interface ArchivedRoomCardProps {
  room: {
    id: string;
    room_name: string;
  };
  onRoomClick: (roomId: string) => void;
  onUnarchive: (roomId: string) => void;
}

const ArchivedRoomCard: React.FC<ArchivedRoomCardProps> = ({
  room,
  onRoomClick,
  onUnarchive,
}) => {
  return (
    <Paper
      elevation={2}
      sx={{
        width: 180,
        height: 180,
        borderRadius: 2,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 4,
        },
      }}
    >
      {/* Header with room icon and clickable area */}
      <Box
        sx={{
          height: '50%',
          bgcolor: 'grey.400',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
        }}
        onClick={() => onRoomClick(room.id)}
      >
        <MeetingRoomIcon sx={{ fontSize: 50, color: 'white' }} />
      </Box>

      {/* Room content */}
      <Box sx={{ p: 1.5 }}>
        <Typography
          variant="subtitle1"
          sx={{
            fontWeight: 'bold',
            mb: 1,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {room.room_name}
        </Typography>

        {/* Action buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1 }}>
          <Tooltip title="Unarchive room">
            <IconButton
              color="primary"
              onClick={() => onUnarchive(room.id)}
              size="small"
            >
              <UnarchiveIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
    </Paper>
  );
};

export default ArchivedRoomCard;