import PropTypes from 'prop-types';

import { filterInstitutions } from '../utils';
import { InstitutionCard } from './InstitutionCard';
import { InstitutionsMap } from './InstitutionsMap';

export function InstitutionsList({
    institutions,
    query,
    interviewMin,
    interviewMax,
}) {
    if (!institutions || institutions.length === 0) {
        return (
            <div className="InstitutionsList InstitutionsList--empty">
                <p>No institutions available at the moment.</p>
            </div>
        );
    }

    const filtered = filterInstitutions(
        institutions,
        query,
        interviewMin,
        interviewMax
    );

    return (
        <div className="InstitutionsList">
            <InstitutionsMap institutions={filtered} height={400} />

            <div className="InstitutionsList-cards">
                {filtered.length === 0 ? (
                    <div className="InstitutionsList InstitutionsList--empty">
                        <p>No institutions match the current filters.</p>
                    </div>
                ) : (
                    filtered.map((institution) => (
                        <InstitutionCard
                            key={institution.id}
                            institution={institution}
                            query={query}
                        />
                    ))
                )}
            </div>
        </div>
    );
}

InstitutionsList.propTypes = {
    institutions: PropTypes.array.isRequired,
    query: PropTypes.string,
    interviewMin: PropTypes.number,
    interviewMax: PropTypes.number,
};

export default InstitutionsList;
