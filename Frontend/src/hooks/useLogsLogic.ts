import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetRoomLogsQuery } from '../features/logsSlice'; 
import { useGetWeeksQuery } from '../features/weeksSlice'; 
import { skipToken } from '@reduxjs/toolkit/query/react';

interface Log {
    id: string;
    timestamp: string;
    email: string;
}

interface Week {
    id: string;
}

interface LogsLogicReturn {
    roomId: string | undefined;
    userId: string | undefined;
    selectedWeek: string;
    setSelectedWeek: React.Dispatch<React.SetStateAction<string>>;
    weeks: Week[] | undefined;
    isWeeksLoading: boolean;
    weeksError: any; 
    isWeeksSuccess: boolean;
    logs: Log[] | undefined;
    logsError: any; 
    isLogsLoading: boolean;
    isLogsSuccess: boolean;
    handleWeekChange: (event: any) => void; 
    navigateToScanner: () => void;
}

/**
 * @module useLogsLogic
 * @description Custom hook to manage the logic for displaying and filtering attendance logs for a specific room.
 * It fetches available weeks for a given user and room, allows selection of a week,
 * and then fetches the corresponding logs. It also provides navigation to a scanner page.
 *
 * @returns {LogsLogicReturn} An object containing:
 * - `roomId`, `userId`: Identifiers for the current room and user from URL parameters.
 * - `selectedWeek`, `setSelectedWeek`: State for the currently selected week ID and its setter.
 * - `weeks`, `isWeeksLoading`, `weeksError`, `isWeeksSuccess`: Data, loading state, error, and success status for fetching weeks.
 * - `logs`, `isLogsLoading`, `logsError`, `isLogsSuccess`: Data, loading state, error, and success status for fetching logs for the selected week.
 * - `handleWeekChange`: Callback function to update the `selectedWeek` based on user input.
 * - `navigateToScanner`: Callback function to navigate to the scanner page for the current user and room.
 */
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
            // Automatically select the most recent week (last in array is most recent)
            setSelectedWeek(weeks[weeks.length - 1].id);
        }
    }, [isWeeksSuccess, weeks, selectedWeek]);

    const handleWeekChange = useCallback((event: any) => { 
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