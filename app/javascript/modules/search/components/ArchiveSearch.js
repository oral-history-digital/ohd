import { useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Helmet } from 'react-helmet';

import { AuthShowContainer } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { usePathBase } from 'modules/routes';
import { INDEX_SEARCH } from 'modules/sidebar';
import { ScrollToTop } from 'modules/user-agent';
import { useQuery } from 'modules/react-toolbox';
import SearchActionsContainer from './SearchActionsContainer';
import ArchiveSearchTabsContainer from './ArchiveSearchTabsContainer';

export default function ArchiveSearch({
    isLoggedIn,
    query,
    resultsAvailable,
    resultsCount,
    searchInArchive,
    setSidebarTabsIndex,
}) {
    const { t } = useI18n();
    const pathBase = usePathBase();
    const searchParams = useQuery();

    useEffect(() => {
        setSidebarTabsIndex(INDEX_SEARCH);
    }, []);

    useEffect(() => {
        search({
            ...query,
            page: 1,
        });
    }, [isLoggedIn]);

    function handleScroll(inView) {
        if (inView) {
            let page = (parseInt(query.page) || 0) + 1;
            search(Object.assign({}, query, {page: page}));
        }
    }

    function search(query={page: 1}) {
        const url = `${pathBase}/searches/archive`;

        console.log(query);
        const combinedQuery = {
            ...query,
            sort: searchParams.get('sort') || 'relevance',
        };
        console.log('combined', combinedQuery)

        searchInArchive(url, combinedQuery);
    }


    return (
        <ScrollToTop>
            <Helmet>
                <title>{t('interviews')}</title>
            </Helmet>
            <div className="wrapper-content interviews">
                <h1 className="search-results-title">
                    {t('interviews')}
                </h1>
                <div className="SearchResults-legend search-results-legend">
                    <AuthShowContainer ifLoggedIn>
                        <SearchActionsContainer />
                    </AuthShowContainer>
                    {
                        resultsAvailable && (
                            <div className="search-results-legend-text">
                                {resultsCount} {t('archive_results')}
                            </div>
                        )
                    }
                </div>
                <ArchiveSearchTabsContainer
                    onScroll={handleScroll}
                    onSortOrderChange={search}
                />
            </div>
        </ScrollToTop>
    );
}

ArchiveSearch.propTypes = {
    isLoggedIn: PropTypes.bool.isRequired,
    query: PropTypes.object.isRequired,
    resultsAvailable: PropTypes.bool.isRequired,
    resultsCount: PropTypes.number.isRequired,
    searchInArchive: PropTypes.func.isRequired,
    setSidebarTabsIndex: PropTypes.func.isRequired,
};
