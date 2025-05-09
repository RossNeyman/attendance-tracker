import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRoomLogsQuery } from '../features/logsSlice'; // Adjust path as necessary
import { useGetWeeksQuery } from '../features/weeksSlice'; // Adjust path as necessary
import { skipToken } from '@reduxjs/toolkit/query/react';

interface Log {
    id: string;
    timestamp: string;
    email: string;
    // Add other log properties if any
}

interface Week {
    id: string;
    // Add other week properties if any, e.g., week_name, start_date
}

interface LogsLogicReturn {
    roomId: string | undefined;
    userId: string | undefined;
    selectedWeek: string;
    setSelectedWeek: React.Dispatch<React.SetStateAction<string>>;
    weeks: Week[] | undefined;
    isWeeksLoading: boolean;
    weeksError: any; // Consider using a more specific error type
    isWeeksSuccess: boolean;
    logs: Log[] | undefined;
    logsError: any; // Consider using a more specific error type
    isLogsLoading: boolean;
    isLogsSuccess: boolean;
    handleWeekChange: (event: any) => void; // Adjust 'any' based on SelectChangeEvent if using MUI v5+
    navigateToScanner: () => void;
}

export const useLogsLogic = (): LogsLogicReturn => {
    const { roomId, userId } = useParams<{ roomId: string; userId: string }>();
    const navigate = useNavigate();
    const [selectedWeek, setSelectedWeek] = useState<string>('');

    const { 
        data: weeks, 
        isLoading: isWeeksLoading, 
        error: weeksError, 
        isSuccess: isWeeksSuccess 
    } = useGetWeeksQuery(userId && roomId ? { userId, roomId } : skipToken);

    const { 
        data: logs, 
        error: logsError, 
        isLoading: isLogsLoading, 
        isSuccess: isLogsSuccess 
    } = useGetRoomLogsQuery(
        selectedWeek && userId && roomId ? { userId, roomId, weekId: selectedWeek } : skipToken
    );

    useEffect(() => {
        if (isWeeksSuccess && weeks && weeks.length > 0 && !selectedWeek) {
            // Automatically select the most recent week (assuming last in array is most recent)
            setSelectedWeek(weeks[weeks.length - 1].id);
        }
    }, [isWeeksSuccess, weeks, selectedWeek]);

    // Error logging can remain in the component or be handled here
    // For simplicity, we'll let the component handle displaying errors

    const handleWeekChange = useCallback((event: any) => { // Adjust 'any'
        setSelectedWeek(event.target.value as string);
    }, []);

    const navigateToScanner = useCallback(() => {
        if (userId && roomId) {
            navigate(`/scanner/${userId}/${roomId}`);
        }
    }, [userId, roomId, navigate]);

    return {
        roomId,
        userId,
        selectedWeek,
        setSelectedWeek,
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
    };
};