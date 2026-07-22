/**
 * Format a date string into a human-readable format.
 * @param {string} date 
 * @returns 
 */
function formatDate(date) {

    if (!date) {
        return 'Unknown';
    }


    return new Date(date)
        .toLocaleString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

}


module.exports = {
    formatDate
};