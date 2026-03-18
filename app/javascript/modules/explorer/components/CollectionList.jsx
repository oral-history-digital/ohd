import { useState } from 'react';

import { useGetArchiveCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { CollectionCard } from './CollectionCard';

const INITIAL_VISIBLE_COLLECTIONS = 10;

export function CollectionList({ archive }) {
    const { t } = useI18n();
    const { collections } = useGetArchiveCollections(archive.id);
    const [showAllCollections, setShowAllCollections] = useState(false);

    if (!collections || collections.length === 0) return null;

    const hiddenCollectionsCount = Math.max(
        collections.length - INITIAL_VISIBLE_COLLECTIONS,
        0
    );
    const visibleCollections = showAllCollections
        ? collections
        : collections.slice(0, INITIAL_VISIBLE_COLLECTIONS);

    return (
        <div className={'CollectionList'}>
            <h4 className="CollectionList-collectionsTitle">
                {t('explorer.collection_list.title', {
                    count: collections.length,
                })}
            </h4>
            {visibleCollections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
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
};
