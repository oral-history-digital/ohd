import { useSelector } from 'react-redux';

import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
import { getCurrentProject, getProjects } from 'modules/data';
import { MemoizedRoutesWithoutProjectId, MemoizedRoutesWithProjectId } from './Routes';

function RouteDivider() {
    const project = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    const isScrollBelowThreshold = useScrollBelowThreshold();

    return (
        <LayoutContainer scrollPositionBelowThreshold={isScrollBelowThreshold}>
            {project.archive_domain ?
                <MemoizedRoutesWithoutProjectId project={project} /> :
                <MemoizedRoutesWithProjectId />
            }
        </LayoutContainer>
    );
}

export default RouteDivider;
