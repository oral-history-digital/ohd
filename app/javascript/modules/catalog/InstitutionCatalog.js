import PropTypes from 'prop-types';

import CatalogTable from './CatalogTable';
import useInstance from './useInstance';
import useInstitutionData from './useInstitutionData';

export default function InstitutionCatalog({ id }) {
    const data = useInstitutionData(id);
    const { instance } = useInstance(data, 'institution');

    return <CatalogTable instance={instance} />;
}

InstitutionCatalog.propTypes = {
    id: PropTypes.number.isRequired,
};
