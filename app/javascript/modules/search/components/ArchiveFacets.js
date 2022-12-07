import classNames from 'classnames';

import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { useEventTypes } from 'modules/event-types';
import FacetDropdown from './FacetDropdown';
import Facet from './Facet';
import YearRangeFacet from './YearRangeFacet';
import useFacets from '../useFacets';

export default function ArchiveFacets() {
    const { locale } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { facets, isLoading, isValidating } = useFacets();
    const { isLoading: eventTypesAreLoading, data: eventTypes } = useEventTypes();

    if (!facets || eventTypesAreLoading) {
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
            {Object.keys(facets).map(facetName => {
                const facetData = facets[facetName];

                if (facetName === 'year_of_birth') {
                    const years = Object.keys(facetData.subfacets)
                        .map(year => Number.parseInt(year));

                    return (
                        <FacetDropdown
                            key={facetName}
                            label={facetData.name[locale]}
                        >
                            <YearRangeFacet
                                name={facetName}
                                sliderMin={Math.min(...years)}
                                sliderMax={Math.max(...years)}
                            />
                        </FacetDropdown>
                    );
                } else if (facetData.type === 'EventType') {
                    const eventType = eventTypes.find(et =>
                        et.code === facetData.name)

                    const values = Object.keys(facetData.subfacets);
                    if (values.length === 0) {
                        return null;
                    }

                    // Facet values are formatted like:
                    // 1955.0..1960.0
                    // ^       ^
                    // |       |
                    // 0       8
                    const min = Number(values.at(0).slice(0, 4));
                    const max = Number(values.at(-1).slice(8, 12));

                    return (
                        <FacetDropdown
                            key={facetName}
                            label={eventType.name}
                        >
                            <YearRangeFacet
                                name={facetName}
                                sliderMin={min}
                                sliderMax={max}
                            />
                        </FacetDropdown>
                    );
                } else {
                    const isAdminFacet = adminFacets.includes(facetName);
                    const isVisible = !isAdminFacet || isAuthorized({ type: 'General' }, 'edit');

                    if (!isVisible) {
                        return null;
                    }

                    return (
                        <FacetDropdown
                            key={facetName}
                            label={facetData.name[locale]}
                            admin={isAdminFacet}
                        >
                            <Facet
                                facet={facetName}
                                data={facetData}
                            />
                        </FacetDropdown>
                    );
                }
            })}
        </div>
    );
}
