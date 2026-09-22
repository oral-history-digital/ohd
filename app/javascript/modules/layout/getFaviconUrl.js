export default function getFaviconUrl(project) {
    if (project?.favicon_url) return project.favicon_url;

    // TODO: Replace this logic once umrella project from instance settings is used
    if (project?.shortname && project.shortname !== 'ohd') {
        return `/favicons/favicon-${project.shortname}.ico`;
    }

    return '/favicon.ico';
}
