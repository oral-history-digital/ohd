import PropTypes from 'prop-types'

import { Spinner } from 'modules/spinners';
import useArchiveData from './useArchiveData';
import useInstance from './useInstance';
import CatalogTable from './CatalogTable';

export default function ArchiveCatalog({
    id,
}) {
    const { data, error, isLoading } = useArchiveData(id);
    const { instance } = useInstance(data, 'archive');

    return isLoading ?
        <Spinner /> :
        <CatalogTable instance={instance} />;
}

ArchiveCatalog.propTypes = {
    id: PropTypes.number.isRequired,
};
