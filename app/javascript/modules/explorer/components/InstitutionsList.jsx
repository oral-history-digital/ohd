import { useGetInstitutionsList } from 'modules/data';
import PropTypes from 'prop-types';

import { useAccordion } from '../hooks';
import { filterInstitutions } from '../utils';
import { InstitutionCard } from './InstitutionCard';
import { InstitutionsMap } from './InstitutionsMap';

export function InstitutionsList({
    query,
    interviewMin,
    interviewMax,
    instArchiveMin,
    instArchiveMax,
}) {
    const { expandedId, toggle } = useAccordion();
    const { institutions, loading, error } = useGetInstitutionsList({
        all: true,
    });

    if (loading) {
        return (
            <div className="InstitutionsList InstitutionsList--empty">
                <p>Loading institutions...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="InstitutionsList InstitutionsList--empty">
                <p>An error occurred while loading institutions.</p>
            </div>
        );
    }

    if (!institutions || institutions.length === 0) {
        return (
            <div className="InstitutionsList InstitutionsList--empty">
                <p>No institutions available at the moment.</p>
            </div>
        );
    }

    const filteredInstitutions = filterInstitutions(
        institutions,
        query,
        interviewMin,
        interviewMax,
        instArchiveMin,
        instArchiveMax
    );

    return (
        <div className="InstitutionsList">
            <InstitutionsMap institutions={filteredInstitutions} height={400} />

            <div className="InstitutionsList-cards">
                {filteredInstitutions.length === 0 ? (
                    <div className="InstitutionsList InstitutionsList--empty">
                        <p>No institutions match the current filters.</p>
                    </div>
                ) : (
                    filteredInstitutions.map((institution) => (
                        <InstitutionCard
                            key={institution.id}
                            institution={institution}
                            query={query}
                            expanded={expandedId === institution.id}
                            onToggle={() => toggle(institution.id)}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

InstitutionsList.propTypes = {
    query: PropTypes.string,
    interviewMin: PropTypes.number,
    interviewMax: PropTypes.number,
    instArchiveMin: PropTypes.number,
    instArchiveMax: PropTypes.number,
};

export default InstitutionsList;
