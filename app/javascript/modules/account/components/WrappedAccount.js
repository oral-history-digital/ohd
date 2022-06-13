import { Component } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { ErrorBoundary } from 'modules/react-toolbox';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { Features } from 'modules/features';
import { t } from 'modules/i18n';
import UserProjects from './UserProjects';
import UserDetailsContainer from './UserDetailsContainer';

export default class WrappedAccount extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { account } = this.props;

        return (
            <div className='wrapper-content register'>
                <Helmet>
                    <title>{t(this.props, `activerecord.models.user_account.one`)}</title>
                </Helmet>
                <ErrorBoundary>
                    <AuthShowContainer ifLoggedIn ifNoProject >
                        <h1>{t(this.props, `activerecord.models.user_account.one`)}</h1>
                        <div className='user-registration boxes'>
                            {
                                account && <UserDetailsContainer />
                            }
                        </div>
                        <div className='user-registration boxes'>
                            {
                                account && <UserProjects />
                            }
                        </div>
                        <AuthorizedContent object={{type: 'General'}} action='edit'>
                            <Features />
                        </AuthorizedContent>
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut={true}>
                        {t(this.props, 'devise.failure.unauthenticated')}
                    </AuthShowContainer>
                </ErrorBoundary>
            </div>
        );
    }
}

WrappedAccount.propTypes = {
    account: PropTypes.object,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};
