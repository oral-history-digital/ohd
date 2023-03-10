import { useSelector } from 'react-redux';

import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
import { getCurrentProject, getProjects } from 'modules/data';
import { MemoizedRoutesWithoutProjectId, MemoizedRoutesWithProjectId } from './Routes';
//import projectByDomain from './projectByDomain';

function RouteDivider() {
    const project = useSelector(getCurrentProject);
    const projects = useSelector(getProjects);
    //const projectFromDomain = projectByDomain(projects);
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
