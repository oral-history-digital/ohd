import PropTypes from 'prop-types';

import { ArchiveSearchFormContainer } from 'modules/search';
import { useI18n } from 'modules/i18n';
import { AuthorizedContent } from 'modules/auth';
import InterviewDataContainer from './InterviewDataContainer';
import AdminActionsContainer from './AdminActionsContainer';

function ArchiveSearchTabPanel({ selectedArchiveIds }) {
    const { t } = useI18n();

    return (
        <>
            <div className='flyout-tab-title'>
                {t('archive_search')}
            </div>

            <ArchiveSearchFormContainer/>

            <div className='flyout-sub-tabs-container flyout-video'>
                <AuthorizedContent object={{type: 'General'}} action='edit'>
                    <InterviewDataContainer
                        title={t('admin_actions')}
                        content={<AdminActionsContainer archiveIds={selectedArchiveIds} />}
                    />
                </AuthorizedContent>
            </div>
        </>
    );
}

ArchiveSearchTabPanel.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};

export default ArchiveSearchTabPanel;
