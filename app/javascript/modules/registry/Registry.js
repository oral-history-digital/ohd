import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';

import { useTrackPageView } from 'modules/analytics';
import { AuthorizedContent } from 'modules/auth';
import { useIsEditor } from 'modules/archive';
import { useI18n } from 'modules/i18n';
import { HelpText } from 'modules/help-text';
import { ScrollToTop } from 'modules/user-agent';
import { Spinner } from 'modules/spinners';
import RegistrySearchResult from './RegistrySearchResult';
import MergeRegistryEntriesButtonContainer from './MergeRegistryEntriesButtonContainer';
import RegistryEntries from './RegistryEntries';
import useRootEntry from './useRootEntry';

export default function Registry({
    foundRegistryEntries,
    showRegistryEntriesSearchResults,
    isRegistryEntrySearching,
}) {
    const { t } = useI18n();
    const isEditor = useIsEditor();
    useTrackPageView();

    const { isLoading, data: rootRegistryEntry } = useRootEntry();

    if (isLoading) {
        return <Spinner />;
    }

    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('registry')}</title>
            </Helmet>
            <div className='wrapper-content register'>
                <h1 className='registry-entries-title'>
                    {t('registry')}
                </h1>

                {isEditor && <HelpText code="registry_page" className="u-mb" />}

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
                                        foundRegistryEntries?.results?.map(result => <RegistrySearchResult key={result.id} result={result} />)
                                    }
                                </ul>
                            )
                        ) :
                        <RegistryEntries root registryEntryParent={rootRegistryEntry} />
                }
            </div>
        </ScrollToTop>
    );
}

Registry.propTypes = {
    foundRegistryEntries: PropTypes.object.isRequired,
    showRegistryEntriesSearchResults: PropTypes.bool.isRequired,
    isRegistryEntrySearching: PropTypes.bool,
};
