import { useSelector } from 'react-redux';

import { LayoutContainer, useScrollBelowThreshold } from 'modules/layout';
import { getProjects } from 'modules/data';
import { MemoizedRoutesWithoutProjectId, MemoizedRoutesWithProjectId } from './Routes';
import projectByDomain from './projectByDomain';

function RouteDivider() {
    const projects = useSelector(getProjects);
    const projectFromDomain = projectByDomain(projects);
    const isScrollBelowThreshold = useScrollBelowThreshold();

    return (
        <LayoutContainer scrollPositionBelowThreshold={isScrollBelowThreshold}>
            {projectFromDomain ?
                <MemoizedRoutesWithoutProjectId /> :
                <MemoizedRoutesWithProjectId />
            }
        </LayoutContainer>
    );
}

export default RouteDivider;
