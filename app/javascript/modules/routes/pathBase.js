import projectByDomain from './projectByDomain';

export default function pathBase({ projectId, projects, locale }) {
    if (!projectId || projectByDomain(projects)) {
        return `/${locale}`;
    } else {
        return `/${projectId}/${locale}`;
    }
}
