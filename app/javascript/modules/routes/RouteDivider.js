import React from 'react';
import { Route } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { WrapperPageContainer } from 'modules/layout';
import { getProjects } from 'modules/data';
import { Routes, RoutesWithProjectId } from './Routes';
import projectByDomain from './projectByDomain';

function RouteDivider() {
    const projects = useSelector(getProjects);
    const projectFromDomain = projectByDomain(projects);

    return (
        <Route path={'/'} render={routeProps => (
            <WrapperPageContainer {...routeProps} >
                { projectFromDomain ? <Routes /> : <RoutesWithProjectId /> }
            </WrapperPageContainer>
        )} />
    );
}

export default RouteDivider;
