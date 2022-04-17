import PropTypes from 'prop-types';

import { useAuthorization } from 'modules/auth';
import useArchiveSearch from '../useArchiveSearch';
import Facet from './Facet';
import YearFacet from './YearFacet';

export default function ArchiveFacets({
    map,
    handleSubmit,
}) {
    const { isAuthorized } = useAuthorization();
    const { facets } = useArchiveSearch();

    if (!facets) {
        return null;
    }

    const adminFacets = [
        'workflow_state',
        'tasks_user_account_ids',
        'tasks_supervisor_ids',
    ];

    return Object.keys(facets).map((facet, index) => {
        if (facet === 'year_of_birth') {
            const years = Object.keys(facets[facet]['subfacets'])
                .map(year => Number.parseInt(year));

            return (
                <YearFacet
                    data={facets[facet]}
                    facet={facet}
                    key={index}
                    handleSubmit={handleSubmit}
                    slider
                    sliderMin={Math.min(...years)}
                    sliderMax={Math.max(...years)}
                    map={map}
                    show={(adminFacets.indexOf(facet) > -1 && isAuthorized({type: 'General'}, 'edit')) || (adminFacets.indexOf(facet) === -1)}
                    admin={(adminFacets.indexOf(facet) > -1)}
                />
            );
        } else {
            return (
                <Facet
                    data={facets[facet]}
                    facet={facet}
                    key={index}
                    handleSubmit={handleSubmit}
                    map={map}
                    show={(adminFacets.indexOf(facet) > -1 && isAuthorized({type: 'General'}, 'edit')) || (adminFacets.indexOf(facet) === -1)}
                    admin={(adminFacets.indexOf(facet) > -1)}
                />
            );
        }
    });
}

ArchiveFacets.propTypes = {
    map: PropTypes.bool,
    handleSubmit: PropTypes.func.isRequired,
};
