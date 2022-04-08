import { memo } from 'react';
import PropTypes from 'prop-types';
import Observer from 'react-intersection-observer';
import { useSelector, useDispatch } from 'react-redux';

import { AuthShowContainer } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import { useI18n } from 'modules/i18n';
import useArchiveSearch from '../useArchiveSearch';
import SearchActionsContainer from './SearchActionsContainer';
import ArchiveSearchTabsContainer from './ArchiveSearchTabsContainer';
import ArchiveSearchSorting from './ArchiveSearchSorting';

function ArchiveSearch({
    search,
}) {
    const { t } = useI18n();
    const dispatch = useDispatch();
    console.log(search);

    const searchParams = new URLSearchParams(search);

    const sortBy = searchParams.get('sort');
    const sortOrder = searchParams.get('order');

    const { data, error, isValidating, size, setSize } = useArchiveSearch(
        sortBy, sortOrder
    );
    console.log(data, size);


    function handleScroll(inView) {
        if (inView) {
            setSize(size + 1);
        }
    }

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
                            {data.total} {t('archive_results')}
                        </div>
                    )
                }
            </div>

            <ArchiveSearchSorting />

            <ArchiveSearchTabsContainer
                interviews={data?.interviews}
                size={size}
                isValidating={isValidating}
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
        </>
    );
}

ArchiveSearch.propTypes = {
    search: PropTypes.string,
}

const MemoizedArchiveSearch = memo(ArchiveSearch);

export default MemoizedArchiveSearch;
