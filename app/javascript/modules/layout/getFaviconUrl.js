export default function getFaviconUrl(project) {
    if (project?.favicon_url) return project.favicon_url;

    if (project?.shortname && !project.is_umbrella) {
        return `/favicons/favicon-${project.shortname}.ico`;
    }

    return '/favicon.ico';
}
