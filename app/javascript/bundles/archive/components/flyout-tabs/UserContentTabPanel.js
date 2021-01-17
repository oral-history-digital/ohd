import React from 'react';
import PropTypes from 'prop-types';

import AuthShowContainer from '../../containers/AuthShowContainer';
import AllUserContentsContainer from '../../containers/AllUserContentsContainer';
import { useI18n } from '../../hooks/i18n';

function UserContentTabPanel(props) {

    const { t } = useI18n();

    return (
        <AuthShowContainer ifLoggedIn>
            <div className='flyout-tab-title'>
                { t('user_content') }
            </div>
            <div className='flyout-sub-tabs-container flyout-folder'>
                <AllUserContentsContainer />
            </div>
        </AuthShowContainer>
    );
}

UserContentTabPanel.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};

export default UserContentTabPanel;
