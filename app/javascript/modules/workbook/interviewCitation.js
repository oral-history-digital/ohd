import { useI18n } from 'modules/i18n';

import { formatTimecode } from 'modules/interview-helpers';
import { OHD_LOCATION } from 'modules/constants';

export default function interviewCitation(
    interview,
    project,
    pathBase,
    tape,
    time
) {
    const { t, locale } = useI18n();

    const domain = project.archive_domain || OHD_LOCATION;
    const projectName = project.name;
    let selfLink;
    if (domain) {
        selfLink = `${domain}${pathBase}/interviews/${interview.archive_id}`;
    }
    if (tape && time) {
        selfLink += `?tape=${tape}&time=${formatTimecode(time, true)}`;
    }
    const today = (new Date()).toLocaleDateString(undefined, { dateStyle: 'medium' });

    let citation = '';

    if (interview.anonymous_title) {
        citation += `${interview.anonymous_title?.[locale]}, `;
    }
    citation += `${t('interview')} `;
    citation += `${interview.archive_id}, `;
    citation += `${interview.interview_date}, `;
    if (tape && time) {
        citation += `${t('tape')} ${tape} – ${formatTimecode(time)}, `;
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
