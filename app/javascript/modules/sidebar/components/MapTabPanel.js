import PropTypes from 'prop-types';

import { ArchiveSearchFormContainer } from 'modules/search';
import { t } from 'modules/i18n';
import SubTab from './SubTab';
import AdminActionsContainer from './AdminActionsContainer';
import { AuthorizedContent } from 'modules/auth';

function MapTabPanel(props) {
    return (
        <>
            <h3 className='SidebarTabs-title'>
                { t(props, 'map') }
            </h3>

            <ArchiveSearchFormContainer map />

            <div className='flyout-sub-tabs-container flyout-video'>
                <AuthorizedContent object={{type: 'General'}} action='edit'>
                    <SubTab title={t(props, 'admin_actions')} >
                        <AdminActionsContainer archiveIds={props.selectedArchiveIds} />
                    </SubTab>
                </AuthorizedContent>
            </div>
        </>
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
