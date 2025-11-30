// src/hooks/useTimeAgo.ts (New file)

import { useEffect, useState } from 'react';
import { getTimeAgo } from '../utils/timeUtils'; // Your utility function

/**
 * Custom hook to calculate and update the time elapsed since a timestamp.
 * It forces an update every 60 seconds.
 * * @param {string} createdAtIsoDate - The ISO 8601 string timestamp.
 * @returns {string} The time elapsed (e.g., "5 minutes ago").
 */
export const useTimeAgo = (createdAtIsoDate: string): string => {
    
    // 1. Initial State: Calculate the current time string immediately
    const [timeAgo, setTimeAgo] = useState(() => getTimeAgo(createdAtIsoDate));
    
    // 2. Effect for setting up the timer
    useEffect(() => {
        // Function to run the update
        const updateTime = () => {
            // Recalculate and update the state
            setTimeAgo(getTimeAgo(createdAtIsoDate));
        };

        // Set the interval to run every 60 seconds (60000 milliseconds)
        const intervalId = setInterval(updateTime, 60000); 

        // Cleanup function: Clear the interval when the component unmounts 
        // or dependencies change. This is CRUCIAL to prevent memory leaks.
        return () => clearInterval(intervalId);

    }, [createdAtIsoDate]); // 3. Dependency: Rerun effect if the order's creation time changes

    return timeAgo;
};