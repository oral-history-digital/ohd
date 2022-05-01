import PropTypes from 'prop-types';
import { FaStar, FaDownload } from 'react-icons/fa';
import moment from 'moment';
import queryString from 'query-string';
import range from 'lodash.range';

import { PROJECT_DG } from 'modules/constants';
import { useI18n } from 'modules/i18n';
import { Modal } from 'modules/ui';
import { usePathBase } from 'modules/routes';
import { UserContentFormContainer } from 'modules/workbook';
import { useSearchParams } from 'modules/query-string';
import queryToText from '../queryToText';
import useFacets from '../useFacets';

export default function SearchActions({
    projectId,
    locale,
    translations,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const { facets } = useFacets();
    const { allParams, fulltext, facets: urlFacets, yearOfBirthMin,
        yearOfBirthMax } = useSearchParams();

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

    const showExportSearchLink = Object.keys(allParams).length > 0 && projectId !== PROJECT_DG;

    const params = {
        fulltext,
        ...urlFacets,
        year_of_birth: range(yearOfBirthMin, yearOfBirthMax + 1),
    };
    const paramStr = queryString.stringify(params, { arrayFormat: 'bracket' });
    const exportUrl = `${pathBase}/searches/archive.csv?${paramStr}`;

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
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired,
};
