import { parseDate } from './parseDate';

export function isDate(dateString) {
    const date = parseDate(dateString);
    return date instanceof Date && !isNaN(date);
}
