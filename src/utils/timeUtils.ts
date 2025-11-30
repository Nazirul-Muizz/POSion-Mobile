// src/utils/timeUtils.ts

import { format, formatDistanceToNow, parseISO } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';

/**
 * Calculates and formats the time elapsed since the given ISO date string.
 * @param {string} createdAtIsoDate - The ISO 8601 string timestamp from the order.
 * @returns {string} A human-readable duration string (e.g., "5 minutes ago").
 */
export const getTimeAgo = (createdAtIsoDate: string): string => {
    try {
        const createdDate = parseISO(createdAtIsoDate);
        
        // formatDistanceToNow calculates the difference between createdDate and new Date()
        return formatDistanceToNow(createdDate, { 
            addSuffix: true, 
            includeSeconds: true 
        });
    } catch (error) {
        console.error("Invalid date format:", createdAtIsoDate, error);
        return "Unknown time";
    }
};

// --- Configuration ---
const MALAYSIA_TIMEZONE = 'Asia/Kuala_Lumpur'; 
// Malaysia is always UTC+8 and does not observe Daylight Saving Time.

export const getMalaysiaFormattedTime = () => {
    
    // 1. Define the current moment (always in UTC)
    const currentDate = new Date(); 

    // 2. Convert the UTC moment to a Date object representing the time in Malaysia.
    // This is the key step for accurate timezone setting.
    const zonedDate = toZonedTime(currentDate, MALAYSIA_TIMEZONE);

    // 3. Format the date into the desired output string.
    // The format string 'yyyy-MM-dd HH:mm:ss' will display the time according 
    // to the time represented by the 'zonedDate' object (i.e., Malaysia time).
    const formattedTime = format(zonedDate, 'yyyy-MM-dd HH:mm:ss');
    
    return formattedTime;
};

// Example Usage (assuming you call this function to define created at):
const createdAtTimestamp = getMalaysiaFormattedTime();
console.log(createdAtTimestamp);