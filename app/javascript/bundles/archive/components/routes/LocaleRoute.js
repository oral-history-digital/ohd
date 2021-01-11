import React from 'react';
import { Helmet } from 'react-helmet';
import { Route } from 'react-router-dom';

import WrapperPageContainer from '../../containers/WrapperPageContainer';
import Routes from './Routes';

function LocaleRoute() {
    return (
        <Route path="/:locale" render={routeProps => (
            <>
            <Helmet>
                <html lang={routeProps.match.params.locale} />
            </Helmet>
            <WrapperPageContainer>
                <Routes />
            </WrapperPageContainer>
            </>
        )} />
    );
}

export default LocaleRoute;
