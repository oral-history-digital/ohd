import React from 'react';
import Observer from 'react-intersection-observer'
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import UserRegistrationContainer from '../containers/UserRegistrationContainer';
import { t } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class UserRegistrations extends React.Component {

    renderScrollObserver() {
        if (this.props.isUserRegistrationSearching) {
            return <img src={spinnerSrc} className="archive-search-spinner"/>;
        }
        else if (this.props.resultPagesCount > (this.props.query.page)) {
            return (
                <Observer
                    onChange={inView => this.handleScroll(inView)}
                />
            )
        }
    }

    handleScroll(inView) {
        if(inView){
            this.props.setUserRegistrationQueryParams({page: this.props.query.page + 1});
            let url = `/${this.props.locale}/user_registrations`;
            this.props.searchUserRegistration(url, this.props.query);
        }
    }

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
                    {this.renderScrollObserver()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </WrapperPageContainer>
        );
    }
}
