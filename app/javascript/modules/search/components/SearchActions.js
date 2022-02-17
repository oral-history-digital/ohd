import PropTypes from 'prop-types';
import { FaStar, FaDownload } from 'react-icons/fa';
import moment from 'moment';
import queryString from 'query-string';

import { PROJECT_DG } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { usePathBase } from 'modules/routes';
import { UserContentFormContainer } from 'modules/workbook';
import queryToText from '../queryToText';

export default function SearchActions({
    query,
    facets,
    projectId,
    locale,
    translations,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();

    function saveSearchForm(closeModal) {
        moment.locale(locale);
        const now = moment().format('lll');
        const queryText = queryToText(query, { locale, translations, facets });
        const title = queryText === '' ? now : queryText + ' - ' + now;

        return <UserContentFormContainer
            title={title}
            description=''
            properties={query}
            type='Search'
            submitLabel={t('save_search')}
            onSubmit={closeModal}
            onCancel={closeModal}
        />
    }

    const showExportSearchLink = Object.keys(query).length > 0 && projectId !== PROJECT_DG;

    let exportUrl = `${pathBase}/searches/archive.csv`;
    const qs = queryString.stringify({
        ...query,
        page: undefined,
    });
    if (qs.length > 0) {
        exportUrl += `?${qs}`;
    }

    return (
        <>
            <Modal
                title={t('save_search')}
                trigger={<><FaStar className="Icon Icon--text" /> {t('save_search')}</>}
            >
                {saveSearchForm}
            </Modal>
            {
                showExportSearchLink && (
                    <Modal
                        title={t('export_search_results')}
                        trigger={<><FaDownload className="Icon Icon--text" /> {t('export_search_results')}</>}
                    >
                        <a href={exportUrl} download>
                            CSV
                        </a>
                    </Modal>
                )
            }
        </>
    );
}

SearchActions.propTypes = {
    query: PropTypes.object.isRequired,
    facets: PropTypes.object.isRequired,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};
