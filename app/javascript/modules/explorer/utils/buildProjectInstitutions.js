/**
 * Extracts institutions and parents from project summaries, keeping the first
 * name for each ID. Missing names are retained and sorted as empty strings.
 *
 * @param {Object[]} projects - Project summaries with optional institution arrays.
 * @returns {Array<{id: number, name: ?string}>} Unique institutions sorted by name.
 */
export const buildProjectInstitutions = (projects) => {
    const seen = new Map();

    projects.forEach((project) => {
        project.institutions?.forEach((inst) => {
            if (inst.id && !seen.has(inst.id)) {
                seen.set(inst.id, inst.name);
            }

            // Also include parent institutions to allow filtering by them
            const parent = inst.parent;
            if (parent?.id && !seen.has(parent.id)) {
                seen.set(parent.id, parent.name);
            }
        });
    });

    return Array.from(seen.entries())
        .map(([id, name]) => ({ id, name }))
        .sort((a, b) => (a.name || '').localeCompare(b.name || ''));
};
