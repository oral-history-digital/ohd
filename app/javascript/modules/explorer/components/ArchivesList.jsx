import { useGetArchives } from 'modules/data';
import PropTypes from 'prop-types';

import {
    useAccordion,
    useArchivesSort,
    useExplorerCollectionRange,
} from '../hooks';
import { filterArchives, sortArchives } from '../utils';
import { ArchiveCard } from './ArchiveCard';
import { ArchivesSortControl } from './ArchivesSortControl';

export function ArchivesList({
    query,
    interviewMin,
    interviewMax,
    collectionMin,
    collectionMax,
    yearMin,
    yearMax,
    institutionIds,
}) {
    const { expandedId, toggle } = useAccordion();
    const { sort, setSort } = useArchivesSort();
    const { archives, isLoading, error } = useGetArchives({
        all: true,
        workflowState: 'public',
    });
    const { globalCollectionMin, globalCollectionMax } =
        useExplorerCollectionRange({ archives });

    const filtered = filterArchives(
        archives,
        query,
        interviewMin,
        interviewMax,
        collectionMin ?? globalCollectionMin,
        collectionMax ?? globalCollectionMax,
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
            <ArchivesSortControl value={sort} onChange={setSort} />
            {sortArchives(filtered, sort).map((archive) => (
                <ArchiveCard
                    key={archive.id}
                    archive={archive}
                    query={query}
                    expanded={expandedId === archive.id}
                    onToggle={() => toggle(archive.id)}
                />
            ))}
        </div>
    );
}

export default ArchivesList;

ArchivesList.propTypes = {
    query: PropTypes.string,
    interviewMin: PropTypes.number,
    interviewMax: PropTypes.number,
    collectionMin: PropTypes.number,
    collectionMax: PropTypes.number,
    yearMin: PropTypes.number,
    yearMax: PropTypes.number,
    institutionIds: PropTypes.arrayOf(PropTypes.number),
};
