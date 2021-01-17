import React from 'react';
import { Route } from 'react-router-dom';

import WrapperPageContainer from '../../containers/WrapperPageContainer';
import Routes from './Routes';

function ProjectLocaleRoute() {
    return (
        <Route path="/:projectId/:locale" render={routeProps => (
            <WrapperPageContainer {...routeProps} >
                <Routes />
            </WrapperPageContainer>
        )} />
    );
}

export default ProjectLocaleRoute;
