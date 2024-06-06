import keyBy from 'lodash.keyby';

/**
 * IN: projects array, institution
 * OUT: institution
 */

export default function addChildProjects(projects, institution) {
    const projectsById = keyBy(projects, 'id');

    const clonedInstitution = {
        ...institution,
        projects: Object.values(institution.institution_projects)
            .map(ip => projectsById[ip.project_id])
            .filter(project => project?.workflow_state === 'public')
    };
    return clonedInstitution;
}
