// formatter.js

/**
 * Format a date to a readable string.
 * @param {string|Date} date - The date to format.
 * @param {object} [options={}] - The formatting options.
 * @returns {string} - The formatted date string.
 */
export function formatDate(date, options = {}) {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', options);
}

/**
 * Format a number to a currency string.
 * @param {number} amount - The amount to format.
 * @param {string} [currency='IDR'] - The currency code.
 * @returns {string} - The formatted currency string.
 */
export function formatCurrency(amount, currency = 'IDR') {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency
    }).format(amount);
}

/**
 * Capitalize the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}