import { useAuthorization } from 'modules/auth';
import { useEventTypes } from 'modules/event-types';
import { useI18n } from 'modules/i18n';
import { SearchSpinnerOverlay, Spinner } from 'modules/spinners';

import {
    extractBirthYearRange,
    extractYearRangeFromValues,
    findEventTypeByCode,
    isFacetDataValid,
} from '../facetUtils';
import useFacets from '../useFacets';
import BirthYearFacet from './BirthYearFacet';
import Facet from './Facet';
import FacetDropdown from './FacetDropdown';
import RangeFacet from './RangeFacet';

export default function ArchiveFacets() {
    const { locale } = useI18n();
    const { isAuthorized } = useAuthorization();
    const { facets, isLoading } = useFacets();
    const { isLoading: eventTypesAreLoading, data: eventTypes } =
        useEventTypes();

    if (!facets || eventTypesAreLoading) {
        return <Spinner withPadding />;
    }

    const adminFacets = ['tasks_user_ids', 'tasks_supervisor_ids'];

    return (
        <SearchSpinnerOverlay loading={isLoading}>
            {Object.keys(facets).map((facetName) => {
                const facetData = facets[facetName];

                if (facetName === 'year_of_birth') {
                    if (!isFacetDataValid(facetData, locale, true)) {
                        return null;
                    }

                    const yearRange = extractBirthYearRange(
                        facetData.subfacets
                    );

                    if (!yearRange) {
                        return null;
                    }

                    return (
                        <FacetDropdown
                            key={facetName}
                            facet={facetName}
                            label={facetData.name[locale]}
                        >
                            <BirthYearFacet
                                sliderMin={yearRange.min}
                                sliderMax={yearRange.max}
                            />
                        </FacetDropdown>
                    );
                } else if (facetData.type === 'EventType') {
                    if (!facetData?.subfacets) {
                        return null;
                    }

                    const eventType = findEventTypeByCode(
                        eventTypes,
                        facetData.name
                    );

                    if (!eventType) {
                        return null;
                    }

                    const values = Object.keys(facetData.subfacets);
                    const yearRange = extractYearRangeFromValues(values);

                    if (!yearRange) return null;

                    const { min, max } = yearRange;

                    return (
                        <FacetDropdown
                            key={facetName}
                            facet={facetName}
                            label={eventType.name}
                        >
                            <RangeFacet
                                name={facetName}
                                sliderMin={min}
                                sliderMax={max}
                            />
                        </FacetDropdown>
                    );
                } else {
                    if (!isFacetDataValid(facetData, locale, false)) {
                        return null;
                    }

                    const isAdminFacet = adminFacets.includes(facetName);
                    const isVisible =
                        !isAdminFacet ||
                        isAuthorized({ type: 'General' }, 'edit');

                    if (!isVisible) return null;

                    return (
                        <FacetDropdown
                            key={facetName}
                            facet={facetName}
                            label={facetData.name[locale]}
                            admin={isAdminFacet}
                        >
                            <Facet facet={facetName} data={facetData} />
                        </FacetDropdown>
                    );
                }
            })}
        </SearchSpinnerOverlay>
    );
}
