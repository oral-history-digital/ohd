import { useSelector} from 'react-redux';

import { getSelectedArchiveIds } from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { useProject } from 'modules/routes';
import { ArchiveSearchFormContainer } from 'modules/search';
import SubTab from './SubTab';
import AdminActionsContainer from './AdminActionsContainer';

export default function ArchiveSearchTabPanel() {
    const { t } = useI18n();
    const { isOhd } = useProject();
    const selectedArchiveIds = useSelector(getSelectedArchiveIds);

    return (
        <ErrorBoundary small>
            <h3 className='SidebarTabs-title'>
                {t(isOhd ? 'modules.sidebar.search' : 'archive_search')}
            </h3>

            <ArchiveSearchFormContainer/>

            <div className='flyout-sub-tabs-container flyout-video'>
                <AuthorizedContent object={{type: 'General'}} action='edit'>
                    <SubTab title={t('admin_actions')} >
                        <AdminActionsContainer archiveIds={selectedArchiveIds} />
                    </SubTab>
                </AuthorizedContent>
            </div>
        </ErrorBoundary>
    );
}
