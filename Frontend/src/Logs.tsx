import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow, MenuItem, Select } from '@mui/material';
import { useGetRoomLogsQuery, useGetWeeksQuery } from './features/logsSlice';
import NavBar from './components/NavBar';

const Logs: React.FC = () => {
    const { roomId, userId } = useParams<{ roomId: string, userId: string }>();
    const [selectedWeek, setSelectedWeek] = useState<string>('');
    const { data: weeks, isLoading: isWeeksLoading, error: isWeeksError, isSuccess: isWeeksSuccess } = useGetWeeksQuery({ userId: userId, roomId: roomId });
    const { data: logs, error, isLoading, refetch: setLogs } = useGetRoomLogsQuery({ userId: userId, roomId: roomId, weekId: selectedWeek });

    useEffect(() => {
        if (isWeeksSuccess) {
            setSelectedWeek(weeks[weeks.length - 1].id);
        }
        setLogs();
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
                ) : logs.length > 0 ? (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Date</TableCell>
                                <TableCell>Attendees</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {logs.map((log: any, index: any) => (
                                <TableRow key={index}>
                                    <TableCell>{log.date}</TableCell>
                                    <TableCell>{log.attendees.join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <Typography>No logs available for this week.</Typography>
                )}
            </Container>
        );
    };
}
export default Logs;