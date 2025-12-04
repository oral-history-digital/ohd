import PropTypes from 'prop-types';

import CatalogTable from './CatalogTable';
import useArchiveData from './useArchiveData';
import useInstance from './useInstance';

export default function ArchiveCatalog({ id }) {
    const data = useArchiveData(id);
    const { instance } = useInstance(data, 'archive');

    if (data.length === 0) {
        return null;
    }

    return <CatalogTable instance={instance} />;
}

ArchiveCatalog.propTypes = {
    id: PropTypes.number.isRequired,
};
