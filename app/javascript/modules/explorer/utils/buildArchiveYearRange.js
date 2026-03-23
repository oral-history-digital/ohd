/**
 * Computes the min/max publication year from an array of archives.
 * Archives with null or invalid publication_date are ignored.
 *
 * @param {Array} archives
 * @returns {{ globalYearMin: number|null, globalYearMax: number|null }}
 */
export const buildArchiveYearRange = (archives) => {
    const years = archives
        .map((a) => Number(a.publication_date))
        .filter((y) => !isNaN(y) && y > 0);

    if (years.length === 0) return { globalYearMin: null, globalYearMax: null };

    return {
        globalYearMin: Math.min(...years),
        globalYearMax: Math.max(...years),
    };
};
