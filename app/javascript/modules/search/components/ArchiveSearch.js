import Observer from 'react-intersection-observer';

import { AuthShowContainer } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { ErrorMessage } from 'modules/ui';
import useArchiveSearch from '../useArchiveSearch';
import SearchActionsContainer from './SearchActionsContainer';
import ArchiveSearchTabsContainer from './ArchiveSearchTabsContainer';
import ArchiveSearchSorting from './ArchiveSearchSorting';

const PAGE_SIZE = 12;

function ArchiveSearch() {
    const { t, locale } = useI18n();

    const { interviews, total, data, error, isValidating, isLoading, size,
        setSize } = useArchiveSearch();

    function handleScroll(inView) {
        if (inView) {
            setSize(size + 1);
        }
    }

    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.interviews?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.interviews?.length < PAGE_SIZE);
    const isRefreshing = isValidating && data && data.length === size;

    return (
        <>
            <h1 className="search-results-title">
                {total?.toLocaleString(locale)} {t('interviews')}
            </h1>
            <div className="SearchResults-legend search-results-legend u-mt">
                <AuthShowContainer ifLoggedIn>
                    <SearchActionsContainer />
                </AuthShowContainer>
            </div>

            <ArchiveSearchSorting className="u-mt-small" />

            <ArchiveSearchTabsContainer
                className="u-mt-small"
                interviews={interviews}
                empty={isEmpty}
                loading={isLoading}
            />

            {error && (
                <ErrorMessage className="u-mt">
                    {error.message} ({error.status})
                </ErrorMessage>
            )}

            {!isLoadingMore && !isReachingEnd && (
                <Observer onChange={handleScroll} />
            )}

            {isLoadingMore && <Spinner />}
        </>
    );
}

export default ArchiveSearch;
