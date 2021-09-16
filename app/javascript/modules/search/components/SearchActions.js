import PropTypes from 'prop-types';
import { FaStar, FaDownload } from 'react-icons/fa';
import moment from 'moment';

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

    const showExportSearchLink = Object.keys(query).length > 0 && projectId !== PROJECT_DG;

    function saveSearchForm(onSubmit) {
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
            onSubmit={onSubmit}
        />
    }

    function exportSearchUrl() {
        const modifiedQuery = {
            ...query,
        };
        delete modifiedQuery['page'];

        let url = `${pathBase}/searches/archive.csv`;

        for (let i = 0, len = Object.keys(modifiedQuery).length; i < len; i++) {
            const param = Object.keys(modifiedQuery)[i];
            url += (i === 0) ? '?' : '&'
            if (modifiedQuery[param] && modifiedQuery[param].length > 0) {
                url += `${param}=${modifiedQuery[param]}`;
            }
        }

        return url;
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
                        <a href={exportSearchUrl()} download>
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
