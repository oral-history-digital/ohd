import { memo } from 'react';
import Observer from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';

import { AuthShowContainer } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import useArchiveSearch from '../useArchiveSearch';
import SearchActionsContainer from './SearchActionsContainer';
import ArchiveSearchTabsContainer from './ArchiveSearchTabsContainer';
import ArchiveSearchSorting from './ArchiveSearchSorting';

function ArchiveSearch() {
    const { t } = useI18n();
    const dispatch = useDispatch();

    const { data, error, isValidating, size, setSize } = useArchiveSearch();
    console.log(data, size);

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
            />

            {
                isValidating ?
                    <Spinner /> :
                    (
                        data?.numPages > size && (
                            <Observer onChange={() => {}} />
                        )
                    )
            }
        </>
    );
}

const MemoizedArchiveSearch = memo(ArchiveSearch);

export default MemoizedArchiveSearch;
