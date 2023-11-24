import { PROJECT_ZWAR, PROJECT_CDOH } from 'modules/constants';

export default function showTranslationTab(project, interview, locale) {
    return projectSupportsTranslatedTranscript(project, interview, locale)
        && translationAvailable(interview);
}

function projectSupportsTranslatedTranscript(project, interview, locale) {
    switch (project.identifier) {
    case PROJECT_CDOH:
        return interview.lang !== locale;
    case PROJECT_ZWAR:
        return interview.lang !== 'de';
    default:
        return interview.lang !== locale;
    }
}

function translationAvailable(interview) {
    return interview?.transcript_locales.includes(interview.translation_locale);
}
