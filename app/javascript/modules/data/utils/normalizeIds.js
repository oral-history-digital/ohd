export function normalizeProjectDbId(value) {
    if (value === null || value === undefined) {
        return null;
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) && value >= 0 ? value : null;
    }

    if (typeof value === 'string') {
        const normalized = value.trim();
        if (!normalized) {
            return null;
        }

        const id = Number(normalized);
        return Number.isFinite(id) && id >= 0 ? id : null;
    }

    return null;
}

export function normalizeShortname(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim();
    return normalized || null;
}
