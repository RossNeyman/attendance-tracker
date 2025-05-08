import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select, Button } from '@mui/material';
import { useGetRoomLogsQuery} from './features/logsSlice';
import { useGetWeeksQuery } from './features/weeksSlice';
import NavBar from './components/NavBar';
import { skipToken } from '@reduxjs/toolkit/query/react';

/*
 * Logs Component
 * This component fetches and displays attendance logs for a specific room and week.
 * It allows users to select a week and view the corresponding logs.
 */
const Logs: React.FC = () => {
    const { roomId, userId } = useParams<{ roomId: string, userId: string }>();
    const [selectedWeek, setSelectedWeek] = useState<string>('');
    const { data: weeks, isLoading: isWeeksLoading, error: isWeeksError, isSuccess: isWeeksSuccess } = useGetWeeksQuery({ userId: userId, roomId: roomId });
    const { data: logs, error, isLoading, isSuccess } = useGetRoomLogsQuery(
        selectedWeek ? { userId: userId, roomId: roomId, weekId: selectedWeek } : skipToken
    );
    const navigate = useNavigate();

    useEffect(() => {
        if (isWeeksSuccess) {
            setSelectedWeek(weeks[weeks.length - 1].id);
            console.log(weeks);
        }
    }, [selectedWeek]);

    useEffect(()=> {
        if(error){
            console.error("Error fetching logs:", error);
            //Dog error component here
        }
        if(isWeeksError){
            console.error("Error fetching weeks:", isWeeksError);
            //Dog error component here
        }
    }, [error, isWeeksError])

    if (isWeeksLoading) {
        return <CircularProgress />;
    }

    if (isWeeksSuccess) {
        const weekIds = weeks.map((week: any) => week.id);
        return (
            <Container>
                <NavBar />
                <Button onClick={() => {navigate(`/scanner/${userId}/${roomId}`)}}>
                    Use device as scanner for this room
                </Button>
                <Typography variant="h4" gutterBottom>
                    Attendance Logs for Room {roomId}
                </Typography>
                <Typography variant="subtitle1" gutterBottom>
                    Select a week to view attendance logs:
                </Typography>
                <Select
                    value={selectedWeek}
                    fullWidth
                    style={{ marginBottom: '20px' }}
                    onChange={(e) => setSelectedWeek(e.target.value)}
                >
                    {weekIds.map((weekId: string) => (
                        <MenuItem key={weekId} value={weekId}>
                            {weekId}
                        </MenuItem>
                    ))}
                </Select>
                {isLoading ? (
                    <CircularProgress />
                ) : (isSuccess) ? ( logs.length>0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Attendees</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((log: any) => (
                                <TableRow key={log.id}>
                                    <TableCell>{log.timestamp}</TableCell>
                                    <TableCell>{log.email}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>No logs available for this week.</Typography>
                )): (
                    <Typography>Please select a week to view logs</Typography>
                )}
            </Container>
        );
    };
}
export default Logs;