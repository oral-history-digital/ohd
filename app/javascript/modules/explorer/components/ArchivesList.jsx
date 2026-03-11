import { useGetArchives } from 'modules/data';
import PropTypes from 'prop-types';

import { filterArchives } from '../utils';
import { ArchiveCard } from './ArchiveCard';

export function ArchivesList({
    query,
    interviewMin,
    interviewMax,
    yearMin,
    yearMax,
    institutionIds,
}) {
    const { archives, isLoading, error } = useGetArchives({
        all: true,
        workflowState: 'public',
    });

    const filtered = filterArchives(
        archives,
        query,
        interviewMin,
        interviewMax,
        yearMin,
        yearMax,
        institutionIds
    );

    // TODO: Use t() and/or Spinner
    if (isLoading) {
        return (
            <div className="Explorer">
                <div className="Explorer-loading">Loading…</div>
            </div>
        );
    }

    // TODO: Use t() and/or a nicer error message
    if (error) {
        return (
            <div className="Explorer">
                <div className="Explorer-error">
                    An error occurred while fetching data. Please try again
                    later.
                </div>
            </div>
        );
    }

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
    query: PropTypes.string,
    interviewMin: PropTypes.number,
    interviewMax: PropTypes.number,
    yearMin: PropTypes.number,
    yearMax: PropTypes.number,
    institutionIds: PropTypes.arrayOf(PropTypes.number),
};
