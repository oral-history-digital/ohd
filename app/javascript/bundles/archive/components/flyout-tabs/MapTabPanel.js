import React from 'react';
import PropTypes from 'prop-types';

import AdminActionsContainer from '../../containers/AdminActionsContainer';
import AuthShowContainer from '../../containers/AuthShowContainer';
import ArchiveSearchFormContainer from '../../containers/ArchiveSearchFormContainer';
import InterviewDataContainer from '../../containers/InterviewDataContainer';
import { admin, t } from '../../../../lib/utils';

function MapTabPanel(props) {
    return (
        <AuthShowContainer ifLoggedIn>
            <div className='flyout-tab-title'>
                { t(props, 'map') }
            </div>
            <ArchiveSearchFormContainer map/>
            <div className='flyout-sub-tabs-container flyout-video'>
                {
                    admin(props, {type: 'General', action: 'edit'}) ?
                        (<InterviewDataContainer
                            title={t(props, 'admin_actions')}
                            content={<AdminActionsContainer archiveIds={props.selectedArchiveIds} />}
                        />) :
                        null
                }
            </div>
        </AuthShowContainer>
    );
}

MapTabPanel.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
}

export default MapTabPanel;