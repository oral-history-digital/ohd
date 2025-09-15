import { FaStar } from 'react-icons/fa';
import { useSelector } from 'react-redux';

import { getCurrentInterview } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { useSearchParams } from 'modules/query-string';
import { Modal } from 'modules/ui';
import { WorkbookItemForm } from 'modules/workbook';

import queryToTitle from '../queryToTitle';
import useFacets from '../useFacets';

export default function SearchActions() {
    const { t, locale } = useI18n();
    const { facets } = useFacets();
    const { allParams } = useSearchParams();
    const interview = useSelector(getCurrentInterview);

    function showSaveButton() {
        const filters = { ...allParams };
        delete filters.sort;
        delete filters.order;

        return Object.keys(filters).length > 0;
    }

    function saveSearchForm(closeModal) {
        const queryTitle = queryToTitle(allParams, facets, { t, locale });

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
