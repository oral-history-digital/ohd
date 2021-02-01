import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import WrapperPageContainer from 'bundles/archive/containers/WrapperPageContainer';
import { Routes, RoutesWithProjectId } from './Routes';
import { getProjects } from 'bundles/archive/selectors/dataSelectors';
import { projectByDomain } from 'lib/utils';

function RouteDivider() {
    const projects = useSelector(getProjects);
    const projectFromDomain = projectByDomain(projects);
    const path = projectFromDomain ? "/:locale" : "/:projectId/:locale";

    return (
        <Route path={path} render={routeProps => (
            <WrapperPageContainer {...routeProps} >
                { projectFromDomain ? <Routes /> : <RoutesWithProjectId /> }
            </WrapperPageContainer>
        )} />
    );
}

export default RouteDivider;
