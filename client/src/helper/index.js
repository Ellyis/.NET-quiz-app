export const getFormattedTime = seconds => {
    return Math.floor(seconds / 60).toString().padStart(2, '0') + ":" + 
        Math.floor(seconds % 60).toString().padStart(2, '0');
}