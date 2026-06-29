export function parseDate(value) {
    if (typeof value !== 'string') {
        return value;
    }

    const input = value.trim();

    const patterns = [
        // 2026-2-13 or 2026-02-13
        {
            regex: /^(\d{4})-(\d{1,2})-(\d{1,2})$/,
            order: ['year', 'month', 'day'],
        },

        // 13.2.2026 or 13.02.2026
        {
            regex: /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/,
            order: ['day', 'month', 'year'],
        },

        // 2/13/2026, 02/13/2026, 2/3/2026
        {
            regex: /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/,
            order: ['month', 'day', 'year'],
        },
    ];

    for (const { regex, order } of patterns) {
        const match = input.match(regex);

        if (!match) {
            continue;
        }

        const parts = {};

        order.forEach((key, index) => {
            parts[key] = Number(match[index + 1]);
        });

        const date = new Date(parts.year, parts.month - 1, parts.day);

        // Reject invalid dates like 2026-02-31.
        if (
            date.getFullYear() === parts.year &&
            date.getMonth() === parts.month - 1 && // Months are 0-indexed
            date.getDate() === parts.day
        ) {
            return date;
        }

        return input;
    }

    return input;
}
