import { ALPHA2_TO_ALPHA3, PROJECT_DG } from 'modules/constants';

export default function showTocTab(project, interview, locale) {
    return projectSupportsToc(project) && tocAvailable(interview, locale);
}

function projectSupportsToc(project) {
    return project.shortname !== PROJECT_DG;
}

function tocAvailable(interview, locale) {
    const alpha3 = ALPHA2_TO_ALPHA3[locale];
    return interview?.toc_alpha3s.includes(alpha3);
}
