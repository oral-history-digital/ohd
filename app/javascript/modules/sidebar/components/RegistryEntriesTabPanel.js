import PropTypes from 'prop-types';
import { FaDownload } from 'react-icons/fa';

import { ErrorBoundary } from 'modules/react-toolbox';
import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { RegistrySearchFormContainer } from 'modules/registry';
import { useProject } from 'modules/routes';
import DownloadRegistryEntries from './DownloadRegistryEntries';

function RegistryEntriesTabPanel({
    showRegistryEntriesSearchResults,
    locales,
    changeRegistryEntriesViewMode,
}) {
    const { t, locale } = useI18n();
    const { projectId } = useProject();

    return (
        <ErrorBoundary small>
            <h3 className="SidebarTabs-title">{t('registry')}</h3>
            <div className="flyout-sub-tabs-container">
                <RegistrySearchFormContainer />
                <p>
                    <button
                        type="button"
                        className="Button"
                        onClick={() =>
                            changeRegistryEntriesViewMode(
                                !showRegistryEntriesSearchResults,
                                projectId
                            )
                        }
                    >
                        {t(
                            'activerecord.models.registry_entry.actions.' +
                                (showRegistryEntriesSearchResults
                                    ? 'show_tree'
                                    : 'show_search_results')
                        )}
                    </button>
                </p>
                {locales.map((locale) => (
                    <AuthorizedContent
                        key={locale}
                        object={{ type: 'General' }}
                        action="edit"
                    >
                        <div key={locale}>
                            <DownloadRegistryEntries
                                format="pdf"
                                specificLocale={locale}
                            />
                            <DownloadRegistryEntries
                                format="csv"
                                specificLocale={locale}
                            />
                        </div>
                    </AuthorizedContent>
                ))}
            </div>
        </ErrorBoundary>
    );
}

RegistryEntriesTabPanel.propTypes = {
    showRegistryEntriesSearchResults: PropTypes.bool.isRequired,
    locales: PropTypes.array.isRequired,
    changeRegistryEntriesViewMode: PropTypes.func.isRequired,
};

export default RegistryEntriesTabPanel;
