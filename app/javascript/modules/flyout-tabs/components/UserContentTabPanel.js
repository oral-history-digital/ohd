import React from 'react';

import { useI18n } from 'bundles/archive/hooks/i18n';
import AuthShowContainer from 'bundles/archive/containers/AuthShowContainer';
import AllUserContentsContainer from 'bundles/archive/containers/AllUserContentsContainer';

function UserContentTabPanel() {
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

export default UserContentTabPanel;
