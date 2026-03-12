import { useGetArchiveCollections } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import { CollectionCard } from './CollectionCard';

export function CollectionList({ archive }) {
    const { t } = useI18n();
    const { collections } = useGetArchiveCollections(archive.id);

    if (!collections || collections.length === 0) return null;

    return (
        <div className={'CollectionList'}>
            <h4 className="CollectionList-collectionsTitle">
                {t('explorer.collection_list.title', {
                    count: collections.length,
                })}
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
