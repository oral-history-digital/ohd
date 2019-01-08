import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import { t } from '../../../lib/utils';

export default class UserRegistrations extends React.Component {

    render() {
        let tabIndex = this.props.locales.length + 9;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    implement users here
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
