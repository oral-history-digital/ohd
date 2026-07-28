import { useHydrateAllProjects } from 'modules/data';

import WrappedProjectsContainer from './WrappedProjectsContainer';

// Bridge for legacy admin containers:
// load lightweight project list once via SWR and backfill missing Redux entries.
// Full project payload is fetched on-demand when editing a single project.
// TODO: Remove this bridge and switch to fully SWR-based data fetching in legacy admin containers.
function HydrateProjectsForLegacyContainers() {
    useHydrateAllProjects();

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
