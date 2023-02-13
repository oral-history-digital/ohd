export default function projectByDomain(projects) {
    return projects && Object.values(projects).find(
        project => !project.is_ohd && project.archive_domain === window.location.origin
    );
}
