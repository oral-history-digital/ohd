import { getSelectedArchiveIds } from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { useProject } from 'modules/routes';
import { ArchiveSearchFormContainer } from 'modules/search';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import { useSelector } from 'react-redux';

import AdminActions from './AdminActions';
import SubTab from './SubTab';

/**
 * Shows project-specific search help and authorized result actions.
 *
 * @returns {React.ReactElement} Search controls or project request status.
 */
export default function ArchiveSearchTabPanel() {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject({});
    const selectedArchiveIds = useSelector(getSelectedArchiveIds);

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }
    if (isLoading || !project) return <Spinner />;

    const isUmbrella = project.is_umbrella;

    const titleString = isUmbrella
        ? 'modules.sidebar.search'
        : 'archive_search';
    const helpTextString = isUmbrella ? 'search_page' : 'archive_search_page';

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title u-flex">
                {t(titleString)}
                <HelpText code={helpTextString} small className="u-ml-tiny" />
            </h3>

            <ArchiveSearchFormContainer />

            <div className="flyout-sub-tabs-container flyout-video">
                <AuthorizedContent object={{ type: 'General' }} action="edit">
                    <SubTab title={t('admin_actions')}>
                        <AdminActions archiveIds={selectedArchiveIds} />
                    </SubTab>
                </AuthorizedContent>
            </div>
        </ErrorBoundary>
    );
}
