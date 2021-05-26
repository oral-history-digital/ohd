import PropTypes from 'prop-types';

import { AuthShowContainer } from 'modules/auth';
import { ArchiveSearchFormContainer } from 'modules/search';
import { admin } from 'modules/auth';
import { t } from 'modules/i18n';
import InterviewDataContainer from './InterviewDataContainer';
import AdminActionsContainer from './AdminActionsContainer';

function MapTabPanel(props) {
    return (
        <AuthShowContainer ifLoggedIn>
            <div className='flyout-tab-title'>
                { t(props, 'map') }
            </div>
            <ArchiveSearchFormContainer map/>
            <div className='flyout-sub-tabs-container flyout-video'>
                {
                    admin(props, {type: 'General'}, 'edit') ?
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
