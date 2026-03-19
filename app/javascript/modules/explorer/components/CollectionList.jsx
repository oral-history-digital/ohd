import { useState } from 'react';

import { useGetArchiveCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { useFilteredCollections } from '../hooks';
import { CollectionCard } from './CollectionCard';

const INITIAL_VISIBLE_COLLECTIONS = 10;

export function CollectionList({ archive, query = '' }) {
    const { t } = useI18n();
    const { collections } = useGetArchiveCollections(archive.id);
    const [showAllCollections, setShowAllCollections] = useState(false);
    const filteredCollections = useFilteredCollections({ collections, query });

    if (!collections || collections.length === 0) return null;

    const hiddenCollectionsCount = Math.max(
        filteredCollections.length - INITIAL_VISIBLE_COLLECTIONS,
        0
    );
    const visibleCollections = showAllCollections
        ? filteredCollections
        : filteredCollections.slice(0, INITIAL_VISIBLE_COLLECTIONS);

    return (
        <div className={'CollectionList'}>
            <h4 className="CollectionList-collectionsTitle">
                {t('explorer.collection_list.title', {
                    count: filteredCollections.length,
                })}
            </h4>
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
