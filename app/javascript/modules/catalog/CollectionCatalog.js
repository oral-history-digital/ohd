import PropTypes from 'prop-types';

import { Spinner } from 'modules/spinners';
import useCollectionData from './useCollectionData';
import useInstance from './useInstance';
import CatalogTable from './CatalogTable';

export default function CollectionCatalog({
    id,
}) {
    const { interviews, isLoading } = useCollectionData(id);
    const { instance } = useInstance(interviews, 'collection');

    return isLoading ?
        <Spinner /> :
        <CatalogTable instance={instance} />;
}

CollectionCatalog.propTypes = {
    id: PropTypes.number.isRequired,
};
