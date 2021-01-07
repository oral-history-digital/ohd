import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import AuthShowContainer from '../containers/AuthShowContainer';
import RegistryEntriesContainer from '../containers/RegistryEntriesContainer';
import RegistryEntrySearchResultContainer from '../containers/RegistryEntrySearchResultContainer';
import AuthorizedContent from './AuthorizedContent';
import Fetch from './Fetch';

import { INDEX_REGISTRY_ENTRIES } from '../constants/flyoutTabs';
import { ROOT_REGISTRY_ENTRY_ID } from '../constants/archiveConstants';
import { getRootRegistryEntryFetched } from '../selectors/dataSelectors';
import { useI18n } from '../hooks/i18n';

export default function RegistryEntriesTree({
    locale,
    projectId,
    rootRegistryEntry,
    foundRegistryEntries,
    showRegistryEntriesTree,
    isRegistryEntrySearching,
    selectedRegistryEntryIds,
    submitData,
    openArchivePopup,
    closeArchivePopup,
    setFlyoutTabsIndex,
}) {
    const { t } = useI18n();

    useEffect(() => {
        window.scrollTo(0, 1);
        setFlyoutTabsIndex(INDEX_REGISTRY_ENTRIES);
    }, []);

    const mergeRegistryEntries = () => {
        const firstId = selectedRegistryEntryIds.slice(0, 1);
        const restIds = selectedRegistryEntryIds.slice(1);

        submitData({ locale, projectId }, {merge_registry_entry: {id: firstId, ids: restIds}});
        closeArchivePopup();
    }

    return (
        <div className='wrapper-content register'>
            <Fetch
                fetchParams={['registry_entries', ROOT_REGISTRY_ENTRY_ID]}
                testSelector={getRootRegistryEntryFetched}
            >
                <AuthShowContainer ifLoggedIn>
                        <h1 className='registry-entries-title'>
                            {t((projectId === 'mog') ? 'registry_mog' : 'registry')}
                        </h1>

                        {
                            (selectedRegistryEntryIds.length >= 2) && (
                                <AuthorizedContent object={{type: 'RegistryEntry', action: 'update'}}>
                                    <div
                                        className='flyout-sub-tabs-content-ico-link'
                                        onClick={() => openArchivePopup({
                                            title: t('activerecord.models.registry_entries.actions.merge'),
                                            content: (
                                                <div>
                                                    <div className='any-button' onClick={mergeRegistryEntries}>
                                                        {t('ok')}
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    >
                                        {t('activerecord.models.registry_entries.actions.merge')}
                                    </div>
                                </AuthorizedContent>
                            )
                        }

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
    selectedRegistryEntryIds: PropTypes.array.isRequired,
    isRegistryEntrySearching: PropTypes.bool,
    projectId: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
    submitData: PropTypes.func.isRequired,
    setFlyoutTabsIndex: PropTypes.func.isRequired,
    openArchivePopup: PropTypes.func.isRequired,
    closeArchivePopup: PropTypes.func.isRequired,
};
