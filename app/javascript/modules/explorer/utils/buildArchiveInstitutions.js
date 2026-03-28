/**
 * Extracts a deduplicated, sorted list of institutions from all archives.
 *
 * @param {Array} archives
 * @returns {Array<{ id: number, name: string }>}
 */
export const buildArchiveInstitutions = (archives) => {
    const seen = new Map();

    archives.forEach((archive) => {
        archive.institutions?.forEach((inst) => {
            if (inst.id && !seen.has(inst.id)) {
                seen.set(inst.id, inst.name);
            }
        });
    });

    return Array.from(seen.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => a.name.localeCompare(b.name));
};
