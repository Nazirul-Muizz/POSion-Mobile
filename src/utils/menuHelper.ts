
export const chunkIntoRows = <T>(data: T[], columns: number = 3): T[][] => {
    const rows: T[][] = [];

    for (let i = 0; i < data.length; i += columns) {
        rows.push(data.slice(i, i + columns));
    }
    return rows;
}

export const validateItemName = (name: string): boolean => {
    // new name should not be empty or just spaces
    // and should not exceed 50 characters
    return name.trim().length > 0 && name.length <= 50; 
}

