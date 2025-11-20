import { useState } from 'react';
import PropTypes from 'prop-types';

import { useI18n } from 'modules/i18n';
import FacetFilterInput from './FacetFilterInput';
import FacetValues from './FacetValues';

export default function Facet({ data, facet }) {
    const { locale } = useI18n();

    const [filter, setFilter] = useState('');

    function handleFilterChange(event) {
        event.preventDefault();
        setFilter(event.target.value);
    }

    return (
        <>
            <FacetFilterInput
                data={data}
                facet={facet}
                filter={filter}
                onChange={handleFilterChange}
            />
            <FacetValues
                data={data}
                facet={facet}
                filter={filter}
                locale={locale}
            />
        </>
    );
}

Facet.propTypes = {
    facet: PropTypes.string,
    data: PropTypes.object.isRequired,
};
