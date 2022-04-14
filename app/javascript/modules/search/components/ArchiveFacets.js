import PropTypes from 'prop-types';

import { useAuthorization } from 'modules/auth';
import useArchiveSearch from '../useArchiveSearch';
import FacetContainer from './FacetContainer';

export default function ArchiveFacets({
    query,
    map,
    handleSubmit,
}) {
    const { isAuthorized } = useAuthorization();
    const { facets } = useArchiveSearch();

    function yearRange(facet) {
        if (facet === 'year_of_birth') {
            return [
                Number.parseInt(Object.keys(facets[facet]['subfacets']).sort(function(a, b){return a-b})[0]),
                Number.parseInt(Object.keys(facets[facet]['subfacets']).sort(function(a, b){return b-a})[0]),
            ];
        }
        else {
            return [];
        }
    }

    if (!facets) {
        return null;
    }

    const currentYearRange = [
        query['year_of_birth[]'] && Number.parseInt(query['year_of_birth[]'][0]),
        query['year_of_birth[]'] && Number.parseInt(query['year_of_birth[]'][query['year_of_birth[]'].length -1])
    ];

    const adminFacets = ['workflow_state', 'tasks_user_account_ids', 'tasks_supervisor_ids'];

    return Object.keys(facets).map((facet, index) => (
        <FacetContainer
            data={facets[facet]}
            facet={facet}
            key={index}
            handleSubmit={handleSubmit}
            slider={facet === 'year_of_birth'}
            sliderMin={yearRange(facet)[0]}
            sliderMax={yearRange(facet)[1]}
            currentMin={currentYearRange[0] || yearRange(facet)[0]}
            currentMax={currentYearRange[1] || yearRange(facet)[1]}
            map={map}
            show={(adminFacets.indexOf(facet) > -1 && isAuthorized({type: 'General'}, 'edit')) || (adminFacets.indexOf(facet) === -1)}
            admin={(adminFacets.indexOf(facet) > -1)}
        />
    ));
}

ArchiveFacets.propTypes = {
    query: PropTypes.object.isRequired,
    facets: PropTypes.object,
    map: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
};
