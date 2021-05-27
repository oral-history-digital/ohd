import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { WrapperPageContainer, useScrollBelowThreshold } from 'modules/layout';
import { getProjects } from 'modules/data';
import { MemoizedRoutes, MemoizedRoutesWithProjectId } from './Routes';
import projectByDomain from './projectByDomain';

function RouteDivider() {
    const projects = useSelector(getProjects);
    const projectFromDomain = projectByDomain(projects);
    const isScrollBelowThreshold = useScrollBelowThreshold();

    return (
        <Route path={'/'} render={routeProps => (
            <WrapperPageContainer
                {...routeProps}
                isSticky={isScrollBelowThreshold}
            >
                { projectFromDomain ? <MemoizedRoutes /> : <MemoizedRoutesWithProjectId /> }
            </WrapperPageContainer>
        )} />
    );
}

export default RouteDivider;
