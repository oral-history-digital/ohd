import { useState } from 'react';

import { useGetArchiveCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { useCollectionsSort, useFilteredCollections } from '../hooks';
import { sortCollections } from '../utils';
import { CollectionCard } from './CollectionCard';
import { CollectionSortControl } from './CollectionSortControl';

const INITIAL_VISIBLE_COLLECTIONS = 10;

export function CollectionList({ archive, query = '' }) {
    const { t } = useI18n();
    const { collections } = useGetArchiveCollections(archive.id);
    const [showAllCollections, setShowAllCollections] = useState(false);
    const { sort, setSort } = useCollectionsSort();
    const filteredCollections = useFilteredCollections({ collections, query });
    const sortedCollections = sortCollections(filteredCollections, sort);

    if (!collections || collections.length === 0) return null;

    const hiddenCollectionsCount = Math.max(
        sortedCollections.length - INITIAL_VISIBLE_COLLECTIONS,
        0
    );
    const visibleCollections = showAllCollections
        ? sortedCollections
        : sortedCollections.slice(0, INITIAL_VISIBLE_COLLECTIONS);

    return (
        <div className={'CollectionList'}>
            <div className="CollectionList--filtersInfo">
                <p className="CollectionList--countLabel">
                    {t('explorer.collection_list.title', {
                        count: filteredCollections.length,
                    })}
                </p>
                <CollectionSortControl value={sort} onChange={setSort} />
            </div>
            {visibleCollections.map((collection) => (
                <CollectionCard
                    key={collection.id}
                    collection={collection}
                    query={query}
                />
            ))}
            {!showAllCollections && hiddenCollectionsCount > 0 && (
                <button
                    type="button"
                    className="CollectionList-showMoreButton"
                    onClick={() => setShowAllCollections(true)}
                    aria-label="Show more collections"
                >
                    +{hiddenCollectionsCount}
                </button>
            )}
        </div>
    );
}

export default CollectionList;

CollectionList.propTypes = {
    archive: PropTypes.object.isRequired,
    query: PropTypes.string,
};
