import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

import AdminActionsContainer from '../../containers/AdminActionsContainer';
import ArchiveSearchFormContainer from '../../containers/ArchiveSearchFormContainer';
import InterviewDataContainer from '../../containers/InterviewDataContainer';
import { t, admin } from '../../../../lib/utils';

function ArchiveSearchTabPanel(props) {
    return (
        <Fragment>
            <div className='flyout-tab-title'>
                {t(props, 'archive_search')}
            </div>
            <ArchiveSearchFormContainer/>
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
        </Fragment>
    );
}

ArchiveSearchTabPanel.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
    account: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
};

export default ArchiveSearchTabPanel;
