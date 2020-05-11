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
            this.props.fetchData(this.props, 'user_registrations', null, null, parametrizedQuery(this.props.query));
        }
    }

    userRegistrations() {
        if (this.props.userRegistrations && Object.keys(this.props.userRegistrations).length > 0) {
            return Object.keys(this.props.userRegistrations).sort(function(a, b){return b-a}).map((c, index) => {
                return <UserRegistrationContainer userRegistration={this.props.userRegistrations[c]} key={`userRegistration-${c}`} />
            })
        } else {
            return (<div className="content-search-legend"><p>0 {t(this.props, 'user_registration_results')}</p></div>);
        }
    }

    render() {
        let tabIndex = this.props.locales.length + 5;
        return (
            <WrapperPageContainer tabIndex={tabIndex}>
                <div className='wrapper-content register'>
                    <AuthShowContainer ifLoggedIn={true}>
		        <h1 className='registry-entries-title'>{t(this.props, `edit.users.admin`)}</h1>
                        {this.userRegistrations()}
                        {this.renderScrollObserver()}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {t(this.props, 'devise.failure.unauthenticated')}
                    </AuthShowContainer>
		</div>
            </WrapperPageContainer>
        );
    }
}
