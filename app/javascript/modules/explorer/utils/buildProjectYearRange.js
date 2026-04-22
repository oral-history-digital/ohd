/**
 * Computes the min/max publication year from an array of projects.
 * Projects with null or invalid publication_date are ignored.
 *
 * @param {Array} projects
 * @returns {{ globalYearMin: number|null, globalYearMax: number|null }}
 */
export const buildProjectYearRange = (projects) => {
    const years = projects
        .map((a) => Number(a.publication_date))
        .filter((y) => !isNaN(y) && y > 0);

    if (years.length === 0) return { globalYearMin: null, globalYearMax: null };

    return {
        globalYearMin: Math.min(...years),
        globalYearMax: Math.max(...years),
    };
};
