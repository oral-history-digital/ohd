import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { Workbook } from 'modules/workbook';

export default function WorkbookTabPanel() {
    const { t } = useI18n();

    return (
        <ErrorBoundary small>
            <AuthShowContainer ifLoggedIn ifNoProject>
                <h3 className="SidebarTabs-title">{t('user_content')}</h3>
                <div className="flyout-sub-tabs-container flyout-folder">
                    <Workbook />
                </div>
            </AuthShowContainer>
        </ErrorBoundary>
    );
}
