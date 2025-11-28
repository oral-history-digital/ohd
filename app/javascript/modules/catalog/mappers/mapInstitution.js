import curry from 'lodash.curry';

import rowComparator from '../rowComparator';
import mapProject from './mapProject';

export default function mapInstitution(locale, institution) {
    const curriedMapInstitution = curry(mapInstitution)(locale);
    const curriedMapProject = curry(mapProject)(locale);

    // Subrows = subinstitutions + archives.
    const subRows =
        institution.children?.map(curriedMapInstitution)?.sort(rowComparator) ||
        [];
    const projectRows = institution.projects
        ?.map(curriedMapProject)
        .sort(rowComparator);
    const subRowsWithProjects = subRows.concat(projectRows);

    return {
        type: 'institution',
        id: institution.id,
        shortname: institution.shortname,
        name: institution.name?.[locale],
        description: institution.description?.[locale],
        num_interviews: institution.num_interviews,
        parent_id: institution.parent_id,
        hasSubInstitutions: subRows.length > 0,
        subRows: subRowsWithProjects,
    };
}
