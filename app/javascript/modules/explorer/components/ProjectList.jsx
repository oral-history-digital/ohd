import { useI18n } from 'modules/i18n';
import PropTypes from 'prop-types';

import {
    useAccordion,
    useCatalogProjects,
    useExplorerListCountLabel,
    useProjectsAndCollectionsRange,
    useProjectsSort,
} from '../hooks';
import { filterProjects, sortProjects } from '../utils';
import { ProjectCard } from './ProjectCard';
import { ProjectSortControl } from './ProjectSortControl';

/**
 * Displays policy-visible catalog projects fetched through Redux, with client-side
 * filtering, sorting, and expandable cards. Shows loading, error, and empty states.
 *
 * @param {Object} props - Catalog filters and display settings.
 * @param {string} [props.query] - Search text matched against projects, institutions, and collection previews.
 * @param {?number} [props.interviewMin] - Inclusive minimum interview count.
 * @param {?number} [props.interviewMax] - Inclusive maximum interview count.
 * @param {?number} [props.collectionMin] - Minimum collection count; defaults to the list minimum.
 * @param {?number} [props.collectionMax] - Maximum collection count; defaults to the list maximum.
 * @param {number[]} [props.institutionIds] - Institution or parent IDs; empty means no institution filter.
 * @param {boolean} [props.showTotals=true] - Include the unfiltered total in the count label.
 * @param {boolean} [props.hideifEmpty=false] - Render nothing when no projects match.
 * @returns {import('react').ReactElement|null} Project list or its current request/empty state.
 */
export function ProjectList({
    query,
    interviewMin,
    interviewMax,
    collectionMin,
    collectionMax,
    institutionIds,
    showTotals = true,
    hideifEmpty = false,
}) {
    const { t } = useI18n();
    const { expandedId, toggle } = useAccordion();
    const { sort, setSort } = useProjectsSort();
    const { projects, isLoading, error } = useCatalogProjects();
    const { globalCollectionMin, globalCollectionMax } =
        useProjectsAndCollectionsRange({ items: projects });

    const filtered = filterProjects(
        projects,
        query,
        interviewMin,
        interviewMax,
        collectionMin ?? globalCollectionMin,
        collectionMax ?? globalCollectionMax,
        institutionIds
    );
    const projectCountLabel = useExplorerListCountLabel({
        scope: 'project',
        displayedItems: filtered,
        totalItems: projects,
        showTotals,
    });

    if (isLoading) {
        return (
            <div className="ProjectList--loading">
                {t('explorer.project_list.loading')}
            </div>
        );
    }

    if (error) {
        return (
            <div className="ProjectList">
                <div className="ProjectList--error">
                    {t('explorer.project_list.error')}
                </div>
            </div>
        );
    }

    if (!filtered || filtered.length === 0) {
        if (hideifEmpty) {
            return null;
        }

        return (
            <div className="ProjectList ProjectList--empty">
                <p>
                    {query
                        ? t('explorer.project_list.no_results_query', {
                              query,
                          })
                        : t('explorer.project_list.no_results')}
                </p>
            </div>
        );
    }

    return (
        <div className="ProjectList">
            <div className="ProjectList--filtersInfo">
                <p className="ProjectList--countLabel">{projectCountLabel}</p>
                <ProjectSortControl value={sort} onChange={setSort} />
            </div>
            {sortProjects(filtered, sort).map((project) => (
                <ProjectCard
                    key={project.id}
                    project={project}
                    query={query}
                    expanded={expandedId === project.id}
                    onToggle={() => toggle(project.id)}
                />
            ))}
        </div>
    );
}

export default ProjectList;

ProjectList.propTypes = {
    query: PropTypes.string,
    interviewMin: PropTypes.number,
    interviewMax: PropTypes.number,
    collectionMin: PropTypes.number,
    collectionMax: PropTypes.number,
    institutionIds: PropTypes.arrayOf(PropTypes.number),
    showTotals: PropTypes.bool,
    hideifEmpty: PropTypes.bool,
};
