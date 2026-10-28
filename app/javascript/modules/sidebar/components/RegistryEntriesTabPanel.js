import { AuthorizedContent } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { ErrorBoundary } from 'modules/react-toolbox';
import { RegistrySearchFormContainer } from 'modules/registry';
import { useProject, useProjectIdentity } from 'modules/routes';
import { Spinner } from 'modules/spinners';
import { InlineNotification } from 'modules/ui';
import PropTypes from 'prop-types';
import { FaExternalLinkAlt } from 'react-icons/fa';

import DownloadRegistryEntries from './DownloadRegistryEntries';

/**
 * Shows registry search, view controls, and authorized downloads.
 *
 * @param {Object} props - Registry sidebar properties.
 * @param {boolean} props.showRegistryEntriesSearchResults - Whether results replace the tree.
 * @param {Function} props.changeRegistryEntriesViewMode - Changes the current project's view.
 * @returns {React.ReactElement} Registry sidebar controls.
 */
function RegistryEntriesTabPanel({
    showRegistryEntriesSearchResults,
    changeRegistryEntriesViewMode,
}) {
    const { t } = useI18n();
    const { project, isLoading, error } = useProject();
    const { projectShortname } = useProjectIdentity();

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
                                projectShortname
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
                {error ? (
                    <InlineNotification
                        variant="error"
                        title={t('error')}
                        description={error.message}
                        isClosable={false}
                    />
                ) : isLoading ? (
                    <Spinner />
                ) : (
                    (project?.available_locales || []).map((locale) => (
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
                    ))
                )}

                {/* TODO: replace hardcoded project check with another solution */}
                {projectShortname === 'adg' && (
                    <div className="u-mt">
                        <a
                            href="https://ohtm-dash.oral-history.digital/"
                            target="_blank"
                            title={t(
                                'modules.sidebar.registry_entries_tab_panel.dash_link_title'
                            )}
                            rel="noreferrer"
                        >
                            {t(
                                'modules.sidebar.registry_entries_tab_panel.dash_link'
                            )}{' '}
                            <FaExternalLinkAlt className="Icon Icon--small" />
                        </a>
                    </div>
                )}
            </div>
        </ErrorBoundary>
    );
}

RegistryEntriesTabPanel.propTypes = {
    showRegistryEntriesSearchResults: PropTypes.bool.isRequired,
    changeRegistryEntriesViewMode: PropTypes.func.isRequired,
};

export default RegistryEntriesTabPanel;
