import { Component } from 'react';
import PropTypes from 'prop-types';

import UserProjects from './UserProjects';
import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { Features } from 'modules/features';
import { INDEX_ACCOUNT } from 'modules/flyout-tabs';
import { t } from 'modules/i18n';
import UserDetailsContainer from './UserDetailsContainer';

export default class WrappedAccount extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.props.setFlyoutTabsIndex(INDEX_ACCOUNT);
    }

    render() {
        const { account } = this.props;

        return (
            <div className='wrapper-content register'>
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
            </div>
        );
    }
}

WrappedAccount.propTypes = {
    account: PropTypes.object,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
