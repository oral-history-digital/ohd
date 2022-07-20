import PropTypes from 'prop-types'

import useArchiveData from './useArchiveData';
import useInstance from './useInstance';
import CatalogTable from './CatalogTable';

export default function ArchiveCatalog({
    id,
}) {
    const data = useArchiveData(id);
    const { instance } = useInstance(data, 'archive');

    return <CatalogTable instance={instance} />;
}

ArchiveCatalog.propTypes = {
    id: PropTypes.number.isRequired,
};
