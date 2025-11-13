import { formatTimecode } from 'modules/interview-helpers';
import { OHD_LOCATION } from 'modules/constants';

/**
 * Build a human-readable citation string for an interview.
 *
 * Note: this function is pure and does not call React hooks. Pass a translation
 * function and locale via the options parameter: { t, locale }.
 *
 * @param {Object} interview
 * @param {Object} project
 * @param {string} pathBase
 * @param {number} [tape]
 * @param {number} [time]
 * @param {Object} options - { t: function, locale: string }
 * @returns {string}
 */
export default function interviewCitation(
    interview,
    project,
    pathBase,
    tape,
    time,
    options = {}
) {
    const { t = (k) => k, locale = 'en' } = options;

    const domain = project.archive_domain || OHD_LOCATION;
    const projectName = project.name;
    let selfLink;
    if (domain) {
        selfLink = `${domain}${pathBase}/interviews/${interview.archive_id}`;
    }
    if (tape && time) {
        selfLink += `?tape=${tape}&time=${formatTimecode(time, true)}`;
    }
    const today = new Date().toLocaleDateString(locale || undefined, {
        dateStyle: 'medium',
    });

    let citation = '';

    if (interview.anonymous_title) {
        citation += `${interview.anonymous_title?.[locale]}, `;
    }
    citation += `${t('interview')} `;
    citation += `${interview.archive_id}, `;
    citation += `${interview.interview_date}, `;
    if (tape && time) {
        // include a colon after the position label to match existing usage
        citation += `${t('tape')}: ${tape} – ${formatTimecode(time)}, `;
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
