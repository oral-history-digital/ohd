export default function isDate(dateString) {
    if (typeof dateString !== 'string') {
        return false;
    }

    const trimmedDate = dateString.trim();

    return isFullISO8601Format(trimmedDate)
        && isValidDate(new Date(trimmedDate));
}

export function isFullISO8601Format(dateString) {
    const format = /^\d{4}-\d{2}-\d{2}$/;
    return format.test(dateString);
}

export function isValidDate(date) {
    return date instanceof Date && !isNaN(date);
}
