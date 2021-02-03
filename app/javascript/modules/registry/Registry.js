import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import AuthShowContainer from 'bundles/archive/containers/AuthShowContainer';
import AuthorizedContent from 'bundles/archive/components/AuthorizedContent';
import { INDEX_REGISTRY_ENTRIES } from 'modules/flyout-tabs';
import { Fetch, getRootRegistryEntryFetched } from 'modules/data';
import { useI18n } from 'modules/i18n';import RegistrySearchResultContainer from './RegistrySearchResultContainer';
import MergeRegistryEntriesButtonContainer from './MergeRegistryEntriesButtonContainer';
import RegistryEntriesContainer from './RegistryEntriesContainer';

export default function Registry({
    currentProject,
    rootRegistryEntry,
    foundRegistryEntries,
    showRegistryEntriesTree,
    isRegistryEntrySearching,
    setFlyoutTabsIndex,
}) {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 1);
        setFlyoutTabsIndex(INDEX_REGISTRY_ENTRIES);
    }, []);

    return (
        <div className='wrapper-content register'>
            <Fetch
                fetchParams={['registry_entries', currentProject?.root_registry_entry_id]}
                testSelector={getRootRegistryEntryFetched}
            >
                <AuthShowContainer ifLoggedIn>
                        <h1 className='registry-entries-title'>
                            {t('registry')}
                        </h1>

                        <AuthorizedContent object={{type: 'RegistryEntry', action: 'update'}}>
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
    );
}

Registry.propTypes = {
    currentProject: PropTypes.object,
    rootRegistryEntry: PropTypes.object,
    foundRegistryEntries: PropTypes.object.isRequired,
    showRegistryEntriesTree: PropTypes.bool.isRequired,
    isRegistryEntrySearching: PropTypes.bool,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
