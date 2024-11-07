import { Spinner } from 'modules/spinners';
import { useWorkbook } from 'modules/workbook';
import WorkbookItemList from './WorkbookItemList';

export default function Workbook() {
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
                type="saved_searches"
                contents={savedSearches}
            />
            <WorkbookItemList
                type="saved_interviews"
                contents={savedInterviews}
            />
            <WorkbookItemList
                type="saved_annotations"
                contents={savedSegments}
            />
        </div>
    );
}
