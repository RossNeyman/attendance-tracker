import React from 'react';
import { Container, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select, Button, Alert } from '@mui/material';
import NavBar from '../components/NavBar';
import { useLogsLogic } from '../hooks/useLogsLogic';
import DogError from '../components/DogError';

/*
 * Logs Component
 * This component fetches and displays attendance logs for a specific room and week.
 * It allows users to select a week and view the corresponding logs.
 */
const Logs: React.FC = () => {
    const {
        roomId,
        selectedWeek,
        weeks,
        isWeeksLoading,
        weeksError,
        isWeeksSuccess,
        logs,
        logsError,
        isLogsLoading,
        isLogsSuccess,
        handleWeekChange,
        navigateToScanner,
    } = useLogsLogic();

    if (isWeeksLoading) {
        return (
            <>
                <NavBar />
                <Container sx={{ textAlign: 'center', mt: 4 }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Loading weeks...</Typography>
                </Container>
            </>
        );
    }

    if (weeksError) {
        return (
            <>
                <NavBar />
                <Container>
                    <DogError/>
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Error loading weeks: {weeksError.message || 'An unknown error occurred.'}
                    </Alert>
                </Container>
            </>
        );
    }

    if (logsError) {
        return (
            <>
                <NavBar />
                <Container>
                    <DogError />
                    <Alert severity="error" sx={{ mt: 2 }}>
                        Error loading logs: {logsError.message || 'An unknown error occurred.'}
                    </Alert>
                </Container>
            </>
        );
    }

    if (isWeeksSuccess && weeks) {
        const weekIds = weeks.map((week: any) => week.id);
        return (
            <>
                <NavBar />
                <Container>
                    <Button onClick={navigateToScanner} variant="contained" sx={{ my: 2 }}>
                        Use device as scanner for this room
                    </Button>
                    <Typography variant="h4" gutterBottom>
                        Attendance Logs for Room {roomId}
                    </Typography>
                    {weeks.length === 0 ? (
                        <Typography>No weeks available for this room.</Typography>
                    ) : (
                        <>
                            <Typography variant="subtitle1" gutterBottom>
                                Select a week to view attendance logs:
                            </Typography>
                            <Select
                                value={selectedWeek}
                                fullWidth
                                style={{ marginBottom: '20px' }}
                                onChange={handleWeekChange}
                                displayEmpty
                            >
                                {weekIds.map((weekId: string) => (
                                    <MenuItem key={weekId} value={weekId}>
                                        Week ID: {weekId}
                                    </MenuItem>
                                ))}
                            </Select>
                        </>
                    )}

                    {isLogsLoading ? (
                        <CircularProgress />
                    ) : selectedWeek && isLogsSuccess && logs ? (
                        logs.length > 0 ? (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date/Time</TableCell>
                                        <TableCell>Attendee Email</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {logs.map((log: any) => (
                                        <TableRow key={log.id}>
                                            <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                                            <TableCell>{log.email}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography>No logs available for this week.</Typography>
                        )
                    ) : selectedWeek ? (
                        <Typography>Loading logs for selected week...</Typography>
                    ) : (
                        !isWeeksLoading &&
                        weeks &&
                        weeks.length > 0 && (
                            <Typography>Please select a week to view logs.</Typography>
                        )
                    )}
                </Container>
            </>
        );
    }

    return (
        <>
            <NavBar />
            <Container sx={{ textAlign: 'center', mt: 4 }}>
                <Typography>Something went wrong.</Typography>
            </Container>
        </>
    );
};
export default Logs;