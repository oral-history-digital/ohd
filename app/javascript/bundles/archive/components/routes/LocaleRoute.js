import React from 'react';
import { Route } from 'react-router-dom';

import WrapperPageContainer from '../../containers/WrapperPageContainer';
import Routes from './Routes';

function LocaleRoute() {
    return (
        <Route path="/:projectId/:locale">
            <WrapperPageContainer>
                <Routes />
            </WrapperPageContainer>
        </Route>
    );
}

export default LocaleRoute;
