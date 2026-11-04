/**
 * Returns project record updates for a received list or detail response.
 * The shared data reducer still handles loading status and pagination metadata.
 */
export function reduceProjectRecords(state, action) {
    if (action.dataType !== 'projects') return {};

    if (!action.id && action.extraParams) {
        const projects = { ...state.projects };
        const representations = { ...state.projectRepresentations };

        // Lists contain base data. Keep loaded details and projects from other pages.
        for (const [id, base] of Object.entries(action.data || {})) {
            if (representations[id] === 'detail') continue;
            projects[id] = { ...projects[id], ...base };
            representations[id] = 'base';
        }
        return { projects, projectRepresentations: representations };
    }

    if (action.projectRepresentation === 'detail') {
        const previous = state.projects?.[action.id];
        const data = { ...action.data };

        // These empty maps are placeholders, not instructions to delete records.
        // Preserve any people, task types, and roles loaded by separate requests.
        for (const field of ['people', 'task_types', 'roles']) {
            if (
                previous?.[field] &&
                data[field] &&
                Object.keys(data[field]).length === 0
            )
                delete data[field];
        }
        return {
            projects: {
                ...state.projects,
                [action.id]: { ...previous, ...data },
            },
            projectRepresentations: {
                ...state.projectRepresentations,
                [action.id]: 'detail',
            },
        };
    }

    return {};
}
