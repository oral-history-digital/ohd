import classNames from 'classnames';

import { useAuthorization } from 'modules/auth';
import { useI18n } from 'modules/i18n';
import { Spinner } from 'modules/spinners';
import { useEventTypes } from 'modules/event-types';
import FacetDropdown from './FacetDropdown';
import Facet from './Facet';
import DateFacet from './DateFacet';
import YearOfBirthFacet from './YearOfBirthFacet';
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
                            <YearOfBirthFacet
                                sliderMin={Math.min(...years)}
                                sliderMax={Math.max(...years)}
                            />
                        </FacetDropdown>
                    );
                } else if (facetData.type === 'EventType') {
                    const eventType = eventTypes.find(et =>
                        `events:${et.code}` === facetData.name)

                    return (
                        <FacetDropdown
                            key={facetName}
                            label={eventType.name}
                        >
                            <DateFacet
                                name={facetName}
                                data={facetData}
                                className="u-mt-small"
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
