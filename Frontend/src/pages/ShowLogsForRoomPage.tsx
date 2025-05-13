import React from 'react';
import { Container, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select, Button, Alert } from '@mui/material';
import NavBar from '../components/NavBar';
import { useLogsLogic } from '../hooks/useLogsLogic';
import DogError from '../components/DogError';

/**
 * @remarks
 * This component is responsible for displaying attendance logs for a specific room.
 * It utilizes the `useLogsLogic` custom hook to manage the state and logic for fetching
 * and displaying weeks and their corresponding attendance logs.
 *
 * The component handles various states:
 * - Loading state while fetching weeks.
 * - Error state if fetching weeks fails, displaying an error message and a `DogError` component.
 * - Error state if fetching logs fails, displaying an error message and a `DogError` component.
 * - Success state for weeks:
 *   - If no weeks are available, it displays a message indicating so.
 *   - Otherwise, it presents a dropdown (`Select`) for the user to choose a week.
 *   - A button is provided to navigate to a scanner page for the current room.
 * - Loading state while fetching logs for a selected week.
 * - Success state for logs:
 *   - If logs are available for the selected week, they are displayed in a table with timestamp and attendee email.
 *   - If no logs are available for the selected week, a message indicates this.
 * - A default message prompts the user to select a week if weeks are loaded but no week is yet selected.
 * - A generic "Something went wrong" message is displayed as a fallback if none of the above conditions are met.
 *
 * It includes a `NavBar` component at the top of the page.
 * Material UI components are used for styling and layout.
 *
 * @example
 * ```tsx
 * import Logs from './ShowLogsForRoomPage';
 *
 * // In a router or page component
 * <Logs />
 * ```
 */
//TODO: Change the name of this component and its associations to a more descriptive name
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