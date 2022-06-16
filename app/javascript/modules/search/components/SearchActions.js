import PropTypes from 'prop-types';
import { FaStar } from 'react-icons/fa';
import moment from 'moment';

import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { UserContentFormContainer } from 'modules/workbook';
import { useSearchParams } from 'modules/query-string';
import queryToText from '../queryToText';
import useFacets from '../useFacets';

export default function SearchActions({
    locale,
    translations,
}) {
    const { t } = useI18n();
    const { facets } = useFacets();
    const { allParams } = useSearchParams();

    function saveSearchForm(closeModal) {
        moment.locale(locale);
        const now = moment().format('lll');
        const queryText = queryToText(allParams, facets, locale, translations);
        const title = queryText === '' ? now : `${queryText} - ${now}`;

        return <UserContentFormContainer
            title={title}
            description=''
            properties={allParams}
            type='Search'
            submitLabel={t('save_search')}
            onSubmit={closeModal}
            onCancel={closeModal}
        />
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
