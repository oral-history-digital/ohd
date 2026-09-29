export function getProjectBrandName(project, locale) {
    const name = project?.name?.[locale] || project?.display_name?.[locale];

    if (!name) return null;

    return project.display_shortname
        ? `${name} (${project.display_shortname})`
        : name;
}
