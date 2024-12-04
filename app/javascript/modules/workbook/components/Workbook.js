import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { useWorkbook } from 'modules/workbook';
import WorkbookItemList from './WorkbookItemList';

export default function Workbook() {
    const { t } = useI18n();
    const {
        isValidating,
        savedSearches,
        savedInterviews,
        savedSegments,
    } = useWorkbook();

    if (isValidating) {
        return <Spinner />;
    }

    return (
        <div>
            <WorkbookItemList
                contents={savedSearches}
                title={t('saved_searches')}
            />
            <WorkbookItemList
                contents={savedInterviews}
                title={t('saved_interviews')}
            />
            <WorkbookItemList
                contents={savedSegments}
                title={t('saved_annotations')}
            />
        </div>
    );
}
