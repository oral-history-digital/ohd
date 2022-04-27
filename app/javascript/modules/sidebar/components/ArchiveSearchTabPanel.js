import PropTypes from 'prop-types';

import { ArchiveSearchFormContainer } from 'modules/search';
import { useI18n } from 'modules/i18n';
import { AuthorizedContent } from 'modules/auth';
import SubTab from './SubTab';
import AdminActionsContainer from './AdminActionsContainer';

function ArchiveSearchTabPanel({ selectedArchiveIds, project }) {
    const { t } = useI18n();

    return (
        <>
            <h3 className='SidebarTabs-title'>
                {t('archive_search')}
            </h3>

            <ArchiveSearchFormContainer/>

            { project &&
                <div className='flyout-sub-tabs-container flyout-video'>
                    <AuthorizedContent object={{type: 'General'}} action='edit'>
                        <SubTab title={t('admin_actions')} >
                            <AdminActionsContainer archiveIds={selectedArchiveIds} />
                        </SubTab>
                    </AuthorizedContent>
                </div>
            }
        </>
    );
}

ArchiveSearchTabPanel.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};

export default ArchiveSearchTabPanel;
