import PropTypes from 'prop-types';

import { useSearchParams } from 'modules/query-string';
import FacetValue from './FacetValue';

export default function FacetValues({
    data,
    facet,
    filter,
    locale,
}) {
    const { getFacetParam } = useSearchParams();
    const checkedFacets = getFacetParam(facet);

    function sortedSubfacets() {
        // if the Facet is about time periods, sort by years ( by doing: .replace(/[^\d]/g, '') )
        if (data.name['de'] && data.name['de'].trim() === 'Zeitperioden') {
            return Object.keys(data.subfacets).sort((a, b) => {
                return (localDescriptor(a).replace(/[^\d]/g, '') > localDescriptor(b).replace(/[^\d]/g, '')) ? 1 : ((localDescriptor(b).replace(/[^\d]/g, '') > localDescriptor(a).replace(/[^\d]/g, '')) ? -1 : 0);
            });
        }
        // everything else
        // sort first alphabetically, then put prioritized down in the list (like "others"/"sonstige")
        else {
            return Object.keys(data.subfacets).sort((a, b) => {
                return (localDescriptor(a) > localDescriptor(b)) ? 1 : ((localDescriptor(b) > localDescriptor(a)) ? -1 : 0);
            }).sort((a, b) => {
                return (priority(a) > priority(b)) ? 1 : ((priority(b) > priority(a)) ? -1 : 0);
            });
        }
    }

    function localDescriptor(subfacetId) {
        return data.subfacets[subfacetId].name[locale];
    }

    function priority(subfacetId) {
        return data.subfacets[subfacetId].priority;
    }

    return sortedSubfacets().filter(subfacetId => {
        let subfacetName = data.subfacets[subfacetId].name[locale];
        if (subfacetName) {
            return subfacetName.toLowerCase().includes(filter.toLowerCase());
        }
    }).map((subfacetId) => {
        let checkedState = false;
        if (checkedFacets) {
            checkedState = checkedFacets.indexOf(subfacetId.toString()) > -1;
        }
        return (
            <FacetValue
                key={subfacetId}
                id={subfacetId}
                facetName={facet}
                facetValue={data.subfacets[subfacetId]}
                checked={checkedState}
            />
        );
    })
}

FacetValues.propTypes = {
    data: PropTypes.object.isRequired,
    facet: PropTypes.string.isRequired,
    locale: PropTypes.string.isRequired,
};
