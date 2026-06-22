import { useEffect } from 'react';

import { RECEIVE_DATA, getProjects, useGetProjects } from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';

import WrappedProjectsContainer from './WrappedProjectsContainer';

// Bridge for legacy admin containers:
// load lightweight project list once via SWR and backfill missing Redux entries.
// Full project payload is fetched on-demand when editing a single project.
// TODO: Remove this bridge and switch to fully SWR-based data fetching in legacy admin containers.
function HydrateProjectsForLegacyContainers() {
    const dispatch = useDispatch();
    const existingProjects = useSelector(getProjects);
    const { projects } = useGetProjects({ all: true });

    useEffect(() => {
        if (!Array.isArray(projects) || projects.length === 0) {
            return;
        }

        const projectsById = projects.reduce((acc, project) => {
            if (project?.id !== undefined && project?.id !== null) {
                // Keep richer project objects already in Redux (for example from
                // initial bootstrap or per-project hydration) and only backfill
                // missing entries for legacy containers.
                if (existingProjects?.[project.id]) {
                    return acc;
                }

                acc[project.id] = {
                    ...project,
                    // Legacy admin hooks rely on `data.type` (e.g. useSensitiveData).
                    // `/projects/list` payload doesn't provide it, so add a compatible fallback.
                    type: project.type || 'Project',
                };
            }
            return acc;
        }, {});

        if (Object.keys(projectsById).length === 0) {
            return;
        }

        dispatch({
            type: RECEIVE_DATA,
            dataType: 'projects',
            data: projectsById,
        });
    }, [dispatch, existingProjects, projects]);

    return null;
}

export default function ArchivePage() {
    return (
        <div className="wrapper-content project-index">
            {/* Keep legacy container flow while hydrating list data into Redux. */}
            <HydrateProjectsForLegacyContainers />
            <WrappedProjectsContainer />
        </div>
    );
}
