export function getProjectUrl(project, locale) {
    if (!project || !locale) {
        return { url: null, isExternalUrl: false };
    }

    const isExternalUrl = Boolean(project.archive_domain);
    const url = isExternalUrl
        ? project.archive_domain
        : `/${project.shortname}/${locale}`;

    return { url, isExternalUrl };
}
