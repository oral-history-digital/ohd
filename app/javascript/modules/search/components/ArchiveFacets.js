import { useAuthorization } from 'modules/auth';
import useArchiveSearch from '../useArchiveSearch';
import Facet from './Facet';
import BirthYearFacet from './BirthYearFacet';

export default function ArchiveFacets() {
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
                <BirthYearFacet
                    data={facets[facet]}
                    key={index}
                    sliderMin={Math.min(...years)}
                    sliderMax={Math.max(...years)}
                />
            );
        } else {
            return (
                <Facet
                    data={facets[facet]}
                    facet={facet}
                    key={index}
                    show={(adminFacets.indexOf(facet) > -1 && isAuthorized({type: 'General'}, 'edit')) || (adminFacets.indexOf(facet) === -1)}
                    admin={(adminFacets.indexOf(facet) > -1)}
                />
            );
        }
    });
}
