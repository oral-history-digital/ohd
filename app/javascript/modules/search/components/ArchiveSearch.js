import { memo } from 'react';
import { useEffect } from 'react';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import Observer from 'react-intersection-observer';

import { getIsLoggedIn } from 'modules/account';
import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { INDEX_SEARCH, setSidebarTabsIndex } from 'modules/sidebar';
import { ScrollToTop } from 'modules/user-agent';
import { useQuery } from 'modules/react-toolbox';
import useArchiveSearch from '../useArchiveSearch';
import SearchActionsContainer from './SearchActionsContainer';
import ArchiveSearchTabsContainer from './ArchiveSearchTabsContainer';
import ArchiveSearchSorting from './ArchiveSearchSorting';

function ArchiveSearch() {
    //const { t } = useI18n();
    const searchParams = useQuery();
    const dispatch = useDispatch();
    //const isLoggedIn = useSelector(getIsLoggedIn);

    const { data, error, isValidating, size, setSize } = useArchiveSearch();
    console.log(data, size);

    useEffect(() => {
        dispatch(setSidebarTabsIndex(INDEX_SEARCH));
    }, []);

    //useEffect(() => {
    //}, [isLoggedIn, searchParams]);

    function handleScroll(inView) {
        if (inView) {
            setSize(size + 1);
        }
    }

    function search(page = 1) {
        const combinedQuery = {
            //...query,
            sort: searchParams.get('sort') || 'relevance',
            order: searchParams.get('order') || 'asc',
            page,
        };
    }

    return (
        <ScrollToTop>
            <Helmet>
                <title>{/*t('interviews')*/}</title>
            </Helmet>
            <div className="wrapper-content interviews">
                <h1 className="search-results-title">
                    {/*t('interviews')*/}
                </h1>
                <div className="SearchResults-legend search-results-legend">
                    <AuthShowContainer ifLoggedIn>
                        <SearchActionsContainer />
                    </AuthShowContainer>
                    {
                        data && (
                            <div className="search-results-legend-text">
                                {data.total} {/*t('archive_results')*/}
                            </div>
                        )
                    }
                </div>

                <ArchiveSearchSorting />

                <ArchiveSearchTabsContainer
                    interviews={data?.interviews}
                    isValidating={isValidating}
                    onScroll={handleScroll}
                />

                {
                    isValidating ?
                        <Spinner /> :
                        (
                            data?.numPages > size && (
                                <Observer onChange={handleScroll} />
                            )
                        )
                }
            </div>
        </ScrollToTop>
    );
}

const MemoizedArchiveSearch = memo(ArchiveSearch);

export default MemoizedArchiveSearch;
