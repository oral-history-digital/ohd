import classNames from 'classnames';

import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import FacetDropdown from './FacetDropdown';
import Facet from './Facet';
import DateFacet from './DateFacet';
import YearOfBirthFacet from './YearOfBirthFacet';
import useFacets from '../useFacets';

export default function ArchiveFacets() {
    const { locale } = useI18n();
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
            {Object.keys(facets).map(facet => {
                if (facet === 'year_of_birth') {
                    const years = Object.keys(facets[facet]['subfacets'])
                        .map(year => Number.parseInt(year));

                    return (
                        <YearOfBirthFacet
                            data={facets[facet]}
                            key={facet}
                            sliderMin={Math.min(...years)}
                            sliderMax={Math.max(...years)}
                        />
                    );
                } else if (facet === 'date_of_birth') {
                    return (
                        <FacetDropdown
                            key={facet}
                            label={facets[facet].name[locale]}
                        >
                            <DateFacet
                                minDate={facets[facet].min_date}
                                maxDate={facets[facet].max_date}
                                name={facet}
                                className="u-mt-small"
                            />
                        </FacetDropdown>
                    );
                } else {
                    return (
                        <Facet
                            data={facets[facet]}
                            facet={facet}
                            key={facet}
                            show={(adminFacets.indexOf(facet) > -1 && isAuthorized({type: 'General'}, 'edit')) || (adminFacets.indexOf(facet) === -1)}
                            admin={(adminFacets.indexOf(facet) > -1)}
                        />
                    );
                }
            })}
        </div>
    );
}
