import { PROJECT_DG } from 'modules/constants';

export default function showTocTab(project, interview, locale) {
    return projectSupportsToc(project)
        && tocAvailable(interview, locale);
}

function projectSupportsToc(project) {
    return project.shortname !== PROJECT_DG;
}

function tocAvailable(interview, locale) {
    return interview?.toc_locales.includes(locale);
}
