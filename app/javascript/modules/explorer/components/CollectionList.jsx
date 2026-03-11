import { useGetArchiveCollections } from 'modules/data';
import PropTypes from 'prop-types';

import { CollectionCard } from './CollectionCard';

export function CollectionList({ archive }) {
    const { collections } = useGetArchiveCollections(archive.id);

    if (!collections || collections.length === 0) return null;

    return (
        <div className={'CollectionList'}>
            <h4 className="CollectionList-collectionsTitle">
                Collections ({collections.length})
            </h4>
            {collections.map((collection) => (
                <CollectionCard key={collection.id} collection={collection} />
            ))}
        </div>
    );
}

export default CollectionList;

CollectionList.propTypes = {
    archive: PropTypes.object.isRequired,
};
