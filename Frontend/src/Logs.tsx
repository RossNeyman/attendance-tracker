import * as React from 'react';
import NavBar from './components/NavBar';
import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Button,
  Paper,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

export function Logs() {
  const [viewBy, setViewBy] = React.useState('Weekly');
  const [viewMode, setViewMode] = React.useState('Grid');
  const [logs, setLogs] = React.useState({
    Sun: {}, Mon: {}, Tue: {}, Wed: {}, Thu: {}, Fri: {}, Sat: {},
  });

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedDay, setSelectedDay] = React.useState('');
  const [newLog, setNewLog] = React.useState('');
  const [selectedHour, setSelectedHour] = React.useState('00:00');
  const [editMode, setEditMode] = React.useState(false);

  const handleSort = () => {
    const sortedLogs = { ...logs };
    for (const day in sortedLogs) {
      const entries = Object.entries(sortedLogs[day]);
      sortedLogs[day] = Object.fromEntries(
        entries.sort((a, b) => a[1].localeCompare(b[1]))
      );
    }
    setLogs(sortedLogs);
  };

  const handleOpenDialog = (day, hour = '00:00') => {
    setSelectedDay(day);
    setSelectedHour(hour);
    setNewLog(logs[day][hour] || '');
    setEditMode(Boolean(logs[day][hour]));
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setNewLog('');
    setSelectedHour('00:00');
    setEditMode(false);
  };

  const handleSaveLog = () => {
    if (newLog.trim() === '') return;
    const paddedHour = selectedHour.padStart(5, '0');
    setLogs((prev) => ({
      ...prev,
      [selectedDay]: {
        ...prev[selectedDay],
        [paddedHour]: newLog.trim()
      }
    }));
    handleCloseDialog();
  };

  const handleDeleteLog = (day, hour) => {
    setLogs((prev) => {
      const updated = { ...prev[day] };
      delete updated[hour];
      return {
        ...prev,
        [day]: updated
      };
    });
  };

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const getVisibleDays = () => {
    if (viewBy === 'Daily') return ['Mon'];
    return days;
  };

  const allLogs = [];
  for (const day of getVisibleDays()) {
    for (const hour in logs[day]) {
      allLogs.push({ day, hour, text: logs[day][hour] });
    }
  }

  if ((viewMode === 'List') && allLogs.length === 0) {
    allLogs.push(
      { day: 'Mon', hour: '08:00', text: 'Meeting' },
      { day: 'Tue', hour: '14:00', text: 'Review Session' },
      { day: 'Fri', hour: '10:00', text: 'Wrap-up' }
    );
  }

  return (
    <>
      <NavBar />
      <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2, mb: 3, justifyContent: 'center', flexWrap: 'wrap' }}>
          <FormControl size="small">
            <InputLabel>View by</InputLabel>
            <Select value={viewBy} onChange={(e) => setViewBy(e.target.value)} label="View by">
              <MenuItem value="Daily">Daily</MenuItem>
              <MenuItem value="Weekly">Weekly</MenuItem>
              <MenuItem value="Monthly">Monthly</MenuItem>
              <MenuItem value="Yearly">Yearly</MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>View as</InputLabel>
            <Select value={viewMode} onChange={(e) => setViewMode(e.target.value)} label="View as">
              <MenuItem value="Grid">Grid</MenuItem>
              <MenuItem value="List">List</MenuItem>
            </Select>
          </FormControl>

          <Button variant="outlined" disabled={viewMode !== 'List'} onClick={handleSort}>
            Sort Alphabetically
          </Button>
        </Box>

        {viewMode === 'Grid' ? (
          <Grid container spacing={2} wrap="nowrap" sx={{ overflowX: 'auto' }}>
            <Grid item>
              <Box sx={{ p: 2, minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                {hours.map((hour) => (
                  <Box key={hour} sx={{ height: 48, display: 'flex', alignItems: 'center' }}>
                    <Typography variant="caption" sx={{ minWidth: 40 }}>{hour}</Typography>
                  </Box>
                ))}
              </Box>
            </Grid>

            {days.map((day) => (
              <Grid item key={day} sx={{ flexShrink: 0 }}>
                <Paper elevation={2} sx={{ p: 1, width: 180, minHeight: 1152 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{day}</Typography>
                    <Button size="small" variant="text" onClick={() => handleOpenDialog(day)}>
                      + Add Log
                    </Button>
                  </Box>
                  <Box>
                    {hours.map((hour) => (
                      <Paper key={hour} sx={{ height: 48, mb: 0.5, backgroundColor: '#f9f9f9', p: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography variant="caption" sx={{ flexGrow: 1 }}>
                          {logs[day][hour] || ''}
                        </Typography>
                        {logs[day][hour] && (
                          <Box>
                            <IconButton size="small" onClick={() => handleOpenDialog(day, hour)}><EditIcon fontSize="small" /></IconButton>
                            <IconButton size="small" onClick={() => handleDeleteLog(day, hour)}><DeleteIcon fontSize="small" /></IconButton>
                          </Box>
                        )}
                      </Paper>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ width: '100%', maxWidth: 600 }}>
            {allLogs.length === 0 ? (
              <Typography variant="body1" sx={{ textAlign: 'center', mt: 4 }}>
                No logs found for this view.
              </Typography>
            ) : (
              allLogs
                .sort((a, b) => a.day.localeCompare(b.day) || a.hour.localeCompare(b.hour))
                .map(({ day, hour, text }) => (
                  <Paper key={day + hour} sx={{ p: 2, mb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="subtitle2">{day} - {hour}</Typography>
                      <Typography variant="body2">{text}</Typography>
                    </Box>
                    <Box>
                      <IconButton size="small" onClick={() => handleOpenDialog(day, hour)}><EditIcon fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => handleDeleteLog(day, hour)}><DeleteIcon fontSize="small" /></IconButton>
                    </Box>
                  </Paper>
              ))
            )}
          </Box>
        )}
      </Box>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? 'Edit Log' : `Add Log for ${selectedDay}`}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
            <InputLabel>Select Time</InputLabel>
            <Select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              label="Select Time"
              disabled={editMode}
            >
              {hours.map((hour) => (
                <MenuItem key={hour} value={hour}>{hour}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Log Comment"
            type="text"
            fullWidth
            variant="outlined"
            value={newLog}
            onChange={(e) => setNewLog(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveLog} variant="contained">{editMode ? 'Update' : 'Add'}</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
