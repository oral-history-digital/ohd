import React from 'react';
import PropTypes from 'prop-types';
import Observer from 'react-intersection-observer'

import { AuthShowContainer } from 'modules/auth';
import { parametrizedQuery } from 'modules/admin';
import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import UserRegistrationContainer from './UserRegistrationContainer';

export default class UserRegistrations extends React.Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.renderScrollObserver = this.renderScrollObserver.bind(this);
    }

    renderScrollObserver() {
        if (this.props.isUserRegistrationSearching) {
            return <Spinner />;
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
            return Object.keys(this.props.userRegistrations).sort(function(a, b){return b-a}).map((c) => {
                return <UserRegistrationContainer userRegistration={this.props.userRegistrations[c]} key={`userRegistration-${c}`} />
            })
        } else {
            return (<div className="content-search-legend"><p>0 {t(this.props, 'user_registration_results')}</p></div>);
        }
    }

    render() {
        return (
            <div className='wrapper-content register'>
                <AuthShowContainer ifLoggedIn={true}>
                    <h1 className='registry-entries-title'>
                        {t(this.props, `edit.users.admin`)}
                    </h1>
                    {this.userRegistrations()}
                    {this.renderScrollObserver()}
                </AuthShowContainer>
                <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                    {t(this.props, 'devise.failure.unauthenticated')}
                </AuthShowContainer>
            </div>
        );
    }
}

UserRegistrations.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    projects: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    userRegistrations: PropTypes.object,
    resultPagesCount: PropTypes.number.isRequired,
    isUserRegistrationSearching: PropTypes.bool,
    fetchData: PropTypes.func.isRequired,
    setQueryParams: PropTypes.func.isRequired,
};