import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

import { ErrorBoundary } from 'modules/react-toolbox';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { RegistrySearchFormContainer } from 'modules/registry';
import DownloadRegistryEntriesContainer from './DownloadRegistryEntriesContainer';
import { PROJECT_MOG } from 'modules/constants';

function RegistryEntriesTabPanel({
    projectId,
    showRegistryEntriesSearchResults,
    locale,
    locales,
    changeRegistryEntriesViewMode,
}) {
    const { t } = useI18n();

    return (
        <ErrorBoundary small>
            <h3 className='SidebarTabs-title'>
                {t('registry')}
            </h3>
            <div className='flyout-sub-tabs-container'>
                <RegistrySearchFormContainer />
                <p>
                    <button
                        type="button"
                        className="Button"
                        onClick={() => changeRegistryEntriesViewMode(!showRegistryEntriesSearchResults, projectId)}
                    >
                        {t('activerecord.models.registry_entry.actions.' + (showRegistryEntriesSearchResults ? 'show_tree' : 'show_search_results'))}
                    </button>
                </p>
                {
                    projectId != PROJECT_MOG ?
                        locales.map((locale) => (
                            <AuthorizedContent key={locale} object={{type: 'General'}} action='edit'>
                                <div key={locale}>
                                    <DownloadRegistryEntriesContainer format="pdf" specificLocale={locale} />
                                    <DownloadRegistryEntriesContainer format="csv" specificLocale={locale} />
                                </div>
                            </AuthorizedContent>
                        )) :
                        null
                }
                {
                    (projectId === PROJECT_MOG) ?
                            <div key={locale}>
                                <p>
                                    <a href={`/alfa-${locale}.pdf`}>
                                        <FaDownload
                                            className="Icon Icon--primary"
                                            title={t('download_registry_entries', { format: 'pdf' , locale: locale })}
                                        />
                                        {' '}
                                        {t('download_registry_entries', { format: 'pdf', locale: locale })}
                                    </a>
                                </p>
                            </div>
                        :
                        null
                }
            </div>
        </ErrorBoundary>
    );
}

RegistryEntriesTabPanel.propTypes = {
    projectId: PropTypes.string.isRequired,
    showRegistryEntriesSearchResults: PropTypes.bool.isRequired,
    locale: PropTypes.string.isRequired,
    locales: PropTypes.array.isRequired,
    translations: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
    editView: PropTypes.bool.isRequired,
    changeRegistryEntriesViewMode: PropTypes.func.isRequired,
};

export default RegistryEntriesTabPanel;
