import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { MapFacets } from 'modules/search';
import PropTypes from 'prop-types';

import AdminActionsContainer from './AdminActionsContainer';
import SubTab from './SubTab';

function MapTabPanel({ selectedArchiveIds }) {
    const { t } = useI18n();

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title">{t('map')}</h3>

            <MapFacets />

            <div className="flyout-sub-tabs-container flyout-video">
                <AuthorizedContent object={{ type: 'General' }} action="edit">
                    <SubTab title={t('admin_actions')}>
                        <AdminActionsContainer
                            archiveIds={selectedArchiveIds}
                        />
                    </SubTab>
                </AuthorizedContent>
            </div>
        </ErrorBoundary>
    );
}

MapTabPanel.propTypes = {
    selectedArchiveIds: PropTypes.array.isRequired,
};

export default MapTabPanel;
