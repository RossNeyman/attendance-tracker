import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Select, MenuItem, CircularProgress, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';

interface Log {
    date: string;
    attendees: string[];
}

const Logs: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const [logs, setLogs] = useState<Log[]>([]);
    const [selectedWeek, setSelectedWeek] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [weeks, setWeeks] = useState<string[]>([]);

    useEffect(() => {
        const fetchWeeks = async () => {
            try {
                const response = await fetch(`/api/rooms/${roomId}/weeks`);
                const data = await response.json();
                setWeeks(data);
                if (data.length > 0) {
                    setSelectedWeek(data[0]);
                }
            } catch (error) {
                console.error('Error fetching weeks:', error);
            }
        };

        fetchWeeks();
    }, [roomId]);

    useEffect(() => {
        if (!selectedWeek) return;
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/rooms/${roomId}/logs?week=${selectedWeek}`);
                const data = await response.json();
                setLogs(data);
            } catch (error) {
                console.error('Error fetching logs:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchLogs();
    }, [roomId, selectedWeek]);

    const handleWeekChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedWeek(event.target.value as string);
    };

    return (
        <Container>
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
            >
                {weeks.map((week) => (
                    <MenuItem key={week} value={week}>
                        {week}
                    </MenuItem>
                ))}
            </Select>
            {loading ? (
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
                        {logs.map((log, index) => (
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

export default Logs;