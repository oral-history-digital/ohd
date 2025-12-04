import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import { Modal } from 'modules/ui';
import { WorkbookItemForm } from 'modules/workbook';
import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import useFacets from '../useFacets';
import useQueryTitle from '../useQueryTitle';

export default function SearchActions() {
    const { t } = useI18n();
    const { facets } = useFacets();
    const { allParams } = useSearchParams();
    const interview = useSelector(getCurrentInterview);
    const queryTitle = useQueryTitle(allParams, facets);

    function showSaveButton() {
        const filters = { ...allParams };
        delete filters.sort;
        delete filters.order;

        return Object.keys(filters).length > 0;
    }

    function saveSearchForm(closeModal) {
        return (
            <WorkbookItemForm
                interview={interview}
                title={queryTitle}
                description=""
                properties={allParams}
                type="Search"
                submitLabel={t('save_search')}
                onSubmit={closeModal}
                onCancel={closeModal}
            />
        );
    }

    if (!showSaveButton()) {
        return null;
    }

    return (
        <Modal
            title={t('save_search')}
            trigger={
                <>
                    <FaStar className="Icon Icon--text" /> {t('save_search')}
                </>
            }
        >
            {saveSearchForm}
        </Modal>
    );
}

SearchActions.propTypes = {};
