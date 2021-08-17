import { useI18n } from 'modules/i18n';import { AuthShowContainer } from 'modules/auth';
import { WorkbookContainer } from 'modules/workbook';

function WorkbookTabPanel() {
    const { t } = useI18n();

    return (
        <AuthShowContainer ifLoggedIn ifNoProject>
            <div className='flyout-tab-title'>
                { t('user_content') }
            </div>
            <div className='flyout-sub-tabs-container flyout-folder'>
                <WorkbookContainer />
            </div>
        </AuthShowContainer>
    );
}

export default WorkbookTabPanel;
