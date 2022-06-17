import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

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
    showRegistryEntriesSearchResults,
    isRegistryEntrySearching,
}) {
    const { t } = useI18n();

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('registry')}</title>
            </Helmet>
            <div className='wrapper-content register'>
                <Fetch
                    fetchParams={['registry_entries', currentProject?.root_registry_entry_id, null, null, 'with_associations=true']}
                    testSelector={getRootRegistryEntryFetched}
                    reloadSelector={getRootRegistryEntryReload}
                >
                    <h1 className='registry-entries-title'>
                        {t('registry')}
                    </h1>

                    <AuthorizedContent object={{type: 'RegistryEntry'}} action='update'>
                        <MergeRegistryEntriesButtonContainer />
                    </AuthorizedContent>

                    {
                        showRegistryEntriesSearchResults ?
                            (foundRegistryEntries?.results?.length === 0 && !isRegistryEntrySearching ?
                                (
                                    <div className="search-result">
                                        {`0 ${t('registryentry_results')}`}
                                    </div>
                                ) :
                                (
                                    <ul className="RegistryEntryList RegistryEntryList--root">
                                        {
                                            foundRegistryEntries?.results?.map(result => <RegistrySearchResultContainer key={result.id} result={result} />)
                                        }
                                    </ul>
                                )
                            ) :
                            <RegistryEntriesContainer root registryEntryParent={rootRegistryEntry} />
                    }
                </Fetch>
            </div>
        </ScrollToTop>
    );
}

Registry.propTypes = {
    currentProject: PropTypes.object,
    rootRegistryEntry: PropTypes.object,
    foundRegistryEntries: PropTypes.object.isRequired,
    showRegistryEntriesSearchResults: PropTypes.bool.isRequired,
    isRegistryEntrySearching: PropTypes.bool,
};
