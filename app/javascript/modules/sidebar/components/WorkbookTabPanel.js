import { useI18n } from 'modules/i18n';import { AuthShowContainer } from 'modules/auth';
import { WorkbookContainer } from 'modules/workbook';

function WorkbookTabPanel() {
    const { t } = useI18n();

    return (
        <AuthShowContainer ifLoggedIn ifNoProject>
            <h3 className='SidebarTabs-title'>
                { t('user_content') }
            </h3>
            <div className='flyout-sub-tabs-container flyout-folder'>
                <WorkbookContainer />
            </div>
        </AuthShowContainer>
    );
}

export default WorkbookTabPanel;
