import { useEffect } from 'react';
import PropTypes from 'prop-types';

import { AuthShowContainer, AuthorizedContent } from 'modules/auth';
import { INDEX_REGISTRY_ENTRIES, INDEX_ACCOUNT } from 'modules/sidebar';
import { Fetch, getRootRegistryEntryFetched, getRootRegistryEntryReload } from 'modules/data';
import { useI18n } from 'modules/i18n';
import { ScrollToTop } from 'modules/user-agent';
import RegistrySearchResultContainer from './RegistrySearchResultContainer';
import MergeRegistryEntriesButtonContainer from './MergeRegistryEntriesButtonContainer';
import RegistryEntriesContainer from './RegistryEntriesContainer';

export default function Registry({
    currentProject,
    rootRegistryEntry,
    foundRegistryEntries,
    showRegistryEntriesTree,
    isRegistryEntrySearching,
    setSidebarTabsIndex,
    isLoggedIn,
}) {
    const { t } = useI18n();

    useEffect(() => {
        setSidebarTabsIndex(isLoggedIn ? INDEX_REGISTRY_ENTRIES : INDEX_ACCOUNT);
    }, []);

    return (
        <ScrollToTop>
            <div className='wrapper-content register'>
                <Fetch
                    fetchParams={['registry_entries', currentProject?.root_registry_entry_id, null, null, 'with_associations=true']}
                    testSelector={getRootRegistryEntryFetched}
                    reloadSelector={getRootRegistryEntryReload}
                >
                    <AuthShowContainer ifLoggedIn>
                            <h1 className='registry-entries-title'>
                                {t('registry')}
                            </h1>

                            <AuthorizedContent object={{type: 'RegistryEntry'}} action='update'>
                                <MergeRegistryEntriesButtonContainer />
                            </AuthorizedContent>

                            {
                                showRegistryEntriesTree ?
                                    <RegistryEntriesContainer root registryEntryParent={rootRegistryEntry} /> :
                                    (foundRegistryEntries.results.length === 0 && !isRegistryEntrySearching ?
                                        (
                                            <div className="search-result">
                                                {`0 ${t('registryentry_results')}`}
                                            </div>
                                        ) :
                                        (
                                            <ul className="RegistryEntryList RegistryEntryList--root">
                                                {
                                                    foundRegistryEntries.results.map(result => <RegistrySearchResultContainer key={result.id} result={result} />)
                                                }
                                            </ul>
                                        )
                                    )
                            }
                    </AuthShowContainer>
                    <AuthShowContainer ifLoggedOut ifNoProject>
                        {t('devise.failure.unauthenticated')}
                    </AuthShowContainer>
                </Fetch>
            </div>
        </ScrollToTop>
    );
}

Registry.propTypes = {
    currentProject: PropTypes.object,
    rootRegistryEntry: PropTypes.object,
    foundRegistryEntries: PropTypes.object.isRequired,
    showRegistryEntriesTree: PropTypes.bool.isRequired,
    isRegistryEntrySearching: PropTypes.bool,
    setSidebarTabsIndex: PropTypes.func.isRequired,
};
