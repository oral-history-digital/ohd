import PropTypes from 'prop-types';

import useInstitutionData from './useInstitutionData';
import useInstance from './useInstance';
import CatalogTable from './CatalogTable';

export default function InstitutionCatalog({ id }) {
    const data = useInstitutionData(id);
    const { instance } = useInstance(data, 'institution');

    return <CatalogTable instance={instance} />;
}

InstitutionCatalog.propTypes = {
    id: PropTypes.number.isRequired,
};
