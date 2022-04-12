import { memo } from 'react';
import PropTypes from 'prop-types';
import Observer from 'react-intersection-observer';
import { useSelector } from 'react-redux';

import { AuthShowContainer } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import { getIsLoggedIn } from 'modules/account';
import useArchiveSearch from '../useArchiveSearch';
import SearchActionsContainer from './SearchActionsContainer';
import ArchiveSearchTabsContainer from './ArchiveSearchTabsContainer';
import ArchiveSearchSorting from './ArchiveSearchSorting';

const PAGE_SIZE = 12;

function ArchiveSearch({
    search,
}) {
    const { t } = useI18n();
    const isLoggedIn = useSelector(getIsLoggedIn);

    const searchParams = new URLSearchParams(search);
    const sortBy = searchParams.get('sort');
    const sortOrder = searchParams.get('order');

    const { interviews, total, data, error, isValidating, size, setSize } = useArchiveSearch(
        sortBy, sortOrder, isLoggedIn,
    );

    function handleScroll(inView) {
        if (inView) {
            setSize(size + 1);
        }
    }

    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData ||
        (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isEmpty = data?.[0]?.length === 0;
    const isReachingEnd =
        isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);
    const isRefreshing = isValidating && data && data.length === size;

    return (
        <>
            <h1 className="search-results-title">
                {t('interviews')}
            </h1>
            <div className="SearchResults-legend search-results-legend">
                <AuthShowContainer ifLoggedIn>
                    <SearchActionsContainer />
                </AuthShowContainer>
                {
                    interviews && (
                        <div className="search-results-legend-text">
                            {total} {t('archive_results')}
                        </div>
                    )
                }
            </div>

            <ArchiveSearchSorting
                searchParams={searchParams}
            />

            <ArchiveSearchTabsContainer
                interviews={interviews}
                empty={isEmpty}
            />

            {!isLoadingMore && !isReachingEnd && (
                <Observer onChange={handleScroll} />
            )}

            {isLoadingMore && <Spinner />}
        </>
    );
}

ArchiveSearch.propTypes = {
    search: PropTypes.string,
}

const MemoizedArchiveSearch = memo(ArchiveSearch);

export default MemoizedArchiveSearch;
