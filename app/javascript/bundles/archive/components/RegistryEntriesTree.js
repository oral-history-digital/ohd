import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import AuthShowContainer from '../containers/AuthShowContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import RegistryEntrySearchResultContainer from '../containers/RegistryEntrySearchResultContainer';
import MergeRegistryEntriesButtonContainer from '../containers/MergeRegistryEntriesButtonContainer';
import AuthorizedContent from './AuthorizedContent';
import Fetch from './Fetch';
import { INDEX_REGISTRY_ENTRIES } from '../constants/flyoutTabs';
import { getRootRegistryEntryFetched } from '../selectors/dataSelectors';
import { useI18n } from '../hooks/i18n';

export default function RegistryEntriesTree({
    projectId,
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
                fetchParams={['registry_entries', rootRegistryEntry.id]}
                testSelector={getRootRegistryEntryFetched}
            >
                <AuthShowContainer ifLoggedIn>
                        <h1 className='registry-entries-title'>
                            {t((projectId === 'mog') ? 'registry_mog' : 'registry')}
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
                                                foundRegistryEntries.results.map(result => <RegistryEntrySearchResultContainer key={result.id} result={result} />)
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

RegistryEntriesTree.propTypes = {
    rootRegistryEntry: PropTypes.object,
    foundRegistryEntries: PropTypes.object.isRequired,
    showRegistryEntriesTree: PropTypes.bool.isRequired,
    isRegistryEntrySearching: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
};
