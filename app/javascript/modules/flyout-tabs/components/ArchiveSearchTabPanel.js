import React from 'react';
import PropTypes from 'prop-types';

import AdminActionsContainer from 'bundles/archive/containers/AdminActionsContainer';
import ArchiveSearchFormContainer from 'bundles/archive/containers/ArchiveSearchFormContainer';
import InterviewDataContainer from 'bundles/archive/containers/InterviewDataContainer';
import { useI18n } from 'bundles/archive/hooks/i18n';
import AuthorizedContent from 'bundles/archive/components/AuthorizedContent';

function ArchiveSearchTabPanel({ selectedArchiveIds }) {
    const { t } = useI18n();

    return (
        <>
            <div className='flyout-tab-title'>
                {t('archive_search')}
            </div>

            <ArchiveSearchFormContainer/>

            <div className='flyout-sub-tabs-container flyout-video'>
                <AuthorizedContent object={{type: 'General', action: 'edit'}}>
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
