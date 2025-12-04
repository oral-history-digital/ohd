export default function projectByDomain(projects) {
    return (
        projects &&
        Object.values(projects).find(
            (project) => project.archive_domain === window.location.origin
        )
    );
}
