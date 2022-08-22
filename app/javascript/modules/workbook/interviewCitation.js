import { t } from 'modules/i18n';

import { formatTimecode } from 'modules/interview-helpers';

export default function interviewCitation(interview, project, pathBase, locale,
    translations, tape, time) {
    const archiveDomain = project.archive_domain;
    const projectName = project.name;
    let selfLink;
    if (archiveDomain) {
        selfLink = `${archiveDomain}${pathBase}/interviews/${interview.archive_id}`;
    }
    if (tape && time) {
        selfLink += `?tape=${tape}&time=${formatTimecode(time, true)}`;
    }
    const today = (new Date()).toLocaleDateString(undefined, { dateStyle: 'medium' });

    let citation = '';

    if (interview.anonymous_title) {
        citation += `${interview.anonymous_title?.[locale]}, `;
    }
    citation += `${t({ locale, translations }, 'interview')} `;
    citation += `${interview.archive_id}, `;
    citation += `${interview.interview_date}, `;
    if (tape && time) {
        citation += `${t({ locale, translations }, 'modules.workbook.position')}: ${tape} – ${formatTimecode(time)}, `;
    }
    if (projectName) {
        citation += `${projectName[locale]}, `;
    }
    if (selfLink) {
        citation += `${selfLink}, `;
    }
    citation += today;

    return citation;
}
