import { useTrackPageView } from 'modules/analytics';
import { useIsEditor } from 'modules/archive';
import { AuthorizedContent } from 'modules/auth';
import { HelpText } from 'modules/help-text';
import { useI18n } from 'modules/i18n';
import { InlineNotification } from 'modules/ui';
import { ScrollToTop } from 'modules/user-agent';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import MergeRegistryEntriesButtonContainer from './MergeRegistryEntriesButtonContainer';
import RegistryEntries from './RegistryEntries';
import RegistrySearchResult from './RegistrySearchResult';
import RegistrySkeleton from './RegistrySkeleton';
import useRootEntry from './useRootEntry';

/**
 * Displays the registry tree or search results after its configured root loads.
 *
 * @param {Object} props - Registry page properties.
 * @param {Object} props.foundRegistryEntries - Search results and their metadata.
 * @param {boolean} props.showRegistryEntriesSearchResults - Shows search results instead of the tree.
 * @param {boolean} [props.isRegistryEntrySearching] - Whether a registry search is pending.
 * @returns {React.ReactElement|null} Registry content, loading/error state, or null without a root.
 */
export default function Registry({
    foundRegistryEntries,
    showRegistryEntriesSearchResults,
    isRegistryEntrySearching,
}) {
    const { t } = useI18n();
    const isEditor = useIsEditor();
    useTrackPageView();

    const { isLoading, data: rootRegistryEntry, error } = useRootEntry();

    if (error) {
        return (
            <InlineNotification
                variant="error"
                title={t('error')}
                description={error.message}
                isClosable={false}
            />
        );
    }

    if (isLoading) {
        return <RegistrySkeleton />;
    }
    if (!rootRegistryEntry) return null;

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('registry')}</title>
            </Helmet>
            <div className="wrapper-content register">
                <h1 className="Page-main-title">
                    {t('registry')}
                    <AuthorizedContent
                        object={rootRegistryEntry}
                        action="update"
                    >
                        <span className="u-ml-tiny">{`(ID: ${rootRegistryEntry.id})`}</span>
                    </AuthorizedContent>
                </h1>

                {isEditor && <HelpText code="registry_page" className="u-mb" />}

                <AuthorizedContent
                    object={{ type: 'RegistryEntry' }}
                    action="update"
                >
                    <MergeRegistryEntriesButtonContainer />
                </AuthorizedContent>

                {showRegistryEntriesSearchResults ? (
                    foundRegistryEntries?.results?.length === 0 &&
                    !isRegistryEntrySearching ? (
                        <div className="search-result">
                            {`0 ${t('registryentry_results')}`}
                        </div>
                    ) : (
                        <ul className="RegistryEntryList RegistryEntryList--root">
                            {foundRegistryEntries?.results?.map((result) => (
                                <RegistrySearchResult
                                    key={result.id}
                                    result={result}
                                />
                            ))}
                        </ul>
                    )
                ) : (
                    <RegistryEntries
                        root
                        registryEntryParent={rootRegistryEntry}
                    />
                )}
            </div>
        </ScrollToTop>
    );
}

Registry.propTypes = {
    foundRegistryEntries: PropTypes.object.isRequired,
    showRegistryEntriesSearchResults: PropTypes.bool.isRequired,
    isRegistryEntrySearching: PropTypes.bool,
};
