import PropTypes from 'prop-types';

import { filterArchives } from '../utils';
import { ArchiveCard } from './ArchiveCard';

export function ArchivesList({
    archives,
    query,
    interviewMin,
    interviewMax,
    yearMin,
    yearMax,
    institutionIds,
}) {
    const filtered = filterArchives(
        archives,
        query,
        interviewMin,
        interviewMax,
        yearMin,
        yearMax,
        institutionIds
    );

    if (!filtered || filtered.length === 0) {
        return (
            <div className="ArchivesList ArchivesList--empty">
                <p>
                    {query
                        ? `No archives found for "${query}".`
                        : 'No archives available at the moment.'}
                </p>
            </div>
        );
    }

    return (
        <div className="ArchivesList">
            {filtered.map((archive) => (
                <ArchiveCard key={archive.id} archive={archive} query={query} />
            ))}
        </div>
    );
}

export default ArchivesList;

ArchivesList.propTypes = {
    archives: PropTypes.array.isRequired,
    query: PropTypes.string,
    interviewMin: PropTypes.number,
    interviewMax: PropTypes.number,
    yearMin: PropTypes.number,
    yearMax: PropTypes.number,
    institutionIds: PropTypes.arrayOf(PropTypes.number),
};
