import React from 'react';
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import UserRegistrationContainer from '../containers/UserRegistrationContainer';
import { t } from '../../../lib/utils';

export default class UserRegistrations extends React.Component {

    userRegistrations() {
        let userRegistrations = [];
        for (var c in this.props.userRegistrations) {
            userRegistrations.push(<UserRegistrationContainer userRegistration={this.props.userRegistrations[c]} key={`userRegistration-${c}`} />);
        }
        return userRegistrations;
    }

    render() {
        let tabIndex = this.props.locales.length + 9;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <AuthShowContainer ifLoggedIn={true}>
                    {this.userRegistrations()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
