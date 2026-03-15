import { useGetProjects } from 'modules/data';
import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import {
    useAccordion,
    useArchivesAndCollectionsRange,
    useArchivesSort,
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
    const { t } = useI18n();
    const { expandedId, toggle } = useAccordion();
    const { sort, setSort } = useArchivesSort();
    const {
        projects: archives,
        isLoading,
        error,
    } = useGetProjects({
        all: true,
        workflowState: 'public',
    });
    const { globalCollectionMin, globalCollectionMax } =
        useArchivesAndCollectionsRange({ items: archives });

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

    if (isLoading) {
        return (
            <div className="ArchivesList--loading">
                {t('explorer.archives_list.loading')}
            </div>
        );
    }

    if (error) {
        return (
            <div className="ArchivesList">
                <div className="ArchivesList--error">
                    {t('explorer.archives_list.error')}
                </div>
            </div>
        );
    }

    if (!filtered || filtered.length === 0) {
        return (
            <div className="ArchivesList ArchivesList--empty">
                <p>
                    {query
                        ? t('explorer.archives_list.no_results_query', {
                              query,
                          })
                        : t('explorer.archives_list.no_results')}
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
