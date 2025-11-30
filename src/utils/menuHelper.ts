
export const chunkIntoRows = <T>(data: T[], columns: number = 3): T[][] => {
    const rows: T[][] = [];

    for (let i = 0; i < data.length; i += columns) {
        rows.push(data.slice(i, i + columns));
    }
    return rows;
}