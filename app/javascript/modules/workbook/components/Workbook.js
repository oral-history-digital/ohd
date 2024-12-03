import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { useWorkbook } from 'modules/workbook';
import WorkbookItemList from './WorkbookItemList';

export default function Workbook() {
    const { t } = useI18n();
    const {
        isValidating: workbookIsLoading,
        savedSearches: workbookSearches,
        savedInterviews: workbookInterviews,
        savedSegments: workbookAnnotations,
    } = useWorkbook();

    if (workbookIsLoading) {
        return <Spinner />;
    }

    return (
        <div>
            <WorkbookItemList
                contents={workbookSearches}
                title={t('saved_searches')}
            />
            <WorkbookItemList
                contents={workbookInterviews}
                title={t('saved_interviews')}
            />
            <WorkbookItemList
                contents={workbookAnnotations}
                title={t('saved_annotations')}
            />
        </div>
    );
}
