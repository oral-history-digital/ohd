import React from 'react';
import Observer from 'react-intersection-observer'
import WrapperPageContainer from '../containers/WrapperPageContainer';
import AuthShowContainer from '../containers/AuthShowContainer';
import UserRegistrationContainer from '../containers/UserRegistrationContainer';
import { t, parametrizedQuery } from '../../../lib/utils';
import spinnerSrc from '../../../images/large_spinner.gif'

export default class UserRegistrations extends React.Component {

    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.renderScrollObserver = this.renderScrollObserver.bind(this);
    }

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
            this.props.setQueryParams('user_registrations', {page: this.props.query.page + 1});
            this.props.fetchData('user_registrations', null, null, this.props.locale, parametrizedQuery(this.props.query));
        }
    }

    userRegistrations() {
        if (this.props.userRegistrations) {
            return Object.keys(this.props.userRegistrations).sort(function(a, b){return b-a}).map((c, index) => {
                return <UserRegistrationContainer userRegistration={this.props.userRegistrations[c]} key={`userRegistration-${c}`} />
            })
        } else {
            return null;
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 6;
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
