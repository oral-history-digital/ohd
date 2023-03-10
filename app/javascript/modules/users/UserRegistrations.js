import { Component } from 'react';
import PropTypes from 'prop-types';
import Observer from 'react-intersection-observer'
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
import { AuthShowContainer } from 'modules/auth';
import { parametrizedQuery } from 'modules/admin';
import { HelpText } from 'modules/help-text';
import { t } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import UserRegistrationContainer from './UserRegistrationContainer';

export default class UserRegistrations extends Component {
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
        this.renderScrollObserver = this.renderScrollObserver.bind(this);
    }

    componentDidMount() {
        const query =  'page=1&user_registration_projects.workflow_state=account_confirmed';
        this.props.fetchData(this.props, 'user_registrations', null, null, query);
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
            return (
                <div className="content-search-legend">
                    <p>
                        0 {t(this.props, 'user_registration_results')}
                    </p>
                </div>
            );
        }
    }

    render() {
        return (
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(this.props, `edit.users.admin`)}</title>
                </Helmet>
                <ErrorBoundary>
                    <AuthShowContainer ifLoggedIn={true}>
                        <HelpText code="user_admin_page" />

                        <h1 className='registry-entries-title'>
                            {t(this.props, `edit.users.admin`)}
                        </h1>
                        {this.userRegistrations()}
                        {this.renderScrollObserver()}
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true} ifNoProject={true}>
                        {t(this.props, 'devise.failure.unauthenticated')}
                    </AuthShowContainer>
                </ErrorBoundary>
            </div>
        );
    }
}

UserRegistrations.propTypes = {
    locale: PropTypes.string.isRequired,
    projectId: PropTypes.string.isRequired,
    project: PropTypes.object.isRequired,
    translations: PropTypes.object.isRequired,
    query: PropTypes.object.isRequired,
    userRegistrations: PropTypes.object,
    resultPagesCount: PropTypes.number.isRequired,
    isUserRegistrationSearching: PropTypes.bool,
    fetchData: PropTypes.func.isRequired,
    setQueryParams: PropTypes.func.isRequired,
};
