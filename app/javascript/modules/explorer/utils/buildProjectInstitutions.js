/**
 * Extracts a deduplicated, sorted list of institutions from all projects.
 *
 * @param {Array} projects
 * @returns {Array<{ id: number, name: string }>}
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
        .sort((a, b) => a.name.localeCompare(b.name));
};
