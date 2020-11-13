import React from 'react';
import PropTypes from 'prop-types';

import AuthShowContainer from '../../containers/AuthShowContainer';
import AllUserContentsContainer from '../../containers/AllUserContentsContainer';
import { t } from '../../../../lib/utils';

function UserContentTabPanel(props) {
    return (
        <AuthShowContainer ifLoggedIn>
            <div className='flyout-tab-title'>
                { t(props, 'user_content') }
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
