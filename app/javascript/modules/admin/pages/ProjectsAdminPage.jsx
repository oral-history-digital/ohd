import { useEffect } from 'react';

import { RECEIVE_DATA, getProjects, useGetProjects } from 'modules/data';
import { useDispatch, useSelector } from 'react-redux';

import { ProjectsAdminList } from '../features/projects';

// Bridge for the legacy Redux-based admin list:
// load lightweight project list once via SWR and backfill missing Redux entries.
// Full project payload is fetched on-demand when editing a single project.
// TODO: Remove this bridge and switch the project admin list to fully SWR-based data fetching.
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

export default function ProjectsAdminPage() {
    return (
        <div className="wrapper-content project-index">
            {/* Keep the legacy Redux flow while hydrating list data. */}
            <HydrateProjectsForLegacyContainers />
            <ProjectsAdminList />
        </div>
    );
}
