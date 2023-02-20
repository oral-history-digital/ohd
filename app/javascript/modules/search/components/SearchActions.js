import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { WorkbookItemFormContainer } from 'modules/workbook';
import { useSearchParams } from 'modules/query-string';
import queryToTitle from '../queryToTitle';
import useFacets from '../useFacets';

export default function SearchActions({
    locale,
    translations,
}) {
    const { t } = useI18n();
    const { facets } = useFacets();
    const { allParams } = useSearchParams();

    function showSaveButton() {
        const filters = { ...allParams };
        delete filters.sort;
        delete filters.order;

        return Object.keys(filters).length > 0;
    }

    function saveSearchForm(closeModal) {
        const queryTitle = queryToTitle(allParams, facets, locale, translations);

        return <WorkbookItemFormContainer
            title={queryTitle}
            description=''
            properties={allParams}
            type='Search'
            submitLabel={t('save_search')}
            onSubmit={closeModal}
            onCancel={closeModal}
        />
    }

    if (!showSaveButton()) {
        return null;
    }

    return (
        <Modal
            title={t('save_search')}
            trigger={<><FaStar className="Icon Icon--text" /> {t('save_search')}</>}
        >
            {saveSearchForm}
        </Modal>
    );
}

SearchActions.propTypes = {
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};
