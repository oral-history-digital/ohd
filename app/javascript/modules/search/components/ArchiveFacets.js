import classNames from 'classnames';

import { useAuthorization } from 'modules/auth';
import { Spinner } from 'modules/spinners';
import Facet from './Facet';
import YearOfBirthFacet from './YearOfBirthFacet';
import useFacets from '../useFacets';

export default function ArchiveFacets() {
    const { isAuthorized } = useAuthorization();
    const { facets, isLoading, isValidating } = useFacets();

    if (!facets) {
        return <Spinner withPadding />;
    }

    const adminFacets = [
        'workflow_state',
        'tasks_user_account_ids',
        'tasks_supervisor_ids',
    ];

    return (
        <div className={classNames('LoadingOverlay', {
            'is-loading': isLoading,
        })}>
            {Object.keys(facets).map((facet, index) => {
                if (facet === 'year_of_birth') {
                    const years = Object.keys(facets[facet]['subfacets'])
                        .map(year => Number.parseInt(year));

                    return (
                        <YearOfBirthFacet
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
            })}
        </div>
    );
}
